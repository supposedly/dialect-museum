// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
function id(x) { return x[0]; }

  import * as obj from '../objects';
  import inits from './initializers';
  import type from './type';

  import * as moo from 'moo';
  import * as sym from '../symbols';

  const abc = sym.alphabet;
  const _ = obj.obj;

  // // generate regex
  // const r = (strings, ...interp) => new RegExp(
  //   // easiest way i could think of to just zip them lol
  //   [strings[0], ...interp.map(
  //     (v, i) => `${v}${strings[i + 1]}`
  //   )].join(``)
  // );

  // generate with emphatic
  const c = ([s]) => ({
    match: new RegExp(
      `${abc[s].symbol}\\${abc.emphatic}?`
    ),
    value: match => (match.endsWith(abc.emphatic)
      ? {...abc[s], meta: {...abc[s].meta, features: {...abc[s].meta.features, emphatic: true}}}
      : abc[s]
    )
  });

  // generate everything else
  const $ = ([s]) => ({
    match: abc[s].symbol,
    value: () => abc[s]
  });

  // generate tokens from enum
  const fromEnum = fenum => ({
    match: new RegExp(fenum.keys.join(`|`)),
    value: k => fenum[k]
  });

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

      a: $`a`,
      aa: $`aa`,
      aaLowered: $`AA`,
      ae: $`ae`,
      iLax: $`I`,
      i: $`i`,
      ii: $`ii`,
      uLax: $`U`,
      u: $`u`,
      uu: $`uu`,
      e: $`e`,
      ee: $`ee`,
      o: $`o`,
      oo: $`oo`,
      ay: $`ay`,
      aw: $`aw`,

      noSchwa: $`_`,
      schwa: $`Schwa`,

      fem: $`c`,
      dual: $`Dual`,
      plural: $`Plural`,
      // femDual: $`FemDual`,  # not sure if good idea?
      femPlural: $`C`,
      ayn: $`AynPlural`,
      an: $`An`,
      iyy: $`Iyy`,
      jiyy: $`Jiyy`,
      negative: $`Negative`,

      stressed: $`Stressed`,
      nasal: $`Nasalized`,

      genitiveDelimiter: {
        ...$`Of`,
        push: `augmentation`
      },
      objectDelimiter: {
        ...$`Object`,
        push: `augmentation`
      },
      pseudoSubjectDelimiter: {
        ...$`PseudoSubject`,
        push: `augmentation`
      },
      dativeDelimiter: {
        ...$`Dative`,
        push: `augmentation`
      },

      ws: /[^\S\r\n]+/
    },
    augmentation: {
      pronoun: {
        match: new RegExp(sym.pronoun.join(`|`)),
        pop: 1
      }
    },
    tag: {
      pronoun: new RegExp(sym.pronoun.join(`|`)),
      tam: fromEnum(sym.tamToken),
      voice: fromEnum(sym.voiceToken),
      wazn: fromEnum(sym.wazn),
      suffixDelim: /_/,
      fem: $`c`,
      dual: $`Dual`,
      plural: $`Plural`,
      // femDual: $`FemDual`,  # not sure if good idea?
      femPlural: $`C`,
      ayn: $`AynPlural`,
      an: $`An`,
      iyy: $`Iyy`,
      jiyy: $`Jiyy`,
      negative: $`Negative`,
      closeTag: { match: /]/, pop: 1 }
    },
    ctxTag: {
      ctxItem: /[a-zA-Z0-9 ]+/,
      closeCtx: { match: />/, pop: 1 }
    }
  });

  const processToken = ([{ value }]) => _.process(value);

  const init = (...args) => _.obj(...args).init(inits);

  const processSuffixes = stressedIdx => value => value.map((suf, idx) => _.edit(suf, {type: type.suffix, meta: {stressed: stressedIdx === idx}}));
export const Lexer = lexer;
export const ParserRules = [
    {"name": "passage$ebnf$1", "symbols": []},
    {"name": "passage$ebnf$1$subexpression$1", "symbols": ["__", "term"], "postprocess": ([ , term]) => term},
    {"name": "passage$ebnf$1", "symbols": ["passage$ebnf$1", "passage$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "passage", "symbols": ["term", "passage$ebnf$1"], "postprocess": ([a, b]) => [a, ...b]},
    {"name": "term", "symbols": ["expr"], "postprocess": id},
    {"name": "term", "symbols": ["literal"], "postprocess": id},
    {"name": "term", "symbols": ["idafe"], "postprocess": id},
    {"name": "term", "symbols": ["l"], "postprocess": id},
    {"name": "literal$ebnf$1", "symbols": [/[^)]/]},
    {"name": "literal$ebnf$1", "symbols": ["literal$ebnf$1", /[^)]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "literal", "symbols": [{"literal":"(\\"}, "literal$ebnf$1", {"literal":")"}], "postprocess": ([ , value]) => _.obj(type.literal, {}, value.join(''))},
    {"name": "literal", "symbols": [{"literal":"(\\)"}, {"literal":")"}], "postprocess": () => _.obj(type.literal, {}, `)`)},
    {"name": "idafe$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "idafe$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "idafe$subexpression$1", "symbols": ["expr"]},
    {"name": "idafe$subexpression$1", "symbols": ["idafe"]},
    {"name": "idafe$subexpression$2", "symbols": ["expr"]},
    {"name": "idafe$subexpression$2", "symbols": ["l"]},
    {"name": "idafe$subexpression$2", "symbols": ["idafe"]},
    {"name": "idafe", "symbols": [{"literal":"(idafe"}, "idafe$ebnf$1", "__", "idafe$subexpression$1", "__", "idafe$subexpression$2", {"literal":")"}], "postprocess": 
        ([ , ctx ,, [possessee] ,, [possessor], d]) => init(
          type.idafe, {}, { possessee, possessor }, ctx
        )
          },
    {"name": "l", "symbols": [{"literal":"(l"}, "__", "expr", {"literal":")"}], "postprocess": ([ ,, value]) => init(type.l, {}, value)},
    {"name": "expr", "symbols": ["word"], "postprocess": id},
    {"name": "expr", "symbols": ["pp"]},
    {"name": "expr", "symbols": ["verb"]},
    {"name": "expr", "symbols": ["tif3il"]},
    {"name": "expr", "symbols": ["af3al"]},
    {"name": "expr", "symbols": ["number"]},
    {"name": "number$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number$subexpression$1$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "number$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number$subexpression$1", "symbols": ["number$subexpression$1$ebnf$1"], "postprocess": ([c]) => Boolean(c)},
    {"name": "number", "symbols": [{"literal":"("}, "number$ebnf$1", ({type: "number"}), "number$subexpression$1", {"literal":")"}], "postprocess": 
        ([ , ctx , { value: quantity }, isConstruct ]) => init(type.number, { gender: null, isConstruct }, { quantity: quantity.slice(1) /* getting rid of the # */ }, ctx)
          },
    {"name": "number$ebnf$2", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "number$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number$subexpression$2$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "number$subexpression$2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number$subexpression$2", "symbols": ["number$subexpression$2$ebnf$1"], "postprocess": ([c]) => Boolean(c)},
    {"name": "number", "symbols": [{"literal":"("}, "number$ebnf$2", ({type: "genderedNumber"}), ({type: "numberGender"}), "number$subexpression$2", {"literal":")"}], "postprocess": 
        ([ , ctx , { value: quantity }, { value: gender }, isConstruct ]) => init(type.number, { gender, isConstruct }, { quantity: quantity.slice(1) /* getting rid of the # */ }, ctx)
          },
    {"name": "af3al$ebnf$1", "symbols": ["filter_suffix"], "postprocess": id},
    {"name": "af3al$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "af3al$ebnf$2", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "af3al$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "af3al$ebnf$3", "symbols": ["augmentation"], "postprocess": id},
    {"name": "af3al$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "af3al", "symbols": [{"literal":"(af3al"}, "af3al$ebnf$1", "af3al$ebnf$2", "__", "root", "af3al$ebnf$3", {"literal":")"}], "postprocess": 
        ([ , suffix, ctx ,, root, augmentation]) => init(
          type.af3al,
          {},
          {root, suffix: suffix || [], augmentation},
          ctx
        )
        },
    {"name": "tif3il$ebnf$1", "symbols": ["filter_suffix"], "postprocess": id},
    {"name": "tif3il$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tif3il$ebnf$2", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "tif3il$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tif3il$ebnf$3", "symbols": ["augmentation"], "postprocess": id},
    {"name": "tif3il$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tif3il", "symbols": [{"literal":"(tif3il"}, "tif3il$ebnf$1", "tif3il$ebnf$2", "__", "root", "tif3il$ebnf$3", {"literal":")"}], "postprocess": 
        ([ , suffix, ctx ,, root, augmentation]) => init(
          type.tif3il,
          {},
          {root, suffix: suffix || [], augmentation},
          ctx
        )
        },
    {"name": "pp$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "pp$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pp$ebnf$2", "symbols": ["augmentation"], "postprocess": id},
    {"name": "pp$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pp", "symbols": [{"literal":"(pp"}, "pp$ebnf$1", "__", "suffixed_wazn", "__", "voice", "__", "pronoun", "__", "root", "pp$ebnf$2", {"literal":")"}], "postprocess": 
        ([ , ctx ,, {form, suffix} ,, voice ,, conjugation ,, root, augmentation]) => init(
          type.pp,
          { conjugation, form, voice },
          { root, suffix: suffix || [], augmentation },
          ctx
        )
          },
    {"name": "verb$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "verb$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "verb$ebnf$2", "symbols": ["augmentation"], "postprocess": id},
    {"name": "verb$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "verb", "symbols": [{"literal":"(verb"}, "verb$ebnf$1", "__", "wazn", "__", "tam", "__", "pronoun", "__", "root", "verb$ebnf$2", {"literal":")"}], "postprocess": 
        ([ , ctx ,, form ,, tam ,, conjugation ,, root, augmentation]) => init(
          type.verb,
          { form, tam, conjugation },
          { root, augmentation },
          ctx
        )
          },
    {"name": "suffixed_wazn$ebnf$1", "symbols": ["filter_suffix"], "postprocess": id},
    {"name": "suffixed_wazn$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "suffixed_wazn", "symbols": [({type: "openTag"}), ({type: "wazn"}), "suffixed_wazn$ebnf$1", ({type: "closeTag"})], "postprocess": ([, {value: form}, suffix]) => ({form, suffix})},
    {"name": "filter_suffix", "symbols": [{"literal":"_"}, "suffix"], "postprocess": ([ , suffix]) => suffix},
    {"name": "word$ebnf$1", "symbols": ["suffix"], "postprocess": id},
    {"name": "word$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "word$ebnf$2", "symbols": ["augmentation"], "postprocess": id},
    {"name": "word$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "word", "symbols": ["stem", "word$ebnf$1", "word$ebnf$2"], "postprocess": 
        ([{value}, suffix, augmentation]) => init(
          type.word,
          { was: null },
          [
            ...(suffix && suffix.some(o => o.meta.stressed) ? value.map(syl => _.edit(syl, {meta: {stressed: false}})) : value),
            ...(suffix || []),
            ...(augmentation ? [augmentation] : [])
          ]
        )
            },
    {"name": "word", "symbols": [{"literal":"(ctx"}, "ctx_tags", "__", "word", {"literal":")"}], "postprocess": ([ , ctx ,, word]) => ctx.map(word.ctx)},
    {"name": "ctx_tags$ebnf$1$subexpression$1", "symbols": ["__", ({type: "openCtx"}), ({type: "ctxItem"}), ({type: "closeCtx"})], "postprocess": ([ ,, { value }]) => value},
    {"name": "ctx_tags$ebnf$1", "symbols": ["ctx_tags$ebnf$1$subexpression$1"]},
    {"name": "ctx_tags$ebnf$1$subexpression$2", "symbols": ["__", ({type: "openCtx"}), ({type: "ctxItem"}), ({type: "closeCtx"})], "postprocess": ([ ,, { value }]) => value},
    {"name": "ctx_tags$ebnf$1", "symbols": ["ctx_tags$ebnf$1", "ctx_tags$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ctx_tags", "symbols": ["ctx_tags$ebnf$1"], "postprocess": 
        ([values]) => values
        },
    {"name": "suffix", "symbols": ["suffix_not_iyy"], "postprocess": id},
    {"name": "suffix$macrocall$2", "symbols": ["IYY"]},
    {"name": "suffix$macrocall$1$ebnf$1", "symbols": ["suffix_not_iyy"], "postprocess": id},
    {"name": "suffix$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "suffix$macrocall$1", "symbols": ["suffix$macrocall$2", "suffix$macrocall$1$ebnf$1"], "postprocess": 
        ([suffixChain, nesteds]) => {
          // XXX: the suffixChain.length stuff is bad hardcoding
          // (basically works bc the only options are C%, CG, =%, =G, and % or G on its own, so do the math)
          // will bite me later if i wanna use this for a recursable suffix that isn't % or G and doesn't have their stress behavior
          // or maybe if i wanna use this for a chain of more than 2 initial suffixes
          return nesteds
            ? [...processSuffixes(nesteds.some(o => o.meta.stressed) ? -1 : suffixChain.length - 1)(suffixChain), ...nesteds]
            : processSuffixes(suffixChain.length - 2)(suffixChain);
        }
          },
    {"name": "suffix", "symbols": ["suffix$macrocall$1"], "postprocess": id},
    {"name": "suffix$macrocall$4", "symbols": ["JIYY"]},
    {"name": "suffix$macrocall$3$ebnf$1", "symbols": ["suffix_not_iyy"], "postprocess": id},
    {"name": "suffix$macrocall$3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "suffix$macrocall$3", "symbols": ["suffix$macrocall$4", "suffix$macrocall$3$ebnf$1"], "postprocess": 
        ([suffixChain, nesteds]) => {
          // XXX: the suffixChain.length stuff is bad hardcoding
          // (basically works bc the only options are C%, CG, =%, =G, and % or G on its own, so do the math)
          // will bite me later if i wanna use this for a recursable suffix that isn't % or G and doesn't have their stress behavior
          // or maybe if i wanna use this for a chain of more than 2 initial suffixes
          return nesteds
            ? [...processSuffixes(nesteds.some(o => o.meta.stressed) ? -1 : suffixChain.length - 1)(suffixChain), ...nesteds]
            : processSuffixes(suffixChain.length - 2)(suffixChain);
        }
          },
    {"name": "suffix", "symbols": ["suffix$macrocall$3"], "postprocess": id},
    {"name": "suffix_not_iyy", "symbols": ["FEM"], "postprocess": processSuffixes(-1)},
    {"name": "suffix_not_iyy", "symbols": ["AN"], "postprocess": processSuffixes(-1)},
    {"name": "suffix_not_iyy", "symbols": ["DUAL"], "postprocess": processSuffixes(0)},
    {"name": "suffix_not_iyy", "symbols": ["PLURAL"], "postprocess": processSuffixes(0)},
    {"name": "suffix_not_iyy", "symbols": ["FEM_PLURAL"], "postprocess": processSuffixes(0)},
    {"name": "suffix_not_iyy", "symbols": ["AYN"], "postprocess": processSuffixes(0)},
    {"name": "suffix_not_iyy", "symbols": ["FEM", "AN"], "postprocess": processSuffixes(-1)},
    {"name": "suffix_not_iyy", "symbols": ["FEM", "DUAL"], "postprocess": processSuffixes(1)},
    {"name": "suffix_not_iyy$macrocall$2", "symbols": ["FEM_PLURAL", "IYY"]},
    {"name": "suffix_not_iyy$macrocall$1$ebnf$1", "symbols": ["suffix_not_iyy"], "postprocess": id},
    {"name": "suffix_not_iyy$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "suffix_not_iyy$macrocall$1", "symbols": ["suffix_not_iyy$macrocall$2", "suffix_not_iyy$macrocall$1$ebnf$1"], "postprocess": 
        ([suffixChain, nesteds]) => {
          // XXX: the suffixChain.length stuff is bad hardcoding
          // (basically works bc the only options are C%, CG, =%, =G, and % or G on its own, so do the math)
          // will bite me later if i wanna use this for a recursable suffix that isn't % or G and doesn't have their stress behavior
          // or maybe if i wanna use this for a chain of more than 2 initial suffixes
          return nesteds
            ? [...processSuffixes(nesteds.some(o => o.meta.stressed) ? -1 : suffixChain.length - 1)(suffixChain), ...nesteds]
            : processSuffixes(suffixChain.length - 2)(suffixChain);
        }
          },
    {"name": "suffix_not_iyy", "symbols": ["suffix_not_iyy$macrocall$1"], "postprocess": id},
    {"name": "suffix_not_iyy$macrocall$4", "symbols": ["FEM_PLURAL", "JIYY"]},
    {"name": "suffix_not_iyy$macrocall$3$ebnf$1", "symbols": ["suffix_not_iyy"], "postprocess": id},
    {"name": "suffix_not_iyy$macrocall$3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "suffix_not_iyy$macrocall$3", "symbols": ["suffix_not_iyy$macrocall$4", "suffix_not_iyy$macrocall$3$ebnf$1"], "postprocess": 
        ([suffixChain, nesteds]) => {
          // XXX: the suffixChain.length stuff is bad hardcoding
          // (basically works bc the only options are C%, CG, =%, =G, and % or G on its own, so do the math)
          // will bite me later if i wanna use this for a recursable suffix that isn't % or G and doesn't have their stress behavior
          // or maybe if i wanna use this for a chain of more than 2 initial suffixes
          return nesteds
            ? [...processSuffixes(nesteds.some(o => o.meta.stressed) ? -1 : suffixChain.length - 1)(suffixChain), ...nesteds]
            : processSuffixes(suffixChain.length - 2)(suffixChain);
        }
          },
    {"name": "suffix_not_iyy", "symbols": ["suffix_not_iyy$macrocall$3"], "postprocess": id},
    {"name": "suffix_not_iyy$macrocall$6", "symbols": ["DUAL", "IYY"]},
    {"name": "suffix_not_iyy$macrocall$5$ebnf$1", "symbols": ["suffix_not_iyy"], "postprocess": id},
    {"name": "suffix_not_iyy$macrocall$5$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "suffix_not_iyy$macrocall$5", "symbols": ["suffix_not_iyy$macrocall$6", "suffix_not_iyy$macrocall$5$ebnf$1"], "postprocess": 
        ([suffixChain, nesteds]) => {
          // XXX: the suffixChain.length stuff is bad hardcoding
          // (basically works bc the only options are C%, CG, =%, =G, and % or G on its own, so do the math)
          // will bite me later if i wanna use this for a recursable suffix that isn't % or G and doesn't have their stress behavior
          // or maybe if i wanna use this for a chain of more than 2 initial suffixes
          return nesteds
            ? [...processSuffixes(nesteds.some(o => o.meta.stressed) ? -1 : suffixChain.length - 1)(suffixChain), ...nesteds]
            : processSuffixes(suffixChain.length - 2)(suffixChain);
        }
          },
    {"name": "suffix_not_iyy", "symbols": ["suffix_not_iyy$macrocall$5"], "postprocess": id},
    {"name": "suffix_not_iyy$macrocall$8", "symbols": ["DUAL", "JIYY"]},
    {"name": "suffix_not_iyy$macrocall$7$ebnf$1", "symbols": ["suffix_not_iyy"], "postprocess": id},
    {"name": "suffix_not_iyy$macrocall$7$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "suffix_not_iyy$macrocall$7", "symbols": ["suffix_not_iyy$macrocall$8", "suffix_not_iyy$macrocall$7$ebnf$1"], "postprocess": 
        ([suffixChain, nesteds]) => {
          // XXX: the suffixChain.length stuff is bad hardcoding
          // (basically works bc the only options are C%, CG, =%, =G, and % or G on its own, so do the math)
          // will bite me later if i wanna use this for a recursable suffix that isn't % or G and doesn't have their stress behavior
          // or maybe if i wanna use this for a chain of more than 2 initial suffixes
          return nesteds
            ? [...processSuffixes(nesteds.some(o => o.meta.stressed) ? -1 : suffixChain.length - 1)(suffixChain), ...nesteds]
            : processSuffixes(suffixChain.length - 2)(suffixChain);
        }
          },
    {"name": "suffix_not_iyy", "symbols": ["suffix_not_iyy$macrocall$7"], "postprocess": id},
    {"name": "stem", "symbols": ["consonant"], "postprocess": value => _.obj(type.stem, { stressedOn: null }, [_.obj(type.syllable, { stressed: null, weight: 0 }, value)])},
    {"name": "stem", "symbols": ["monosyllable"], "postprocess": ([{ stressedOn, value }]) => _.obj(type.stem, { stressedOn }, value)},
    {"name": "stem", "symbols": ["disyllable"], "postprocess": ([{ stressedOn, value }]) => _.obj(type.stem, { stressedOn }, value)},
    {"name": "stem", "symbols": ["trisyllable"], "postprocess": ([{ stressedOn, value }]) => _.obj(type.stem, { stressedOn }, value)},
    {"name": "stem$ebnf$1", "symbols": []},
    {"name": "stem$ebnf$1", "symbols": ["stem$ebnf$1", "medial_syllable"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "stem", "symbols": ["initial_syllable", "stem$ebnf$1", "final_three_syllables"], "postprocess": ([a, b, { stressedOn, value: c }]) => _.obj(type.stem, { stressedOn }, [a, ...b, ...c])},
    {"name": "monosyllable$macrocall$2", "symbols": ["final_syllable"], "postprocess": id},
    {"name": "monosyllable$macrocall$1", "symbols": ["ST", "monosyllable$macrocall$2"], "postprocess": ([st, value]) => _.obj(type.syllable, value.meta, [...st, ...value.value])},
    {"name": "monosyllable$macrocall$1", "symbols": ["consonant", "monosyllable$macrocall$2"], "postprocess": ([c, value]) => _.obj(type.syllable, value.meta, [c, ...value.value])},
    {"name": "monosyllable$macrocall$1", "symbols": ["monosyllable$macrocall$2"], "postprocess": ([value]) => value},
    {"name": "monosyllable", "symbols": ["monosyllable$macrocall$1"], "postprocess":  ([syllable]) => ({
          stressedOn: -1,
          value: [_.edit(syllable, { meta: { stressed: true }})]
        }) },
    {"name": "disyllable", "symbols": ["trochee"], "postprocess": ([value]) => ({ stressedOn: -2, value })},
    {"name": "disyllable", "symbols": ["iamb"], "postprocess": ([value]) => ({ stressedOn: -1, value })},
    {"name": "trochee", "symbols": ["initial_syllable", "final_lighter_syllable"], "postprocess": ([b, c]) => [_.edit(b, { meta: { stressed: true }}), c]},
    {"name": "trochee", "symbols": ["initial_syllable", "STRESSED", "final_syllable"], "postprocess": ([b ,, c]) => [_.edit(b, { meta: { stressed: true }}), c]},
    {"name": "iamb", "symbols": ["initial_syllable", "final_superheavy_syllable"], "postprocess": ([b, c]) => [b, _.edit(c, { meta: { stressed: true }})]},
    {"name": "iamb", "symbols": ["initial_syllable", "final_stressed_syllable"]},
    {"name": "trisyllable", "symbols": ["dactyl"], "postprocess": ([value]) => ({ stressedOn: -3, value })},
    {"name": "trisyllable", "symbols": ["initial_syllable", "final_trochee"], "postprocess": ([a, b]) => ({ stressedOn: -2, value: [a, ...b] })},
    {"name": "trisyllable", "symbols": ["initial_syllable", "final_iamb"], "postprocess": ([a, b]) => ({ stressedOn: -1, value: [a, ...b] })},
    {"name": "dactyl", "symbols": ["initial_syllable", "final_dibrach"], "postprocess": ([a, b]) => [_.edit(a, { meta: { stressed: true }}), ...b]},
    {"name": "dactyl", "symbols": ["initial_syllable", "STRESSED", "medial_syllable", "final_unstressed_syllable"], "postprocess": ([a, _, b, c]) => [_.edit(a, { meta: { stressed: true }}), b, c]},
    {"name": "final_three_syllables", "symbols": ["final_dactyl"], "postprocess": ([value]) => ({ stressedOn: -3, value })},
    {"name": "final_three_syllables", "symbols": ["medial_syllable", "final_trochee"], "postprocess": ([a, b]) => ({ stressedOn: -2, value: [a, ...b] })},
    {"name": "final_three_syllables", "symbols": ["medial_syllable", "final_iamb"], "postprocess": ([a, b]) => ({ stressedOn: -1, value: [a, ...b] })},
    {"name": "final_dactyl", "symbols": ["medial_syllable", "final_dibrach"], "postprocess": ([a, b]) => [_.edit(a, { meta: { stressed: true }}), ...b]},
    {"name": "final_dactyl", "symbols": ["medial_syllable", "STRESSED", "medial_syllable", "final_unstressed_syllable"], "postprocess": ([a ,, b, c]) => [_.edit(a, { meta: { stressed: true }}), b, c]},
    {"name": "final_dibrach", "symbols": ["light_syllable", "final_lighter_syllable"]},
    {"name": "final_trochee", "symbols": ["heavier_syllable", "final_lighter_syllable"], "postprocess": ([b, c]) => [_.edit(b, { meta: { stressed: true }}), c]},
    {"name": "final_trochee", "symbols": ["medial_syllable", "STRESSED", "final_syllable"], "postprocess": ([b ,, c]) => [_.edit(b, { meta: { stressed: true }}), c]},
    {"name": "final_iamb", "symbols": ["medial_syllable", "final_superheavy_syllable"], "postprocess": ([b, c]) => [b, _.edit(c, { meta: { stressed: true }})]},
    {"name": "final_iamb", "symbols": ["medial_syllable", "final_stressed_syllable"]},
    {"name": "heavier_syllable", "symbols": ["heavy_syllable"], "postprocess": id},
    {"name": "heavier_syllable", "symbols": ["superheavy_syllable"], "postprocess": id},
    {"name": "final_lighter_syllable", "symbols": ["final_heavy_syllable"], "postprocess": id},
    {"name": "initial_syllable", "symbols": ["initial_light_syllable"], "postprocess": id},
    {"name": "initial_syllable", "symbols": ["initial_heavy_syllable"], "postprocess": id},
    {"name": "initial_syllable", "symbols": ["initial_superheavy_syllable"], "postprocess": id},
    {"name": "final_syllable", "symbols": ["final_unstressed_syllable"], "postprocess": id},
    {"name": "final_syllable", "symbols": ["final_stressed_syllable"], "postprocess": id},
    {"name": "final_unstressed_syllable", "symbols": ["final_heavy_syllable"], "postprocess": id},
    {"name": "final_unstressed_syllable", "symbols": ["final_superheavy_syllable"], "postprocess": id},
    {"name": "medial_syllable", "symbols": ["light_syllable"], "postprocess": id},
    {"name": "medial_syllable", "symbols": ["heavy_syllable"], "postprocess": id},
    {"name": "medial_syllable", "symbols": ["superheavy_syllable"], "postprocess": id},
    {"name": "initial_light_syllable$macrocall$2", "symbols": ["light_syllable"], "postprocess": id},
    {"name": "initial_light_syllable$macrocall$1", "symbols": ["ST", "initial_light_syllable$macrocall$2"], "postprocess": ([st, value]) => _.obj(type.syllable, value.meta, [...st, ...value.value])},
    {"name": "initial_light_syllable$macrocall$1", "symbols": ["consonant", "initial_light_syllable$macrocall$2"], "postprocess": ([c, value]) => _.obj(type.syllable, value.meta, [c, ...value.value])},
    {"name": "initial_light_syllable$macrocall$1", "symbols": ["initial_light_syllable$macrocall$2"], "postprocess": ([value]) => value},
    {"name": "initial_light_syllable", "symbols": ["initial_light_syllable$macrocall$1"], "postprocess": id},
    {"name": "initial_heavy_syllable$macrocall$2", "symbols": ["heavy_syllable"], "postprocess": id},
    {"name": "initial_heavy_syllable$macrocall$1", "symbols": ["ST", "initial_heavy_syllable$macrocall$2"], "postprocess": ([st, value]) => _.obj(type.syllable, value.meta, [...st, ...value.value])},
    {"name": "initial_heavy_syllable$macrocall$1", "symbols": ["consonant", "initial_heavy_syllable$macrocall$2"], "postprocess": ([c, value]) => _.obj(type.syllable, value.meta, [c, ...value.value])},
    {"name": "initial_heavy_syllable$macrocall$1", "symbols": ["initial_heavy_syllable$macrocall$2"], "postprocess": ([value]) => value},
    {"name": "initial_heavy_syllable", "symbols": ["initial_heavy_syllable$macrocall$1"], "postprocess": id},
    {"name": "initial_superheavy_syllable$macrocall$2", "symbols": ["superheavy_syllable"], "postprocess": id},
    {"name": "initial_superheavy_syllable$macrocall$1", "symbols": ["ST", "initial_superheavy_syllable$macrocall$2"], "postprocess": ([st, value]) => _.obj(type.syllable, value.meta, [...st, ...value.value])},
    {"name": "initial_superheavy_syllable$macrocall$1", "symbols": ["consonant", "initial_superheavy_syllable$macrocall$2"], "postprocess": ([c, value]) => _.obj(type.syllable, value.meta, [c, ...value.value])},
    {"name": "initial_superheavy_syllable$macrocall$1", "symbols": ["initial_superheavy_syllable$macrocall$2"], "postprocess": ([value]) => value},
    {"name": "initial_superheavy_syllable", "symbols": ["initial_superheavy_syllable$macrocall$1"], "postprocess": id},
    {"name": "final_heavy_syllable", "symbols": ["consonant", "final_heavy_rime"], "postprocess": ([a, b]) => _.obj(type.syllable, { weight: 2, stressed: false }, [a, ...b])},
    {"name": "final_heavy_syllable", "symbols": ["FEM", "AN"], "postprocess": 
        ([a, b]) => _.obj(
          type.syllable,
          { weight: 2, stressed: false },
          [
            a, /* _.edit(a, { meta: { t: true }}), */
            b
          ]
        )
          },
    {"name": "final_stressed_syllable", "symbols": ["consonant", "final_stressed_rime"], "postprocess": ([a, b]) => _.obj(type.syllable, { weight: null, stressed: true }, [a, ...b])},
    {"name": "final_superheavy_syllable", "symbols": ["consonant", "final_superheavy_rime"], "postprocess": ([a, b]) => _.obj(type.syllable, { weight: 3, stressed: null }, [a, ...b])},
    {"name": "final_superheavy_syllable", "symbols": ["FEM", "DUAL"], "postprocess": 
        ([a, b]) => _.obj(
          type.syllable,
          { weight: 3, stressed: null },
          [
            a, /* _.edit(a, { meta: { t: true }}), */
            b
          ]
        )
          },
    {"name": "final_heavy_rime", "symbols": ["short_vowel", "consonant"]},
    {"name": "final_heavy_rime", "symbols": ["long_vowel"]},
    {"name": "final_heavy_rime", "symbols": ["AN"]},
    {"name": "final_stressed_rime$subexpression$1", "symbols": ["long_vowel"], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$1", "symbols": [({type: "a"})], "postprocess": processToken},
    {"name": "final_stressed_rime$subexpression$1", "symbols": [({type: "e"})], "postprocess": processToken},
    {"name": "final_stressed_rime$subexpression$1", "symbols": [({type: "o"})], "postprocess": processToken},
    {"name": "final_stressed_rime", "symbols": ["final_stressed_rime$subexpression$1", "STRESSED"]},
    {"name": "final_superheavy_rime", "symbols": ["superheavy_rime"], "postprocess": id},
    {"name": "light_syllable", "symbols": ["consonant", "light_rime"], "postprocess": ([a, b]) => _.obj(type.syllable, { weight: 1, stressed: false }, [a, ...b])},
    {"name": "heavy_syllable", "symbols": ["consonant", "heavy_rime"], "postprocess": ([a, b]) => _.obj(type.syllable, { weight: 2, stressed: false }, [a, ...b])},
    {"name": "superheavy_syllable", "symbols": ["consonant", "superheavy_rime"], "postprocess": ([a, b]) => _.obj(type.syllable, { weight: 3, stressed: false }, [a, ...b])},
    {"name": "light_rime", "symbols": ["short_vowel"]},
    {"name": "heavy_rime", "symbols": ["long_vowel"]},
    {"name": "heavy_rime", "symbols": ["short_vowel", "consonant"]},
    {"name": "superheavy_rime", "symbols": ["long_vowel", "consonant"]},
    {"name": "superheavy_rime", "symbols": ["short_vowel", "consonant", "NO_SCHWA", "consonant"]},
    {"name": "superheavy_rime", "symbols": ["short_vowel", "consonant", "consonant"]},
    {"name": "superheavy_rime", "symbols": ["long_vowel", "consonant", "consonant"]},
    {"name": "superheavy_rime", "symbols": ["long_vowel", "consonant", "NO_SCHWA", "consonant"]},
    {"name": "vowel$subexpression$1", "symbols": ["long_vowel"]},
    {"name": "vowel$subexpression$1", "symbols": ["short_vowel"]},
    {"name": "vowel$ebnf$1", "symbols": ["NASAL"], "postprocess": id},
    {"name": "vowel$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "vowel", "symbols": ["vowel$subexpression$1", "vowel$ebnf$1"], "postprocess": ([[value], nasal]) => (nasal ? _.edit(value, {meta: {features: {nasalized: true}}}) : value)},
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
    {"name": "root$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
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
    {"name": "pronoun", "symbols": [({type: "openTag"}), ({type: "pronoun"}), ({type: "closeTag"})], "postprocess": ([ , { value }]) => init(type.pronoun, {}, value)},
    {"name": "tam", "symbols": [({type: "openTag"}), ({type: "tam"}), ({type: "closeTag"})], "postprocess": ([ , { value }]) => value},
    {"name": "voice", "symbols": [({type: "openTag"}), ({type: "voice"}), ({type: "closeTag"})], "postprocess": ([ , { value }]) => value},
    {"name": "wazn", "symbols": [({type: "openTag"}), ({type: "wazn"}), ({type: "closeTag"})], "postprocess": ([ , { value }]) => value},
    {"name": "augmentation", "symbols": ["delimiter", ({type: "pronoun"})], "postprocess": ([delimiter, { value }]) => init(type.augmentation, { delimiter }, init(type.pronoun, {}, value))},
    {"name": "delimiter", "symbols": [({type: "objectDelimiter"})], "postprocess": processToken},
    {"name": "delimiter", "symbols": [({type: "genitiveDelimiter"})], "postprocess": processToken},
    {"name": "delimiter", "symbols": [({type: "pseudoSubjectDelimiter"})], "postprocess": processToken},
    {"name": "delimiter", "symbols": [({type: "dativeDelimiter"})], "postprocess": processToken},
    {"name": "ST", "symbols": [({type: "s"}), ({type: "t"})], "postprocess": ([{ value: a }, { value: b }]) => [_.process(a), _.process(b)]},
    {"name": "NO_SCHWA", "symbols": [({type: "noSchwa"})], "postprocess": processToken},
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
    {"name": "__", "symbols": [({type: "ws"})], "postprocess": () => null}
];
export const ParserStart = "passage";
