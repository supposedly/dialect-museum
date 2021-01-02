# type: syllable, meta: weight (0 = light, 10 = heavy, 20 = superheavy)
# type: epenthetic, meta: priority (+ = priority, - = antipriority)
# type: vowel, meta: length (short = short, long = long)
# type: consonant, meta: emphaticness (emphatic = emphatic, plain = plain)

# zero clue why this needs the [value] to be unpacked one level, nearley is annoying
makeInitial[Syllable] ->
    ST $Syllable  {% ([st, [value]]) => ({ type: `syllable`, meta: value.meta, value: [...st, ...value.value] }) %}
  | consonant $Syllable  {% ([c, [value]]) => ({ type: `syllable`, meta: value.meta, value: [c, ...value.value] }) %}
  | $Syllable  {% ([[value]]) => value %}

word -> 
    monosyllable  {% id %}
  | disyllable  {% id %}
  | trisyllable {% id %}
  | initial_syllable medial_syllable:* last_three_syllables  {% ([a, b, c]) => [a, ...b, ...c] %}

monosyllable -> makeInitial[final_syllable]  {% ([syllable]) => ({ ...syllable, meta: { ...syllable.meta, stressed: true } }) %}

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
  | PLURAL  {% id %}
  | DUAL  {% id %}

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
      b === c ? [a, b, c] : [a, b, { type: `epenthetic`, meta: `+`, value: `schwa` }, c]
    )%}
  | long_vowel consonant consonant # technically superduperheavy but no difference; found in maarktayn although that's spelled mArkc=
  | long_vowel consonant NO_SCHWA consonant # technically superduperheavy but no difference; found in maarktayn although that's spelled mArkc=

vowel -> (long_vowel | short_vowel)  {% ([[value]]) => value %}
final_short_vowel -> (A | I_TENSE | I_LAX | E | FEM)  {% ([[value]]) => ({ type: `vowel`, meta: `short`, value }) %}
short_vowel -> (A|I_TENSE|I_LAX|U|E|O)  {% ([[value]]) => ({ type: `vowel`, meta: `short`, value }) %}
long_vowel -> (AA|AA_LOWERED|AE|II|UU|EE|OO|AY|AW)  {% ([[value]]) => ({ type: `vowel`, meta: `long`, value }) %}

consonant -> (plain_consonant | emphatic_consonant)  {% ([[value]]) => value %}
emphatic_consonant -> plain_consonant EMPHATIC  {% ([{ value: [value] }]) => ({ type: `consonant`, meta: `emphatic`, value }) %}  # XXX: could be [value] not [{ value: [value] }] for more nesting idk
plain_consonant -> (2|3|B|D|F|G|GH|H|7|5|J|K|Q|L|M|N|P|R|S|SH|T|V|W|Y|Z|TH|DH)  {% ([[value]]) => ({ type: `consonant`, meta: `plain`, value }) %}

ST -> S T  {% () => [{ type: `consonant`, meta: `plain`, value: `s` }, { type: `consonant`, meta: `plain`, value: `t` }]%}

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

NO_SCHWA -> "'"  {% () => ({ type: `epenthetic`, meta: `-`, value: `schwa` }) %} # 3in'd عند, karaf's كرفس, and 2in't إنت -- the idea's that the schwa is still a thing there but the default pron is without it
EMPHATIC -> "`"  {% id %}  # goes after the emphatic letter i guess
STRESSED ->  "*"  {% () => `stressed` %}  # goes after the stressed vowel. only use this if the word's stress is not automatic

POSSESSIVE -> "-"  {% id %}  # for idafe pronouns
OBJECT -> "."  {% id %}  # for verbs and active participles
CLITIC -> ","  {% id %}  # usable before -l- and -x
ANYPRON -> ";"  {% id %}  # i guess this is usable after -l- and with prepositions...

# a good example of <e> and <*>: heXXa* for donkeys
