// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
// @ts-nocheck
function id(d: any[]): any { return d[0]; }

  // @ts-nocheck
  import * as _ from './obj';
  import {$Type} from '../alphabets/layers/templated'; // this hardcoding (which is necessary) makes it seem like this file should be somewhere else idk
  // or at least the hardcoding should be in this directory's index.ts maybe?
  import {$Type as $UnderlyingType} from '../alphabets/layers/underlying';
  import * as enums from '../enums';

  import * as moo from 'moo';
  import * as sym from './parsing-symbols';

  // // generate regex
  // const r = (strings, ...interp) => new RegExp(
  //   // easiest way i could think of to just zip them lol
  //   [strings[0], ...interp.map(
  //     (v, i) => `${v}${strings[i + 1]}`
  //   )].join(``)
  // );

  // generate diff symbols (applies to all but consonants which need special treatment)
  const generate = (...categories) => categories.map(category => ([s]) => {
    const {symbol, value, ...features} = sym[category][s];
    return {
      match: symbol ?? s,
      value: () => ({
        type: $UnderlyingType[category],
        value: value ?? symbol,
        symbol: symbol ?? s,
        features,
      })
    };
  });

  const [v, s, d, $] = generate(`vowel`, `suffix`, `delimiter`, `symbol`);

  // generate with emphatic
  const c = ([s]) => ({
    match: new RegExp(
      `${sym.consonant[s].symbol ?? s}\\${sym.symbol.emphatic}?`
    ),
    value: match => ({
      type: $UnderlyingType.consonant,
      meta: {
        emphatic: match.endsWith(sym.symbol.emphatic)
      },
      value: s
    })
  });

  // generate tokens from enum
  const fromEnum = (fenum, prefix = ``) => prefix
    ? {
      match: new RegExp(enums.keys(fenum).map(k => `${prefix}:${k}`).join(`|`)),
      value: k => fenum[k.substring(k.indexOf(`:`) + 1)]
    }
    : {
      match: new RegExp(enums.keys(fenum).join(`|`)),
      value: k => fenum[k]
    };

  const lexer = moo.states({
    main: {
      openFilter: /\((?:[a-z0-9]+|\\)?/,
      closeFilter: /\)/,

      number: /#\d{2,4}|#[03-9]/,
      genderedNumber: /#[12]/,
      numberGender: /M|F/,

      openTag: { match: /\[/, push: `tag` },
      openCtx: { match: /</, push: `ctxTag` },

      openWeakConsonant: /\{/,
      closeWeakConsonant: /\}/,

      2: c`2`,
      3: c`3`,
      b: c`b`,
      d: c`d`,
      f: c`f`,
      g: c`g`,
      gh: c`gh`,
      h: c`h`,
      7: c`7`,
      5: c`5`,
      j: c`j`,
      k: c`k`,
      q: c`q`,
      l: c`l`,
      m: c`m`,
      n: c`n`,
      p: c`p`,
      r: c`r`,
      s: c`s`,
      sh: c`sh`,
      t: c`t`,
      v: c`v`,
      w: c`w`,
      y: c`y`,
      z: c`z`,
      Z: c`Z`,
      th: c`th`,
      dh: c`dh`,
      nullConsonant: c`null`,

      a: v`a`,
      aa: v`aa`,
      aaLowered: v`AA`,
      ae: v`ae`,
      iLax: v`I`,
      i: v`i`,
      ii: v`ii`,
      uLax: v`U`,
      u: v`u`,
      uu: v`uu`,
      e: v`e`,
      ee: v`ee`,
      o: v`o`,
      oo: v`oo`,
      ay: v`ay`,
      aw: v`aw`,

      fem: s`c`,
      dual: s`Dual`,
      plural: s`Plural`,
      // femDual: s`FemDual`,  # not sure if good idea?
      femPlural: s`C`,
      ayn: s`AynPlural`,
      an: s`An`,
      iyy: s`Iyy`,
      jiyy: s`Jiyy`,
      negative: s`Negative`,

      stressed: $`stressed`,
      nasal: $`nasalized`,
      fus7a: $`fus7a`,

      genitiveDelimiter: {
        ...d`Of`,
        push: `augmentation`
      },
      objectDelimiter: {
        ...d`Object`,
        push: `augmentation`
      },
      pseudoSubjectDelimiter: {
        ...d`PseudoSubject`,
        push: `augmentation`
      },
      dativeDelimiter: {
        ...d`Dative`,
        push: `augmentation`
      },

      ws: /[^\S\r\n]+/,
      noBoundary: `.`
    },
    augmentation: {
      pronoun: {
        match: new RegExp(sym.pronoun.join(`|`)),
        pop: 1
      }
    },
    tag: {
      pronoun: new RegExp(sym.pronoun.join(`|`)),
      tam: fromEnum(enums.$TamToken),
      voice: fromEnum(enums.$VoiceToken),
      verbWazn: fromEnum(enums.$VerbWazn, `v`),
      ppWazn: fromEnum(enums.$PPWazn, `pp`),
      suffixDelim: /_/,
      fem: s`c`,
      dual: s`Dual`,
      plural: s`Plural`,
      // femDual: s`FemDual`,  # not sure if good idea?
      femPlural: s`C`,
      ayn: s`AynPlural`,
      an: s`An`,
      iyy: s`Iyy`,
      jiyy: s`Jiyy`,
      negative: s`Negative`,
      closeTag: { match: /]/, pop: 1 }
    },
    ctxTag: {
      ctxItem: /[a-zA-Z0-9 ]+/,
      closeCtx: { match: />/, pop: 1 }
    }
  });

  const processToken = ([{ value }]) => _.process(value);

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "passage$ebnf$1", "symbols": []},
    {"name": "passage$ebnf$1$subexpression$1$subexpression$1", "symbols": ["__WS"]},
    {"name": "passage$ebnf$1$subexpression$1$subexpression$1", "symbols": ["__NOBOUNDARY"]},
    {"name": "passage$ebnf$1$subexpression$1", "symbols": ["passage$ebnf$1$subexpression$1$subexpression$1", "term"], "postprocess": 
        ([[boundary], term]) => boundary ? [boundary, term] : [term]
          },
    {"name": "passage$ebnf$1", "symbols": ["passage$ebnf$1", "passage$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "passage", "symbols": ["term", "passage$ebnf$1"], "postprocess": ([a, b]) => [a, ...b.flat()]},
    {"name": "term", "symbols": ["expr"], "postprocess": id},
    {"name": "term", "symbols": ["literal"], "postprocess": id},
    {"name": "term", "symbols": ["idafe"], "postprocess": id},
    {"name": "term", "symbols": ["l"], "postprocess": id},
    {"name": "literal$ebnf$1", "symbols": [/[^)]/]},
    {"name": "literal$ebnf$1", "symbols": ["literal$ebnf$1", /[^)]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "literal", "symbols": [{"literal":"(\\"}, "literal$ebnf$1", {"literal":")"}], "postprocess": ([ , value]) => _.obj($Type.literal, value.join(''))},
    {"name": "literal", "symbols": [{"literal":"(\\)"}, {"literal":")"}], "postprocess": () => _.obj($Type.literal, `)`)},
    {"name": "idafe$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "idafe$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "idafe$subexpression$1", "symbols": ["expr"]},
    {"name": "idafe$subexpression$1", "symbols": ["idafe"]},
    {"name": "idafe$subexpression$2", "symbols": ["expr"]},
    {"name": "idafe$subexpression$2", "symbols": ["l"]},
    {"name": "idafe$subexpression$2", "symbols": ["idafe"]},
    {"name": "idafe", "symbols": [{"literal":"(idafe"}, "idafe$ebnf$1", "__", "idafe$subexpression$1", "__", "idafe$subexpression$2", {"literal":")"}], "postprocess": 
        ([ , ctx ,, [possessee] ,, [possessor], d]) => _.obj(
          $Type.idafe, {}, { possessee, possessor }, ctx
        )
          },
    {"name": "l", "symbols": [{"literal":"(l"}, {"literal":")"}], "postprocess": () => _.obj($Type.l)},
    {"name": "expr", "symbols": ["word"], "postprocess": id},
    {"name": "expr", "symbols": ["pp"]},
    {"name": "expr", "symbols": ["verb"]},
    {"name": "expr", "symbols": ["tif3il"]},
    {"name": "expr", "symbols": ["af3al"]},
    {"name": "expr", "symbols": ["number"]},
    {"name": "number$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "number$subexpression$1$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "number$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "number$subexpression$1", "symbols": ["number$subexpression$1$ebnf$1"], "postprocess": ([c]) => Boolean(c)},
    {"name": "number", "symbols": [{"literal":"("}, "number$ebnf$1", ({type: "number"}), "number$subexpression$1", {"literal":")"}], "postprocess": 
        ([ , ctx , { value: quantity }, isConstruct ]) => _.obj($Type.number, { gender: null, isConstruct }, { gender: null, quantity: quantity.slice(1) /* getting rid of the # */ }, ctx)
          },
    {"name": "number$ebnf$2", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "number$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "number$subexpression$2$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "number$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "number$subexpression$2", "symbols": ["number$subexpression$2$ebnf$1"], "postprocess": ([c]) => Boolean(c)},
    {"name": "number", "symbols": [{"literal":"("}, "number$ebnf$2", ({type: "genderedNumber"}), ({type: "numberGender"}), "number$subexpression$2", {"literal":")"}], "postprocess": 
        ([ , ctx , { value: quantity }, { value: gender }, isConstruct ]) => _.obj($Type.number, { gender, isConstruct }, { gender, quantity: quantity.slice(1) /* getting rid of the # */ }, ctx)
          },
    {"name": "af3al$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "af3al$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "af3al", "symbols": [{"literal":"(af3al"}, "af3al$ebnf$1", "__", "root", {"literal":")"}], "postprocess": 
        ([ , suffix, ctx ,, root]) => _.obj(
          $Type.af3al,
          { root },
          {},
          {},
          ctx
        )
        },
    {"name": "tif3il$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "tif3il$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "tif3il", "symbols": [{"literal":"(tif3il"}, "tif3il$ebnf$1", "__", "root", {"literal":")"}], "postprocess": 
        ([ , suffix, ctx ,, root]) => _.obj(
          $Type.tif3il,
          { root },
          {},
          {},
          ctx
        )
        },
    {"name": "pp$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "pp$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "pp", "symbols": [{"literal":"(pp"}, "pp$ebnf$1", "__", "ppWazn", "__", "voice", "__", "pronoun", "__", "root", {"literal":")"}], "postprocess": 
        ([ , ctx ,, wazn ,, voice ,, subject ,, root]) => _.obj(
          $Type.pp,
          { root, subject, voice, wazn: wazn.substring(2) },
          {},
          {},
          ctx
        )
          },
    {"name": "verb$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "verb$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "verb", "symbols": [{"literal":"(verb"}, "verb$ebnf$1", "__", "verbWazn", "__", "tam", "__", "pronoun", "__", "root", {"literal":")"}], "postprocess": 
        ([ , ctx ,, wazn ,, tam ,, subject ,, root]) => _.obj(
          $Type.verb,
          { root, subject, tam, wazn: wazn.substring(2) },
          {},
          {},
          ctx
        )
          },
    {"name": "suffix", "symbols": ["FEM"]},
    {"name": "suffix", "symbols": ["AN"]},
    {"name": "suffix", "symbols": ["DUAL"]},
    {"name": "suffix", "symbols": ["PLURAL"]},
    {"name": "suffix", "symbols": ["FEM_PLURAL"]},
    {"name": "suffix", "symbols": ["AYN"]},
    {"name": "suffix", "symbols": ["FEM"]},
    {"name": "suffix", "symbols": ["FEM"]},
    {"name": "suffix", "symbols": ["IYY"]},
    {"name": "suffix", "symbols": ["JIYY"]},
    {"name": "word$ebnf$1", "symbols": ["segment"]},
    {"name": "word$ebnf$1", "symbols": ["word$ebnf$1", "segment"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "word", "symbols": ["word$ebnf$1"], "postprocess": 
        ([values]) => _.obj($Type.word, values)
            },
    {"name": "word", "symbols": [{"literal":"(ctx"}, "ctx_tags", "__", "word", {"literal":")"}], "postprocess": ([ , ctx ,, word]) => ctx.map(word.ctx)},
    {"name": "ctx_tags$ebnf$1$subexpression$1", "symbols": ["__", ({type: "openCtx"}), ({type: "ctxItem"}), ({type: "closeCtx"})], "postprocess": ([ ,, { value }]) => value},
    {"name": "ctx_tags$ebnf$1", "symbols": ["ctx_tags$ebnf$1$subexpression$1"]},
    {"name": "ctx_tags$ebnf$1$subexpression$2", "symbols": ["__", ({type: "openCtx"}), ({type: "ctxItem"}), ({type: "closeCtx"})], "postprocess": ([ ,, { value }]) => value},
    {"name": "ctx_tags$ebnf$1", "symbols": ["ctx_tags$ebnf$1", "ctx_tags$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ctx_tags", "symbols": ["ctx_tags$ebnf$1"], "postprocess": 
        ([values]) => values
        },
    {"name": "segment$subexpression$1", "symbols": ["consonant"], "postprocess": id},
    {"name": "segment$subexpression$1", "symbols": ["vowel"], "postprocess": id},
    {"name": "segment", "symbols": ["segment$subexpression$1"], "postprocess": id},
    {"name": "vowel$subexpression$1", "symbols": ["long_vowel"]},
    {"name": "vowel$subexpression$1", "symbols": ["short_vowel"]},
    {"name": "vowel$ebnf$1", "symbols": ["NASAL"], "postprocess": id},
    {"name": "vowel$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "vowel", "symbols": ["vowel$subexpression$1", "vowel$ebnf$1"], "postprocess": ([[value], nasal]) => (nasal ? _.edit(value, {features: {nasalized: true}}) : value)},
    {"name": "short_vowel$subexpression$1", "symbols": [({type: "a"})]},
    {"name": "short_vowel$subexpression$1", "symbols": [({type: "iLax"})]},
    {"name": "short_vowel$subexpression$1", "symbols": [({type: "i"})]},
    {"name": "short_vowel$subexpression$1", "symbols": [({type: "uLax"})]},
    {"name": "short_vowel$subexpression$1", "symbols": [({type: "u"})]},
    {"name": "short_vowel$subexpression$1", "symbols": [({type: "e"})]},
    {"name": "short_vowel$subexpression$1", "symbols": [({type: "o"})]},
    {"name": "short_vowel", "symbols": ["short_vowel$subexpression$1"], "postprocess": ([[{ value }]]) => _.process(value)},
    {"name": "long_vowel$subexpression$1", "symbols": [({type: "aa"})]},
    {"name": "long_vowel$subexpression$1", "symbols": [({type: "aaLowered"})]},
    {"name": "long_vowel$subexpression$1", "symbols": [({type: "ae"})]},
    {"name": "long_vowel$subexpression$1", "symbols": [({type: "ii"})]},
    {"name": "long_vowel$subexpression$1", "symbols": [({type: "uu"})]},
    {"name": "long_vowel$subexpression$1", "symbols": [({type: "ee"})]},
    {"name": "long_vowel$subexpression$1", "symbols": [({type: "oo"})]},
    {"name": "long_vowel$subexpression$1", "symbols": [({type: "ay"})]},
    {"name": "long_vowel$subexpression$1", "symbols": [({type: "aw"})]},
    {"name": "long_vowel", "symbols": ["long_vowel$subexpression$1"], "postprocess": ([[{ value }]]) => _.process(value)},
    {"name": "root$ebnf$1", "symbols": ["consonant"], "postprocess": id},
    {"name": "root$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "root", "symbols": ["consonant", "consonant", "consonant", "root$ebnf$1"]},
    {"name": "consonant", "symbols": ["strong_consonant"], "postprocess": id},
    {"name": "consonant", "symbols": ["weak_consonant"], "postprocess": id},
    {"name": "weak_consonant", "symbols": [({type: "openWeakConsonant"}), "strong_consonant", ({type: "closeWeakConsonant"})], "postprocess": 
        ([ , value]) => _.edit(value, { meta: { weak: true }})
        },
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "2"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "3"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "b"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "d"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "f"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "g"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "gh"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "h"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "7"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "5"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "j"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "k"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "q"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "l"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "m"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "n"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "p"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "r"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "s"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "S"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "sh"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "t"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "v"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "z"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "th"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "dh"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "w"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "y"})]},
    {"name": "strong_consonant$subexpression$1", "symbols": [({type: "nullConsonant"})]},
    {"name": "strong_consonant", "symbols": ["strong_consonant$subexpression$1"], "postprocess": ([[{ value }]]) => _.process(value)},
    {"name": "augmentation", "symbols": ["delimiter", "pronoun"]},
    {"name": "pronoun", "symbols": [({type: "openTag"}), ({type: "pronoun"}), ({type: "closeTag"})], "postprocess": ([ , { value }]) => _.obj($Type.pronoun, value)},
    {"name": "tam", "symbols": [({type: "openTag"}), ({type: "tam"}), ({type: "closeTag"})], "postprocess": ([ , { value }]) => value},
    {"name": "voice", "symbols": [({type: "openTag"}), ({type: "voice"}), ({type: "closeTag"})], "postprocess": ([ , { value }]) => value},
    {"name": "verbWazn", "symbols": [({type: "openTag"}), ({type: "verbWazn"}), ({type: "closeTag"})], "postprocess": ([ , { value }]) => value},
    {"name": "ppWazn", "symbols": [({type: "openTag"}), ({type: "ppWazn"}), ({type: "closeTag"})], "postprocess": ([ , { value }]) => value},
    {"name": "delimiter", "symbols": [({type: "objectDelimiter"})], "postprocess": processToken},
    {"name": "delimiter", "symbols": [({type: "genitiveDelimiter"})], "postprocess": processToken},
    {"name": "delimiter", "symbols": [({type: "pseudoSubjectDelimiter"})], "postprocess": processToken},
    {"name": "delimiter", "symbols": [({type: "dativeDelimiter"})], "postprocess": processToken},
    {"name": "FEM", "symbols": [({type: "fem"})], "postprocess": processToken},
    {"name": "DUAL", "symbols": [({type: "dual"})], "postprocess": processToken},
    {"name": "PLURAL", "symbols": [({type: "plural"})], "postprocess": processToken},
    {"name": "FEM_PLURAL", "symbols": [({type: "femPlural"})], "postprocess": processToken},
    {"name": "AYN", "symbols": [({type: "ayn"})], "postprocess": processToken},
    {"name": "AN", "symbols": [({type: "an"})], "postprocess": processToken},
    {"name": "IYY", "symbols": [({type: "iyy"})], "postprocess": processToken},
    {"name": "JIYY", "symbols": [({type: "jiyy"})], "postprocess": processToken},
    {"name": "NEGATIVE", "symbols": [({type: "negative"})], "postprocess": processToken},
    {"name": "STRESSED", "symbols": [({type: "stressed"})], "postprocess": processToken},
    {"name": "NASAL", "symbols": [({type: "nasal"})], "postprocess": processToken},
    {"name": "__", "symbols": [({type: "ws"})], "postprocess": processToken},
    {"name": "__WS", "symbols": [({type: "ws"})], "postprocess": ([value]) => _.obj($Type.boundary, value)},
    {"name": "__NOBOUNDARY", "symbols": [({type: "noBoundary"})], "postprocess": () => null}
  ],
  ParserStart: "passage",
};

export default grammar;
