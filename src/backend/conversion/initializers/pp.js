const {
  parseWord: { parseWord, parseLetter },
  misc: {
    lastOf,
    newSyllable,
    backup
  }
} = require(`../utils`);

// Object.freeze() isn't great here bc it's shallow but oh well, thought that counts
const Y = Object.freeze(parseLetter`y`);

// push suffix onto last syllable of base
const pushSuffix = suffix => base => lastOf(base).value.push(...suffix);

// bump last consonant of last syllable into a new syllable
// if last syllable's last segment isn't a consonant, just make an empty new syllable
function bumpLastConsonant(base) {
  const lastSyllable = lastOf(base).value;
  if (lastOf(lastSyllable).type === `consonant`) {
    base.push(newSyllable([lastSyllable.pop()]));
  } else {
    base.push(newSyllable());
  }
}

// return strategies for immediately before pushing suffix
function strategize(conjugation) {
  if (conjugation.number.plural() || conjugation.gender.fem()) {
    return [bumpLastConsonant];
  }
  return [];
}

// strategies again but specifically for iy-final participles
function iyStrategize(conjugation) {
  if (conjugation.number.plural()) {
    return [
      // mishtiryiin, qaaryiin
      // aka: `*.I.y ii.n` => `*.I y.ii.n`
      bumpLastConsonant,
      base => {
        // mishtriin, qaariin
        // aka: `*.I.y ii.n` => `* ii.n`
        lastOf(base).value.splice(-2);
        base.push(newSyllable());
      },
      base => {
        // mishtriyyiin, qaariyyiin (yikes...)
        // aka: `*.I.y ii.n` => `*.I.y y.ii.n`
        base.push(newSyllable([Y]));
      }
    ];
  }
  /* else */
  if (conjugation.gender.fem()) {
    return [
      // mishtiryc, qaaryc
      // aka: `*.I.y c` => `*.I y.c`
      bumpLastConsonant,
      base => {
        // mishtriyyc, qaariyyc (yikes...)
        // aka: `*.I.y c` => `*.I.y y.c`
        base.push(newSyllable([Y]));
      }
    ];
  }
  /* else do nothing bc no suffix */
  return [];
}

function pp({
  meta: { conjugation, form, voice },
  value: {
    root: [$F, $3, $L, $Q],
    augmentation
  }
}) {
  const isActiveVoice = voice === `active`;
  const suffix = conjugation.participle.suffix;

  const $ = parseWord({
    preTransform: [[
      ...strategize(conjugation),
      pushSuffix(suffix)
    ]],
    augmentation
  });

  // XXX: hacky/bad check lol
  const lastRadical = form.includes(`2`) ? $Q : $L;

  const $iy = !lastRadical.meta.weak ? $ : parseWord({
    preTransform: backup(
      iyStrategize(conjugation)
    ).map(
      preSuffix => [preSuffix, pushSuffix(suffix)]
    ).or([]),
    augmentation
  });

  const pickVoice = (active, passive) => (isActiveVoice ? active : passive);

  // *final*-weak specifically
  const pickWeak = (weak, sound) => (lastRadical.meta.weak ? weak : sound);

  switch (form) {
    case `1/both`:
      if (isActiveVoice) {
        throw new Error(`Active voice is currently unsupported with 1/both`);
      }
      // now passive
      if ($3.meta.weak) {
        const variants = [];
        if ($F.value === `n`) {
          if ($L.meta.weak) {
            variants.push(
              ...$iy`-m.i.${$F} +t.i -${$3}.I.y`,
              ...$iy`m.i.${$F} t.i ${$3}.I.y`,
              ...$iy`m.i.${$F} ${$3}.I.y`
            );
          } else {
            variants.push(...$`m.i.${$F} t.aa.${$L}`);
          }
        }
        variants.push(
          ...$`m.i.n ${$F}.aa.${$L}`,
          ...$`m.a.${$F} y.uu.${$L}`
        );
        return variants;
      }
      if ($L.meta.weak) {
        return $iy`m.i.${$F} ${$3}.I.y`;
      }
      // default
      return $`m.a.${$F} ${$3}.uu.${$L}`;
    case `1/fe3il`: {
      if (!isActiveVoice) {
        throw new Error(`Can't use passive voice with 1/fe3il`);
      }
      const variants = [];
      // 2akal, 2a5ad
      if ($F.meta.weak) {
        variants.push(
          // maayiC and maa3iy don't exist B)
          ...($3.meta.weak ? $iy`m.aa y.I.${$L}` : $iy`m.aa ${$3}.I.${$L}`)
        );
      }
      if ($3.value === $L.value) {
        variants.push(...$`${$F}.aa.${$3}.${$L}`);
      }
      return [
        ...variants,
        ...($3.meta.weak ? $iy`${$F}.aa y.I.${$L}` : $iy`${$F}.aa ${$3}.I.${$L}`)
      ];
    }
    case `1/fa3len`:
      if (!isActiveVoice) {
        throw new Error(`Can't use passive voice with 1/fa3len`);
      }
      return $`${$F}.a/i.${$3} ${$L}.aa.n`;
    case `fa33al`:
      return pickVoice(
        [
          ...$iy`m.${$F}.a.${$3} ${$3}.I.${$L}`,
          ...pickWeak($`m.${$F}.a.${$3} ${$3}.aa`, $`m.${$F}.a.${$3} ${$3}.a.${$L}`)
        ],
        pickWeak($`m.${$F}.a/i.${$3} ${$3}.aa`, $`m.${$F}.a.${$3} ${$3}.a.${$L}`)
      );
    case `tfa33al`:
      return pickVoice(
        pickWeak(
          [
            ...$`m.${$F}.a.${$3} ${$3}.aa`,
            ...$`m.i.t ${$F}.a.${$3} ${$3}.aa`,
            // XXX: should these ones use a/i? i feel like they shouldn't
            // (like mit2akkid mit2ikkid, mitzakker mitzikkir...)
            ...$iy`m.i.t ${$F}.a.${$3} ${$3}.I.${$L}`,
            ...$iy`m.i.t ${$F}.i.${$3} ${$3}.I.${$L}`
          ],
          [
            ...$`m.${$F}.a.${$3} ${$3}.a.${$L}`,
            ...$`m.i.t ${$F}.a.${$3} ${$3}.a.${$L}`,
            // see XXX above
            ...$iy`m.i.t ${$F}.a.${$3} ${$3}.I.${$L}`,
            ...$iy`m.i.t ${$F}.i.${$3} ${$3}.I.${$L}`
          ]
        ),
        pickWeak($`m.i.t ${$F}.a.${$3} ${$3}.aa`, $`m.i.t ${$F}.a.${$3} ${$3}.a.${$L}`)
      );
    case `stfa33al`:
      // stanna-yestanna
      if ($F.meta.weak) {
        return pickVoice(
          [
            // intentionally not including misti33il here, no mistinni (...right?)
            ...$iy`m.i.s t.a.${$3} ${$3}.I.${$L}`,
            ...pickWeak($`m.i.s t.a.${$3} ${$3}.aa`, $`m.i.s t.a.${$3} ${$3}.a.${$L}`)
          ],
          pickWeak($`m.i.s t.a.${$3} ${$3}.aa`, $`m.i.s t.a.${$3} ${$3}.a.${$L}`)
        );
      }
      return pickVoice(
        [
          // see XXX in tfa33al above
          ...$iy`m.i.s._.t ${$F}.a.${$3} ${$3}.I.${$L}`,
          ...$iy`m.i.s._.t ${$F}.i.${$3} ${$3}.I.${$L}`,
          ...pickWeak($`m.i.s._.t ${$F}.a.${$3} ${$3}.aa`, $`m.i.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`)
        ],
        pickWeak($`m.i.s._.t ${$F}.a.${$3} ${$3}.aa`, $`m.i.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`)
      );
    case `fe3al`:
      return pickVoice(
        [
          ...$iy`m.${$F}.aa ${$3}.I.${$L}`,
          ...pickWeak($`m.${$F}.aa ${$3}.aa`, $`m.${$F}.aa ${$3}.a.${$L}`)
        ],
        pickWeak($`m.${$F}.aa ${$3}.aa`, $`m.${$F}.aa ${$3}.a.${$L}`)
      );
    case `tfe3al`:
      return pickVoice(
        [
          ...pickWeak($`m.${$F}.aa ${$3}.aa`, $`m.${$F}.aa ${$3}.a.${$L}`),
          ...$iy`m.i.t ${$F}.aa ${$3}.I.${$L}`,
          ...pickWeak($`m.i.t ${$F}.aa ${$3}.aa`, $`m.i.t ${$F}.aa ${$3}.a.${$L}`)
        ],
        pickWeak($`m.i.t ${$F}.aa ${$3}.aa`, $`m.i.t ${$F}.aa ${$3}.a.${$L}`)
      );
    case `stfe3al`:
      // stehal-yistehal
      if ($F.meta.weak) {
        return pickVoice(
          [
            ...$iy`m.i.s t.aa ${$3}.I.${$L}`,
            ...pickWeak($`m.i.s t.aa ${$3}.aa`, $`m.i.s t.aa ${$3}.a.${$L}`)
          ],
          pickWeak($`m.i.s t.aa ${$3}.aa`, $`m.i.s t.aa ${$3}.a.${$L}`)
        );
      }
      return pickVoice(
        [
          ...$iy`m.i.s._.t ${$F}.aa ${$3}.I.${$L}`,
          ...pickWeak($`m.i.s._.t ${$F}.aa ${$3}.aa`, $`m.i.s._.t ${$F}.aa ${$3}.a.${$L}`)
        ],
        pickWeak($`m.i.s._.t ${$F}.aa ${$3}.aa`, $`m.i.s._.t ${$F}.aa ${$3}.a.${$L}`)
      );
    case `2af3al`:
      return pickVoice(
        [
          ...$iy`m.i.${$F} ${$3}.I.${$L}`,
          ...$iy`m.2.a.${$F} ${$3}.I.${$L}`,
          ...$`m.2.a.${$F} ${$3}.a.${$L}`
        ],
        [
          ...pickWeak($`m.u.${$F} ${$3}.aa`, $`m.u.${$F} ${$3}.a.${$L}`),
          ...pickWeak($`m.2.a.${$F} ${$3}.aa`, $`m.2.a.${$F} ${$3}.a.${$L}`)
        ]
      );
    case `nfa3al`:
      if ($3.meta.weak) {
        return $`m.i.n ${$F}.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return pickVoice(
          [
            ...$`m.a.${$F} ${$3}.uu.${$L}`,
            ...$`m.i.n ${$F}.a.${$3}.${$L}`
          ],
          $`m.i.n ${$F}.a.${$3}.${$L}`
        );
      }
      return pickVoice(
        [
          ...$`m.a.${$F} ${$3}.uu.${$L}`,
          ...$iy`-m.i.n +${$F}.i -${$3}.I.${$L}`,
          ...$iy`m.i.n ${$F}.i ${$3}.I.${$L}`,
          $`-m.i.n +${$F}.a -${$3}.a.${$L}`
        ],
        [
          ...pickWeak($`-m.i.n +${$F}.a -${$3}.aa`, $`-m.i.n +${$F}.a -${$3}.a.${$L}`),
          ...pickWeak($`m.i.n ${$F}.a ${$3}.aa`, $`m.i.n ${$F}.a ${$3}.a.${$L}`)
        ]
      );
    case `nfi3il`:
      // same as nfa3al but can never be minfa3al when 'active', only minfi3il
      if ($3.meta.weak) {
        return $`m.i.n ${$F}.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return pickVoice(
          [
            ...$`m.a.${$F} ${$3}.uu.${$L}`,
            ...$`m.i.n ${$F}.a.${$3}.${$L}`
          ],
          $`m.i.n ${$F}.a.${$3}.${$L}`
        );
      }
      return pickVoice(
        [
          ...$`m.a.${$F} ${$3}.uu.${$L}`,
          ...$iy`-m.i.n +${$F}.i -${$3}.I.${$L}`,
          ...$iy`m.i.n ${$F}.i ${$3}.I.${$L}`
        ],
        [
          ...pickWeak($`-m.i.n +${$F}.a -${$3}.aa`, $`-m.i.n +${$F}.a -${$3}.a.${$L}`),
          ...pickWeak($`m.i.n ${$F}.a ${$3}.aa`, $`m.i.n ${$F}.a ${$3}.a.${$L}`)
        ]
      );
    case `fta3al`:
      if ($3.meta.weak) {
        return $`m.i.${$F} t.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return $`m.i.${$F} t.a.${$3}.${$L}`;
      }
      return pickVoice(
        [
          ...$iy`-m.i.${$F} +t.i -${$3}.I.${$L}`,
          ...$iy`m.i.${$F} t.i ${$3}.I.${$L}`,
          ...$`m.i.${$F} t.a ${$3}.a.${$L}`
        ],
        [
          ...pickWeak($`-m.i.${$F} +t.a -${$3}.aa`, $`-m.i.${$F} +t.a -${$3}.a.${$L}`),
          ...pickWeak($`m.i.${$F} t.a ${$3}.aa`, $`m.i.${$F} t.a ${$3}.a.${$L}`)
        ]
      );
    case `fti3il`:
      // same as fta3al but can never be mifta3al when 'active', only mifti3il
      if ($3.meta.weak) {
        return $`m.i.${$F} t.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return $`m.i.${$F} t.a.${$3}.${$L}`;
      }
      return pickVoice(
        [
          ...$iy`-m.i.${$F} +t.i -${$3}.I.${$L}`,
          ...$iy`m.i.${$F} t.i ${$3}.I.${$L}`
        ],
        [
          ...pickWeak($`-m.i.${$F} +t.a -${$3}.aa`, $`-m.i.${$F} +t.a -${$3}.a.${$L}`),
          ...pickWeak($`m.i.${$F} t.a ${$3}.aa`, $`m.i.${$F} t.a ${$3}.a.${$L}`)
        ]
      );
    case `staf3al`:
      if ($3.meta.weak) {
        // not including an "if $L.meta.weak" branch here because
        // the only verb possibly like that is sta7aa, and that
        // should actually be constructed as a fta3al verb
        // of the "root" s7y
        return pickVoice(
          [...$`m.i.s._.t ${$F}.ii.${$L}`, ...$`m.i.s t.a ${$F}.ii.${$L}`],
          [...$`m.i.s._.t ${$F}.aa.${$L}`, ...$`m.i.s t.a ${$F}.aa.${$L}`]
        );
      }
      // geminate root
      if ($3.value === $L.value) {
        return pickVoice(
          [...$`m.i.s._.t ${$F}.i.${$3}.${$L}`, ...$`m.i.s t.a ${$F}.i.${$3}.${$L}`],
          [...$`m.i.s._.t ${$F}.a.${$3}.${$L}`, ...$`m.i.s t.a ${$F}.a.${$3}.${$L}`]
        );
      }
      return pickVoice(
        $iy`m.i.s t.a.${$F} ${$3}.I.${$L}`,
        pickWeak($`m.i.s t.a.${$F} ${$3}.aa`, $`m.i.s t.a.${$F} ${$3}.a.${$L}`)
      );
    case `f3all`:
      if (isActiveVoice) {
        return $`m.i.${$F} ${$3}.a.${$L}.${$L}`;
      }
      throw new Error(`Can't use passive voice with f3all`);
    case `fa3la2`:
      return pickVoice(
        [
          ...$iy`m.${$F}.a.${$3} ${$L}.I.${$Q}`,
          ...pickWeak($`m.${$F}.a.${$3} ${$L}.aa`, $`m.${$F}.a.${$3} ${$L}.a.${$Q}`)
        ],
        pickWeak($`m.${$F}.a.${$3} ${$L}.aa`, $`m.${$F}.a.${$3} ${$L}.a.${$Q}`)
      );
    case `tfa3la2`:
      return pickVoice(
        [
          ...pickWeak($`m.${$F}.a.${$3} ${$L}.aa`, $`m.${$F}.a.${$3} ${$L}.a.${$Q}`),
          // see XXX in tfa33al above
          ...$iy`m.i.t ${$F}.a.${$3} ${$L}.I.${$Q}`,
          ...$iy`m.i.t ${$F}.i.${$3} ${$L}.I.${$Q}`
        ],
        pickWeak($`m.i.t ${$F}.a.${$3} ${$L}.aa`, $`m.i.t ${$F}.a.${$3} ${$L}.a.${$Q}`)
      );
    case `stfa3la2`:
      if ($F.meta.weak) {
        // doesn't exist B)
        return pickVoice(
          [
          // see XXX in tfa33al above
            ...$iy`m.i.s t.a.${$3} ${$L}.I.${$Q}`,
            ...$iy`m.i.s t.i.${$3} ${$L}.I.${$Q}`,
            ...pickWeak($`m.i.s t.a.${$3} ${$L}.aa`, $`m.i.s t.a.${$3} ${$L}.a.${$Q}`)
          ],
          pickWeak($`m.i.s t.a.${$3} ${$L}.aa`, $`m.i.s t.a.${$3} ${$L}.a.${$Q}`)
        );
      }
      return pickVoice(
        [
          // see XXX in tfa33al above
          ...$iy`m.i.s._.t ${$F}.a.${$3} ${$L}.I.${$Q}`,
          ...$iy`m.i.s._.t ${$F}.i.${$3} ${$L}.I.${$Q}`,
          ...pickWeak($`m.i.s._.t ${$F}.a.${$3} ${$L}.aa`, $`m.i.s._.t ${$F}.a.${$3} ${$L}.a.${$Q}`)
        ],
        pickWeak($`m.i.s._.t ${$F}.a.${$3} ${$L}.aa`, $`m.i.s._.t ${$F}.a.${$3} ${$L}.a.${$Q}`)
      );
    default:
      return null;
  }
}

module.exports = {
  pp
};
