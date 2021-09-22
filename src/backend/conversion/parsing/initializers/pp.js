import { contract } from '../vowels';
import { type as segType } from '../../objects';
import { parseWord, parseLetter } from '../../parse-word';
import { wazn, voiceToken } from '../../symbols';
import * as utils from '../../utils';
const {
  misc: {
    lastOf, backup,
  },
  syllables: {newSyllable},
} = utils;

const I = Object.freeze(parseLetter`i`);
const Y = Object.freeze(parseLetter`y`);
const AA = Object.freeze(parseLetter`aa`);

// push suffix onto last syllable of base
// XXX TODO: technically they should be added at syllable level instead of
// segment level (bc word.js is what makes suffixes segment-level)
// but i think that would mess stress up and generally be annoying yikes
const pushSuffix = suffix => base => lastOf(base).value.push(suffix);

// add suffixes passed in from elsewhere
const addWordSuffixes = suffixes => base => base.push(...suffixes);

// bump last consonant of last syllable into a new syllable
// if last syllable's last segment isn't a consonant, just make an empty new syllable
function bumpLastConsonant(base) {
  const lastSyllable = lastOf(base).value;
  if (lastOf(lastSyllable).type === segType.consonant) {
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

function muToMi(base) {
  const firstSyllable = base[0].value;
  if (firstSyllable[0].value === `m` && firstSyllable[1].value === `u`) {
    firstSyllable.splice(1, 1, I);
  }
}

// strategies again but specifically for iy-final participles
function iyStrategize(conjugation) {
  if (conjugation.number.plural()) {
    return [
      // mishtiryiin, qaaryiin
      // aka: `*.i.y ii.n` => `*.i y.ii.n`
      bumpLastConsonant,
      /*
      // commenting this one out because it'll be handled later as
      // a regular rule that alternates Cyii with Cii
      // (maybe excluding e.g. byiibas which would instead be handled as a South Lev sorta thingy)
      base => {
        // mishtriin, qaariin
        // aka: `*.i.y ii.n` => `* ii.n`
        lastOf(base).value.splice(-2);
        base.push(newSyllable());
      },
      */
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
    meta.augmentation = augmentation(base);
    if (meta.augmentation.delimiter.value === `dative`) {
      // this part needs to be in a post-transformer because it doesn't make sense
      // for the contracted syllable to be temporarily unstressed
      // (which would be the case were it a pretransformer)
      const lastSyllable = lastOf(base).value;
      const a = lastOf(lastSyllable, 1);
      const b = lastOf(lastSyllable);
      if (
        a.type === segType.vowel && a.meta.features.length === 2 && !a.meta.features.diphthongal
        && b.type === segType.consonant
      ) {
        lastSyllable.splice(-2, 1, contract(a));
      }
    }
  });
}//

export default function pp({
  type: was,
  meta: {conjugation, form, voice},
  value: {
    root: [$F, $3, $L, $Q],
    augmentation,
    suffix: suffixes
  },
  context,
}) {
  // xor but being extra-explicit about it
  // (if form is quadriliteral then $Q must be given, and if not then not)
  if (Boolean($Q) !== Boolean(wazn.keys[form].endsWith(`2`))) {
    throw new Error(`Didn't expect fourth radical ${$Q} with form ${form}`);
  }

  const isActiveVoice = voice === voiceToken.active;
  const conjugationSuffix = conjugation.suffix;
  const lastRadical = $Q || $L;
  const onlyMu = context.has(`mu`);

  const ayFixer = (!conjugationSuffix.length && lastRadical.meta.weak) && fixAy;

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
      pushSuffix(conjugationSuffix),
      suffixes && addWordSuffixes(suffixes),
    ],
    !onlyMu && [
      muToMi,
      ayFixer,
      strategize(conjugation),
      pushSuffix(conjugationSuffix),
      suffixes && addWordSuffixes(suffixes),
    ]],
    meta,
  });

  const $iy = !lastRadical.meta.weak ? $ : parseWord({
    preTransform: backup(
      iyStrategize(conjugation),
    ).map(
      preSuffix => [
        !useMu && muToMi,
        ayFixer,
        preSuffix,
        pushSuffix(conjugationSuffix),
        suffixes && addWordSuffixes(suffixes),
      ],
    ).or([/* ayFixer */]),  // commented out because $iy shouldn't be used on -ay words
    postTransform: [[augment(augmentation)]],
    meta,
  });
  switch (form) {
    case wazn.anyForm1:
      if (isActiveVoice) {
        throw new Error(`Active voice is currently unsupported with anyForm1`);
      }
      // now passive
      if ($3.meta.weak) {
        const variants = [];
        if ($F.value === `n`) {
          if ($L.meta.weak) {
            variants.push(
              ...$iy`-m.u.${$F} +t.i -${$3}.i.y`,
              ...$iy`m.u.${$F} t.I ${$3}.i.y`,
              ...$iy`m.u.${$F} ${$3}.i.y`,
            );
          } else {
            variants.push(...$`m.u.${$F} t.aa.${$L}`);
          }
        }
        variants.push(
          ...$`m.u.n ${$F}.aa.${$L}`,
          ...$`m.a.${$F} y.uu.${$L}`,
        );
        return variants;
      }
      if ($L.meta.weak) {
        return $iy`m.i.${$F} ${$3}.i.y`;
      }
      // default
      return $`m.a.${$F} ${$3}.uu.${$L}`;
    case wazn.fe3il: {
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
    case wazn.fa3len:
      if (!isActiveVoice) {
        throw new Error(`Can't use passive voice with fa3len`);
      }
      return $`${$F}.a.${$3} ${$L}.aa.n`;
    case wazn.fa33al:
      return isActiveVoice
        ? [
          ...$iy`m.${$F}.a.${$3} ${$3}.i.${$L}`,
          ...$`m.${$F}.a.${$3} ${$3}.a.${$L}`,
        ]
        : $`m.${$F}.a.${$3} ${$3}.a.${$L}`;
    case wazn.tfa33al:
      return isActiveVoice
        ? [
          ...$`m.${$F}.a.${$3} ${$3}.a.${$L}`,
          ...$`m.u.t ${$F}.a.${$3} ${$3}.a.${$L}`,
          ...$iy`m.u.t ${$F}.a.${$3} ${$3}.i.${$L}`,
          ...$iy`m.u.t ${$F}.i.${$3} ${$3}.i.${$L}`,
        ]
        : $`m.u.t ${$F}.a.${$3} ${$3}.a.${$L}`;
    case wazn.stfa33al:
      // stanna-yestanna
      if ($F.meta.weak) {
        return isActiveVoice
          ? [
          // intentionally not including misti33il here, no mistinni (...right?)
            ...$iy`m.u.s t.a.${$3} ${$3}.i.${$L}`,
            ...$`m.u.s t.a.${$3} ${$3}.a.${$L}`,
          ]
          : $`m.u.s t.a.${$3} ${$3}.a.${$L}`;
      }
      return isActiveVoice
        ? [
        // see XXX in tfa33al above
          ...$iy`m.u.s._.t ${$F}.a.${$3} ${$3}.i.${$L}`,
          ...$iy`m.u.s._.t ${$F}.i.${$3} ${$3}.i.${$L}`,
          ...$`m.u.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`,
        ]
        : $`m.u.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`;
    case wazn.fe3al:
      return isActiveVoice
        ? [
          ...$iy`m.${$F}.aa ${$3}.i.${$L}`,
          ...$`m.${$F}.aa ${$3}.a.${$L}`,
        ]
        : $`m.${$F}.aa ${$3}.a.${$L}`;
    case wazn.tfe3al:
      return isActiveVoice
        ? [
          ...$`m.${$F}.aa ${$3}.a.${$L}`,
          ...$iy`m.u.t ${$F}.aa ${$3}.i.${$L}`,
          ...$`m.u.t ${$F}.aa ${$3}.a.${$L}`,
        ]
        : $`m.u.t ${$F}.aa ${$3}.a.${$L}`;
    case wazn.stfe3al:
      // stehal-yistehal
      if ($F.meta.weak) {
        return isActiveVoice
          ? [
            ...$iy`m.u.s t.aa ${$3}.i.${$L}`,
            ...$`m.u.s t.aa ${$3}.a.${$L}`,
          ]
          : $`m.u.s t.aa ${$3}.a.${$L}`;
      }
      return isActiveVoice
        ? [
          ...$iy`m.u.s._.t ${$F}.aa ${$3}.i.${$L}`,
          ...$`m.u.s._.t ${$F}.aa ${$3}.a.${$L}`,
        ]
        : $`m.u.s._.t ${$F}.aa ${$3}.a.${$L}`;
    case wazn[`2af3al`]:
      return isActiveVoice ? [
        ...$iy`m.u.${$F} ${$3}.i.${$L}`,
        ...$iy`m.2.a.${$F} ${$3}.i.${$L}`,
        ...$`m.2.a.${$F} ${$3}.a.${$L}`,
      ] : [
        ...$`m.u.${$F} ${$3}.a.${$L}`,
        ...$`m.2.a.${$F} ${$3}.a.${$L}`,
      ];
    case wazn.nfa3al:
      if ($3.meta.weak) {
        return $`m.u.n ${$F}.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return isActiveVoice
          ? [
            ...$`m.a.${$F} ${$3}.uu.${$L}`,
            ...$`m.u.n ${$F}.a.${$3}.${$L}`,
          ]
          : $`m.u.n ${$F}.a.${$3}.${$L}`;
      }
      return isActiveVoice ? [
        ...$`m.a.${$F} ${$3}.uu.${$L}`,
        ...$iy`-m.u.n +${$F}.i -${$3}.i.${$L}`,
        ...$iy`m.u.n ${$F}.I ${$3}.i.${$L}`,
        $`-m.u.n +${$F}.a -${$3}.a.${$L}`,
      ] : [
        ...$`-m.u.n +${$F}.a -${$3}.a.${$L}`,
        ...$`m.u.n ${$F}.a ${$3}.a.${$L}`,
      ];
    case wazn.nfi3il:
      // same as nfa3al but can never be minfa3al when 'active', only minfi3il
      if ($3.meta.weak) {
        return $`m.u.n ${$F}.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return isActiveVoice
          ? [
            ...$`m.a.${$F} ${$3}.uu.${$L}`,
            ...$`m.u.n ${$F}.a.${$3}.${$L}`,
          ]
          : $`m.u.n ${$F}.a.${$3}.${$L}`;
      }
      return isActiveVoice ? [
        ...$`m.a.${$F} ${$3}.uu.${$L}`,
        ...$iy`-m.u.n +${$F}.i -${$3}.i.${$L}`,
        ...$iy`m.u.n ${$F}.I ${$3}.i.${$L}`,
      ] : [
        ...$`-m.u.n +${$F}.a -${$3}.a.${$L}`,
        ...$`m.u.n ${$F}.a ${$3}.a.${$L}`,
      ];
    case wazn.fta3al:
      if ($3.meta.weak) {
        return $`m.u.${$F} t.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return $`m.u.${$F} t.a.${$3}.${$L}`;
      }
      return isActiveVoice ? [
        ...$iy`-m.u.${$F} +t.i -${$3}.i.${$L}`,
        ...$iy`m.u.${$F} t.I ${$3}.i.${$L}`,
        ...$`m.u.${$F} t.a ${$3}.a.${$L}`,
      ] : [
        ...$`-m.u.${$F} +t.a -${$3}.a.${$L}`,
        ...$`m.u.${$F} t.a ${$3}.a.${$L}`,
      ];
    case wazn.fti3il:
      // same as fta3al but can never be mifta3al when 'active', only mifti3il
      if ($3.meta.weak) {
        return $`m.u.${$F} t.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return $`m.u.${$F} t.a.${$3}.${$L}`;
      }
      return isActiveVoice ? [
        ...$iy`-m.u.${$F} +t.i -${$3}.i.${$L}`,
        ...$iy`m.u.${$F} t.I ${$3}.i.${$L}`,
      ] : [
        ...$`-m.u.${$F} +t.a -${$3}.a.${$L}`,
        ...$`m.u.${$F} t.a ${$3}.a.${$L}`,
      ];
    case wazn.staf3al:
      if ($3.meta.weak) {
        // not including an "if $L.meta.weak" branch here because
        // the only verb possibly like that is sta7aa, and that
        // should actually be constructed as a fta3al verb
        // of the "root" s7y
        return isActiveVoice ? [...$`m.u.s._.t ${$F}.ii.${$L}`, ...$`m.u.s t.a ${$F}.ii.${$L}`] : [...$`m.u.s._.t ${$F}.aa.${$L}`, ...$`m.u.s t.a ${$F}.aa.${$L}`];
      }
      // geminate root
      if ($3.value === $L.value) {
        return isActiveVoice ? [...$`m.u.s._.t ${$F}.i.${$3}.${$L}`, ...$`m.u.s t.a ${$F}.i.${$3}.${$L}`] : [...$`m.u.s._.t ${$F}.a.${$3}.${$L}`, ...$`m.u.s t.a ${$F}.a.${$3}.${$L}`];
      }
      return isActiveVoice ? $iy`m.u.s t.a.${$F} ${$3}.i.${$L}` : $`m.u.s t.a.${$F} ${$3}.a.${$L}`;
    case wazn.f3all:
      if (isActiveVoice) {
        return $`m.u.${$F} ${$3}.a.${$L}.${$L}`;
      }
      throw new Error(`Can't use passive voice with f3all`);
    case wazn.fa3la2:
      return isActiveVoice
        ? [
          ...$iy`m.${$F}.a.${$3} ${$L}.i.${$Q}`,
          ...$`m.${$F}.a.${$3} ${$L}.a.${$Q}`,
        ]
        : $`m.${$F}.a.${$3} ${$L}.a.${$Q}`;
    case wazn.tfa3la2:
      return isActiveVoice
        ? [
          ...$`m.${$F}.a.${$3} ${$L}.a.${$Q}`,
          // see XXX in tfa33al above
          ...$iy`m.u.t ${$F}.a.${$3} ${$L}.i.${$Q}`,
          ...$iy`m.u.t ${$F}.i.${$3} ${$L}.i.${$Q}`,
        ]
        : $`m.u.t ${$F}.a.${$3} ${$L}.a.${$Q}`;
    case wazn.stfa3la2:
      if ($F.meta.weak) {
        // doesn't exist B)
        return isActiveVoice
          ? [
          // see XXX in tfa33al above
            ...$iy`m.u.s t.a.${$3} ${$L}.i.${$Q}`,
            ...$iy`m.u.s t.i.${$3} ${$L}.i.${$Q}`,
            ...$`m.u.s t.a.${$3} ${$L}.a.${$Q}`,
          ]
          : $`m.u.s t.a.${$3} ${$L}.a.${$Q}`;
      }
      return isActiveVoice
        ? [
        // see XXX in tfa33al above
          ...$iy`m.u.s._.t ${$F}.a.${$3} ${$L}.i.${$Q}`,
          ...$iy`m.u.s._.t ${$F}.i.${$3} ${$L}.i.${$Q}`,
          ...$`m.u.s._.t ${$F}.a.${$3} ${$L}.a.${$Q}`,
        ]
        : $`m.u.s._.t ${$F}.a.${$3} ${$L}.a.${$Q}`;
    default:
      throw new Error(`Unknown participle form ${form} ('${wazn.keys[form]}')`);
  }
}
