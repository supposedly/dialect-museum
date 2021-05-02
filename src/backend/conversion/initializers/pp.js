const {
  parseWord: { parseWord, parseLetter },
  misc: {
    lastOf,
    newSyllable,
    invMap
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

function iyStrategize(conjugation) {
  if (conjugation.number.plural) {
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
  if (conjugation.gender.fem) {
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
    transform: [
      bumpLastConsonant,
      pushSuffix(suffix)
    ],
    eraseStress: !!suffix,
    augmentation
  });

  // XXX: hacky/bad check lol
  const lastRadical = form.includes(`2`) ? $Q : $L;

  const $iy = !lastRadical.meta.weak ? $ : invMap(
    iyStrategize(conjugation).map(preSuffix => parseWord({
      transform: [preSuffix, pushSuffix(suffix)],
      eraseStress: !!suffix,
      augmentation
    }))
  ).or($);

  const pickVoice = (active, passive) => (isActiveVoice ? active : passive);

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
              ...$iy`-m.u.${$F} +t.i -${$3}.I.y`,
              ...$iy`m.u.${$F} t.i ${$3}.I.y`,
              ...$iy`m.i.${$F} ${$3}.I.y`
            );
          } else {
            variants.push($`m.u.${$F} t.aa.${$L}`);
          }
        }
        variants.push(
          $`m.u.n ${$F}.aa.${$L}`,
          $`m.a.${$F} y.uu.${$L}`
        );
        return variants;
      }
      if ($L.meta.weak) {
        return $iy`m.i.${$F} ${$3}.I.y`;
      }
      // default
      return [$`m.a.${$F} ${$3}.uu.${$L}`];
    case `1/fe3il`: {
      if (!isActiveVoice) {
        throw new Error(`Can't use passive voice with 1/fe3il`);
      }
      const variants = [];
      // 2akal, 2a5ad
      if ($F.meta.weak) {
        variants.push(
          // maayiC doesn't exist B)
          ...($3.meta.weak ? $iy`m.aa y.I.${$L}` : $iy`m.aa ${$3}.I.${$L}`)
        );
      }
      if ($3.value === $L.value) {
        variants.push($`${$F}.aa.${$3}.${$L}`);
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
      return [
        $`${$F}.i.${$3} ${$L}.aa.n`,
        $`${$F}.a.${$3} ${$L}.aa.n`
      ];
    case `fa33al`:
      return pickVoice(
        [
          ...$iy`m.u ${$F}.a.${$3} ${$3}.I.${$L}`,
          $L.meta.weak ? $`m.u ${$F}.a.${$3} ${$3}.aa` : $`m.u ${$F}.a.${$3} ${$3}.a.${$L}`
        ],
        [$L.meta.weak ? $`m.u ${$F}.a.${$3} ${$3}.aa` : $`m.u ${$F}.a.${$3} ${$3}.a.${$L}`]
      );
    case `tfa33al`:
      return pickVoice(
        [
          $L.meta.weak ? $`m.u.t ${$F}.a.${$3} ${$3}.aa` : $`m.u.t ${$F}.a.${$3} ${$3}.a.${$L}`,
          ...$iy`m.u.t ${$F}.a.${$3} ${$3}.I.${$L}`,
          ...$iy`m.u.t ${$F}.i.${$3} ${$3}.I.${$L}`,
          $L.meta.weak ? $`m.u ${$F}.a.${$3} ${$3}.aa` : $`m.u ${$F}.a.${$3} ${$3}.a.${$L}`
        ],
        [$L.meta.weak ? $`m.u.t ${$F}.a.${$3} ${$3}.aa` : $`m.u.t ${$F}.a.${$3} ${$3}.a.${$L}`]
      );
    case `stfa33al`:
      // stanna-yestanna
      if ($F.meta.weak) {
        return pickVoice(
          [
            ...$iy`m.u.s t.a.${$3} ${$3}.I.${$L}`,
            $L.meta.weak ? $`m.u.s t.a.${$3} ${$3}.aa` : $`m.u.s t.a.${$3} ${$3}.a.${$L}`
          ],
          [$L.meta.weak ? $`m.u.s t.a.${$3} ${$3}.aa` : $`m.u.s t.a.${$3} ${$3}.a.${$L}`]
        );
      }
      return pickVoice(
        [
          ...$iy`m.u.s._.t ${$F}.a.${$3} ${$3}.I.${$L}`,
          $L.meta.weak ? $`m.u.s._.t ${$F}.a.${$3} ${$3}.aa` : $`m.u.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`
        ],
        [$L.meta.weak ? $`m.u.s._.t ${$F}.a.${$3} ${$3}.aa` : $`m.u.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`]
      );
    case `fe3al`:
      return pickVoice(
        [
          ...$iy`m.u ${$F}.aa ${$3}.I.${$L}`,
          $L.meta.weak ? $`m.u ${$F}.aa ${$3}.aa` : $`m.u ${$F}.aa ${$3}.a.${$L}`
        ],
        [$L.meta.weak ? $`m.u ${$F}.aa ${$3}.aa` : $`m.u ${$F}.aa ${$3}.a.${$L}`]
      );
    case `tfe3al`:
      return pickVoice(
        [
          $L.meta.weak ? $`m.u ${$F}.aa ${$3}.aa` : $`m.u ${$F}.aa ${$3}.a.${$L}`,
          ...$iy`m.u.t ${$F}.aa ${$3}.I.${$L}`,
          $L.meta.weak ? $`m.u.t ${$F}.aa ${$3}.aa` : $`m.u.t ${$F}.aa ${$3}.a.${$L}`
        ],
        [$L.meta.weak ? $`m.u.t ${$F}.aa ${$3}.aa` : $`m.u.t ${$F}.aa ${$3}.a.${$L}`]
      );
    case `stfe3al`:
      // stehal-yistehal
      if ($F.meta.weak) {
        return pickVoice(
          [
            ...$iy`m.u.s t.aa ${$3}.I.${$L}`,
            $L.meta.weak ? $`m.u.s t.aa ${$3}.aa` : $`m.u.s t.aa ${$3}.a.${$L}`
          ],
          [$L.meta.weak ? $`m.u.s t.aa ${$3}.aa` : $`m.u.s t.aa ${$3}.a.${$L}`]
        );
      }
      return pickVoice(
        [
          ...$iy`m.u.s._.t ${$F}.aa ${$3}.I.${$L}`,
          $L.meta.weak ? $`m.u.s._.t ${$F}.aa ${$3}.aa` : $`m.u.s._.t ${$F}.aa ${$3}.a.${$L}`
        ],
        [$L.meta.weak ? $`m.u.s._.t ${$F}.aa ${$3}.aa` : $`m.u.s._.t ${$F}.aa ${$3}.a.${$L}`]
      );
    case `nfa3al`:
      if ($3.meta.weak) {
        return [$`m.u.n ${$F}.aa.${$L}`];
      }
      if ($3.value === $L.value) {
        return pickVoice(
          [
            $`m.a.${$F} ${$3}.uu.${$L}`,
            $`m.u.n ${$F}.a.${$3}.${$L}`
          ],
          [$`m.u.n ${$F}.a.${$3}.${$L}`]
        );
      }
      return pickVoice(
        [
          $`m.a.${$F} ${$3}.uu.${$L}`,
          ...$iy`-m.u.n +${$F}.i -${$3}.I.${$L}`,
          ...$iy`m.u.n ${$F}.i ${$3}.I.${$L}`
        ],
        [
          $L.meta.weak ? $`-m.u.n +${$F}.a -${$3}.aa` : $`-m.u.n +${$F}.a -${$3}.a.${$L}`,
          $L.meta.weak ? $`m.u.n ${$F}.a ${$3}.aa` : $`m.u.n ${$F}.a ${$3}.a.${$L}`
        ]
      );
    case `fta3al`:
      if ($3.meta.weak) {
        return [$`m.u.${$F} t.aa.${$L}`];
      }
      if ($3.value === $L.value) {
        return [$`m.u.${$F} t.a.${$3}.${$L}`];
      }
      return pickVoice(
        [
          ...$iy`-m.u.${$F} +t.i -${$3}.I.${$L}`,
          ...$iy`m.u.${$F} t.i ${$3}.I.${$L}`
        ],
        [
          $L.meta.weak ? $`-m.u.${$F} +t.a -${$3}.aa` : $`-m.u.${$F} +t.a -${$3}.a.${$L}`,
          $L.meta.weak ? $`m.u.${$F} t.a ${$3}.aa` : $`m.u.${$F} t.a ${$3}.a.${$L}`
        ]
      );
    case `staf3al`:
      if ($3.meta.weak) {
        // not including an "if $L.meta.weak" branch here because
        // the only verb possibly like that is sta7aa, and that
        // should actually be constructed as a fta3al verb
        // of the "root" s7y
        return pickVoice(
          [$`m.u.s._.t ${$F}.ii.${$L}`],
          [$`m.u.s._.t ${$F}.aa.${$L}`]
        );
      }
      // geminate root
      if ($3.value === $L.value) {
        return pickVoice(
          [$`m.u.s._.t ${$F}.i.${$3}.${$L}`],
          [$`m.u.s._.t ${$F}.a.${$3}.${$L}`]
        );
      }
      return pickVoice(
        $iy`m.u.s t.a.${$F} ${$3}.I.${$L}`,
        [$L.meta.weak ? $`m.u.s t.a.${$F} ${$3}.aa` : $`m.u.s t.a.${$F} ${$3}.a.${$L}`]
      );
    case `stAf3al`:
      if ($3.meta.weak) {
        return pickVoice(
          [$`m.u.s t.a ${$F}.ii.${$L}`],
          [$`m.u.s t.a ${$F}.aa.${$L}`]
        );
      }
      // geminate root
      if ($3.value === $L.value) {
        return pickVoice(
          [$`m.u.s t.a ${$F}.i.${$3}.${$L}`],
          [$`m.u.s t.a ${$F}.a.${$3}.${$L}`]
        );
      }
      throw new Error(`Can't use stAf3al except with final-geminate and second-weak verbs`);
    case `f3all`:
      if (isActiveVoice) {
        return $`m.u.${$F} ${$3}.a.${$L}.${$L}`;
      }
      throw new Error(`Can't use passive voice with f3all`);
    case `fa3la2`:
      return pickVoice(
        [
          ...$iy`m.u ${$F}.a.${$3} ${$L}.I.${$Q}`,
          $Q.meta.weak ? $`m.u ${$F}.a.${$3} ${$L}.aa` : $`m.u ${$F}.a.${$3} ${$L}.a.${$Q}`
        ],
        [$Q.meta.weak ? $`m.u ${$F}.a.${$3} ${$L}.aa` : $`m.u ${$F}.a.${$3} ${$L}.a.${$Q}`]
      );
    case `tfa3la2`:
      return pickVoice(
        [
          $Q.meta.weak ? $`m.u ${$F}.a.${$3} ${$L}.aa` : $`m.u ${$F}.a.${$3} ${$L}.a.${$Q}`,
          ...$iy`m.u.t ${$F}.a.${$3} ${$L}.I.${$Q}`
        ],
        [$Q.meta.weak ? $`m.u.t ${$F}.a.${$3} ${$L}.aa` : $`m.u.t ${$F}.a.${$3} ${$L}.a.${$Q}`]
      );
    case `stfa3la2`:
      if ($F.meta.weak) {
        // doesn't exist B)
        return pickVoice(
          [
            ...$iy`m.u.s t.a.${$3} ${$L}.I.${$Q}`,
            $Q.meta.weak ? $`m.u.s t.a.${$3} ${$L}.aa` : $`m.u.s t.a.${$3} ${$L}.a.${$Q}`
          ],
          [$Q.meta.weak ? $`m.u.s t.a.${$3} ${$L}.aa` : $`m.u.s t.a.${$3} ${$L}.a.${$Q}`]
        );
      }
      return pickVoice(
        [
          ...$iy`m.u.s._.t ${$F}.a.${$3} ${$L}.I.${$Q}`,
          $Q.meta.weak ? $`m.u.s._.t ${$F}.a.${$3} ${$L}.aa` : $`m.u.s._.t ${$F}.a.${$3} ${$L}.a.${$Q}`
        ],
        [$Q.meta.weak ? $`m.u.s._.t ${$F}.a.${$3} ${$L}.aa` : $`m.u.s._.t ${$F}.a.${$3} ${$L}.a.${$Q}`]
      );
    default:
      return null;
  }
}

module.exports = {
  pp
};
