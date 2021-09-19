/* eslint-disable no-multi-spaces */
// DSL-ish stuff
/* eslint-disable no-unexpected-multiline */
/* eslint-disable func-call-spacing */
/* eslint-disable no-spaced-func */

// // cursed
// function isValidPropName(name) {
//   // eslint-disable-next-line no-unused-vars
//   const _ = {};
//   try {
//     // eslint-disable-next-line no-eval
//     eval(`_.name`);
//   } catch (e) {
//     if (e instanceof SyntaxError) {
//       return false;
//     }
//   }
//   return true;
// }

import { fenum } from './enums';
import { type } from './objects';
export { type };

export const articulator = fenum([`throat`, `tongue`, `lips`]);
export const location = fenum([`glottis`, `pharynx`, `uvula`, `velum`, `palate`, `bridge`, `ridge`, `teeth`, `lips`]);
export const manner = fenum([`plosive`, `fricative`, `affricate`, `approximant`, `nasal`, `flap`]);

function c(map) {
  function createConsonant(
    name,
    symbol,
    features = {},
    sub = null
  ) {
    if (name === null) {
      // terminate chain
      return map;
    }
    const names = [name];
    if (sub || !/^[a-z_$][a-z0-9_$]*$/i.test(name)) {
      names.push(sub || `_${name}`);
    }
    const obj = {
      type: type.consonant,
      meta: {
        weak: false,
        features: {
          emphatic: false,
          semivocalic: false,
          rounded: false,
          ...features,
          // ensure these three aren't `undefined`
          articulator: features.location,
          voicing: features.voicing,
          manner: features.manner,
          isNull: name === `null`
        },
      },
      symbol,
      value: name,
    };
    names.forEach(n => { map[n] = obj; });
    return createConsonant;
  }
  return createConsonant;
}

function v(map) {
  function createVowel(name, symbol, features = {}) {
    if (name === null) {
      // terminate chain
      return map;
    }
    map[name] = {
      type: type.vowel,
      meta: {
        lengthOffset: 0,  // 1 = elongated, -1 = contracted
        features: {
          length: name.length,
          diphthongal: false,
          nasalized: false,
          ...features,
        },
      },
      symbol,
      value: name,
    };
    return createVowel;
  }
  return createVowel;
}

// anything that isn't a letter is capitalized
export const alphabet = {
  ...c({
    emphatic: `*`,  // goes after the emphatic letter
  })
  // glottal
  (`h`, `h`, {
    location: location.glottis,
    articulator: articulator.throat,
    manner: manner.fricative,
    voicing: false,
  })
  (`2`, `2`, {
    location: location.glottis,
    articulator: articulator.throat,
    manner: manner.plosive,
    voicing: false,
  })
  // pharyngeal
  (`7`, `7`, {
    location: location.pharynx,
    articulator: articulator.throat,
    manner: manner.fricative,
    voicing: false,
  })
  (`3`, `3`, {
    location: location.pharynx,
    articulator: articulator.throat,
    manner: manner.approximant,
    voicing: true,
  })
  // uvular
  (`5`, `5`, {
    location: location.uvula,
    articulator: articulator.tongue,
    manner: manner.fricative,
    voicing: false,
  })
  (`gh`, `9`, {
    location: location.uvula,
    articulator: articulator.tongue,
    manner: manner.fricative,
    voicing: true,
  })
  (`q`, `q`, {
    location: location.uvula,
    articulator: articulator.tongue,
    manner: manner.plosive,
    voicing: false,
  })
  // velar
  (`k`, `k`, {
    location: location.velum,
    articulator: articulator.tongue,
    manner: manner.plosive,
    voicing: false,
  })
  (`g`, `g`, {
    location: location.velum,
    articulator: articulator.tongue,
    manner: manner.plosive,
    voicing: true,
  })
  // palatal
  (`y`, `y`, {
    location: location.palate,
    articulator: articulator.tongue,
    manner: manner.approximant,
    voicing: true,
    semivocalic: true,
  })
  // postalveolar
  (`sh`, `x`, {
    location: location.bridge,
    articulator: articulator.tongue,
    manner: manner.fricative,
    voicing: false,
  })
  (`j`, `j`, {
    location: location.bridge,
    articulator: articulator.tongue,
    manner: manner.fricative,
    voicing: true,
  })
  // alveolar
  (`r`, `r`, {
    location: location.ridge,
    articulator: articulator.tongue,
    manner: manner.flap,
    voicing: true,
  })  // trill...
  // denti-alveolar idk
  (`l`, `l`, {
    location: location.ridge,
    articulator: articulator.tongue,
    manner: manner.approximant,  // lateral don't real
    voicing: true,
  })
  (`s`, `s`, {
    location: location.ridge,
    articulator: articulator.tongue,
    manner: manner.fricative,
    voicing: false,
  })
  (`z`, `z`, {
    location: location.ridge,
    articulator: articulator.tongue,
    manner: manner.fricative,
    voicing: true,
  })
  (`n`, `n`, {
    location: location.ridge,
    articulator: articulator.tongue,
    manner: manner.nasal,
    voicing: true,
  })
  (`t`, `t`, {
    location: location.ridge,
    articulator: articulator.tongue,
    manner: manner.plosive,
    voicing: false,
  })
  (`d`, `d`, {
    location: location.ridge,
    articulator: articulator.tongue,
    manner: manner.plosive,
    voicing: true,
  })
  // interdental
  (`th`, `8`, {
    location: location.teeth,
    articulator: articulator.tongue,
    manner: manner.fricative,
    voicing: false,
  })
  (`dh`, `6`, {
    location: location.teeth,
    articulator: articulator.tongue,
    manner: manner.fricative,
    voicing: true,
  })
  // labiodental
  (`f`, `f`, {
    location: location.teeth,
    articulator: articulator.lips,
    manner: manner.fricative,
    voicing: false,
  })
  (`v`, `v`, {
    location: location.teeth,
    articulator: articulator.lips,
    manner: manner.fricative,
    voicing: true,
  })
  // bilabial
  (`w`, `w`, {
    location: location.lips,
    articulator: articulator.lips,
    manner: manner.approximant,
    voicing: true,
    semivocalic: true,
    rounded: true,
  })
  (`m`, `m`, {
    location: location.lips,
    articulator: articulator.lips,
    manner: manner.nasal,
    voicing: true,
  })  // nasal???
  (`b`, `b`, {
    location: location.lips,
    articulator: articulator.lips,
    manner: manner.plosive,
    voicing: true,
  })
  (`p`, `p`, {
    location: null,
    articulator: null,
    manner: manner.plosive,
    voicing: false,
  })
  // null
  (`null`, `0`, {
    location: location.bruh,
    articulator: articulator,
    manner: null,
    voicing: true,
  })
  (null),

  ...v({})
  (`a`, `a`)
  (`aa`, `A`)
  (`AA`, `&`)  // lowered aa, like in شاي
  (`ae`, `{`)  // 'foreign' ae, like in نان or فادي (hate xsampa for making { a reasonable way to represent this lmao)

  (`I`, `1`)  /* lax i, specifically for unstressed open syllables
               * like null<i<a when still in the medial stage, e.g. for ppl with kitIr كتير
               * aaand for stuff like mixYk/mixEke and mixAn (when not something like mxYk and mxAn)
               */
  (`i`, `i`)  // default unspecified-tenseness i (= kasra)
  (`ii`, `I`)

  (`U`, `0`)  /* lax u, specifically for unstressed open syllables
               * like l08C instead of lu8C (is that a thing?)
               */
  (`u`, `u`)  // default unspecified-tenseness u (= damme)
  (`uu`, `U`)

  (`e`, `e`)  /* word-final for *-a, like hYdIke
               * plus undecided on e.g. hEdIk vs hedIk (or just hYdIk?) for the short pron of هيديك
               * .......or h1dIk lol
               * also for loans like fetta فتا or elI" إيلي
               */
  (`ee`, `E`)

  (`o`, `o`)  // motEr?
  (`oo`, `O`)

  (`ay`, `Y`, {diphthongal: true})
  (`aw`, `W`, {diphthongal: true})
  (null),

  _: {  // no schwa
    type: type.epenthetic,
    meta: {
      priority: false,
    },
    symbol: `_`,
    value: `noschwa`,
  },
  Schwa: {
    type: type.epenthetic,
    meta: {
      priority: true,
    },
    symbol: `'`,
    value: `schwa`,
  },

  // fem suffix is its own thing bc -a vs -e vs -i variation
  c: {
    type: type.suffix,
    symbol: `c`,
    value: `fem`,
  },
  // not sure if this is a good idea?
  // FemDual: {
  //   type: type.suffix,
  //   symbol: `<`,
  //   value: `fdual`
  // },
  C: {
    type: type.suffix,
    symbol: `C`,
    value: `fplural`,
  },
  // dual suffix is its own thing bc -ayn/-een vs -aan variation (per Mekki 1984)
  Dual: {
    type: type.suffix,
    symbol: `=`,  // equals sign bc it's two lines
    value: `dual`,
  },
  // plural suffix is its own thing bc -iin-l- vs -in-l- variation, or stuff
  // like meshteryiin vs meshtriyyiin vs meshtriin
  Plural: {
    type: type.suffix,
    symbol: `+`,  // plus because plural is uhh... more
    value: `plural`,
  },
  // fossilized "dual" suffix like 3YnYn => 3Yn# and 7awAlYn => 7awAl#
  DualPlural: {
    type: type.suffix,
    symbol: `#`,  // kindasortamaybenot like a mix between + and = lol
    value: `ayn`,
  },
  // adverbial -an, ـًا
  An: {
    type: type.suffix,
    symbol: `@`,  // bc i needed an unused symbol that still resembles an A
    value: `an`,
  },
  // necessary bc it alternates between -i and -iyy-
  // (and maybe -(consonant)%= can become -yIn ~ -In instead of -iyyIn too?)
  Nisbe: {
    type: type.suffix,
    symbol: `%`,  // ahahahaha get it
    value: `iyy`
  },

  Stressed: {  // goes after the stressed syllable; only use if the word's stress is not automatic
    type: type.modifier,
    symbol: `"`,
    value: `stressed`,
  },
  French: {  // nasalized and, if final, stressed; 2ONrI" lOsyON kappitAN
    type: type.modifier,
    symbol: `N`,
    value: `nasalized`,
  },

  Of: {  // introduces idafe pronouns
    type: type.delimiter,
    symbol: `-`,
    value: `genitive`,
  },
  Object: {  // introduces verbs and active participles
    type: type.delimiter,
    symbol: `.`,
    value: `object`,
  },
  PseudoSubject: {  // s`arr~3ms/s`all~3ms, badd~3ms/bidd~3ms, أوعك أصحك etc
    type: type.delimiter,
    symbol: `~`,
    value: `pseudo-subject`,
  },
  Dative: {  // this stands for the dative L
    type: type.delimiter,
    symbol: `|`,
    value: `dative`,
  },
};

export const wazn = fenum([
  /* form 1: participles */
  `anyForm1`,
  `fe3il`,
  `fa3len`,
  /* form 1: verbs */
  `a`,
  `i`,
  `u`,
  /* all other forms */
  `fa33al`,
  `tfa33al`,
  `stfa33al`,
  `fe3al`,
  `tfe3al`,
  `stfe3al`,
  `2af3al`,  // never knew why this is conventionally stuck in the middle of (s/t)fa33al/(s/t)faa3al
  `nfa3al`,
  `nfi3il`,  // for npst -nfi3il. the pst is the same as nfa3al
  `fta3al`,
  `fti3il`,  // for npst -fti3il. the pst is the same as fta3al
  `staf3al`,
  `f3all`,
  `fa3la2`,
  `tfa3la2`,
  `stfa3la2`,  // probably only theoretically exists lol
]);

export const tamToken = fenum([
  `pst`,
  `sbjv`,
  `ind`,
  `imp`,
]);

export const voiceToken = fenum([
  `active`,
  `passive`,
]);

export const PERSON = {
  first: `1`,
  second: `2`,
  third: `3`,
};

export const GENDER = {
  masc: `m`,
  fem: `f`,
  common: `c`,
};

export const NUMBER = {
  singular: `s`,
  dual: `d`,
  plural: `p`,
};

const [P, G, N] = [PERSON, GENDER, NUMBER];

// not an enum because other code looks the individual chars of each element
// could probably fix that by turning P/G/N into enums like
// fenum([1, 2, 3]), fenum([`m`, `f`, `c`]), fenum([`s`, `d`, `p`])
// but that would need some refactoring
export const pronoun = [
  P.first  + G.masc   + N.singular,   // -e according to loun
  P.first  + G.fem    + N.singular,   // -i according to loun
  P.first  + G.common + N.singular,   // the normal neutral one idk
  P.first  + G.common + N.plural,
  P.second + G.masc   + N.singular,
  P.second + G.fem    + N.singular,
  P.second + G.common + N.singular,   // maybe someday
  P.second + G.masc   + N.plural,     // -kVm in case it exists in some southern dialect
  P.second + G.fem    + N.plural,     // ditto but -kVn
  P.second + G.common + N.plural,
  P.third  + G.masc   + N.singular,
  P.third  + G.fem    + N.singular,
  P.third  + G.masc   + N.plural,     // ditto but -(h)Vm
  P.third  + G.fem    + N.plural,     // ditto but -(h)Vn
  P.third  + G.common + N.plural,
];

export const negative = `X`;  // dunno how to implement this
