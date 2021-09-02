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
    // since i'm currently including emphatics as their own k-v entries
    // in symbols.alphabet, this will work fine
    // if i ever change that decision, then will switch to the commented
    // version of this function below
    value: () => abc[s]
    // value: match => (match.endsWith(abc.emphatic)
    //   ? { ...abc[s], meta: { ...abc[s].meta, emphatic: true }}
    //   : abc[s]
    // )
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
      th: c`th`,
      dh: c`dh`,
      nullConsonant: c`null`,

      a: $`a`,
      aa: $`aa`,
      aaLowered: $`AA`,
      ae: $`ae`,
      iTense: $`I`,
      i: $`i`,
      ii: $`ii`,
      uTense: $`U`,
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
      an: $`An`,

      stressed: $`Stressed`,
      french: $`French`,

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
      verbForm: fromEnum(sym.verbForm),
      ppForm: fromEnum(sym.ppForm),
      closeTag: { match: /]/, pop: 1 }
    },
    ctxTag: {
      ctxItem: /[a-zA-Z0-9 ]+/,
      closeCtx: { match: />/, pop: 1 }
    }
  });

  const processToken = ([{ value }]) => _.process(value);

  const init = (...args) => _.obj(...args).init(inits);
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
    {"name": "af3al$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "af3al$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "af3al$ebnf$2", "symbols": ["augmentation"], "postprocess": id},
    {"name": "af3al$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "af3al", "symbols": [{"literal":"(af3al"}, "af3al$ebnf$1", "__", "root", "af3al$ebnf$2", {"literal":")"}], "postprocess": ([ , ctx ,, root, augmentation]) => init(type.af3al, {}, { root, augmentation }, ctx)},
    {"name": "tif3il$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "tif3il$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tif3il$ebnf$2$subexpression$1", "symbols": ["FEM"]},
    {"name": "tif3il$ebnf$2$subexpression$1", "symbols": ["DUAL"]},
    {"name": "tif3il$ebnf$2$subexpression$1", "symbols": ["AN"]},
    {"name": "tif3il$ebnf$2$subexpression$1", "symbols": ["FEM", "DUAL"]},
    {"name": "tif3il$ebnf$2$subexpression$1", "symbols": ["FEM", "AN"]},
    {"name": "tif3il$ebnf$2$subexpression$1", "symbols": ["FEM_PLURAL"]},
    {"name": "tif3il$ebnf$2$subexpression$1", "symbols": ["FEM_PLURAL", "AN"]},
    {"name": "tif3il$ebnf$2", "symbols": ["tif3il$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "tif3il$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tif3il$ebnf$3", "symbols": ["augmentation"], "postprocess": id},
    {"name": "tif3il$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tif3il", "symbols": [{"literal":"(tif3il"}, "tif3il$ebnf$1", "__", "root", "tif3il$ebnf$2", "tif3il$ebnf$3", {"literal":")"}], "postprocess": 
        ([ , ctx ,, root, suffix, augmentation]) => init(
          type.tif3il,
          {},
          {
            root,
            suffix: suffix || [],
            augmentation
          },
          ctx
        )
        },
    {"name": "pp$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "pp$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pp$ebnf$2", "symbols": ["augmentation"], "postprocess": id},
    {"name": "pp$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pp", "symbols": [{"literal":"(pp"}, "pp$ebnf$1", "__", "pronoun", "__", "pp_form", "__", "voice", "__", "root", "pp$ebnf$2", {"literal":")"}], "postprocess": 
        ([ , ctx ,, conjugation ,, form ,, voice ,, root, augmentation]) => init(
          type.pp,
          { conjugation, form, voice },
          { root, augmentation },
          ctx
        )
          },
    {"name": "verb$ebnf$1", "symbols": ["ctx_tags"], "postprocess": id},
    {"name": "verb$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "verb$ebnf$2", "symbols": ["augmentation"], "postprocess": id},
    {"name": "verb$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "verb", "symbols": [{"literal":"(verb"}, "verb$ebnf$1", "__", "pronoun", "__", "verb_form", "__", "tam", "__", "root", "verb$ebnf$2", {"literal":")"}], "postprocess": 
        ([ , ctx ,, conjugation ,, form ,, tam ,, root, augmentation]) => init(
          type.verb,
          { form, tam, conjugation },
          { root, augmentation },
          ctx
        )
          },
    {"name": "word", "symbols": ["stem"], "postprocess": ([{ value }]) => init(type.word, { was: null, augmentation: null }, value)},
    {"name": "word", "symbols": ["stem", "augmentation"], "postprocess": ([{ value }, augmentation]) => init(type.word, { augmentation: augmentation(value) }, value)},
    {"name": "word", "symbols": [{"literal":"(ctx"}, "ctx_tags", "__", "word", {"literal":")"}], "postprocess": ([ , ctx ,, word]) => ctx.map(word.ctx)},
    {"name": "ctx_tags$ebnf$1$subexpression$1", "symbols": ["__", ({type: "openCtx"}), ({type: "ctxItem"}), ({type: "closeCtx"})], "postprocess": ([ ,, value]) => value},
    {"name": "ctx_tags$ebnf$1", "symbols": ["ctx_tags$ebnf$1$subexpression$1"]},
    {"name": "ctx_tags$ebnf$1$subexpression$2", "symbols": ["__", ({type: "openCtx"}), ({type: "ctxItem"}), ({type: "closeCtx"})], "postprocess": ([ ,, value]) => value},
    {"name": "ctx_tags$ebnf$1", "symbols": ["ctx_tags$ebnf$1", "ctx_tags$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ctx_tags", "symbols": ["ctx_tags$ebnf$1"], "postprocess": 
        ([ , values]) => values
        },
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
    {"name": "final_lighter_syllable", "symbols": ["final_light_syllable"], "postprocess": id},
    {"name": "final_lighter_syllable", "symbols": ["final_heavy_syllable"], "postprocess": id},
    {"name": "initial_syllable", "symbols": ["initial_light_syllable"], "postprocess": id},
    {"name": "initial_syllable", "symbols": ["initial_heavy_syllable"], "postprocess": id},
    {"name": "initial_syllable", "symbols": ["initial_superheavy_syllable"], "postprocess": id},
    {"name": "final_syllable", "symbols": ["final_unstressed_syllable"], "postprocess": id},
    {"name": "final_syllable", "symbols": ["final_stressed_syllable"], "postprocess": id},
    {"name": "final_unstressed_syllable", "symbols": ["final_light_syllable"], "postprocess": id},
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
    {"name": "final_light_syllable", "symbols": ["consonant", "final_light_rime"], "postprocess": ([a, b]) => _.obj(type.syllable, { weight: 1, stressed: false }, [a, ...b])},
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
    {"name": "final_light_rime", "symbols": ["final_short_vowel"]},
    {"name": "final_heavy_rime", "symbols": ["short_vowel", "consonant"]},
    {"name": "final_heavy_rime", "symbols": ["long_vowel"]},
    {"name": "final_heavy_rime", "symbols": ["AN"], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$1", "symbols": ["long_vowel"], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$1", "symbols": [({type: "a"})], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$1", "symbols": [({type: "e"})], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$1", "symbols": [({type: "o"})], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$2", "symbols": ["STRESSED"], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$2", "symbols": ["FRENCH"], "postprocess": id},
    {"name": "final_stressed_rime", "symbols": ["final_stressed_rime$subexpression$1", "final_stressed_rime$subexpression$2"]},
    {"name": "final_superheavy_rime", "symbols": ["superheavy_rime"], "postprocess": id},
    {"name": "final_superheavy_rime", "symbols": ["PLURAL"]},
    {"name": "final_superheavy_rime", "symbols": ["FEM_PLURAL"]},
    {"name": "final_superheavy_rime", "symbols": ["DUAL"]},
    {"name": "light_syllable", "symbols": ["consonant", "light_rime"], "postprocess": ([a, b]) => _.obj(type.syllable, { weight: 1, stressed: false }, [a, ...b])},
    {"name": "heavy_syllable", "symbols": ["consonant", "heavy_rime"], "postprocess": ([a, b]) => _.obj(type.syllable, { weight: 2, stressed: false }, [a, ...b])},
    {"name": "superheavy_syllable", "symbols": ["consonant", "superheavy_rime"], "postprocess": ([a, b]) => _.obj(type.syllable, { weight: 3, stressed: false }, [a, ...b])},
    {"name": "light_rime", "symbols": ["short_vowel"]},
    {"name": "heavy_rime$subexpression$1", "symbols": ["long_vowel"]},
    {"name": "heavy_rime$subexpression$1", "symbols": ["short_vowel", "consonant"]},
    {"name": "heavy_rime", "symbols": ["heavy_rime$subexpression$1"], "postprocess": id},
    {"name": "superheavy_rime", "symbols": ["long_vowel", "consonant"]},
    {"name": "superheavy_rime", "symbols": ["short_vowel", "consonant", "NO_SCHWA", "consonant"]},
    {"name": "superheavy_rime", "symbols": ["short_vowel", "consonant", "consonant"], "postprocess":  ([a, b, c]) => (
          b === c ? [a, b, c] : [a, b, _.process(abc.Schwa), c]
        ) },
    {"name": "superheavy_rime", "symbols": ["long_vowel", "consonant", "consonant"], "postprocess":  ([a, b, c]) => (
          b === c ? [a, b, c] : [a, b, _.process(abc.Schwa), c]
        ) },
    {"name": "superheavy_rime", "symbols": ["long_vowel", "consonant", "NO_SCHWA", "consonant"]},
    {"name": "vowel$subexpression$1", "symbols": ["long_vowel"]},
    {"name": "vowel$subexpression$1", "symbols": ["short_vowel"]},
    {"name": "vowel", "symbols": ["vowel$subexpression$1"], "postprocess": ([[value]]) => value},
    {"name": "final_short_vowel$subexpression$1", "symbols": [({type: "a"})]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [({type: "iTense"})]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [({type: "uTense"})]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [({type: "e"})]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [({type: "o"})]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [({type: "fem"})]},
    {"name": "final_short_vowel", "symbols": ["final_short_vowel$subexpression$1"], "postprocess": ([[{ value }]]) => _.process(value)},
    {"name": "short_vowel$subexpression$1", "symbols": [({type: "a"})]},
    {"name": "short_vowel$subexpression$1", "symbols": [({type: "iTense"})]},
    {"name": "short_vowel$subexpression$1", "symbols": [({type: "i"})]},
    {"name": "short_vowel$subexpression$1", "symbols": [({type: "uTense"})]},
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
    {"name": "pp_form", "symbols": [({type: "openTag"}), ({type: "ppForm"}), ({type: "closeTag"})], "postprocess": ([ , { value }]) => value},
    {"name": "verb_form", "symbols": [({type: "openTag"}), ({type: "verbForm"}), ({type: "closeTag"})], "postprocess": ([ , { value }]) => value},
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
    {"name": "AN", "symbols": [({type: "an"})], "postprocess": processToken},
    {"name": "STRESSED", "symbols": [({type: "stressed"})], "postprocess": processToken},
    {"name": "FRENCH", "symbols": [({type: "french"})], "postprocess": processToken},
    {"name": "__", "symbols": [({type: "ws"})], "postprocess": () => null}
];
export const ParserStart = "passage";
