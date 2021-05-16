@{%
  const _ = require(`./objects`);
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
    }
  });

  const processToken = ([{ value }]) => _.process(value);

  const init = (...args) => _.obj(...args).init(inits);
%}

@lexer lexer

makeInitial[Syllable] ->
    ST $Syllable  {% ([st, value]) => _.obj(`syllable`, value.meta, [...st, ...value.value]) %}
  | consonant $Syllable  {% ([c, value]) => _.obj(`syllable`, value.meta, [c, ...value.value]) %}
  | $Syllable  {% ([value]) => value %}

sentence ->
    term {% id %}
  | term (__ term {% ([ , term]) => term %}):+ {% ([a, b]) => [a, ...b] %}

term ->
    word  {% id %}
  | idafe  {% id %}
  | pp  {% id %}
  | verb  {% id %}
  | l  {% id %}
  | af3al {% id %}
  | tif3il {% id %}
  | literal {% id %}

# `bruh (\ -- ) what (\?)` gives `bruh -- what?` (aka whitespace only matters inside the literal)
literal ->
    "(\\" [^)]:+ ")"  {% ([ , value]) => _.obj(`literal`, {}, value.join('')) %}
  | "(\\)" ")"  {% () => _.obj(`literal`, {}, `)`) %}  # just in case

af3al -> "(af3al" __ root augmentation:? ")" {% ([ ,, root, augmentation]) => init(`af3al`, {}, { root, augmentation }) %}

tif3il -> "(tif3il" __ root (FEM {% id %} | FEM_PLURAL {% id %}):? augmentation:? ")" {%
  ([ ,, root, fem, augmentation]) => init(`tif3il`, {}, { root, fem, augmentation })
%}

idafe ->
  "(idafe"
    __ (word | idafe)
    __ (word | l | idafe)
  ")"  {%
    ([ ,, [possessee] ,, [possessor], d]) => init(
      `idafe`, {}, { possessee, possessor }
    )
  %}

l -> "(l" __ word ")"  {% ([ ,, value]) => init(`def`, {}, value) %}

# pp needs to be a thing because -c behaves funny in participles (fe3la and fe3ilt-/fe3lit-/fe3liit-),
# A is more likely to raise to /e:/ in fe3il participles,
# and the first vowel in fa3len participles is a~i
pp -> "(pp"
    __ pronoun
    __ pp_form
    __ voice
    __ root
    augmentation:?
  ")"  {%
    ([ ,, conjugation ,, form ,, voice ,, root, augmentation]) => init(
      `pp`, { conjugation, form, voice }, { root, augmentation }
    )
  %}

# verb needs to be a thing because verb conjugations can differ wildly
# (7aky!t/7iky!t vs 7ak!t vs 7ik!t (and -at too)... rta7t vs rti7t, seme3kon vs sme3kon etc)
verb ->
  "(verb"
    __ pronoun
    __ verb_form
    __ tam
    __ root
    augmentation:?
  ")"  {%
    ([ ,, conjugation ,, form ,, tam ,, root, augmentation]) => init(
      `verb`, { form, tam, conjugation }, { root, augmentation }
    )
  %}

# TODO figure out a better way of including the augmentation?
# TODO since I'm not using stems, maybe remove them
# (what specifically happened was that i didn't look at this part of the grammar until i'd finished
# a lot of the rest of the backend, none of which i thought to use stems in, so i had to go back
# here and change `([value]) =>` to `([{ value }])) =>`
word ->
    stem  {% ([{ value }]) => init(`word`, { was: null, augmentation: null }, value) %}
  | stem augmentation  {% ([{ value }, augmentation]) => init(`word`, { augmentation }, value) %}

# messy because of stressedOn :(
stem ->
    consonant  {% ([value]) => _.obj(`stem`, { stressedOn: null }, [_.obj(`syllable`, { stressed: null, weight: 0 }, value)]) %}
  | monosyllable  {% ([{ stressedOn, value }]) => _.obj(`stem`, { stressedOn }, value) %}
  | disyllable  {% ([{ stressedOn, value }]) => _.obj(`stem`, { stressedOn }, value) %}
  | trisyllable  {% ([{ stressedOn, value }]) => _.obj(`stem`, { stressedOn }, value) %}
  | initial_syllable medial_syllable:* final_three_syllables  {% ([a, b, { stressedOn, value: c }]) => _.obj(`stem`, { stressedOn }, [a, ...b, ...c]) %}

monosyllable -> makeInitial[final_syllable  {% id %}]  {% ([syllable]) => ({
  stressedOn: -1,
  value: [_.edit(syllable, { meta: { stressed: true }})]
}) %}

disyllable ->
   trochee  {% ([value]) => ({ stressedOn: -2, value }) %}
  | iamb  {% ([value]) => ({ stressedOn: -1, value }) %}

trochee ->
    initial_syllable final_lighter_syllable  {% ([b, c]) => [_.edit(b, { meta: { stressed: true }}), c] %}
  | initial_syllable STRESSED final_syllable  {% ([b ,, c]) => [_.edit(b, { meta: { stressed: true }}), c] %}
iamb ->
    initial_syllable final_superheavy_syllable  {% ([b, c]) => [b, _.edit(c, { meta: { stressed: true }})] %}
  | initial_syllable final_stressed_syllable  # this one could probably be handled more consistently/elegantly lol

# dunno why i made this if i'm not using it
# initial_heavier_syllable ->
#     initial_heavy_syllable  {% id %}
#   | initial_superheavy_syllable  {% id %}

trisyllable ->
    dactyl  {% ([value]) => ({ stressedOn: -3, value }) %}
  | initial_syllable final_trochee  {% ([a, b]) => ({ stressedOn: -2, value: [a, ...b] }) %}  # thank god i don't have to use the word amphibrach
  | initial_syllable final_iamb  {% ([a, b]) => ({ stressedOn: -1, value: [a, ...b] }) %}  # or decide which spelling of anap(a)est is cooler

dactyl ->
    initial_syllable final_dibrach {% ([a, b]) => [_.edit(a, { meta: { stressed: true }}), ...b] %}
  | initial_syllable STRESSED medial_syllable final_unstressed_syllable  {% ([a, _, b, c]) => [_.edit(a, { meta: { stressed: true }}), b, c] %}

final_three_syllables ->
    final_dactyl  {% ([value]) => ({ stressedOn: -3, value }) %}
  | medial_syllable final_trochee  {% ([a, b]) => ({ stressedOn: -2, value: [a, ...b] }) %}  # see ^
  | medial_syllable final_iamb  {% ([a, b]) => ({ stressedOn: -1, value: [a, ...b] }) %}  # ^^

final_dactyl ->
    medial_syllable final_dibrach {% ([a, b]) => [_.edit(a, { meta: { stressed: true }}), ...b] %}
  | medial_syllable STRESSED medial_syllable final_unstressed_syllable  {% ([a ,, b, c]) => [_.edit(a, { meta: { stressed: true }}), b, c] %}

final_dibrach -> light_syllable final_lighter_syllable  # dibrach better than pyrrhic bc (1) quantitative and (2) more specific
final_trochee ->
    heavier_syllable final_lighter_syllable  {% ([b, c]) => [_.edit(b, { meta: { stressed: true }}), c] %}
  | medial_syllable STRESSED final_syllable  {% ([b ,, c]) => [_.edit(b, { meta: { stressed: true }}), c] %}
final_iamb ->
    medial_syllable final_superheavy_syllable  {% ([b, c]) => [b, _.edit(c, { meta: { stressed: true }})] %}
  | medial_syllable final_stressed_syllable  # this one could probably be handled more consistently/elegantly lol

heavier_syllable ->
    heavy_syllable  {% id %}
  | superheavy_syllable  {% id %}
final_lighter_syllable ->
    final_light_syllable  {% id %}
  | final_heavy_syllable  {% id %}

initial_syllable ->
    initial_light_syllable  {% id %}
  | initial_heavy_syllable  {% id %}
  | initial_superheavy_syllable  {% id %}

final_syllable ->
    final_unstressed_syllable  {% id %}
  | final_stressed_syllable  {% id %}

final_unstressed_syllable ->
    final_light_syllable  {% id %}
  | final_heavy_syllable  {% id %}
  | final_superheavy_syllable  {% id %}

medial_syllable ->
    light_syllable  {% id %}
  | heavy_syllable  {% id %}
  | superheavy_syllable  {% id %}

initial_light_syllable -> makeInitial[light_syllable {% id %}]  {% id %}
initial_heavy_syllable -> makeInitial[heavy_syllable {% id %}]  {% id %}
initial_superheavy_syllable -> makeInitial[superheavy_syllable {% id %}]  {% id %}

final_light_syllable -> consonant final_light_rime  {% ([a, b]) => _.obj(`syllable`, { weight: 1, stressed: false }, [a, ...b]) %}
final_heavy_syllable -> consonant final_heavy_rime  {% ([a, b]) => _.obj(`syllable`, { weight: 2, stressed: false }, [a, ...b]) %}
final_stressed_syllable -> consonant final_stressed_rime  {% ([a, b]) => _.obj(`syllable`, { weight: null, stressed: true }, [a, ...b]) %}
final_superheavy_syllable ->
    consonant final_superheavy_rime  {% ([a, b]) => _.obj(`syllable`, { weight: 3, stressed: false }, [a, ...b]) %}
  # this will allow this sequence to be word-initial (bc monosyllables) but w/e probably not worth fixing lol
  | FEM DUAL  {%
    ([a, b]) => _.obj(`syllable`, { weight: 3, stressed: false }, [a, b])
  %}

final_light_rime -> final_short_vowel
final_heavy_rime -> short_vowel consonant
final_stressed_rime -> (long_vowel  {% id %} | %a  {% id %} | %e  {% id %} | %o  {% id %}) (STRESSED {% id %} | FRENCH {% id %})
final_superheavy_rime ->
    superheavy_rime  {% id %}
  | PLURAL
  | FEM_PLURAL
  | DUAL

light_syllable -> consonant light_rime  {% ([a, b]) => _.obj(`syllable`, { weight: 1, stressed: false }, [a, ...b]) %}
heavy_syllable -> consonant heavy_rime  {% ([a, b]) => _.obj(`syllable`, { weight: 2, stressed: false }, [a, ...b]) %}
superheavy_syllable -> consonant superheavy_rime  {% ([a, b]) => _.obj(`syllable`, { weight: 3, stressed: false }, [a, ...b]) %}

light_rime -> short_vowel
heavy_rime -> (long_vowel | short_vowel consonant)  {% id %}
superheavy_rime ->
    long_vowel consonant
  | short_vowel consonant NO_SCHWA consonant
  | short_vowel consonant consonant
     {% ([a, b, c]) => (
      b === c ? [a, b, c] : [a, b, _.process(abc.Schwa), c]
    ) %}
  | long_vowel consonant consonant  # technically superduperheavy but no difference; found in maarktayn although that's spelled mArkc=
  | long_vowel consonant NO_SCHWA consonant  # technically superduperheavy but no difference; found in maarktayn although that's spelled mArkc=

# the {value} here ISN'T the {value} from my own schema -- it's instead from moo,
# which provides us our own object as the {value} of its own lex-result object
vowel -> (long_vowel | short_vowel)  {% ([[value]]) => value %}
final_short_vowel -> (%a | %iTense | %uTense | %e | %o | %fem)  {% ([[{ value }]]) => _.process(value) %}
short_vowel -> (%a | %iTense | %i | %uTense | %u | %e | %o)  {% ([[{ value }]]) => _.process(value) %}
long_vowel -> (%aa | %aaLowered | %ae | %ii | %uu | %ee | %oo | %ay | %aw)  {% ([[{ value }]]) => _.process(value) %}

root -> consonant consonant consonant consonant:?
consonant -> strong_consonant  {% id %} | weak_consonant  {% id %}
weak_consonant -> %openWeakConsonant strong_consonant %closeWeakConsonant  {%
  ([ , value]) => _.edit(value, { meta: { weak: true }})
%}
# ditto above re {value}
strong_consonant -> (
  %2 | %3 | %b | %d | %f | %g | %gh | %h | %7 | %5 | %j | %k | %q | %l | %m |
  %n | %p | %r | %s | %sh | %t | %v | %z | %th | %dh | %w | %y | %nullConsonant
)  {% ([[{ value }]]) => _.process(value) %}

# ditto
pronoun -> %openTag %pronoun %closeTag  {% ([ , { type, meta, value }]) => init(type, meta, value) %}
tam -> %openTag %tam %closeTag  {% ([ , value]) => value %}
voice -> %openTag %voice %closeTag  {% ([ , value]) => value %}
pp_form -> %openTag (%higherForm | %ppForm1) %closeTag  {% ([ , [value]]) => value %}
verb_form -> %openTag (%higherForm | %verbForm1) %closeTag  {% ([ , [value]]) => value %}

augmentation -> delimiter %pronoun  {% ([delimiter, { value }]) => init(`augmentation`, { delimiter }, init(`pronoun`, {}, value))] %}

# ditto
delimiter ->
    %objectDelimiter {% processToken %}
  | %genitiveDelimiter {% processToken %}
  | %pseudoSubjectDelimiter {% processToken %}
  | %dativeDelimiter {% processToken %}


ST -> %s %t  {% ([{ value: a }, { value: b }]) => [_.process(a), _.process(b)] %}
NO_SCHWA -> %noSchwa  {% processToken %}
FEM -> %fem  {% processToken %}
DUAL -> %dual  {% processToken %}
PLURAL -> %plural  {% processToken %}
FEM_PLURAL -> %femPlural  {% processToken %}
STRESSED -> %stressed  {% processToken %}
FRENCH -> %french {% processToken %}
__ -> %ws  {% () => null %}

# a good example of <e> and <*>: hexxa* for donkeys (alternative form: hixx)
