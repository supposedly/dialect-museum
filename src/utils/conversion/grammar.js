// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const _ = require(`./objects`);

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
      femPlural: $`FemPlural`,

      stressed: $`Stressed`,

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
    }
  });

  const processToken = ([{ value }]) => _.process(value);
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "sentence", "symbols": ["term"], "postprocess": id},
    {"name": "sentence$ebnf$1$subexpression$1", "symbols": ["__", "term"], "postprocess": ([ , term]) => term},
    {"name": "sentence$ebnf$1", "symbols": ["sentence$ebnf$1$subexpression$1"]},
    {"name": "sentence$ebnf$1$subexpression$2", "symbols": ["__", "term"], "postprocess": ([ , term]) => term},
    {"name": "sentence$ebnf$1", "symbols": ["sentence$ebnf$1", "sentence$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sentence", "symbols": ["term", "sentence$ebnf$1"], "postprocess": ([a, b]) => [a, ...b]},
    {"name": "term", "symbols": ["word"], "postprocess": id},
    {"name": "term", "symbols": ["idafe"], "postprocess": id},
    {"name": "term", "symbols": ["pp"], "postprocess": id},
    {"name": "term", "symbols": ["verb"], "postprocess": id},
    {"name": "term", "symbols": ["l"], "postprocess": id},
    {"name": "term", "symbols": ["literal"], "postprocess": id},
    {"name": "literal$ebnf$1", "symbols": [/[^)]/]},
    {"name": "literal$ebnf$1", "symbols": ["literal$ebnf$1", /[^)]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "literal", "symbols": [{"literal":"(\\"}, "literal$ebnf$1", {"literal":")"}], "postprocess": ([ , value]) => _.obj(`literal`, {}, value.join(''))},
    {"name": "literal", "symbols": [{"literal":"(\\)"}, {"literal":")"}], "postprocess": () => _.obj(`literal`, {}, `)`)},
    {"name": "idafe$subexpression$1", "symbols": ["word"]},
    {"name": "idafe$subexpression$1", "symbols": ["idafe"]},
    {"name": "idafe$subexpression$2", "symbols": ["word"]},
    {"name": "idafe$subexpression$2", "symbols": ["l"]},
    {"name": "idafe$subexpression$2", "symbols": ["idafe"]},
    {"name": "idafe", "symbols": [{"literal":"(idafe"}, "__", "idafe$subexpression$1", "__", "idafe$subexpression$2", {"literal":")"}], "postprocess": 
        ([ ,, [possessee] ,, [possessor], d]) => _.obj(
          `idafe`, {}, { possessee, possessor }
        )
          },
    {"name": "l", "symbols": [{"literal":"(l"}, "__", "word", {"literal":")"}], "postprocess": ([ ,, value]) => _.obj(`def`, {}, value)},
    {"name": "pp$ebnf$1", "symbols": ["augmentation"], "postprocess": id},
    {"name": "pp$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pp", "symbols": [{"literal":"(pp"}, "__", "pronoun", "__", "pp_form", "__", "voice", "__", "root", "pp$ebnf$1", {"literal":")"}], "postprocess": 
        ([ ,, conjugation ,, form ,, voice ,, root, augmentation]) => _.obj(
          `pp`, { conjugation, form, voice }, { root, augmentation }
        )
          },
    {"name": "verb$ebnf$1", "symbols": ["augmentation"], "postprocess": id},
    {"name": "verb$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "verb", "symbols": [{"literal":"(verb"}, "__", "pronoun", "__", "verb_form", "__", "tam", "__", "root", "verb$ebnf$1", {"literal":")"}], "postprocess": 
        ([ ,, conjugation ,, form ,, tam ,, root, augmentation]) => _.obj(
          `verb`, { form, tam, conjugation }, { root, augmentation }
        )
          },
    {"name": "word", "symbols": ["stem"], "postprocess": ([value]) => _.obj(`word`, { augmentation: null }, value)},
    {"name": "word", "symbols": ["stem", "augmentation"], "postprocess": ([value, augmentation]) => _.obj(`word`, { augmentation }, value)},
    {"name": "stem$subexpression$1", "symbols": ["consonant"], "postprocess": ([value]) => [_.obj(`syllable`, { stressed: null, weight: 0 }, value)]},
    {"name": "stem$subexpression$1", "symbols": ["monosyllable"]},
    {"name": "stem$subexpression$1", "symbols": ["disyllable"], "postprocess": id},
    {"name": "stem$subexpression$1", "symbols": ["trisyllable"], "postprocess": id},
    {"name": "stem$subexpression$1$ebnf$1", "symbols": []},
    {"name": "stem$subexpression$1$ebnf$1", "symbols": ["stem$subexpression$1$ebnf$1", "medial_syllable"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "stem$subexpression$1", "symbols": ["initial_syllable", "stem$subexpression$1$ebnf$1", "last_three_syllables"], "postprocess": ([a, b, c]) => [a, ...b, ...c]},
    {"name": "stem", "symbols": ["stem$subexpression$1"], "postprocess": ([value]) => _.obj(`stem`, {}, value)},
    {"name": "monosyllable$macrocall$2", "symbols": ["final_syllable"], "postprocess": id},
    {"name": "monosyllable$macrocall$1", "symbols": ["ST", "monosyllable$macrocall$2"], "postprocess": ([st, value]) => _.obj(`syllable`, value.meta, [...st, ...value.value])},
    {"name": "monosyllable$macrocall$1", "symbols": ["consonant", "monosyllable$macrocall$2"], "postprocess": ([c, value]) => _.obj(`syllable`, value.meta, [c, ...value.value])},
    {"name": "monosyllable$macrocall$1", "symbols": ["monosyllable$macrocall$2"], "postprocess": ([value]) => value},
    {"name": "monosyllable", "symbols": ["monosyllable$macrocall$1"], "postprocess": ([syllable]) => _.edit(syllable, { meta: { stressed: true }})},
    {"name": "disyllable", "symbols": ["penult_stress_disyllable"], "postprocess": id},
    {"name": "disyllable", "symbols": ["final_stress_disyllable"], "postprocess": id},
    {"name": "penult_stress_disyllable", "symbols": ["initial_syllable", "final_lighter_syllable"], "postprocess": ([b, c]) => [_.edit(b, { meta: { stressed: true }}), c]},
    {"name": "penult_stress_disyllable", "symbols": ["initial_syllable", "STRESSED", "final_syllable"], "postprocess": ([b ,, c]) => [_.edit(b, { meta: { stressed: true }}), c]},
    {"name": "final_stress_disyllable", "symbols": ["initial_syllable", "final_superheavy_syllable"], "postprocess": ([b, c]) => [b, _.edit(c, { meta: { stressed: true }})]},
    {"name": "final_stress_disyllable", "symbols": ["initial_syllable", "final_stressed_syllable"]},
    {"name": "initial_heavier_syllable", "symbols": ["initial_heavy_syllable"], "postprocess": id},
    {"name": "initial_heavier_syllable", "symbols": ["initial_superheavy_syllable"], "postprocess": id},
    {"name": "trisyllable", "symbols": ["antepenult_stress_trisyllable"], "postprocess": id},
    {"name": "trisyllable", "symbols": ["initial_syllable", "stressed_penult_last_two"], "postprocess": ([a, b]) => [a, ...b]},
    {"name": "trisyllable", "symbols": ["initial_syllable", "stressed_final_last_two"], "postprocess": ([a, b]) => [a, ...b]},
    {"name": "antepenult_stress_trisyllable", "symbols": ["initial_syllable", "unstressed_last_two"], "postprocess": ([a, b]) => [_.edit(a, { meta: { stressed: true }}), ...b]},
    {"name": "antepenult_stress_trisyllable", "symbols": ["initial_syllable", "STRESSED", "medial_syllable", "final_unstressed_syllable"], "postprocess": ([a, _, b, c]) => [_.edit(a, { meta: { stressed: true }}), b, c]},
    {"name": "last_three_syllables", "symbols": ["antepenult_stress_triplet"], "postprocess": id},
    {"name": "last_three_syllables", "symbols": ["medial_syllable", "stressed_penult_last_two"], "postprocess": ([a, b]) => [a, ...b]},
    {"name": "last_three_syllables", "symbols": ["medial_syllable", "stressed_final_last_two"], "postprocess": ([a, b]) => [a, ...b]},
    {"name": "antepenult_stress_triplet", "symbols": ["medial_syllable", "unstressed_last_two"], "postprocess": ([a, b]) => [_.edit(a, { meta: { stressed: true }}), ...b]},
    {"name": "antepenult_stress_triplet", "symbols": ["medial_syllable", "STRESSED", "medial_syllable", "final_unstressed_syllable"], "postprocess": ([a ,, b, c]) => [_.edit(a, { meta: { stressed: true }}), b, c]},
    {"name": "unstressed_last_two", "symbols": ["light_syllable", "final_lighter_syllable"]},
    {"name": "stressed_penult_last_two", "symbols": ["heavier_syllable", "final_lighter_syllable"], "postprocess": ([b, c]) => [_.edit(b, { meta: { stressed: true }}), c]},
    {"name": "stressed_penult_last_two", "symbols": ["medial_syllable", "STRESSED", "final_syllable"], "postprocess": ([b ,, c]) => [_.edit(b, { meta: { stressed: true }}), c]},
    {"name": "stressed_final_last_two", "symbols": ["medial_syllable", "final_superheavy_syllable"], "postprocess": ([b, c]) => [b, _.edit(c, { meta: { stressed: true }})]},
    {"name": "stressed_final_last_two", "symbols": ["medial_syllable", "final_stressed_syllable"]},
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
    {"name": "final_stressed_rime$subexpression$1", "symbols": [(lexer.has("aa") ? {type: "aa"} : aa)], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$1", "symbols": [(lexer.has("ee") ? {type: "ee"} : ee)], "postprocess": id},
    {"name": "final_stressed_rime$subexpression$1", "symbols": [(lexer.has("oo") ? {type: "oo"} : oo)], "postprocess": id},
    {"name": "final_stressed_rime", "symbols": ["final_stressed_rime$subexpression$1", "STRESSED"]},
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
    {"name": "final_short_vowel$subexpression$1", "symbols": [(lexer.has("i") ? {type: "i"} : i)]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [(lexer.has("e") ? {type: "e"} : e)]},
    {"name": "final_short_vowel$subexpression$1", "symbols": [(lexer.has("fem") ? {type: "fem"} : fem)]},
    {"name": "final_short_vowel", "symbols": ["final_short_vowel$subexpression$1"], "postprocess": ([[{ value }]]) => _.process(value)},
    {"name": "short_vowel$subexpression$1", "symbols": [(lexer.has("a") ? {type: "a"} : a)]},
    {"name": "short_vowel$subexpression$1", "symbols": [(lexer.has("iTense") ? {type: "iTense"} : iTense)]},
    {"name": "short_vowel$subexpression$1", "symbols": [(lexer.has("i") ? {type: "i"} : i)]},
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
    {"name": "pronoun", "symbols": [(lexer.has("openTag") ? {type: "openTag"} : openTag), (lexer.has("pronoun") ? {type: "pronoun"} : pronoun), (lexer.has("closeTag") ? {type: "closeTag"} : closeTag)], "postprocess": ([ , value]) => value},
    {"name": "tam", "symbols": [(lexer.has("openTag") ? {type: "openTag"} : openTag), (lexer.has("tam") ? {type: "tam"} : tam), (lexer.has("closeTag") ? {type: "closeTag"} : closeTag)], "postprocess": ([ , value]) => value},
    {"name": "voice", "symbols": [(lexer.has("openTag") ? {type: "openTag"} : openTag), (lexer.has("voice") ? {type: "voice"} : voice), (lexer.has("closeTag") ? {type: "closeTag"} : closeTag)], "postprocess": ([ , value]) => value},
    {"name": "pp_form$subexpression$1", "symbols": [(lexer.has("higherForm") ? {type: "higherForm"} : higherForm)]},
    {"name": "pp_form$subexpression$1", "symbols": [(lexer.has("ppForm1") ? {type: "ppForm1"} : ppForm1)]},
    {"name": "pp_form", "symbols": [(lexer.has("openTag") ? {type: "openTag"} : openTag), "pp_form$subexpression$1", (lexer.has("closeTag") ? {type: "closeTag"} : closeTag)], "postprocess": ([ , [value]]) => value},
    {"name": "verb_form$subexpression$1", "symbols": [(lexer.has("higherForm") ? {type: "higherForm"} : higherForm)]},
    {"name": "verb_form$subexpression$1", "symbols": [(lexer.has("verbForm1") ? {type: "verbForm1"} : verbForm1)]},
    {"name": "verb_form", "symbols": [(lexer.has("openTag") ? {type: "openTag"} : openTag), "verb_form$subexpression$1", (lexer.has("closeTag") ? {type: "closeTag"} : closeTag)], "postprocess": ([ , [value]]) => value},
    {"name": "augmentation", "symbols": ["delimiter", (lexer.has("pronoun") ? {type: "pronoun"} : pronoun)], "postprocess": ([a, { value }]) => [a, _.process(value)]},
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
    {"name": "__", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": () => null}
]
  , ParserStart: "sentence"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
