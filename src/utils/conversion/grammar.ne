@{%
  const _ = require(`./processors`);

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
      `${abc[s].symbol}${abc.emphatic}?`
    ),
    // since i'm currently including emphatics as their own k-v entries
    // in symbols.alphabet, this will work fine
    // if i ever change that decision, then will switch to the commented
    // version of this function below
    value: match => abc[match]
    // value: match => (
    //   match.endsWith(abc.emphatic) ?
    //     { ...abc[s], meta: { ...abc[s].meta, emphatic: true }}
    //   :
    //     abc[s]
    // )
  });

  // generate everything else
  const $ = ([s]) => ({
    match: abc[s].symbol,
    value: () => abc[s]
  });

  moo.compile({
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
    $: c`$`,
    s: c`s`,
    sh: c`sh`,
    t: c`t`,
    v: c`v`,
    w: c`w`,
    y: c`y`,
    z: c`z`,
    th: c`th`,
    dh: c`dh`,
    null: c`null`,

    a: $`a`,
    aa: $`aa`,
    aaLowered: $`AA`,
    ae: $`ae`,
    iTense: $`i2`,
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

    fem: $`Fem`,
    dual: $`Dual`,
    plural: $`Plural`,

    stressed: $`Stressed`,

    genitiveDelimiter: $`Of`,
    objectDelimiter: $`Object`,
    pseudoSubjectDelimiter: $`PseudoSubject`,
    dativeDelimiter: $`Dative`,

    verbForm: new RegExp(sym.verbForms.join(`|`)),
    ppForm: new RegExp(sym.ppForms.join(`|`)),

    pronoun: new RegExp(sym.pronouns.join(`|`))
  });
%}

@lexer lexer

# [value] needs to be unpacked one level bc i'm not doing {% id %} when calling this macro
# (macro parameters are rules themselves)
makeInitial[Syllable] ->
    ST $Syllable  {% ([st, [value]]) => _.obj(`syllable`, value.meta, [...st, ...value.value]) %}
  | consonant $Syllable  {% ([c, [value]]) => _.obj(`syllable`, value.meta, [c, ...value.value]) %}
  | $Syllable  {% ([[value]]) => value %}

sentence ->
    term {% id %}
  | term (__ term {% ([ , term]) => term %}):+ {% ([a, b]) => [a, ...b] %}

term ->
    word  {% id %}
  | idafe  {% id %}
  | pp  {% id %}
  | verb  {% id %}
  | m  {% id %}
  | l  {% id %}
  | literal {% id %}

# `bruh (\ -- ) what (\?)` gives `bruh -- what?` (aka whitespace only matters inside the literal)
literal ->
    "(\\" [^)]:+ ")"  {% ([ , value]) => _.obj(`literal`, value.join('')) %}
  | "(\\))"  {% () => _.obj(`literal`, `)`) %}  # just in case

idafe ->
  "(idafe"
    __ (word | m | idafe)
    __ (word | m | l | idafe)
  ")"  {% ([ ,, [possessee] ,, [possessor], d]) => _.idafe(
         _.obj(`idafe`, { possessee, possessor })
       ) %}

l -> "(l" __ (word | m) ")"  {% ([ ,, [value]]) => _.l({ type: `def`, value }) %}

# the m- prefix can vary, dunno if this is the best way to represent that tho
# my idea is to do like (ma mYbar) or (mu mujarr!b) so the calling code can just extract that initial mV-
m ->
  "(m"
    ("a" | "i" | "u")
    __ word
  ")"  {% ([ , [vowel] ,, value]) => _.m({ type: `m`, meta: { vowel }, value }) %}

# pp needs to be a thing because -c behaves funny in participles (fe3la and fe3ilt-/fe3lit-/fe3liit-),
# A is more likely to raise to /e:/ in fe3il participles,
# and the first vowel in fa3len participles is a~i
pp -> "(pp"
    __ pronoun
    __ pp_form
    __ ("active" | "passive")
    __ root
    augmentation:?
  ")"  {%
    ([ ,, conjugation ,, form ,, [voice] ,, root, augmentation]) => _.pp(
      _.obj(`pp`, { conjugation, form, voice }, { root, augmentation })
    )
  %}

# verb needs to be a thing because verb conjugations can differ wildly
# (7aky!t/7iky!t vs 7ak!t vs 7ik!t (and -at too)... rt!7t vs rt!7t, seme3kon vs sme3kon etc)
verb ->
  "(verb"
    __ pronoun
    __ verb_form
    __ ("pst" | "ind" | "sbjv" | "imp")  # could do {% id %} on each one of these but [tam] works below
    __ root
    augmentation:?
  ")"  {% ([ ,, conjugation ,, form ,, [tam] ,, root, augmentation]) => _.verb(
         _.obj(`verb`, { form, tam, conjugation }, { root, augmentation })
       ) %}

word ->
    stem  {% ([stem]) => (_.obj(`word`, { stem, augmentation: null })) %}
  | stem augmentation  {% ([stem, augmentation]) => _.obj(`word`, { stem, augmentation }) %}
  | stem augmentation  {% ([stem, augmentation]) => _.obj(`word`, { stem, augmentation }) %}

stem -> (
    consonant  # don't need to {% id %} because it's already going to be [Object] instead of [[Object...]]
    | monosyllable  # ditto
    | disyllable  {% id %}
    | trisyllable  {% id %}
    | initial_syllable medial_syllable:* last_three_syllables  {% ([a, b, c]) => [a, ...b, ...c] %}
  )  {% ([value]) => _.obj(`stem`, { consonant: value.length === 1 && value[0].type === `consonant` }, value) %}

monosyllable -> makeInitial[final_syllable]  {% ([syllable]) => ({ ...syllable, meta: { ...syllable.meta, stressed: true }}) %}

disyllable ->
   penult_stress_disyllable  {% id %}
  | final_stress_disyllable  {% id %}

penult_stress_disyllable ->
    initial_syllable final_lighter_syllable  {% ([b, c]) => [{ ...b, meta: { ...b.meta, stressed: true }}, c] %}
  | initial_syllable STRESSED final_syllable  {% ([b ,, c]) => [{ ...b, meta: { ...b.meta, stressed: true }}, c] %}
final_stress_disyllable ->
    initial_syllable final_superheavy_syllable  {% ([b, c]) => [b, { ...c, meta: { ...c.meta, stressed: true }}] %}
  | initial_syllable final_stressed_syllable  # this one could probably be handled more consistently/elegantly lol

initial_heavier_syllable ->
    initial_heavy_syllable  {% id %}
  | initial_superheavy_syllable  {% id %}

trisyllable ->
    antepenult_stress_trisyllable {% id %}
  | initial_syllable stressed_penult  {% ([a, b]) => [a, ...b] %}
  | initial_syllable stressed_final  {% ([a, b]) => [a, ...b] %}

antepenult_stress_trisyllable ->
    initial_syllable unstressed_last_2 {% ([a, b]) => [{ ...a, meta: { ...a.meta, stressed: true }}, ...b] %}
  | initial_syllable STRESSED medial_syllable final_unstressed_syllable  {% ([a, _, b, c]) => [{ ...a, meta: { ...a.meta, stressed: true }}, b, c] %}

last_three_syllables ->
    antepenult_stress_triplet {% id %}
  | medial_syllable stressed_penult  {% ([a, b]) => [a, ...b] %}
  | medial_syllable stressed_final  {% ([a, b]) => [a, ...b] %}

antepenult_stress_triplet ->
    medial_syllable unstressed_last_2 {% ([a, b]) => [{ ...a, meta: { ...a.meta, stressed: true }}, ...b] %}
  | medial_syllable STRESSED medial_syllable final_unstressed_syllable  {% ([a ,, b, c]) => [{ ...a, meta: { ...a.meta, stressed: true }}, b, c] %}

unstressed_last_2 -> light_syllable final_lighter_syllable
stressed_penult ->
    heavier_syllable final_lighter_syllable  {% ([b, c]) => [{ ...b, meta: { ...b.meta, stressed: true }}, c] %}
  | medial_syllable STRESSED final_syllable  {% ([b ,, c]) => [{ ...b, meta: { ...b.meta, stressed: true }}, c] %}
stressed_final ->
    medial_syllable final_superheavy_syllable  {% ([b, c]) => [b, { ...c, meta: { ...c.meta, stressed: true }}] %}
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

# TODO: make an inheritance relationship thing from final_syllable -> final_unstressed_syllable (aka lessen duplication)
final_unstressed_syllable ->
    final_light_syllable  {% id %}
  | final_heavy_syllable  {% id %}
  | final_superheavy_syllable  {% id %}

final_syllable ->
    final_light_syllable  {% id %}
  | final_heavy_syllable  {% id %}
  | final_stressed_syllable  {% id %}
  | final_superheavy_syllable  {% id %}

medial_syllable ->
    light_syllable  {% id %}
  | heavy_syllable  {% id %}
  | superheavy_syllable  {% id %}

initial_light_syllable -> makeInitial[light_syllable]  {% id %}
initial_heavy_syllable -> makeInitial[heavy_syllable]  {% id %}
initial_superheavy_syllable -> makeInitial[superheavy_syllable]  {% id %}

final_light_syllable -> consonant final_light_rime  {% ([a, b]) => _.obj(`syllable`, { weight: `light`, stressed: false }, [a, ...b]) %}
final_heavy_syllable -> consonant final_heavy_rime  {% ([a, b]) => _.obj(`syllable`, { weight: `heavy`, stressed: false }, [a, ...b]) %}
final_stressed_syllable -> consonant final_stressed_rime  {% ([a, b]) => _.obj(`syllable`, { weight: `special`, stressed: true }, [a, ...b]) %}
final_superheavy_syllable -> consonant final_superheavy_rime  {% ([a, b]) => _.obj(`syllable`, { weight: `superheavy`, stressed: false }, [a, ...b]) %}

final_light_rime -> final_short_vowel
final_heavy_rime -> short_vowel consonant
final_stressed_rime -> (long_vowel  {% id %} | A  {% id %} | E  {% id %} | O  {% id %}) STRESSED
final_superheavy_rime ->
    superheavy_rime  {% id %}
  | PLURAL  # gets unpacked into "p", "l", "u", "r", "a", "l" if {% id %}
  | DUAL

light_syllable -> consonant light_rime  {% ([a, b]) => _.obj(`syllable`, { weight: `light`, stressed: false }, [a, ...b]) %}
heavy_syllable -> consonant heavy_rime  {% ([a, b]) => _.obj(`syllable`, { weight: `heavy`, stressed: false }, [a, ...b]) %}
superheavy_syllable -> consonant superheavy_rime  {% ([a, b]) => _.obj(`syllable`, { weight: `superheavy`, stressed: false }, [a, ...b]) %}

light_rime -> short_vowel
heavy_rime -> (long_vowel | short_vowel consonant)  {% id %}
superheavy_rime ->
    long_vowel consonant
  | short_vowel consonant NO_SCHWA consonant
  | short_vowel consonant consonant
     {% ([a, b, c]) => (
      b === c ? [a, b, c] : [a, b, _.obj(`epenthetic`, { priority: true }, `schwa`), c]
    ) %}
  | long_vowel consonant consonant  # technically superduperheavy but no difference; found in maarktayn although that's spelled mArkc2
  | long_vowel consonant NO_SCHWA consonant  # technically superduperheavy but no difference; found in maarktayn although that's spelled mArkc2

vowel -> (long_vowel | short_vowel)  {% ([[value]]) => value %}
final_short_vowel -> (A|I_TENSE|I_LAX|E|FEM)  {% ([[value]]) => _.obj(`vowel`, { length: 1 }, value) %}
short_vowel -> (A|I_TENSE|I_LAX|U|E|O)  {% ([[value]]) => _.obj(`vowel`, { length: 1 }, value) %}
long_vowel -> (AA|AA_LOWERED|AE|II|UU|EE|OO|AY|AW)  {% ([[value]]) => _.obj(`vowel`, { length: 2 }, value) %}

root -> consonant consonant consonant consonant:?
consonant -> (plain_consonant | emphatic_consonant)  {% ([[value]]) => value %}
emphatic_consonant -> plain_consonant EMPHATIC  {%
  ([{ type, meta, value }, emphatic]) => _.obj(type, { ...meta, emphatic: true }, value)
%}
plain_consonant -> (
  %2 | %3 | %b | %d | %f | %g | %gh | %h | %7 | %5 | %j | %k | %q | %l |
  %m | %n | %p | %r | %s | %sh | %t | %v | %z | %th | %dh | %w | %y | %null
) {% ([[value]]) => value %}

# a good example of <e> and <*>: hexxa* for donkeys (alternative form: hixx)
