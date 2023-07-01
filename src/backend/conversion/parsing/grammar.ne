@{%
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
        symbol: symbol ?? value,
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
  const fromEnum = (fenum, prefix = ``) => ({
    match: new RegExp(enums.keys(fenum).map(k => `${prefix}:k`).join(`|`)),
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
%}

@lexer lexer
@preprocessor typescript

passage -> term ((
    __WS | __BOUNDARY {% id %}
  ) term {%
    ([[boundary], term]) => boundary ? [boundary, term] : [term]
  %}):* {% ([a, b]) => [a, ...b.flat()] %}

term ->
    expr {% id %}
  | literal {% id %}
  | idafe  {% id %}
  | l  {% id %}

# `bruh (\ -- ) what (\?)` gives `bruh -- what?` (aka whitespace only matters inside the literal)
literal ->
    "(\\" [^)]:+ ")"  {% ([ , value]) => _.obj($Type.literal, value.join('')) %}
  | "(\\)" ")"  {% () => _.obj($Type.literal, `)`) %}  # just in case

# TODO: multiple words i guess
idafe ->
  "(idafe"
    ctx_tags:?
    __ (expr | idafe)
    __ (expr | l | idafe)
  ")"  {%
    ([ , ctx ,, [possessee] ,, [possessor], d]) => _.obj(
      $Type.idafe, {}, { possessee, possessor }, ctx
    )
  %}

l -> "(l)"  {% () => _.obj($Type.l) %}

expr ->
    word  {% id %}
  | pp
  | verb
  | tif3il
  | af3al
  | number

# XXX TODO: this sucks
number ->
  "(" ctx_tags:? %number ("-":? {% ([c]) => Boolean(c) %}) ")" {%
    ([ , ctx , { value: quantity }, isConstruct ]) => _.obj($Type.number, { gender: null, isConstruct }, { gender: null, quantity: quantity.slice(1) /* getting rid of the # */ }, ctx)
  %}
  | "(" ctx_tags:? %genderedNumber %numberGender ("-":? {% ([c]) => Boolean(c) %}) ")" {%
    ([ , ctx , { value: quantity }, { value: gender }, isConstruct ]) => _.obj($Type.number, { gender, isConstruct }, { gender, quantity: quantity.slice(1) /* getting rid of the # */ }, ctx)
  %}

af3al -> "(af3al" filter_suffix:? ctx_tags:? __ root ")" {%
  ([ , suffix, ctx ,, root]) => _.obj(
    $Type.af3al,
    { root },
    {},
    {},
    ctx
  )
%}

tif3il -> "(tif3il"
    filter_suffix:?
    ctx_tags:?
    __ root
  ")" {%
  ([ , suffix, ctx ,, root]) => _.obj(
    $Type.tif3il,
    { root },
    {},
    {},
    ctx
  )
%}

# pp needs to be a thing because -c behaves funny in participles (fe3la and fe3ilt-/fe3lit-/fe3liit-),
# A is more likely to raise to /e:/ in fe3il participles,
# and the first vowel in fa3len participles is a~i
pp -> "(pp"
    ctx_tags:?
    __ suffixed_wazn
    __ voice
    __ pronoun
    __ root
  ")"  {%
    ([ , ctx ,, {wazn, suffix} ,, voice ,, subject ,, root]) => _.obj(
      $Type.pp,
      { root },
      {},
      { subject, voice, wazn },
      ctx
    )
  %}

# verb needs to be a thing because verb conjugations can differ wildly
# (7aky!t/7iky!t vs 7ak!t vs 7ik!t (and -at too)... rta7t vs rti7t, seme3kon vs sme3kon etc)
verb ->
  "(verb"
    ctx_tags:?
    __ wazn
    __ tam
    __ pronoun
    __ root
  ")"  {%
    ([ , ctx ,, wazn ,, tam ,, subject ,, root]) => _.obj(
      $Type.verb,
      { subject, tam, wazn },
      { root },
      ctx
    )
  %}

suffixed_wazn -> %openTag %wazn filter_suffix:? %closeTag {% ([, {value: wazn}, suffix]) => ({wazn, suffix}) %}
filter_suffix -> "_" suffix {% ([ , suffix]) => suffix %}

suffix ->
    FEM
  | AN
  | DUAL
  | PLURAL
  | FEM_PLURAL
  | AYN
  | FEM
  | FEM
  | IYY
  | JIYY

# TODO figure out a better way of including the augmentation?
# TODO since I'm not using stems, maybe remove them
# (what specifically happened was that i didn't look at this part of the grammar until i'd finished
# a lot of the rest of the backend, none of which i thought to use stems in, so i had to go back
# here and change `([value]) =>` to `([{ value }])) =>`
word ->
    segment:+ {%
      ([values]) => _.obj($Type.word, values)
    %}
  | "(ctx" ctx_tags __ word ")" {% ([ , ctx ,, word]) => ctx.map(word.ctx) %}

ctx_tags -> (__ %openCtx %ctxItem %closeCtx {% ([ ,, { value }]) => value %}):+ {%
  ([values]) => values
%}

segment -> (consonant {% id %} | vowel {% id %}) {% id %}

# the {value} here ISN'T the {value} from my own schema -- it's instead from moo,
# which provides us our own object as the {value} of its own lex-result object
vowel -> (long_vowel | short_vowel) NASAL:?  {% ([[value], nasal]) => (nasal ? _.edit(value, {features: {nasalized: true}}) : value) %}
short_vowel -> (%a | %iLax | %i | %uLax | %u | %e | %o)  {% ([[{ value }]]) => _.process(value) %}
long_vowel -> (%aa | %aaLowered | %ae | %ii | %uu | %ee | %oo | %ay | %aw)  {% ([[{ value }]]) => _.process(value) %}

root -> consonant consonant consonant consonant:?
consonant -> strong_consonant {% id %} | weak_consonant {% id %}
weak_consonant -> %openWeakConsonant strong_consonant %closeWeakConsonant  {%
  ([ , value]) => _.edit(value, { meta: { weak: true }})
%}
# ditto above re {value}
strong_consonant -> (
  %2 | %3 | %b | %d | %f | %g | %gh | %h | %7 | %5 | %j | %k | %q | %l | %m |
  %n | %p | %r | %s | %S | %sh | %t | %v | %z | %th | %dh | %w | %y | %nullConsonant
)  {% ([[{ value }]]) => _.process(value) %}

augmentation -> delimiter pronoun

# ditto
pronoun -> %openTag %pronoun %closeTag  {% ([ , { value }]) => _.obj($Type.pronoun, value) %}
tam -> %openTag %tam %closeTag  {% ([ , { value }]) => value %}
voice -> %openTag %voice %closeTag  {% ([ , { value }]) => value %}
wazn -> %openTag %wazn %closeTag  {% ([ , { value }]) => value %}

# ditto
delimiter ->
    %objectDelimiter {% processToken %}
  | %genitiveDelimiter {% processToken %}
  | %pseudoSubjectDelimiter {% processToken %}
  | %dativeDelimiter {% processToken %}

FEM -> %fem  {% processToken %}
DUAL -> %dual  {% processToken %}
PLURAL -> %plural  {% processToken %}
FEM_PLURAL -> %femPlural  {% processToken %}
AYN -> %ayn {% processToken %}
AN -> %an {% processToken %}
IYY -> %iyy {% processToken %}
JIYY -> %jiyy {% processToken %}
NEGATIVE -> %negative {% processToken %}
STRESSED -> %stressed  {% processToken %}
NASAL -> %nasal {% processToken %}
__ -> %ws  {% processToken %}
__WS -> %ws {% ([value]) => _.obj($Type.boundary, value) %}
__BOUNDARY -> %noBoundary  {% () => null %}

# a good example of <e> and <*>: hexxa* for donkeys (alternative form: hixx)
