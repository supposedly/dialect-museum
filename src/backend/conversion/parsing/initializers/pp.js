const {
  misc: {
    lastOf,
    newSyllable,
    backup,
  },
  vowels,
} = require(`../../utils`);
const {type, parseWord: {parseWord, parseLetter}} = require(`..`);
const {ppForm, voiceToken} = require(`../../symbols`);

const Y = Object.freeze(parseLetter`y`);
const AA = Object.freeze(parseLetter`aa`);

// push suffix onto last syllable of base
const pushSuffix = suffix => base => lastOf(base).value.push(...suffix);

// bump last consonant of last syllable into a new syllable
// if last syllable's last segment isn't a consonant, just make an empty new syllable
function bumpLastConsonant(base) {
  const lastSyllable = lastOf(base).value;
  if (lastOf(lastSyllable).type === type.consonant) {
    base.push(newSyllable([lastSyllable.pop()]));
  } else {
    base.push(newSyllable());
  }
}

// return strategies for immediately before pushing suffix
function strategize(conjugation) {
  if (conjugation.number.plural() || conjugation.gender.fem()) {
    return bumpLastConsonant;
  }
  return null;
}

// turn -ay into -aa
// ONLY to be used when no suffix
function fixAy(base) {
  const lastSyllable = lastOf(base).value;
  if (lastOf(lastSyllable, 1).value === `a` && lastOf(lastSyllable).meta.weak) {
    lastSyllable.splice(-2, 2, AA);
  }
}

// strategies again but specifically for iy-final participles
function iyStrategize(conjugation) {
  if (conjugation.number.plural()) {
    return [
      // mishtiryiin, qaaryiin
      // aka: `*.i.y ii.n` => `*.i y.ii.n`
      bumpLastConsonant,
      base => {
        // mishtriin, qaariin
        // aka: `*.i.y ii.n` => `* ii.n`
        lastOf(base).value.splice(-2);
        base.push(newSyllable());
      },
      base => {
        // mishtriyyiin, qaariyyiin (yikes...)
        // aka: `*.i.y ii.n` => `*.i.y y.ii.n`
        base.push(newSyllable([Y]));
      },
    ];
  }
  /* else */
  if (conjugation.gender.fem()) {
    return [
      // mishtiryc, qaaryc
      // aka: `*.i.y c` => `*.i y.c`
      bumpLastConsonant,
      base => {
        // mishtriyyc, qaariyyc (yikes...)
        // aka: `*.i.y c` => `*.i.y y.c`
        base.push(newSyllable([Y]));
      },
    ];
  }
  /* else do nothing bc no suffix */
  return [];
}

// post-transformer: adds augmentations to meta depending on end of base
// and contracts long vowel VVC in base if augmentation is dative -l-
function augment(augmentation) {
  return augmentation && ((base, meta) => {
    meta.augmentation = augmentation(base).nFor1sg;
    if (meta.augmentation.delimiter.value === `dative`) {
      // this part needs to be in a post-transformer because it doesn't make sense
      // for the contracted syllable to be temporarily unstressed
      // (which would be the case were it a pretransformer)
      const lastSyllable = lastOf(base).value;
      const a = lastOf(lastSyllable, 1);
      const b = lastOf(lastSyllable);
      if (
        a.type === type.vowel && a.meta.intrinsic.length === 2 && !a.meta.intrinsic.ly.diphthongal
        && b.type === type.consonant
      ) {
        lastSyllable.splice(-2, 1, vowels.contract(a));
      }
    }
  });
}

function pp({
  type: was,
  meta: {conjugation, form, voice},
  value: {
    root: [$F, $3, $L, $Q],
    augmentation,
  },
}) {
  // xor but being extra-explicit about it
  // (if form is quadriliteral then $Q must be given, and if not then not)
  if (Boolean($Q) !== Boolean(ppForm.inv[form].endsWith(`2`))) {
    throw new Error(`Didn't expect fourth radical ${$Q} with form ${form}`);
  }

  const isActiveVoice = voice === voiceToken.active;
  const suffix = conjugation.participle.suffix;
  const lastRadical = $Q || $L;

  const ayFixer = (!suffix.length && lastRadical.meta.weak) && fixAy;

  const meta = {
    was,
    augmentation,
    conjugation,
    form,
    voice,
    root: $Q ? [$F, $3, $L, $Q] : [$F, $3, $L],
  };

  const $ = parseWord({
    preTransform: [[
      ayFixer,
      strategize(conjugation),
      pushSuffix(suffix),
    ]],
    meta,
  });

  const $iy = !lastRadical.meta.weak ? $ : parseWord({
    preTransform: backup(
      iyStrategize(conjugation),
    ).map(
      preSuffix => [ayFixer, preSuffix, pushSuffix(suffix)],
    ).or([/* ayFixer */]),  // TODO: re-figure-out the reason this is fine being commented out
    postTransform: [[augment(augmentation)]],
    meta,
  });

  const pickVoice = (active, passive) => (isActiveVoice ? active : passive);

  switch (form) {
    case ppForm.anyForm1:
      if (isActiveVoice) {
        throw new Error(`Active voice is currently unsupported with anyForm1`);
      }
      // now passive
      if ($3.meta.weak) {
        const variants = [];
        if ($F.value === `n`) {
          if ($L.meta.weak) {
            variants.push(
              ...$iy`-m.i.${$F} +t.i -${$3}.i.y`,
              ...$iy`m.i.${$F} t.I ${$3}.i.y`,
              ...$iy`m.i.${$F} ${$3}.i.y`,
            );
          } else {
            variants.push(...$`m.i.${$F} t.aa.${$L}`);
          }
        }
        variants.push(
          ...$`m.i.n ${$F}.aa.${$L}`,
          ...$`m.a.${$F} y.uu.${$L}`,
        );
        return variants;
      }
      if ($L.meta.weak) {
        return $iy`m.i.${$F} ${$3}.i.y`;
      }
      // default
      return $`m.a.${$F} ${$3}.uu.${$L}`;
    case ppForm.fe3il: {
      if (!isActiveVoice) {
        throw new Error(`Can't use passive voice with fe3il`);
      }
      const variants = [];
      // 2akal, 2a5ad
      if ($F.meta.weak) {
        variants.push(
          // maayiC and maa3iy don't exist B)
          ...($3.meta.weak ? $iy`m.aa y.i.${$L}` : $iy`m.aa ${$3}.i.${$L}`),
        );
      }
      if ($3.value === $L.value) {
        variants.push(...$`${$F}.aa.${$3}.${$L}`);
      }
      return [
        ...variants,
        ...($3.meta.weak ? $iy`${$F}.aa y.i.${$L}` : $iy`${$F}.aa ${$3}.i.${$L}`),
      ];
    }
    case ppForm.fa3len:
      if (!isActiveVoice) {
        throw new Error(`Can't use passive voice with fa3len`);
      }
      return $`${$F}.a.${$3} ${$L}.aa.n`;
    case ppForm.fa33al:
      return pickVoice(
        [
          ...$iy`m.${$F}.a.${$3} ${$3}.i.${$L}`,
          ...$`m.${$F}.a.${$3} ${$3}.a.${$L}`,
        ],
        $`m.${$F}.a.${$3} ${$3}.a.${$L}`,
      );
    case ppForm.tfa33al:
      return pickVoice(
        [
          ...$`m.${$F}.a.${$3} ${$3}.a.${$L}`,
          ...$`m.i.t ${$F}.a.${$3} ${$3}.a.${$L}`,
          // XXX: should these ones use a/i? i feel like they shouldn't
          // (like mit2akkid mit2ikkid, mitzakker mitzikkir...)
          ...$iy`m.i.t ${$F}.a.${$3} ${$3}.i.${$L}`,
          ...$iy`m.i.t ${$F}.i.${$3} ${$3}.i.${$L}`,
        ],
        $`m.i.t ${$F}.a.${$3} ${$3}.a.${$L}`,
      );
    case ppForm.stfa33al:
      // stanna-yestanna
      if ($F.meta.weak) {
        return pickVoice(
          [
            // intentionally not including misti33il here, no mistinni (...right?)
            ...$iy`m.i.s t.a.${$3} ${$3}.i.${$L}`,
            ...$`m.i.s t.a.${$3} ${$3}.a.${$L}`,
          ],
          $`m.i.s t.a.${$3} ${$3}.a.${$L}`,
        );
      }
      return pickVoice(
        [
          // see XXX in tfa33al above
          ...$iy`m.i.s._.t ${$F}.a.${$3} ${$3}.i.${$L}`,
          ...$iy`m.i.s._.t ${$F}.i.${$3} ${$3}.i.${$L}`,
          ...$`m.i.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`,
        ],
        $`m.i.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`,
      );
    case ppForm.fe3al:
      return pickVoice(
        [
          ...$iy`m.${$F}.aa ${$3}.i.${$L}`,
          ...$`m.${$F}.aa ${$3}.a.${$L}`,
        ],
        $`m.${$F}.aa ${$3}.a.${$L}`,
      );
    case ppForm.tfe3al:
      return pickVoice(
        [
          ...$`m.${$F}.aa ${$3}.a.${$L}`,
          ...$iy`m.i.t ${$F}.aa ${$3}.i.${$L}`,
          ...$`m.i.t ${$F}.aa ${$3}.a.${$L}`,
        ],
        $`m.i.t ${$F}.aa ${$3}.a.${$L}`,
      );
    case ppForm.stfe3al:
      // stehal-yistehal
      if ($F.meta.weak) {
        return pickVoice(
          [
            ...$iy`m.i.s t.aa ${$3}.i.${$L}`,
            ...$`m.i.s t.aa ${$3}.a.${$L}`,
          ],
          $`m.i.s t.aa ${$3}.a.${$L}`,
        );
      }
      return pickVoice(
        [
          ...$iy`m.i.s._.t ${$F}.aa ${$3}.i.${$L}`,
          ...$`m.i.s._.t ${$F}.aa ${$3}.a.${$L}`,
        ],
        $`m.i.s._.t ${$F}.aa ${$3}.a.${$L}`,
      );
    case ppForm[`2af3al`]:
      return pickVoice(
        [
          ...$iy`m.i.${$F} ${$3}.i.${$L}`,
          ...$iy`m.2.a.${$F} ${$3}.i.${$L}`,
          ...$`m.2.a.${$F} ${$3}.a.${$L}`,
        ],
        [
          ...$`m.u.${$F} ${$3}.a.${$L}`,
          ...$`m.2.a.${$F} ${$3}.a.${$L}`,
        ],
      );
    case ppForm.nfa3al:
      if ($3.meta.weak) {
        return $`m.i.n ${$F}.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return pickVoice(
          [
            ...$`m.a.${$F} ${$3}.uu.${$L}`,
            ...$`m.i.n ${$F}.a.${$3}.${$L}`,
          ],
          $`m.i.n ${$F}.a.${$3}.${$L}`,
        );
      }
      return pickVoice(
        [
          ...$`m.a.${$F} ${$3}.uu.${$L}`,
          ...$iy`-m.i.n +${$F}.i -${$3}.i.${$L}`,
          ...$iy`m.i.n ${$F}.I ${$3}.i.${$L}`,
          $`-m.i.n +${$F}.a -${$3}.a.${$L}`,
        ],
        [
          ...$`-m.i.n +${$F}.a -${$3}.a.${$L}`,
          ...$`m.i.n ${$F}.a ${$3}.a.${$L}`,
        ],
      );
    case ppForm.nfi3il:
      // same as nfa3al but can never be minfa3al when 'active', only minfi3il
      if ($3.meta.weak) {
        return $`m.i.n ${$F}.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return pickVoice(
          [
            ...$`m.a.${$F} ${$3}.uu.${$L}`,
            ...$`m.i.n ${$F}.a.${$3}.${$L}`,
          ],
          $`m.i.n ${$F}.a.${$3}.${$L}`,
        );
      }
      return pickVoice(
        [
          ...$`m.a.${$F} ${$3}.uu.${$L}`,
          ...$iy`-m.i.n +${$F}.i -${$3}.i.${$L}`,
          ...$iy`m.i.n ${$F}.I ${$3}.i.${$L}`,
        ],
        [
          ...$`-m.i.n +${$F}.a -${$3}.a.${$L}`,
          ...$`m.i.n ${$F}.a ${$3}.a.${$L}`,
        ],
      );
    case ppForm.fta3al:
      if ($3.meta.weak) {
        return $`m.i.${$F} t.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return $`m.i.${$F} t.a.${$3}.${$L}`;
      }
      return pickVoice(
        [
          ...$iy`-m.i.${$F} +t.i -${$3}.i.${$L}`,
          ...$iy`m.i.${$F} t.I ${$3}.i.${$L}`,
          ...$`m.i.${$F} t.a ${$3}.a.${$L}`,
        ],
        [
          ...$`-m.i.${$F} +t.a -${$3}.a.${$L}`,
          ...$`m.i.${$F} t.a ${$3}.a.${$L}`,
        ],
      );
    case ppForm.fti3il:
      // same as fta3al but can never be mifta3al when 'active', only mifti3il
      if ($3.meta.weak) {
        return $`m.i.${$F} t.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return $`m.i.${$F} t.a.${$3}.${$L}`;
      }
      return pickVoice(
        [
          ...$iy`-m.i.${$F} +t.i -${$3}.i.${$L}`,
          ...$iy`m.i.${$F} t.I ${$3}.i.${$L}`,
        ],
        [
          ...$`-m.i.${$F} +t.a -${$3}.a.${$L}`,
          ...$`m.i.${$F} t.a ${$3}.a.${$L}`,
        ],
      );
    case ppForm.staf3al:
      if ($3.meta.weak) {
        // not including an "if $L.meta.weak" branch here because
        // the only verb possibly like that is sta7aa, and that
        // should actually be constructed as a fta3al verb
        // of the "root" s7y
        return pickVoice(
          [...$`m.i.s._.t ${$F}.ii.${$L}`, ...$`m.i.s t.a ${$F}.ii.${$L}`],
          [...$`m.i.s._.t ${$F}.aa.${$L}`, ...$`m.i.s t.a ${$F}.aa.${$L}`],
        );
      }
      // geminate root
      if ($3.value === $L.value) {
        return pickVoice(
          [...$`m.i.s._.t ${$F}.i.${$3}.${$L}`, ...$`m.i.s t.a ${$F}.i.${$3}.${$L}`],
          [...$`m.i.s._.t ${$F}.a.${$3}.${$L}`, ...$`m.i.s t.a ${$F}.a.${$3}.${$L}`],
        );
      }
      return pickVoice(
        $iy`m.i.s t.a.${$F} ${$3}.i.${$L}`,
        $`m.i.s t.a.${$F} ${$3}.a.${$L}`,
      );
    case ppForm.f3all:
      if (isActiveVoice) {
        return $`m.i.${$F} ${$3}.a.${$L}.${$L}`;
      }
      throw new Error(`Can't use passive voice with f3all`);
    case ppForm.fa3la2:
      return pickVoice(
        [
          ...$iy`m.${$F}.a.${$3} ${$L}.i.${$Q}`,
          ...$`m.${$F}.a.${$3} ${$L}.a.${$Q}`,
        ],
        $`m.${$F}.a.${$3} ${$L}.a.${$Q}`,
      );
    case ppForm.tfa3la2:
      return pickVoice(
        [
          ...$`m.${$F}.a.${$3} ${$L}.a.${$Q}`,
          // see XXX in tfa33al above
          ...$iy`m.i.t ${$F}.a.${$3} ${$L}.i.${$Q}`,
          ...$iy`m.i.t ${$F}.i.${$3} ${$L}.i.${$Q}`,
        ],
        $`m.i.t ${$F}.a.${$3} ${$L}.a.${$Q}`,
      );
    case ppForm.stfa3la2:
      if ($F.meta.weak) {
        // doesn't exist B)
        return pickVoice(
          [
          // see XXX in tfa33al above
            ...$iy`m.i.s t.a.${$3} ${$L}.i.${$Q}`,
            ...$iy`m.i.s t.i.${$3} ${$L}.i.${$Q}`,
            ...$`m.i.s t.a.${$3} ${$L}.a.${$Q}`,
          ],
          $`m.i.s t.a.${$3} ${$L}.a.${$Q}`,
        );
      }
      return pickVoice(
        [
          // see XXX in tfa33al above
          ...$iy`m.i.s._.t ${$F}.a.${$3} ${$L}.i.${$Q}`,
          ...$iy`m.i.s._.t ${$F}.i.${$3} ${$L}.i.${$Q}`,
          ...$`m.i.s._.t ${$F}.a.${$3} ${$L}.a.${$Q}`,
        ],
        $`m.i.s._.t ${$F}.a.${$3} ${$L}.a.${$Q}`,
      );
    default:
      return null;
  }
}

module.exports = {
  pp,
};
