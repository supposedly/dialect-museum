// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const { obj: _ } = require(`./objects`);
  const inits = require(`./initializers`);

  const moo = require(`moo`);
  const sym = require(`./symbols`);
  const abc = sym.alphabet;

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

  const lexer = moo.states({
    main: {
      openFilter: /\((?:\w+|\\\)?)/,
      closeFilter: /\)/,

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

      fem: $`Fem`,
      dual: $`Dual`,
      plural: $`Plural`,
      // femDual: $`FemDual`,  # not sure if good idea?
      femPlural: $`FemPlural`,

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

      ws: / +/
    },
    augmentation: {
      pronoun: {
        match: new RegExp(sym.pronouns.join(`|`)),
        pop: 1
      }
    },
    tag: {
      higherForm: new RegExp(sym.higherVerbForms.join(`|`)),
      verbForm1: new RegExp(sym.verbForm1.join(`|`)),
      ppForm1: new RegExp(sym.ppForm1.join(`|`)),
      pronoun: new RegExp(sym.pronouns.join(`|`)),
      tam: /\b(?:pst|ind|sbjv|imp)\b/,
      voice: /\bactive\b|\bpassive\b/,
      closeTag: { match: /]/, pop: 1 }
    },
    ctxTag: {
      ctxItem: /[a-zA-Z0-9\s]+/,
      closeCtx: { match: />/, pop: 1 }
    }
  });

  const processToken = ([{ value }]) => _.process(value);

  const init = (...args) => _.obj(...args).init(inits);
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "passage$ebnf$1", "symbols": []},
    {"name": "passage$ebnf$1$subexpression$1", "symbols": ["__", "term"], "postprocess": ([ , term]) => term},
    {"name": "passage$ebnf$1", "symbols": ["passage$ebnf$1", "passage$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "passage", "symbols": ["term", "passage$ebnf$1"], "postprocess": ([a, b]) => [a, ...b]},
    {"name": "term", "symbols": ["raw_term"], "postprocess": id},
    {"name": "term", "symbols": ["ctx"], "postprocess": id},
    {"name": "ctx$ebnf$1$subexpression$1", "symbols": ["__", "ctx_tag"], "postprocess": ([ , value]) => value.replace(/\s+(\w)/g, (_, c) => `-${c.toUpperCase()}`)},
    {"name": "ctx$ebnf$1", "symbols": ["ctx$ebnf$1$subexpression$1"]},
    {"name": "ctx$ebnf$1$subexpression$2", "symbols": ["__", "ctx_tag"], "postprocess": ([ , value]) => value.replace(/\s+(\w)/g, (_, c) => `-${c.toUpperCase()}`)},
    {"name": "ctx$ebnf$1", "symbols": ["ctx$ebnf$1", "ctx$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ctx", "symbols": [{"literal":"(ctx"}, "ctx$ebnf$1", "__", "raw_term", {"literal":")"}], "postprocess": 
        ([ , contextItems ,, term ]) => {
          contextItems.forEach(term.ctx);
          return term;
        }
        },
    {"name": "ctx_tag", "symbols": [(lexer.has("openCtx") ? {type: "openCtx"} : openCtx), (lexer.has("ctxItem") ? {type: "ctxItem"} : ctxItem), (lexer.has("closeCtx") ? {type: "closeCtx"} : closeCtx)], "postprocess": ([ , value]) => value},
    {"name": "raw_term", "symbols": ["expr"], "postprocess": id},
    {"name": "raw_term", "symbols": ["literal"], "postprocess": id},
    {"name": "raw_term", "symbols": ["idafe"], "postprocess": id},
    {"name": "raw_term", "symbols": ["l"], "postprocess": id},
    {"name": "literal$ebnf$1", "symbols": [/[^)]/]},
    {"name": "literal$ebnf$1", "symbols": ["literal$ebnf$1", /[^)]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "literal", "symbols": [{"literal":"(\\"}, "literal$ebnf$1", {"literal":")"}], "postprocess": ([ , value]) => _.obj(`literal`, {}, value.join(''))},
    {"name": "literal", "symbols": [{"literal":"(\\)"}, {"literal":")"}], "postprocess": () => _.obj(`literal`, {}, `)`)},
    {"name": "idafe$subexpression$1", "symbols": ["expr"]},
    {"name": "idafe$subexpression$1", "symbols": ["idafe"]},
    {"name": "idafe$subexpression$2", "symbols": ["expr"]},
    {"name": "idafe$subexpression$2", "symbols": ["l"]},
    {"name": "idafe$subexpression$2", "symbols": ["idafe"]},
    {"name": "idafe", "symbols": [{"literal":"(idafe"}, "__", "idafe$subexpression$1", "__", "idafe$subexpression$2", {"literal":")"}], "postprocess": 
        ([ ,, [possessee] ,, [possessor], d]) => init(
          `idafe`, {}, { possessee, possessor }
        )
          },
    {"name": "l", "symbols": [{"literal":"(l"}, "__", "expr", {"literal":")"}], "postprocess": ([ ,, value]) => init(`l`, {}, value)},
    {"name": "expr", "symbols": ["word"], "postprocess": id},
    {"name": "expr", "symbols": ["pp"], "postprocess": id},
    {"name": "expr", "symbols": ["verb"], "postprocess": id},
    {"name": "expr", "symbols": ["tif3il"], "postprocess": id},
    {"name": "expr", "symbols": ["af3al"], "postprocess": id},
    {"name": "af3al$ebnf$1", "symbols": ["augmentation"], "postprocess": id},
    {"name": "af3al$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "af3al", "symbols": [{"literal":"(af3al"}, "__", "root", "af3al$ebnf$1", {"literal":")"}], "postprocess": ([ ,, root, augmentation]) => init(`af3al`, {}, { root, augmentation })},
    {"name": "tif3il$ebnf$1$subexpression$1", "symbols": ["FEM"], "postprocess": id},
    {"name": "tif3il$ebnf$1$subexpression$1", "symbols": ["FEM_PLURAL"], "postprocess": id},
    {"name": "tif3il$ebnf$1", "symbols": ["tif3il$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "tif3il$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tif3il$ebnf$2", "symbols": ["augmentation"], "postprocess": id},
    {"name": "tif3il$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tif3il", "symbols": [{"literal":"(tif3il"}, "__", "root", "tif3il$ebnf$1", "tif3il$ebnf$2", {"literal":")"}], "postprocess": 
        ([ ,, root, fem, augmentation]) => init(`tif3il`, {}, { root, fem, augmentation })
        },
    {"name": "pp$ebnf$1", "symbols": ["augmentation"], "postprocess": id},
    {"name": "pp$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pp", "symbols": [{"literal":"(pp"}, "__", "pronoun", "__", "pp_form", "__", "voice", "__", "root", "pp$ebnf$1", {"literal":")"}], "postprocess": 
        ([ ,, conjugation ,, form ,, voice ,, root, augmentation]) => init(
          `pp`, { conjugation, form, voice }, { root, augmentation }
        )
          },
    {"name": "verb$ebnf$1", "symbols": ["augmentation"], "postprocess": id},
    {"name": "verb$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "verb", "symbols": [{"literal":"(verb"}, "__", "pronoun", "__", "verb_form", "__", "tam", "__", "root", "verb$ebnf$1", {"literal":")"}], "postprocess": 
        ([ ,, conjugation ,, form ,, tam ,, root, augmentation]) => init(
          `verb`, { form, tam, conjugation }, { root, augmentation }
        )
          },
    {"name": "word", "symbols": ["stem"], "postprocess": ([{ value }]) => init(`word`, { was: null, augmentation: null }, value)},
    {"name": "word", "symbols": ["stem", "augmentation"], "postprocess": ([{ value }, augmentation]) => init(`word`, { augmentation }, value)},
    {"name": "stem", "symbols": ["consonant"], "postprocess": ([value]) => _.obj(`stem`, { stressedOn: null }, [_.obj(`syllable`, { stressed: null, weight: 0 }, value)])},
    {"name": "stem", "symbols": ["monosyllable"], "postprocess": ([{ stressedOn, value }]) => _.obj(`stem`, { stressedOn }, value)},
    {"name": "stem", "symbols": ["disyllable"], "postprocess": ([{ stressedOn, value }]) => _.obj(`stem`, { stressedOn }, value)},
    {"name": "stem", "symbols": ["trisyllable"], "postprocess": ([{ stressedOn, value }]) => _.obj(`stem`, { stressedOn }, value)},
    {"name": "stem$ebnf$1", "symbols": []},
    {"name": "stem$ebnf$1", "symbols": ["stem$ebnf$1", "medial_syllable"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "stem", "symbols": ["initial_syllable", "stem$ebnf$1", "final_three_syllables"], "postprocess": ([a, b, { stressedOn, value: c }]) => _.obj(`stem`, { stressedOn }, [a, ...b, ...c])},
    {"name": "monosyllable$macrocall$2", "symbols": ["final_syllable"], "postprocess": id},
    {"name": "monosyllable$macrocall$1", "symbols": ["ST", "monosyllable$macrocall$2"], "postprocess": ([st, value]) => _.obj(`syllable`, value.meta, [...st, ...value.value])},
    {"name": "monosyllable$macrocall$1", "symbols": ["consonant", "monosyllable$macrocall$2"], "postprocess": ([c, value]) => _.obj(`syllable`, value.meta, [c, ...value.value])},
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
    {"name": "initial_light_syllable$macrocall$1", "symbols": ["ST", "initial_light_syllable$macrocall$2"], "postprocess": ([st, value]) => _.obj(`syllable`, value.meta, [...st, ...value.value])},
    {"name": "initial_light_syllable$macrocall$1", "symbols": ["consonant", "initial_light_syllable$macrocall$2"], "postprocess": ([c, value]) => _.obj(`syllable`, value.meta, [c, ...value.value])},
    {"name": "initial_light_syllable$macrocall$1", "symbols": ["initial_light_syllable$macrocall$2"], "postprocess": ([value]) => value},
    {"name": "initial_light_syllable", "symbols": ["initial_light_syllable$macrocall$1"], "postprocess": id},
    {"name": "initial_heavy_syllable$macrocall$2", "symbols": ["heavy_syllable"], "postprocess": id},
    {"name": "initial_heavy_syllable$macrocall$1", "symbols": ["ST", "initial_heavy_syllable$macrocall$2"], "postprocess": ([st, value]) => _.obj(`syllable`, value.meta, [...st, ...value.value])},
    {"name": "initial_heavy_syllable$macrocall$1", "symbols": ["consonant", "initial_heavy_syllable$macrocall$2"], "postprocess": ([c, value]) => _.obj(`syllable`, value.meta, [c, ...value.value])},
    {"name": "initial_heavy_syllable$macrocall$1", "symbols": ["initial_heavy_syllable$macrocall$2"], "postprocess": ([value]) => value},
    {"name": "initial_heavy_syllable", "symbols": ["initial_heavy_syllable$macrocall$1"], "postprocess": id},
    {"name": "initial_superheavy_syllable$macrocall$2", "symbols": ["superheavy_syllable"], "postprocess": id},
    {"name": "initial_superheavy_syllable$macrocall$1", "symbols": ["ST", "initial_superheavy_syllable$macrocall$2"], "postprocess": ([st, value]) => _.obj(`syllable`, value.meta, [...st, ...value.value])},
    {"name": "initial_superheavy_syllable$macrocall$1", "symbols": ["consonant", "initial_superheavy_syllable$macrocall$2"], "postprocess": ([c, value]) => _.obj(`syllable`, value.meta, [c, ...value.value])},
    {"name": "initial_superheavy_syllable$macrocall$1", "symbols": ["initial_superheavy_syllable$macrocall$2"], "postprocess": ([value]) => value},
    {"name": "initial_superheavy_syllable", "symbols": ["initial_superheavy_syllable$macrocall$1"], "postprocess": id},
    {"name": "final_light_syllable", "symbols": ["consonant", "final_light_rime"], "postprocess": ([a, b]) => _.obj(`syllable`, { weight: 1, stressed: false }, [a, ...b])},
    {"name": "final_heavy_syllable", "symbols": ["consonant", "final_heavy_rime"], "postprocess": ([a, b]) => _.obj(`syllable`, { weight: 2, stressed: false }, [a, ...b])},
    {"name": "final_stressed_syllable", "symbols": ["consonant", "final_stressed_rime"], "postprocess": ([a, b]) => _.obj(`syllable`, { weight: null, stressed: true }, [a, ...b])},
    {"name": "final_superheavy_syllable", "symbols": ["consonant", "final_superheavy_rime"], "postprocess": ([a, b]) => _.obj(`syllable`, { weight: 3, stressed: false }, [a, ...b])},
    {"name": "final_superheavy_syllable", "symbols": ["FEM", "DUAL"], "postprocess": 
        ([a, b]) => _.obj(`syllable`, { weight: 3, stressed: false }, [a, b])
          },
    {"name": "final_light_rime", "symbols": ["final_short_vowel"]},
    {"name": "final_heavy_rime", "symbols": ["short_vowel", "consonant"]},
    {"name": "final_stressed_rime$subexpression$1", "symbols": ["long_vowel"], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$1", "symbols": [(lexer.has("a") ? {type: "a"} : a)], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$1", "symbols": [(lexer.has("e") ? {type: "e"} : e)], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$1", "symbols": [(lexer.has("o") ? {type: "o"} : o)], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$2", "symbols": ["STRESSED"], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$2", "symbols": ["FRENCH"], "postprocess": id},
    {"name": "final_stressed_rime", "symbols": ["final_stressed_rime$subexpression$1", "final_stressed_rime$subexpression$2"]},
    {"name": "final_superheavy_rime", "symbols": ["superheavy_rime"], "postprocess": id},
    {"name": "final_superheavy_rime", "symbols": ["PLURAL"]},
    {"name": "final_superheavy_rime", "symbols": ["FEM_PLURAL"]},
    {"name": "final_superheavy_rime", "symbols": ["DUAL"]},
    {"name": "light_syllable", "symbols": ["consonant", "light_rime"], "postprocess": ([a, b]) => _.obj(`syllable`, { weight: 1, stressed: false }, [a, ...b])},
    {"name": "heavy_syllable", "symbols": ["consonant", "heavy_rime"], "postprocess": ([a, b]) => _.obj(`syllable`, { weight: 2, stressed: false }, [a, ...b])},
    {"name": "superheavy_syllable", "symbols": ["consonant", "superheavy_rime"], "postprocess": ([a, b]) => _.obj(`syllable`, { weight: 3, stressed: false }, [a, ...b])},
    {"name": "light_rime", "symbols": ["short_vowel"]},
    {"name": "heavy_rime$subexpression$1", "symbols": ["long_vowel"]},
    {"name": "heavy_rime$subexpression$1", "symbols": ["short_vowel", "consonant"]},
    {"name": "heavy_rime", "symbols": ["heavy_rime$subexpression$1"], "postprocess": id},
    {"name": "superheavy_rime", "symbols": ["long_vowel", "consonant"]},
    {"name": "superheavy_rime", "symbols": ["short_vowel", "consonant", "NO_SCHWA", "consonant"]},
    {"name": "superheavy_rime", "symbols": ["short_vowel", "consonant", "consonant"], "postprocess":  ([a, b, c]) => (
          b === c ? [a, b, c] : [a, b, _.process(abc.Schwa), c]
        ) },
    {"name": "superheavy_rime", "symbols": ["long_vowel", "consonant", "consonant"]},
    {"name": "superheavy_rime", "symbols": ["long_vowel", "consonant", "NO_SCHWA", "consonant"]},
    {"name": "vowel$subexpression$1", "symbols": ["long_vowel"]},
    {"name": "vowel$subexpression$1", "symbols": ["short_vowel"]},
    {"name": "vowel", "symbols": ["vowel$subexpression$1"], "postprocess": ([[value]]) => value},
    {"name": "final_short_vowel$subexpression$1", "symbols": [(lexer.has("a") ? {type: "a"} : a)]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [(lexer.has("iTense") ? {type: "iTense"} : iTense)]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [(lexer.has("uTense") ? {type: "uTense"} : uTense)]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [(lexer.has("e") ? {type: "e"} : e)]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [(lexer.has("o") ? {type: "o"} : o)]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [(lexer.has("fem") ? {type: "fem"} : fem)]},
    {"name": "final_short_vowel", "symbols": ["final_short_vowel$subexpression$1"], "postprocess": ([[{ value }]]) => _.process(value)},
    {"name": "short_vowel$subexpression$1", "symbols": [(lexer.has("a") ? {type: "a"} : a)]},
    {"name": "short_vowel$subexpression$1", "symbols": [(lexer.has("iTense") ? {type: "iTense"} : iTense)]},
    {"name": "short_vowel$subexpression$1", "symbols": [(lexer.has("i") ? {type: "i"} : i)]},
    {"name": "short_vowel$subexpression$1", "symbols": [(lexer.has("uTense") ? {type: "uTense"} : uTense)]},
    {"name": "short_vowel$subexpression$1", "symbols": [(lexer.has("u") ? {type: "u"} : u)]},
    {"name": "short_vowel$subexpression$1", "symbols": [(lexer.has("e") ? {type: "e"} : e)]},
    {"name": "short_vowel$subexpression$1", "symbols": [(lexer.has("o") ? {type: "o"} : o)]},
    {"name": "short_vowel", "symbols": ["short_vowel$subexpression$1"], "postprocess": ([[{ value }]]) => _.process(value)},
    {"name": "long_vowel$subexpression$1", "symbols": [(lexer.has("aa") ? {type: "aa"} : aa)]},
    {"name": "long_vowel$subexpression$1", "symbols": [(lexer.has("aaLowered") ? {type: "aaLowered"} : aaLowered)]},
    {"name": "long_vowel$subexpression$1", "symbols": [(lexer.has("ae") ? {type: "ae"} : ae)]},
    {"name": "long_vowel$subexpression$1", "symbols": [(lexer.has("ii") ? {type: "ii"} : ii)]},
    {"name": "long_vowel$subexpression$1", "symbols": [(lexer.has("uu") ? {type: "uu"} : uu)]},
    {"name": "long_vowel$subexpression$1", "symbols": [(lexer.has("ee") ? {type: "ee"} : ee)]},
    {"name": "long_vowel$subexpression$1", "symbols": [(lexer.has("oo") ? {type: "oo"} : oo)]},
    {"name": "long_vowel$subexpression$1", "symbols": [(lexer.has("ay") ? {type: "ay"} : ay)]},
    {"name": "long_vowel$subexpression$1", "symbols": [(lexer.has("aw") ? {type: "aw"} : aw)]},
    {"name": "long_vowel", "symbols": ["long_vowel$subexpression$1"], "postprocess": ([[{ value }]]) => _.process(value)},
    {"name": "root$ebnf$1", "symbols": ["consonant"], "postprocess": id},
    {"name": "root$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "root", "symbols": ["consonant", "consonant", "consonant", "root$ebnf$1"]},
    {"name": "consonant", "symbols": ["strong_consonant"], "postprocess": id},
    {"name": "consonant", "symbols": ["weak_consonant"], "postprocess": id},
    {"name": "weak_consonant", "symbols": [(lexer.has("openWeakConsonant") ? {type: "openWeakConsonant"} : openWeakConsonant), "strong_consonant", (lexer.has("closeWeakConsonant") ? {type: "closeWeakConsonant"} : closeWeakConsonant)], "postprocess": 
        ([ , value]) => _.edit(value, { meta: { weak: true }})
        },
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("2") ? {type: "2"} : 2)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("3") ? {type: "3"} : 3)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("b") ? {type: "b"} : b)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("d") ? {type: "d"} : d)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("f") ? {type: "f"} : f)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("g") ? {type: "g"} : g)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("gh") ? {type: "gh"} : gh)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("h") ? {type: "h"} : h)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("7") ? {type: "7"} : 7)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("5") ? {type: "5"} : 5)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("j") ? {type: "j"} : j)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("k") ? {type: "k"} : k)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("q") ? {type: "q"} : q)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("l") ? {type: "l"} : l)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("m") ? {type: "m"} : m)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("n") ? {type: "n"} : n)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("p") ? {type: "p"} : p)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("r") ? {type: "r"} : r)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("s") ? {type: "s"} : s)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("sh") ? {type: "sh"} : sh)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("t") ? {type: "t"} : t)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("v") ? {type: "v"} : v)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("z") ? {type: "z"} : z)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("th") ? {type: "th"} : th)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("dh") ? {type: "dh"} : dh)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("w") ? {type: "w"} : w)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("y") ? {type: "y"} : y)]},
    {"name": "strong_consonant$subexpression$1", "symbols": [(lexer.has("nullConsonant") ? {type: "nullConsonant"} : nullConsonant)]},
    {"name": "strong_consonant", "symbols": ["strong_consonant$subexpression$1"], "postprocess": ([[{ value }]]) => _.process(value)},
    {"name": "pronoun", "symbols": [(lexer.has("openTag") ? {type: "openTag"} : openTag), (lexer.has("pronoun") ? {type: "pronoun"} : pronoun), (lexer.has("closeTag") ? {type: "closeTag"} : closeTag)], "postprocess": ([ , { type, meta, value }]) => init(type, meta, value)},
    {"name": "tam", "symbols": [(lexer.has("openTag") ? {type: "openTag"} : openTag), (lexer.has("tam") ? {type: "tam"} : tam), (lexer.has("closeTag") ? {type: "closeTag"} : closeTag)], "postprocess": ([ , value]) => value},
    {"name": "voice", "symbols": [(lexer.has("openTag") ? {type: "openTag"} : openTag), (lexer.has("voice") ? {type: "voice"} : voice), (lexer.has("closeTag") ? {type: "closeTag"} : closeTag)], "postprocess": ([ , value]) => value},
    {"name": "pp_form$subexpression$1", "symbols": [(lexer.has("higherForm") ? {type: "higherForm"} : higherForm)]},
    {"name": "pp_form$subexpression$1", "symbols": [(lexer.has("ppForm1") ? {type: "ppForm1"} : ppForm1)]},
    {"name": "pp_form", "symbols": [(lexer.has("openTag") ? {type: "openTag"} : openTag), "pp_form$subexpression$1", (lexer.has("closeTag") ? {type: "closeTag"} : closeTag)], "postprocess": ([ , [value]]) => value},
    {"name": "verb_form$subexpression$1", "symbols": [(lexer.has("higherForm") ? {type: "higherForm"} : higherForm)]},
    {"name": "verb_form$subexpression$1", "symbols": [(lexer.has("verbForm1") ? {type: "verbForm1"} : verbForm1)]},
    {"name": "verb_form", "symbols": [(lexer.has("openTag") ? {type: "openTag"} : openTag), "verb_form$subexpression$1", (lexer.has("closeTag") ? {type: "closeTag"} : closeTag)], "postprocess": ([ , [value]]) => value},
    {"name": "augmentation", "symbols": ["delimiter", (lexer.has("pronoun") ? {type: "pronoun"} : pronoun)], "postprocess": ([delimiter, { value }]) => init(`augmentation`, { delimiter }, init(`pronoun`, {}, value))]},
    {"name": "delimiter", "symbols": [(lexer.has("objectDelimiter") ? {type: "objectDelimiter"} : objectDelimiter)], "postprocess": processToken},
    {"name": "delimiter", "symbols": [(lexer.has("genitiveDelimiter") ? {type: "genitiveDelimiter"} : genitiveDelimiter)], "postprocess": processToken},
    {"name": "delimiter", "symbols": [(lexer.has("pseudoSubjectDelimiter") ? {type: "pseudoSubjectDelimiter"} : pseudoSubjectDelimiter)], "postprocess": processToken},
    {"name": "delimiter", "symbols": [(lexer.has("dativeDelimiter") ? {type: "dativeDelimiter"} : dativeDelimiter)], "postprocess": processToken},
    {"name": "ST", "symbols": [(lexer.has("s") ? {type: "s"} : s), (lexer.has("t") ? {type: "t"} : t)], "postprocess": ([{ value: a }, { value: b }]) => [_.process(a), _.process(b)]},
    {"name": "NO_SCHWA", "symbols": [(lexer.has("noSchwa") ? {type: "noSchwa"} : noSchwa)], "postprocess": processToken},
    {"name": "FEM", "symbols": [(lexer.has("fem") ? {type: "fem"} : fem)], "postprocess": processToken},
    {"name": "DUAL", "symbols": [(lexer.has("dual") ? {type: "dual"} : dual)], "postprocess": processToken},
    {"name": "PLURAL", "symbols": [(lexer.has("plural") ? {type: "plural"} : plural)], "postprocess": processToken},
    {"name": "FEM_PLURAL", "symbols": [(lexer.has("femPlural") ? {type: "femPlural"} : femPlural)], "postprocess": processToken},
    {"name": "STRESSED", "symbols": [(lexer.has("stressed") ? {type: "stressed"} : stressed)], "postprocess": processToken},
    {"name": "FRENCH", "symbols": [(lexer.has("french") ? {type: "french"} : french)], "postprocess": processToken},
    {"name": "__", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": () => null}
]
  , ParserStart: "passage"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
