/* eslint-disable max-len */
/*
I get it (update: nvm this is still missing something I'm just not sure what -- think about .dropIn()...)

There will be three stages of transform declarations
The first stage is just the input->output library that feeds the second stage, these are for convenience as you see fit but they don't ultimately
matter to the overall model

The second stage is transforms based only on the object itself: type, features, and context
You DO NOT complect the second stage with stuff from the environment
This way you can define eg your easy pronoun categories in the second stage, split them up by type (prefix suffix enclitic standalone etc etc etc)
And again the second stage can use functions defined in the library for convenience
idk if this stuff terminates on another second-stage key or on eg a library function... no that doesn't make sense, it has to terminate on another second-stage key

Finally the third stage takes transforms defined in the second stage and puts them in context with different environments
There will be a library of environments too so you don't have to write everything from scratch, I'm thinking this library should be defined as close
to the third stage as possible so you can see it easily instead of my original idea of defining it way back in the call to alphabet(), I think
features/context/traits are good enough
The third stage should also define probabilities I think, I'll have to see how to integrate this with the second stage (maybe cross bridge when get to it)

Lastly, on file structure: I think ultimately there should be a function like alphabet() for each part of this
Namely, a library() 'constructor' should exist separately from alphabet.modify() and alphabet.promote()
You should be able to define a library in one file then import it into multiple other files for different accents' second stages?
I think that's how it could work?
And the third stage will be methods of language(), like how alphabet().modify() and alphabet().promote() are defined

The ultimate goal is probably to have each accent constrained to its own folder although idk how imports for deriving from these stages will work 100% yet
That's okay -- work on getting this up to scratch
Man
*/

/*
Okay some other thought processes I had:

- Remember, in the end, I want to be able to pull up Salam el Rassi's file and just say "q: 100% of the time" vs mine being "q: 0% of the time"
- Second-stage changes maybe actually do need the environment? Maybe that's not such a big deal
- Third-stage changes could be specified as arrays of subsets of second-stage changes: second stage can specify eg the first component and the "e" component of
  pronouns (like {for: [features.person.third]} but at what point do you also add {where: [environment.standalone]}?)

- Oh wait you can handle epenthesis by having maybe a separate pass over rules that target null but have an environment, that's actually not hard at all lmfao
  you just have to do some pro gamer nutshell 6.0 nbhd math to reverse the environment (assuming it's defined in terms of next/prev/nextFoo/prevFoo)

- Anyway the third stage can operate on environments that extend that one, {for: [features.person.third, match.any([features.gender.feminine, features.gender.masculine])]}
- What does this actually look like?

category.modify.pronoun(x => ({
  standalone: {
    
  }
}))
*/



/*
ok wait
nix the current second stage, replace it with the current third stage
the third stage defines shit like
language.idk.pronoun(`standalone`, {
  3p: {
    for: [features.person.third],
    targets: {
      hvx: [h, derive vowel somehow idk, derive c/v somehow idk],
      _e: {right: [e]},
    }
  }
});
language.idk.verb({
  nfa3al: {
    for: [features.shape.nfa3al],
    targets: {
      base: 
    }
  }
});

grr nvm idgi

but insights from tonight:
- modify rules shouldn't exist, they should be handled by defining "terminates in" on promote (aka normal) rules
- you can have transforms be unordered in some middle stage then the final stage can be like

pronoun: { // pretend this is just standalone
  rules: [
    {hvx: 1},
    {_e: 0.5},
  ],
},
verb: {
  rules: [  // pretend this is just nfa3al
    {rule: lib.n, odds: 1},
  ],
  become: [features.shape.fa3al],
]

man

also consider for example prefixes being
capture(i, {where: {env: {next: x({consonant: features.emphatic(true)})}, was: {underlying: {type: `pronoun`, env: {next: `verb`}}}}})  // this rounds
vs
capture(i, {where: {env: {nextVowel: a, next: x({consonant: features.emphatic(true)})}, was: {underlying: {type: `pronoun`, env: {next: `verb`}}}}})  // this doesn't always round

also should become:/"terminates in" actually be the final element of the array? then you can give it probabilities that are synced with stuff
in the array or something idk man idgi
man
*/


/*
const base3s = whatever.pronoun(features => [
  {
    for: [features.gender.feminine, features.person.third, features.number.singular],
    to: {
      hiy: [lib.hvx(`i`)],
    }
  },
  {
    for: [features.gender.masculine, features.person.third, features.number.singular],
    to: {
      hiy: [lib.hvx(`u`)],
    }
  },
  {
    for: [features.gender.feminine, features.person.third, features.number.singular],
    to: {
      hiy: [lib.hvx(`u`)],
    }
  },
  {
    for: [features.gender.feminine, features.person.second, features.number.singular],
    to: {
      $inti: [lib.$int, letters.vowel.i]
    }
  },
]));

const finalVowel = whatever.pronoun(features => ({
  e: {
    for: [features.person.third],
    to: 
  },
  a: {
    for: [features.person.second, features.gender.masculine],
    apply: [{rule: lib._a}]   // probability???????????????
  }
}))
*/

// new insights:
// "rule packs" (presets) define rules, then you can refer to those presets instead of writing whole new rules each time
// see below for syntax tests with extending environments, grouping rules (very very important!! bc then you can order groups and the technique of
// assigning each one to a variable avoids nesting-hell, you just export an array of all these vars with the required ordering(s) omg) 
// the reason "rule packs" (presets) exist is not just to "define rules" but specifically to define rules that generalize over more than one variety
// so for example you can refer to an rule pack's "debuccalize Q" rule in two different rule defs rather than writing ostensibly unrelated rules
// and duplicating stuff
// rule packs also expose objects the frontend can use to inject probabilities and like configuration
// liiiiike when you call an rule-pack rule it'll inject the probabilities you pass the rule func into that exposed object two-wayly or something idk
// rule packs are defined independently of alphabets but when you make one you set it up with (1) a source alphabet, (2) a destination alphabet, (3) dependencies aka ABCHistory

// also when you make a language like const bruv = language([templated, underlying, etc])
// you're passing language() an array of objects that contain EVERYTHING
// each one is not just the alphabet but also its rule packs (especially the object they expose for the frontend) and rules

// lastly for defining rules themselves within rule packs (and also in the next stage for anything the rule pack doesn't cover) i'm replacing
// the {left, right, self} thingy with functions preject(), inject(), postject()!! (etymologically sound weirdly enough lol)
// i think a good metric to minimize is number of curly braces u have to write lol
// so fta3al will be [fa3al(root), inject(1, letters.consonant.t)] i think
// (man rip the problem with inject is i think it'll run into the autocomplete bug)
// and nfa3al will be [preject(letters.consonant.n), fa3al(root)]
// i just realized i probably don't want to use become there?
// like not [preject(letters.consonant.n), {become: features.shape.fa3al}]
// because that's going to affect its {was: ...} shape in future layers?? i think???
// ok but that's stupid lmao if that turns out to be a problem i'll just add a new type of transformation {mock: features.shape.fa3al}
// bc handling special cases redundantly is gonna be so annoying
// right????

/*
{at: 1, inject: letters.consonant.t}
inject(1,letters.consonant.t)
// these are in a file called like underlying/pronoun/prefix.ts or whatever

const bruh = odds.mutuallyExclusiveOrWhateverItShouldBeCalledIdkIGotA2.8InStats();
const beforeA = language.underlying.whatever.pronoun.extend(
  {env: {nextVowel: a}},
  ({prefix}, addSetting) => [
    prefix.sg1.a(25%);
    prefix.sg1.i(75%);
    addSetting(prefix.sg1, `idk exactly how this works lmao but it's needed bc the frontend has to be able to expose this new rule as a setting`);
  ]
);
  
// notice how the ({prefix}) param is self-documenting, I thought that was really neat
const firstPerson = language.underlying.whatever.pronoun(({prefix}) => [
  prefix.sg1.i(),
  prefix.pl1.ni(),
]);,

// prefix.msg2.ti(),
// prefix.fsg2.ti(),
// ^nvm nah the rule pack wouldn't define separate m/f s/p prefixes

const secondPerson = language.underlying.whatever.pronoun(({prefix}) => [
  prefix.__2.ti(),
]);

// new file called /.../standalone.ts
const thirdPerson = language.underlying.whatever.pronoun(({standalone}) => [
  standalone.__3.hvx(),  // remains to be seen if this is implementable + if you can ergonomically select only a few hvx's if need be lol
  // i mean like just standalone.__3.hvx.hin() or something idk lol
]);

// question 1: which of these designs is correct?
//   a) rule pack defines hvx() and _e()
//   b) rule pack defines hvx() and hvxxe()
//   c) rule pack defines only hvx() and you write your own postject(letters.vowel.e) rule
//   i think only (b) and (c) are arguably correct, (a)'s _e() function is a holdover from the "agnostic lib" idea
//   and then ok between them i guess (b) is arguablier correct because the goal of the rule pack is to provide precomposed rules right
//   i guess within the rule pack's own definition you can have it compose hvxxe() out of its own lib.hvx() and lib.e() funcs :eyes:
//
// question 2: what do you do if only some 3rd-person pronouns have -e?
//   this is slightly easier to answer having decided on (b) than it would've been with (a) or (c) (the two are equivalent) lol
//   but still
//   is it like
//   const thirdPersonSingular = language.etc.pronoun.constrain(
//     features => ({spec: features.number.singular}),
//     ({standalone}) => [
//       standalone.__3.hvx(),
//     ]
//   );
//   const thirdPersonPlural = language.etc.pronoun(({standalone}) => [
//     standalone.__3.hvxxe(),
//   ]);
//
//   i mean that WORKS as long as you make sure to order thirdPersonSingular before thirdPersonPlural but is it too cumbersome? (fr is it?)
//   what about
//   const thirdPerson = language.etc.pronoun(({standalone}) => [
//     standalone.__3.hvx.huw(),
//     standalone.__3.hvx.hiy(),
//     standalone.__3.hvxxe.hinne(),
//   ]);

(later addition just to test the aesthetic)
//   const thirdPerson = language.etc.pronoun(({standalone}) => [
//     standalone.__3.hvx.ms.huw(),
//     standalone.__3.hvx.fs.hiy(),
//     standalone.__3.hvxxe.pl.hinne(),
//   ]);
(end later addition)

//   ^ (referring to pre later addition)
//   is that implementable?? and/or is it correct?? man idk lol
//   oh or uh do you maybe want standalone.__3.hvx() and standalone.__3.hvxxe() to be a thing but then to also
//   manually implement standalone.msg3.huw(), standalone.msg3.huwwe(), standalone.fsg3.hiy(), standalone.pl3.hinne(), etc...
//   that seems like a bad idea lol
//   ALSO WAIT WOT is hvx() even possible considering we want to also account for humme lects lmao
//   how about we settle for standalone.sg3.hvx(), standalone.sg3.hvxxe(), but then standalone.fpl3.hinne(), standalone.pl3.hinne(), standalone.pl3.humme(), standalone.mpl3.humme()
//   along with hinnen and the hvx variants of all those
//   that sounds... bad but not bad in the same intractable way as stuff was bad before today
//   like honestly it kinda sounds ok lmao i guess i'm mostly fine with it at least for now
//   so final verdict:

const thirdPerson = language.etc.pronoun(({standalone}) => [
  standalone.pl3.genderNeutral(),  // i think this makes sense to have here even tho it'll be a `become`-only rule
  standalone.pl3.hinne(),
  standalone.sg3.hvx(),
])

//   and then if you need to go more granular on that .sg3.hvx() you can jank it together with a .constrain() thing idk lol figure it out

(does .sg3.hvx.f.hiy() work? or maybe actually just .sg3.hvx.f() because it's already hvx? not sure)
(i still haven't figured out what exactly hvx is loool)
(i think the answer has to do with what eg fa3al is too because fa3al should encompass all fa3al-shaped conjs, weak geminate etc)
(maybe you can do .fa3al() for the default for all of those, but also alternatively specify .fa3al.weak() .fa3al.sound() .fa3al.geminate()
and uhh .fa3al.weak.defective() etc? if you want to select only some options to treat the rest differently??)

// how about verbs? /.../verb.ts

const bruv = odds.idkMan();
const triliteralBasic = language.whatever.verb((shape) => [
  shape.fa3al(),  // is that it????? what about weak/geminate (i mean it's not like those have options anyway right...)
  shape.staf3al.affected.a(bruv(0.25)),  
  shape.staf3al.affected.null(bruv.rest()),
  shape.staf3al
]);


// or maybe it's

const triliteralBasic = language.whatever.verb(({past}) => [
  past.fa3al.fa3al(),  // is that it????? what about weak/geminate (i mean it's not like those have options anyway right...)
  past.staf3al.affected.a(bruv(0.25)),  
  past.staf3al.affected.null(bruv.rest()),
  past.staf3al
]);

// AAAAAAAA idk this is close but not quite there

// anyway what does defining rule packs look like

// .../prefix.ts
const prefix = rulePack(templated, underlying, {spec: `pronoun`, env: {next: `verb`}});

const sg1 = prefix({
  a: [letters.consonant.$, letters.vowel.a],
  i: [letters.consonant.$, letters.vowel.i],
});

const pl1 = prefix({
  ni: [letters.consonant.n, letters.vowel.i]
});

const __2 = prefix([letters.consonant.t, letters.vowel.i]);  // maybe lib.ci(letters.consonant.t)? and for the others lib.ci(letters.consonant.$) and stuff?

const __3 = prefix([letters.consonant.y, letters.vowel.i]);
const fsg3 = prefix([letters.consonant.t, letters.vowel.i]);  // and remember, it's fine/good to restrict this to fsg because that's what the rule pack is for!!

export {sg1, pl1, __2, __3, fsg3};  // i think


// .../standalone.ts
const standalone = rulePack(templated, underlying, {spec: `pronoun`, env: {prev: `boundary`, next: `boundary`}});

cosnt sg3 = standalone({
  hvx: ({gender}) => gender === `masculine` ?? ... // NO
  hvxxe: 
})

const sg3 = standalone.hmmmmm

// before i forget i think the solution to hvx was to make it itself the variable, like const hvx = whatever({hiy: ..., huw: ...})? or some other way to make it
// handle everything
// then its function call would be defined to run all the rules under it
// i just have to figure out the right syntax for all this
// also uhhhhh my rulePack concepts are slightly scuffed rn
// as far as i remember what's in an rulePack should just be a bunch of rules
// like normal from:, to:, where: rules (or for: into: whatever)
// idk about defining the spec/env in the original rulePack() call lol i feel like it should be a drop-in
// BUT WHO KNOWSSS maybe this is actually right we'll see 👍👍👍
// man
*/

/*
// new rulePack stuff
// also i remembered the standalone pronominal endings tend to coordinate with verb conjs like hintni ktabtni but i don't think
// that means you need to stop separating standalone and suffix
// oof but also maybe standalone can have .base (for hvx, hint, 2int, etc) and .ending??? (for -e, -a, -ti, -ni, etc)
// i honestly hate that but also it kind of sounds better than manually defining all the crazy variants... man

const thirdPerson = language.etc.pronoun(({standalone}) => [
  standalone.pl3.genderNeutral(),  // i think this makes sense to have here even tho it'll be a `become`-only rule
  standalone.pl3.hinne(),
  standalone.msg3.huw(),
  standalone.fsg3.hiy(),
])

-------

(category) rulepack = {
  pronoun: {
    standalone: {
      pl3: {
        (idk: {hinne: ..., humme: ...}) => {...},  // not sure if good idea, it's either this or the odds() thing
        hin() {...},
        hum() {...},
        hinne() {...},
        hinnin() {...},
        humme() {...},
        ending: {
          e() {...}
        }
      },
      mpl3: {
        hum() {...},
        humme() {...},
        hinno() {...},
        hinnun() {...},
        base: {
          hin() {...},
        },
        ending: {
          e() {...},
          o() {...},
          un() {...},
        }
      },
      fpl3: {
        hin() {...},
        hinne() {...},
        hinnin() {...},
        ending: {
          ne() {...},
        }
      },
      msg3: {
        huu() {...},
        huwwe() {...},
        ending: {
          we() {...},
          te() {...},
        }
      },
      fsg3: {
        hii() {...},
        hiyye() {...},
        ending: {
          ye() {...},
          te() {...},
        }
      }
    }
  },
  verb: {
    fa3al: {
      sound() {...}
      geminate() {...},
      assimilated: {...},
      hamzated() {...},
      hollow() {...},
      defective: {
        a() {...},
        y() {...},
      },
    },
    base$u: etc,
    base$i: etc,
    base$a: etc,
    fa33al: {
      normal() {...},
      defective() {...},
    },
    tfa33al() {
      return [
        preject(t),
        mock(features.shape.fa33al),
      ];
    },
    // ...
    nfa3al: {
      return [
        preject(n),
        mock(features.shape.fa3al),
      ]
    },
    nfa3il: {
      nfi3il() {
        return [
          preject(n),
          mock(features.shape.fi3il)
        ]
      }
      nfa3il() {
        return [
          preject(n),
          // ugh u probably have to do everything from scratch lol
          // it's ok price u pay :)
        ]
      }
    }
  }
}

// ALL thingies of a rule pack will have a .default() option added by uhhhh by default
// calling .default() will just copy over all the rules that only have one variant


// also other ideas
consonant.q.debuccalized()
vowel.e.lowered()  // can constrain() this to pronouns etc
vowel.final.lengthened()
vowel.alif.raised()
*/
