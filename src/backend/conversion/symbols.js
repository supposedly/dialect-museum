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

const {enum: {fenum}} = require(`./utils`);
const {type} = require(`./objects`);

const articulator = fenum(`throat`, `root`, `mid`, `crown`, `lips`);
const manner = fenum(`plosive`, `fricative`, `affricate`, `approximant`, `nasal`, `flap`);

function c(map, createEmphatics = true) {
  function createConsonant(
    name,
    symbol,
    {sub = null, createEmphatic = createEmphatics, intrinsic = {}} = {},
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
        intrinsic: {
          ...intrinsic,
          articulator: intrinsic.articulator,
          voicing: intrinsic.voicing,
          manner: intrinsic.manner,
          ly: {  // yes ik it's -ally
            emphatic: false,
            semivocalic: false,
            rounded: false,
            ...intrinsic.ly,
            null: name === `null`,
          },
        },
      },
      symbol,
      value: name,
    };
    names.forEach(n => { map[n] = obj; });
    if (createEmphatic) {
      const emphatic = {...obj};
      emphatic.meta.intrinsic.ly.emphatic = true;
      names.forEach(n => {
        map[`${n}${map.emphatic}`] = emphatic;
      });
    }
    return createConsonant;
  }
  return createConsonant;
}

function v(map) {
  function createVowel(name, symbol, {intrinsic = {}} = {}) {
    if (name === null) {
      // terminate chain
      return map;
    }
    map[name] = {
      type: type.vowel,
      meta: {
        intrinsic: {
          length: name.length,
          ...intrinsic,
          ly: {
            diphthongal: false,
            ...intrinsic.ly,
          },
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
const alphabet = {
  ...c({
    emphatic: `*`,  // goes after the emphatic letter
  })
  // glottal
  (`h`, `h`, {intrinsic: {articulator: articulator.throat, voicing: false, manner: manner.fricative}})
  (`2`, `2`, {intrinsic: {articulator: articulator.throat, voicing: false, manner: manner.plosive}})
  // pharyngeal
  (`7`, `7`, {intrinsic: {articulator: articulator.throat, voicing: false, manner: manner.fricative}})
  (`3`, `3`, {intrinsic: {articulator: articulator.throat, voicing: true, manner: manner.approximant}})
  // uvular
  (`5`, `5`, {intrinsic: {articulator: articulator.root, voicing: false, manner: manner.fricative}})
  (`gh`, `9`, {intrinsic: {articulator: articulator.root, voicing: true, manner: manner.fricative}})
  (`q`, `q`, {intrinsic: {articulator: articulator.root, voicing: false, manner: manner.plosive}})
  // velar
  (`k`, `k`, {intrinsic: {articulator: articulator.root, voicing: false, manner: manner.plosive}})
  (`g`, `g`, {intrinsic: {articulator: articulator.root, voicing: true, manner: manner.plosive}})
  // palatal
  (`y`, `y`, {
    intrinsic: {
      articulator: articulator.mid,
      voicing: true,
      manner: manner.approximant,
      ly: {semivocalic: true},
    },
  })
  // postalveolar
  (`sh`, `x`, {intrinsic: {articulator: articulator.crown, voicing: false, manner: manner.fricative}})
  (`j`, `j`, {intrinsic: {articulator: articulator.crown, voicing: true, manner: manner.fricative}})
  // alveolar
  (`r`, `r`, {intrinsic: {articulator: articulator.crown, voicing: true, manner: manner.flap}})  // trill...
  // denti-alveolar idk
  (`l`, `l`, {intrinsic: {articulator: articulator.crown, voicing: true, manner: manner.approximant}})  // lateral don't real
  (`s`, `s`, {intrinsic: {articulator: articulator.crown, voicing: false, manner: manner.fricative}})
  (`z`, `z`, {intrinsic: {articulator: articulator.crown, voicing: true, manner: manner.fricative}})
  (`n`, `n`, {intrinsic: {articulator: articulator.crown, voicing: true, manner: manner.nasal}})
  (`t`, `t`, {intrinsic: {articulator: articulator.crown, voicing: false, manner: manner.plosive}})
  (`d`, `d`, {intrinsic: {articulator: articulator.crown, voicing: true, manner: manner.plosive}})
  // interdental
  (`th`, `8`, {intrinsic: {articulator: articulator.crown, voicing: false, manner: manner.fricative}})
  (`dh`, `6`, {intrinsic: {articulator: articulator.crown, voicing: true, manner: manner.fricative}})
  // labiodental
  (`f`, `f`, {intrinsic: {articulator: articulator.lips, voicing: false, manner: manner.fricative}})
  (`v`, `v`, {intrinsic: {articulator: articulator.lips, voicing: true, manner: manner.fricative}})
  // bilabial
  (`w`, `w`, {
    intrinsic: {
      articulator: articulator.lips,
      voicing: true,
      manner: manner.approximant,
      ly: {semivocalic: true, rounded: true},
    },
  })
  (`m`, `m`, {intrinsic: {articulator: articulator.lips, voicing: true, manner: manner.nasal}})  // nasal???
  (`b`, `b`, {intrinsic: {articulator: articulator.lips, voicing: true, manner: manner.plosive}})
  (`p`, `p`, {intrinsic: {articulator: articulator.lips, voicing: false, manner: manner.plosive}})
  // null
  (`null`, `0`, {createEmphatic: false, intrinsic: {articulator: null, voicing: true, manner: null}})
  (null),

  ...v({})
  (`a/i`, null, {sub: `a_i`})  /* possibly-bad abstraction over a/i variation
                                  * (e.g. in f@33al verbs or f@3laan participles)
                                  * ONLY meant to be used in backend code, not the grammar,
                                  * hence symbol being null
                                  */
  (`a`, `a`)
  (`aa`, `A`)
  (`AA`, `@`)  // lowered aa, like in شاي
  (`ae`, `&`)  // 'foreign' ae, like in نان or فادي

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

  (`ay`, `Y`, {intrinsic: {ly: {diphthongal: true}}})
  (`aw`, `W`, {intrinsic: {ly: {diphthongal: true}}})
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
  Fem: {
    type: type.suffix,
    meta: {
      t: false,  // may be changed with edit() in objects.js
    },
    symbol: `c`,
    value: `fem`,
  },
  // not sure if this is a good idea?
  // FemDual: {
  //   type: type.suffix,
  //   symbol: `<`,
  //   value: `fdual`
  // },
  FemPlural: {
    type: type.suffix,
    symbol: `C`,
    value: `fplural`,
  },
  // dual suffix is its own thing bc -ayn/-een vs -aan variation (per Mekki 1984)
  Dual: {
    type: type.suffix,
    symbol: `=`,
    value: `dual`,
  },
  // plural suffix is its own thing bc -iin-l- vs -in-l- variation, or stuff
  // like meshteryiin vs meshtriyyiin vs meshtriin
  Plural: {
    type: type.suffix,
    symbol: `+`,
    value: `plural`,
  },

  Stressed: {  // goes after the stressed syllable; only use if the word's stress is not automatic
    type: type.modifier,  // idk lol
    symbol: `"`,
    value: `stressed`,
  },
  French: {  // stressed and nasalized; lOsyON kappitAN
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

const higherVerbForms = [
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
];

// technically this should be aa, ai, au, ia, ii, iu
// but since verbs can only show up in one tense here fina nokhtser
const verbForm = fenum(
  `a`,
  `i`,
  `u`,
  ...higherVerbForms
);

const ppForm = fenum(
  `anyForm1`,
  `fa3len`,
  `fe3il`,
  ...higherVerbForms
);

const PERSON = {
  first: `1`,
  second: `2`,
  third: `3`,
};

const GENDER = {
  masc: `m`,
  fem: `f`,
  common: `c`,
};

const NUMBER = {
  singular: `s`,
  dual: `d`,
  plural: `p`,
};

const [P, G, N] = [PERSON, GENDER, NUMBER];

// not an enum because other code looks the individual chars of each element
// could probably fix that by turning P/G/N into enums like
// fenum(1, 2, 3), fenum(`m`, `f`, `c`), fenum(`s`, `d`, `p`)
// but that would need some refactoring
const pronoun = [
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

const negative = `X`;  // dunno how to implement this

const tamToken = fenum(
  `pst`,
  `sbjv`,
  `ind`,
  `imp`
);

const voiceToken = fenum(
  `active`,
  `passive`
);

module.exports = {
  articulator,
  manner,
  type,
  alphabet,
  verbForm,
  ppForm,
  PERSON,
  GENDER,
  NUMBER,
  pronoun,
  negative,
  tamToken,
  voiceToken,
};
