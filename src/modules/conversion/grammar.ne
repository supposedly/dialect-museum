# zero clue why this needs the [value] to be unpacked one level, nearley is annoying
makeInitial[Syllable] ->
    ST $Syllable  {% ([st, [value]]) => ({ type: `syllable`, meta: value.meta, value: [...st, ...value.value] }) %}
  | consonant $Syllable  {% ([c, [value]]) => ({ type: `syllable`, meta: value.meta, value: [c, ...value.value] }) %}
  | $Syllable  {% ([[value]]) => value %}

sentence ->
    term {% id %}
  | term (__ term {% ([a, b]) => b %}):+ {% ([a, b]) => [a, ...b] %}

term ->
    word augmentation pronoun {% ([word, meta, value]) => ({ type: `term`, meta: { augmented: true }, value: [word, { type: `augmentation`, meta, value }] }) %}
  | word {% ([value]) => ({ type: `term`, meta: { augmented: false }, value }) %}
  | literal {% id %}

# `bruh (\ -- ) what (\?)` gives `bruh -- what?` (aka whitespace only matters inside the literal)
literal -> "(\\" [.]:+ ")"  {% ([a, value, b]) => ({ type: `literal`, value }) %}

word ->
    stem  {% id %}
  | idafe  {% id %}
  | pp  {% id %}
  | verb  {% id %}
  | m  {% id %}
  | l  {% id %}

idafe ->
  "(idafe"
    __ (stem | m | idafe)
    __ (stem | m | l | idafe)
  ")"  {% ([a, b, [possessee], c, [possessor], d]) => ({ type: `idafe`, meta: { definite: possessor.type === `def` }, value: { possessee, possessor }}) %}

l -> "(l" __ (stem | m) ")"  {% ([a, b, [value], c]) => ({ type: `def`, value }) %}

# the m- prefix can vary, dunno if this is the best way to represent that tho
m ->
  "(m"
    ("a" | "i" | "u")
    __ stem
  ")"  {% ([a, [vowel], b, value, c]) => ({ type: `m`, meta: { vowel }, value }) %}

# pp needs to be a thing because -c behaves funny in participles (fe3la and fe3ilt-/fe3lit-/fe3liit-),
# A is more likely to raise to /e:/ in fe3il participles,
# and a~i for the first vowel in fa3len participles
pp -> "(pp"
    __ ("m" | "f")
    __ ("active" | "passive")
    __ verb
    # ugliness coming up (basically to be able to handle both the null case and the not-null case the same way)
    (__ ("fa3len"  {% id %} | "fe3il"  {% id %}) {% ([a, b]) => b %}):?  # just as a hint for form-1 active participles
  ")"  {%
    ([a, b, [gender], c, [voice], d, verb, hint, f]) => (
      { type: `pp`, meta: { gender, voice, verb, hint }}
    )
  %}

# verb needs to be a thing because verb conjugations can differ wildly (7akyit/7ikyit vs 7akit vs 7ikit... rti7t vs rta7t, seme3ne vs etc)
verb ->
  "(verb"
    __ pronoun
    __ verb_form
    __ ("pst" | "ind" | "sbjv" | "imp")  # could do {% id %} on each one of these but [tam] works below
    __ consonant
    consonant
    consonant
    consonant:?
  ")"  {% ([a, b, conjugation, c, form, d, [tam], e, root1, root2, root3, root4, f]) => (
         { type: `verb`, meta: { form, tam, conjugation }, value: [root1, root2, root3, root4] }
       ) %}

stem -> 
    monosyllable  # don't need to {% id %} because it's already going to be [Object] instead of [[Object...]]
  | disyllable  {% id %}
  | trisyllable  {% id %}
  | initial_syllable medial_syllable:* last_three_syllables  {% ([a, b, c]) => [a, ...b, ...c] %}

monosyllable -> makeInitial[final_syllable]  {% ([syllable]) => ({ ...syllable, meta: { ...syllable.meta, stressed: true }}) %}

disyllable ->
    penult_stress_disyllable  {% id %}
  | final_stress_disyllable  {% id %}

penult_stress_disyllable ->
    initial_heavier_syllable final_lighter_syllable  {% ([b, c]) => [{ ...b, meta: { ...b.meta, stressed: true }}, c] %}
  | initial_syllable STRESSED final_syllable  {% ([b, _, c]) => [{ ...b, meta: { ...b.meta, stressed: true }}, c] %}
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
  | medial_syllable STRESSED medial_syllable final_unstressed_syllable  {% ([a, _, b, c]) => [{ ...a, meta: { ...a.meta, stressed: true }}, b, c] %}

unstressed_last_2 -> light_syllable final_lighter_syllable
stressed_penult ->
    heavier_syllable final_lighter_syllable  {% ([b, c]) => [{ ...b, meta: { ...b.meta, stressed: true }}, c] %}
  | medial_syllable STRESSED final_syllable  {% ([b, _, c]) => [{ ...b, meta: { ...b.meta, stressed: true }}, c] %}
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

final_light_syllable -> consonant final_light_rime  {% ([a, b]) => ({ type: `syllable`, meta: { weight: `light`, stressed: null }, value: [a, ...b] }) %}
final_heavy_syllable -> consonant final_heavy_rime  {% ([a, b]) => ({ type: `syllable`, meta: { weight: `heavy`, stressed: null }, value: [a, ...b] }) %}
final_stressed_syllable -> consonant final_stressed_rime  {% ([a, b]) => ({ type: `syllable`, meta: { weight: `special`, stressed: true }, value: [a, ...b] }) %}
final_superheavy_syllable -> consonant final_superheavy_rime  {% ([a, b]) => ({ type: `syllable`, meta: { weight: `superheavy`, stressed: null }, value: [a, ...b] }) %}

final_light_rime -> final_short_vowel
final_heavy_rime -> short_vowel consonant
final_stressed_rime -> (long_vowel  {% id %} | A  {% id %} | E  {% id %} | O  {% id %}) STRESSED
final_superheavy_rime ->
    superheavy_rime  {% id %}
  | PLURAL  # gets unpacked into "p", "l", "u", "r", "a", "l" if {% id %}
  | DUAL

light_syllable -> consonant light_rime  {% ([a, b]) => ({ type: `syllable`, meta: { weight: `light`, stressed: null }, value: [a, ...b] }) %}
heavy_syllable -> consonant heavy_rime  {% ([a, b]) => ({ type: `syllable`, meta: { weight: `heavy`, stressed: null }, value: [a, ...b] }) %}
superheavy_syllable -> consonant superheavy_rime  {% ([a, b]) => ({ type: `syllable`, meta: { weight: `superheavy`, stressed: null }, value: [a, ...b] }) %}

light_rime -> short_vowel
heavy_rime -> (long_vowel | short_vowel consonant) {% id %} # i guess the %id% is needed because the parens add an array level or something?
superheavy_rime ->
    long_vowel consonant
  | short_vowel consonant NO_SCHWA consonant
  | short_vowel consonant consonant
     {% ([a, b, c]) => (
      b === c ? [a, b, c] : [a, b, { type: `epenthetic`, meta: { priority: true }, value: `schwa` }, c]
    )%}
  | long_vowel consonant consonant # technically superduperheavy but no difference; found in maarktayn although that's spelled mArkc=
  | long_vowel consonant NO_SCHWA consonant # technically superduperheavy but no difference; found in maarktayn although that's spelled mArkc=

vowel -> (long_vowel | short_vowel)  {% ([[value]]) => value %}
final_short_vowel -> (A | I_TENSE | I_LAX | E | FEM)  {% ([[value]]) => ({ type: `vowel`, meta: { length: 1 }, value }) %}
short_vowel -> (A|I_TENSE|I_LAX|U|E|O)  {% ([[value]]) => ({ type: `vowel`, meta: { length: 1 }, value }) %}
long_vowel -> (AA|AA_LOWERED|AE|II|UU|EE|OO|AY|AW)  {% ([[value]]) => ({ type: `vowel`, meta: { length: 2 }, value }) %}

consonant -> (plain_consonant | emphatic_consonant)  {% ([[value]]) => value %}
emphatic_consonant -> plain_consonant EMPHATIC  {% ([{ value: value }]) => ({ type: `consonant`, meta: { emphatic: true }, value }) %}  # XXX: could be [value] not [{ value: [value] }] for more nesting idk
plain_consonant -> (2|3|B|D|F|G|GH|H|7|5|J|K|Q|L|M|N|P|R|S|SH|T|V|W|Y|Z|TH|DH)  {% ([[value]]) => ({ type: `consonant`, meta: { emphatic: false }, value }) %}

ST -> S T  {% () => [{ type: `consonant`, meta: { emphatic: false }, value: `s` }, { type: `consonant`, meta: { emphatic: false }, value: `t` }]%}

2 -> "2"  {% id %}  # loaned hamze
3 -> "3"  {% id %}
B -> "b"  {% id %}
D -> "d"  {% id %}
F -> "f"  {% id %}
G -> "g"  {% id %}
GH -> "9"  {% () => `gh` %}
H -> "h"  {% id %}
7 -> "7"  {% id %}
5 -> "5"  {% id %}
J -> "j"  {% id %}
K -> "k"  {% id %}
Q -> "q"  {% id %}  # etymological q
L -> "l"  {% id %}
M -> "m"  {% id %}
N -> "n"  {% id %}
P -> "p"  {% id %}
R -> "r"  {% id %}
S -> "s"  {% id %}
SH -> "x"  {% id %}
T -> "t"  {% id %}
V -> "v"  {% id %}
W -> "w"  {% id %}
Y -> "y"  {% id %}
Z -> "z"  {% id %}
TH -> "8"  {% () => `th` %} # looks like theta
DH -> "6"  {% () => `dh` %} # looks like eth
NULL -> "0"  {% () => `null` %}

# LL -> "L"  # the phoneme /ḷː/ in Allah and derived or related words

# XXX: should there be a way to indicate a short A that *isn't* generally deleted, like how most(?)
# people pronounce t`awIl as tawil instead of twil? Or should that be the duty of rule overrides on
# specific words...
A -> "a"  {% id %}
AA -> "A"  {% () => `alif` %}
AA_LOWERED -> "@"  {% () => `lowered alif` %}  # sh@y شاي
AE -> "&"  {% () => `ae` %} # n&n نان, f&d! فادي (versus fAdi, pronounced "fede" or with whatever the speaker's A and i# are)

I_TENSE -> "!"  {% () => `tense i` %}  # 2!d`Afc
I_LAX -> "i"  {% id %} # default value of kasra
II -> "I"  {% () => `long i` %}

U -> "u"  {% id %}
UU -> "U"  {% () => `long u` %}

E -> "e"  {% id %}  # word-final for *-a, like hYdIke
                   # also undecided whether to do e.g. hEdIk or hedIk (or even just hYdIk) هيديك
                   # also-also for loans like fetta فتا or elI إيلي
                   # also-also-also for 0<e<a when still in the medial stage, like for ppl who have ketIr كتير
                   # aaaand for stuff like mexYk or mexEke or whatever, + mexAn (when they're not something like mxYk and mxAn) 
EE -> "E"  {% () => `long e` %}  # for demonstratives and loanwords; hEda هيدا, motEr موتير

O -> "o"  {% id %} # for loans like motEr... also undecided whether to do e.g. hOnIk or honIk (or even just hWnIk) هونيك
OO -> "O"  {% () => `long o` %} # for demonstratives and loanwords; hOl(e) هول هولي, hOn(e) هون هوني, bant`alOn بنطلون, etc. 

AY -> "Y"  {% () => `ay` %}
AW -> "W"  {% () => `aw` %}

# fem suffix is its own thing bc -a vs -e vs -i variation
FEM -> "c"  {% () => `fem` %} # (pp d`Ar!bc) ضاربة
# dual suffix is its own thing bc -ayn/-een vs -aan variation (per Mekki 1984)
DUAL -> "="  {% () => `dual` %} # xa9lc= شغلتين
# plural suffix is its own thing bc -iin-l- vs -in-l- variation, or stuff like meshteryiin vs meshtriyyiin vs meshtriin
PLURAL -> "+"  {% () => `plural` %}  # (pp d`Ar!b+) ضاربين

NO_SCHWA -> "'"  {% () => ({ type: `epenthetic`, meta: { priority: false }, value: `schwa` }) %} # 3in'd عند, karaf's كرفس, and 2in't إنت -- the idea's that the schwa is still a thing there but the default pron is without it
EMPHATIC -> "`"  {% () => null %}  # goes after the emphatic letter i guess
STRESSED ->  "*"  {% () => `stressed` %}  # goes after the stressed vowel. only use this if the word's stress is not automatic

POSSESSIVE -> "-"  {% id %}  # for idafe pronouns
OBJECT -> "."  {% id %}  # for verbs and active participles
CLITIC -> ","  {% id %}  # usable before -l- and -x
ANYPRON -> ";"  {% id %}  # i guess this is usable after -l- and with prepositions...

verb_form ->
    "aa"  {% id %}
  | "ai"  {% id %}
  | "au"  {% id %}
  | "ia"  {% id %}
  | "ii"  {% id %}
  | "iu"  {% id %}
  | "fa33al"  {% id %}
  | "tfa33al"  {% id %}
  | "stfa33al"  {% id %}
  | "fe3al"  {% id %}
  | "tfe3al"  {% id %}
  | "stfe3al"  {% id %}
  | "nfa3al"  {% id %}
  | "fta3al"  {% id %}
  | "staf3al"  {% id %}
  | "stAf3al"  {% id %}  # for stafazz (not stfazz), sta2aal (not st2aal)
  | "f3all"  {% id %}
  | "fa3la2"  {% id %}
  | "tfa3la2" {% id %}
  | "stfa3la2" {% id %}  # probably only theoretically exists lol

pronoun ->
    "1ms"i  {% id %}  # -e according to loun
  | "1fs"i  {% id %}  # -i according to loun
  | "1ns"i  {% id %}  # the normal neutral one idk
  | "1np"i  {% id %}
  | "2ms"i  {% id %}
  | "2fs"i  {% id %}
  | "2ns"i  {% id %}  # maybe someday
  | "2mp"i  {% id %}  # -kVm in case it exists in some southern dialect
  | "2fp"i  {% id %}  # ditto but -kVn
  | "2np"i  {% id %}
  | "3ms"i  {% id %}
  | "3fs"i  {% id %}
  | "3mp"i  {% id %}  # ditto but -(h)Vm
  | "3fp"i  {% id %}  # ditto but -(h)Vn
  | "3np"i  {% id %}

augmentation ->
    "-"  {% () => `possessive` %}  # introduces idafe pronouns
  | "."  {% () => `object` %}  # introduces verbs and active participles
  | "|"  {% () => `dative` %}  # this stands for the dative L

NEGATIVE -> "X"

__ -> [\s]:+ {% () => null %}

# a good example of <e> and <*>: heXXa* for donkeys
