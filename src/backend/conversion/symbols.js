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

const { phonemeProperties: props } = require(`./utils`);

function c(map, createEmphatics = true) {
  function createConsonant(
    name,
    symbol,
    { sub = null, createEmphatic = createEmphatics, intrinsic = {}} = {}
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
      type: `consonant`,
      meta: {
        emphatic: false,
        weak: false,
        intrinsic: {
          ...intrinsic,
          articulator: props.articulators.inv[intrinsic.articulator],
          voicing: intrinsic.voicing,
          manner: props.manners.inv[intrinsic.manner],
          ly: {  // yes ik it's -ally
            semivocalic: false,
            rounded: false,
            ...intrinsic.ly,
            null: name === `null`
          }
        }
      },
      symbol,
      value: name
    };
    names.forEach(n => { map[n] = obj; });
    if (createEmphatic) {
      const emphatic = { ...obj, meta: { ...obj.meta, emphatic: true }};
      names.forEach(n => {
        map[`${n}${map.emphatic}`] = emphatic;
      });
    }
    return createConsonant;
  }
  return createConsonant;
}

function v(map) {
  function createVowel(name, symbol) {
    if (name === null) {
      // terminate chain
      return map;
    }
    map[name] = {
      type: `vowel`,
      meta: {
        // if we ever develop overlong vowels i'll see if
        // i wanna just add a length param to this function lol
        length: name.length
      },
      symbol,
      value: name
    };
    return createVowel;
  }
  return createVowel;
}

// anything that isn't a letter is capitalized
module.exports.alphabet = {
  ...c({
    emphatic: `*`  // goes after the emphatic letter
  })
  // glottal
  (`h`, `h`, { intrinsic: { articulator: `throat`, voicing: false, manner: `fricative` }})
  (`2`, `2`, { intrinsic: { articulator: `throat`, voicing: false, manner: `plosive` }})
  // pharyngeal
  (`7`, `7`, { intrinsic: { articulator: `throat`, voicing: false, manner: `fricative` }})
  (`3`, `3`, { intrinsic: { articulator: `throat`, voicing: true, manner: `approximant` }})
  // uvular
  (`5`, `5`, { intrinsic: { articulator: `root`, voicing: false, manner: `fricative` }})
  (`gh`, `9`, { intrinsic: { articulator: `root`, voicing: true, manner: `fricative` }})
  (`q`, `q`, { intrinsic: { articulator: `root`, voicing: false, manner: `plosive` }})
  // velar
  (`k`, `k`, { intrinsic: { articulator: `root`, voicing: false, manner: `plosive` }})
  (`g`, `g`, { intrinsic: { articulator: `root`, voicing: true, manner: `plosive` }})
  // palatal
  (`y`, `y`, {
    intrinsic: {
      articulator: `body`,
      voicing: true,
      manner: `approximant`,
      ly: { semivocalic: true }
    }
  })
  // postalveolar
  (`sh`, `x`, { intrinsic: { articulator: `crown`, voicing: false, manner: `fricative` }})
  (`j`, `j`, { intrinsic: { articulator: `crown`, voicing: true, manner: `fricative` }})
  // alveolar
  (`r`, `r`, { intrinsic: { articulator: `crown`, voicing: true, manner: `flap` }})  // trill...
  // denti-alveolar idk
  (`l`, `l`, { intrinsic: { articulator: `crown`, voicing: true, manner: `approximant` }})  // lateral don't real
  (`s`, `s`, { intrinsic: { articulator: `crown`, voicing: false, manner: `fricative` }})
  (`z`, `z`, { intrinsic: { articulator: `crown`, voicing: true, manner: `fricative` }})
  (`n`, `n`, { intrinsic: { articulator: `crown`, voicing: true, manner: `nasal` }})
  (`t`, `t`, { intrinsic: { articulator: `crown`, voicing: false, manner: `plosive` }})
  (`d`, `d`, { intrinsic: { articulator: `crown`, voicing: true, manner: `plosive` }})
  // interdental
  (`th`, `8`, { intrinsic: { articulator: `crown`, voicing: false, manner: `fricative` }})
  (`dh`, `6`, { intrinsic: { articulator: `crown`, voicing: true, manner: `fricative` }})
  // labiodental
  (`f`, `f`, { intrinsic: { articulator: `lips`, voicing: false, manner: `fricative` }})
  (`v`, `v`, { intrinsic: { articulator: `lips`, voicing: true, manner: `fricative` }})
  // bilabial
  (`w`, `w`, {
    intrinsic: {
      articulator: `lips`,
      voicing: true,
      manner: `approximant`,
      ly: { semivocalic: true, rounded: true }
    }
  })
  (`m`, `m`, { intrinsic: { articulator: `lips`, voicing: true, manner: `nasal` }})  // nasal???
  (`b`, `b`, { intrinsic: { articulator: `lips`, voicing: true, manner: `plosive` }})
  (`p`, `p`, { intrinsic: { articulator: `lips`, voicing: false, manner: `plosive` }})
  // null
  (`null`, `0`, { createEmphatic: false, intrinsic: { articulator: null, voicing: true, manner: `fricative` }})
  (null),

  ...v({})
  (`a/i`, null, { sub: `a_i` })  /* possibly-bad abstraction over a/i variation
                                  * (e.g. in f@33al verbs or f@3laan participles)
                                  * ONLY meant to be used in backend code, not the grammar,
                                  * hence symbol being null
                                  */
  (`a`, `a`)
  (`aa`, `A`)
  (`AA`, `@`)  // lowered aa, like in شاي
  (`ae`, `&`)  // 'foreign' ae, like in نان or فادي

  (`I`, `!`)  // e.g. 2!d`Afc; also word-final as in the name فادي
  (`i`, `i`)  /* default value of kasra
               * also for 0<i<a when still in the medial stage, like for ppl with kitIr كتير
               * aaand for stuff like mixYk/mixEke and mixAn (when not something like mxYk and mxAn)
               */
  (`ii`, `I`)

  (`U`, `V`)  // there's definitely a tense U but its distribution is weird compared to i/I... still, including it for symmetry
  (`u`, `u`)
  (`uu`, `U`)

  (`e`, `e`)  /* word-final for *-a, like hYdIke
               * plus undecided whether to do e.g. hEdIk or hedIk (or even just hYdIk) هيديك
               * also for loans like fetta فتا or elI" إيلي
               */
  (`ee`, `E`)

  (`o`, `o`)
  (`oo`, `O`)

  (`ay`, `Y`)
  (`aw`, `W`)
  (null),

  _: {  // no schwa
    type: `epenthetic`,
    meta: {
      priority: false
    },
    symbol: `_`,
    value: `noschwa`
  },
  Schwa: {
    type: `epenthetic`,
    meta: {
      priority: true
    },
    symbol: `'`,
    value: `schwa`
  },

  // fem suffix is its own thing bc -a vs -e vs -i variation
  Fem: {
    type: `suffix`,
    meta: {
      t: false  // may be changed with edit() in objects.js
    },
    symbol: `c`,
    value: `fem`
  },
  // not sure if this is a good idea?
  // FemDual: {
  //   type: `suffix`,
  //   symbol: `<`,
  //   value: `fdual`
  // },
  FemPlural: {
    type: `suffix`,
    symbol: `C`,
    value: `fplural`
  },
  // dual suffix is its own thing bc -ayn/-een vs -aan variation (per Mekki 1984)
  Dual: {
    type: `suffix`,
    symbol: `=`,
    value: `dual`
  },
  // plural suffix is its own thing bc -iin-l- vs -in-l- variation, or stuff
  // like meshteryiin vs meshtriyyiin vs meshtriin
  Plural: {
    type: `suffix`,
    symbol: `+`,
    value: `plural`
  },

  Stressed: {  // goes after the stressed syllable; only use if the word's stress is not automatic
    type: `modifier`,  // idk lol
    symbol: `"`,
    value: `stressed`
  },

  Of: {  // introduces idafe pronouns
    type: `delimiter`,
    symbol: `-`,
    value: `genitive`
  },
  Object: {  // introduces verbs and active participles
    type: `delimiter`,
    symbol: `.`,
    value: `object`
  },
  PseudoSubject: {  // s`arr~3ms/s`all~3ms, badd~3ms/bidd~3ms, أوعك أصحك etc
    type: `delimiter`,
    symbol: `~`,
    value: `pseudo-subject`
  },
  Dative: {  // this stands for the dative L
    type: `delimiter`,
    symbol: `|`,
    value: `dative`
  }
};

module.exports.higherVerbForms = [
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
  `stfa3la2`  // probably only theoretically exists lol
];

// technically this should be aa, ai, au, ia, ii, iu
// but since verbs can only show up in one tense here fina nokhtser
module.exports.verbForm1 = [`a`, `i`, `u`];

module.exports.ppForm1 = [
  `1/both`,
  `1/fa3len`,
  `1/fe3il`
  // ...higherVerbForms
];

module.exports.PERSONS = {
  first: `1`,
  second: `2`,
  third: `3`
};

module.exports.GENDERS = {
  masc: `m`,
  fem: `f`,
  common: `c`
};

module.exports.NUMBERS = {
  singular: `s`,
  dual: `d`,
  plural: `p`
};

const [P, G, N] = [this.PERSONS, this.GENDERS, this.NUMBERS];

module.exports.pronouns = [
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
  P.third  + G.common + N.plural
];

module.exports.negative = `X`;  // dunno how to implement this
