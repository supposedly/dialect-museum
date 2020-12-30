# type: syllable, meta: weight (0 = light, 10 = heavy, 20 = superheavy)
# type: epenthetic, meta: priority (+ = priority, - = antipriority)
# type: vowel, meta: length (short = short, long = long)
# type: consonant, meta: emphaticness (emphatic = emphatic, plain = plain)

word -> 
    MONOSYLLABLE  {% id %}
  | INITIAL_SYLLABLE MEDIAL_SYLLABLE:* FINAL_SYLLABLE  {% ([a, b, c]) => [a, ...b, c] %}

MONOSYLLABLE ->
    S T FINAL_SYLLABLE  {% ([s, t, value]) => ({ type: `syllable`, meta: value.meta, value: [s, t, ...value.value] }) %}
  | CONSONANT FINAL_SYLLABLE  {% ([c, value]) => ({ type: `syllable`, meta: value.meta, value: [c, ...value.value] }) %}
  | FINAL_SYLLABLE  {% id %}
INITIAL_SYLLABLE ->
    S T MEDIAL_SYLLABLE  {% ([s, t, value]) => ({ type: `syllable`, meta: value.meta, value: [s, t, ...value.value] }) %}
  | CONSONANT MEDIAL_SYLLABLE  {% ([c, value]) => ({ type: `syllable`, meta: value.meta, value: [c, ...value.value] }) %}
  | MEDIAL_SYLLABLE  {% id %}
MEDIAL_SYLLABLE ->
    LIGHT_SYLLABLE  {% id %}
  | HEAVY_SYLLABLE  {% id %}
  | SUPERHEAVY_SYLLABLE  {% id %}
FINAL_SYLLABLE ->
    FINAL_LIGHT_SYLLABLE  {% id %}
  | FINAL_HEAVY_SYLLABLE  {% id %}
  | FINAL_SPECIAL_SYLLABLE  {% id %}
  | FINAL_SUPERHEAVY_SYLLABLE  {% id %}

FINAL_LIGHT_SYLLABLE -> CONSONANT FINAL_LIGHT_RIME  {% ([a, b]) => ({ type: `syllable`, meta: 0, value: [a, ...b] }) %}
FINAL_HEAVY_SYLLABLE -> CONSONANT FINAL_HEAVY_RIME  {% ([a, b]) => ({ type: `syllable`, meta: 10, value: [a, ...b] }) %}
FINAL_SPECIAL_SYLLABLE -> CONSONANT FINAL_SPECIAL_RIME  {% ([a, b]) => ({ type: `syllable`, meta: 15, value: [a, ...b] }) %}
FINAL_SUPERHEAVY_SYLLABLE -> CONSONANT FINAL_SUPERHEAVY_RIME  {% ([a, b]) => ({ type: `syllable`, meta: 20, value: [a, ...b] }) %}

FINAL_LIGHT_RIME -> FINAL_SHORT_VOWEL
FINAL_HEAVY_RIME -> SHORT_VOWEL CONSONANT
FINAL_SPECIAL_RIME -> (LONG_VOWEL | A | E | O) STRESSED
FINAL_SUPERHEAVY_RIME -> SUPERHEAVY_RIME  {% id %}  # wanna keep original array without adding a nesting level

LIGHT_SYLLABLE -> CONSONANT LIGHT_RIME  {% ([a, b]) => ({ type: `syllable`, meta: 0, value: [a, ...b] }) %}
HEAVY_SYLLABLE -> CONSONANT HEAVY_RIME  {% ([a, b]) => ({ type: `syllable`, meta: 10, value: [a, ...b] }) %}
SUPERHEAVY_SYLLABLE -> CONSONANT SUPERHEAVY_RIME  {% ([a, b]) => ({ type: `syllable`, meta: 20, value: [a, ...b] }) %}

LIGHT_RIME -> SHORT_VOWEL
HEAVY_RIME -> (LONG_VOWEL | SHORT_VOWEL CONSONANT)  {% id %}  # i guess the %id% is needed because the parens add an array level or something?
SUPERHEAVY_RIME ->
    LONG_VOWEL CONSONANT
  | SHORT_VOWEL CONSONANT NO_SCHWA CONSONANT
  | SHORT_VOWEL CONSONANT CONSONANT
     {% ([a, b, c]) => (
      b === c ? [a, b, c] : [a, b, { type: `epenthetic`, meta: `+`, value: `schwa` }, c]
    )%}
  | LONG_VOWEL CONSONANT CONSONANT # technically superduperheavy but no difference; found in maarktayn although that's spelled mArkc=
  | LONG_VOWEL CONSONANT NO_SCHWA CONSONANT # technically superduperheavy but no difference; found in maarktayn although that's spelled mArkc=

VOWEL -> (LONG_VOWEL | SHORT_VOWEL)  {% ([[value]]) => value %}
FINAL_SHORT_VOWEL -> (A | I_TENSE | I_LAX | E | FEM)  {% ([[value]]) => ({ type: `vowel`, meta: `short`, value }) %}
SHORT_VOWEL -> (A|I_TENSE|I_LAX|U|E|O)  {% ([[value]]) => ({ type: `vowel`, meta: `short`, value }) %}
LONG_VOWEL -> (AA|AA_LOWERED|AE|II|UU|EE|OO|AY|AW)  {% ([[value]]) => ({ type: `vowel`, meta: `long`, value }) %}

CONSONANT -> (PLAIN_CONSONANT | EMPHATIC_CONSONANT)  {% ([[value]]) => value %}
EMPHATIC_CONSONANT -> PLAIN_CONSONANT EMPHATIC  {% ([{ value: [value] }]) => ({ type: `consonant`, meta: `emphatic`, value }) %}  # XXX: could be [value] not [{ value: [value] }] for more nesting idk
PLAIN_CONSONANT -> (2|3|B|D|F|G|GH|H|7|5|J|K|Q|L|M|N|P|R|S|SH|T|V|W|Y|Z|TH|DH)  {% ([[value]]) => ({ type: `consonant`, meta: `plain`, value }) %}

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

# LL -> "L"  # the phoneme /ḷː/ in Allah and derived or related words

# XXX: should there be a way to indicate a short A that *isn't* generally deleted, like how most(?)
# people pronounce t`awIl as tawil instead of twil? Or should that be the duty of rule overrides on
# specific words...
A -> "a"  {% id %}
AA -> "A"  {% () => `alif` %}
AA_LOWERED -> "@"  {% () => `lowered alif` %}  # sh@y شاي
AE -> "&"  {% () => `ae` %} # n&n نان, f&d! فادي (versus fAdi, pronounced "fede" or with whatever the speaker's A and i# are)

I_TENSE -> "!"  {% () => `tense i` %}  # 2!d`Afc
I_LAX -> "i"  # default value of kasra
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
