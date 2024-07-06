# Dialect museum

> [!CAUTION]  
> This project requires a TypeScript version no newer than 5.3.3.

<sup>(Current status: see [verb-conjugation debugger](https://orthography-walkthrough-theta.vercel.app/), [demo video](https://www.youtube.com/watch?v=gwm67_UTD0k), and README)</sup>

First things first: this project is **on hiatus** until I get a job :) In its current state it's also incomplete in that (1) there's no UI yet and (2)
there are still a couple breaking bugs left to resolve, but I'm going to save my energy for now because what it's really hankering
for is a full, ground-up redesign.

My estimate's that it's 4&ndash;6 months away from reaching the point where it works and is presentable (read: my estimate is 4 and reality will probably hit me with 6), but its actual
finish date depends on when I can start those 4&ndash;6 months and whether I have enough work time to ensure they
go forth and do not multiply. This README documents the current state of things!

## What is this?

The short answer: I set out to make a tool to help you explore the unique features of different
dialects of Lebanese Arabic, which is helpful for learners and for native speakers who are curious about that heritage.
Along the way, the project turned into a way-more-general tool that can be used to give that treatment to any language at all.

What this will eventually be:
- A website that displays a map with dots on it.
- The map is an atlas of different dialects of the language you're exploring.
  The dots represent the locations of different speaker communities, e.g. different
  cities or settlements.
- You click on one of those dots. To the side of the map, a text will appear, ideally
  a story originally recorded in that community's dialect. It'll be transcribed in
  some standard writing system at first.
- You can then click on any one of the other dots to see how the text might be read by
  someone from those other communities.
- Lastly, you can also change the writing system used to display the text, e.g. by swapping
  it out for a different alphabet or transcription system.

There are a lot of dimensions that language varieties can vary in, like the sentence structures they use, their sound systems,
the way they change words for different grammatical reasons, and their vocabulary. This project is good at two of those,
plus an unexpected challenger for good measure, and these are the things you'll be able to explore by clicking
around on the map:

1. it's mostly about sounds, aka phonology and phonetics,
2. it also allows you to represent morphology, the way words change for grammatical purposes (e.g. verb conjugations),
3. and it even lets you explore different writing systems using the exact same tools.

This mostly stems from a desire to give dictionaries a run for their money. Historically, dictionaries haven't documented
much more than a couple standard or standard-ish accents of whatever language they're for, and I'd bet it's because manually
punching in all of the different pronunciation variants you can think of is really time-consuming and super msitake-prone.
But what if we could outsource it to a computer instead?

- **Step 1.** Grab a computer.
- **Step 2.** Devise a magic representation of our language that encodes **every** variety in one go. That way we don't have to type a bunch of different ones out ourselves.
- **Step 3.** Devise rules we can apply to transform said magic representation into any variety we want.
- **Step 4.** Make the computer do that for us.

In broad strokes, steps 2 and 3 are the idea behind [comparative reconstruction](https://en.wikipedia.org/wiki/Comparative_method).
Language change tends to be regular enough that, for any 2+ language varieties that used to be one single language in the past,
you can often suss out the changes they each must've undergone to get to where they are. Rewinding these changes gets you the magic from
step 2, and you can unrewind them as in step 3 to get from there to any variety you want to check out.

<details>
<summary><b>But you can take shortcuts!</b></summary>
The fun part is that corners can be cut here! You don't have to replay diachronic changes
step-by-step if you don't need to be 100% faithful to the exact chronology in order to produce the same
synchronic result. For example, these are four steps that likely happened on the way to my dialect of Lebanese Arabic:

1. The historic sound /r/ gains [emphasis](https://en.wikipedia.org/wiki/Emphatic_consonant) by default, becoming
   phonemically ṛ (meaning /rˤ/). This did not take place following a short *i* or long *ī*, where the sound remained /r/.
   This affected and was evidenced by the behavior of the feminine suffix, which in Levantine Arabic dialects is
   characterized by varying between a high vowel like *-e* and a low one like *-a* depending on the preceding sound's
   emphasis: "tree" would've been _\*šaǧaṛa_, "gums" would've been _\*nīre_, "she thinks" would've been _\*m(V)fakkire_,
   "she's decided" would've been _\*m(V)qaṛṛire_.
2. Short, unstressed high vowels syncopate in open syllables, although not between two consonants with identical PoA.
   We now get _\*mfakkre_, _\*mqarrire_, still attested in some more-southern Levantine varieties.
3. *r* regains its emphasis in places where it's no longer after an *i*, giving  _\*mfakkṛa_, _\*mqaṛṛire_.
4. This analogically carries over to all participles (those two words are participles), even when the *i* actually never
   dropped out:  _\*mfakkṛa_, _\*mqaṛṛiṛa_! The current forms in my dialect are *mfakkra*, *mʔarira*.

When it comes to reaching the two forms *mfakkra*, *mʔarira* from original _\*mufakkira_, _\*muqarrira_ (these are
reconstructions for before step 1), I have two options:
1. I could replay all of those changes one by one.
2. Or I could ignore history and keep only step 1, where *r* becomes *ṛ* by default across the board. To get to step 4 directly from here,
   we can say that in my dialect and dialects like mine, it becomes *ṛ* even if it is after a short *i*.

While it's absolutely possible (and absolutely really cool) to use this project to model historical sound changes, that's not a
must if your real concern is to document a language's varieties as they exist today. You can instead focus on devising a model that's
easy to represent within the constraints of this framework as long as it achieves the correct end result.
</details>

### History and prior art
One way to conceive of this project is as a kind of [sound change applier](https://linguifex.com/wiki/Guide:Conlanging_tools#Sound_change_appliers).
It spent a long time not knowing it was one, but I think any kind of linguistics-y tool that tries to transform things into other things
will carcinize soon enough into an advanced, featural SCA. Personally, I was really surprised to do a proper review of the SCA toolspace and find how
much depth people have put into these things, and a couple particular giants I think I should pay respects to are [Phonix](https://gitlab.com/jaspax/phonix)
and [Lexurgy](https://www.meamoria.com/lexurgy/html/sc-tutorial.html). You'll notice lots of convergences between their design and what's below!

### Why are there like 600 commits?
Between school and the horrors of life, it took me a long time to hit on a workable design for this project. The current architecture
is the result of two months of thinking and coding and thinking and coding, but it's built atop a good couple years of intermittently
messing around and crash-landing. Glad to finally be here!

## What's in a language

Not much, what's in a language with you?

There are three parts to defining a language with this thing. You have to get your **alphabets** in order, then you have to write **rule packs**, and finally
you can build off of those into specific **profiles** of individual speakers of a dialect.

Let me go over what each of those things are. If you want to try and go from there to get this thing working for your own language, my present advice is **don't.**

### How to add your own language

Don't.

> [!IMPORTANT]  
> Don't!

The beast just isn't ready yet in its current state, like I said at the top of this README. This is the very first draft of a working design, and
because it's a first draft there are a lot of pain points you'll run into. I'll go into more detail below, but the main ones are that the type system
randomly breaks in at least two (fortunately avoidable) cases and is weirdly slow in at least one other (`(un-) × (fortunately avoidable)`) case, and the
part where you actually define your language is (1) kind of disappointingly inflexible, so you have to copy/paste your entire setup to create another one
with minor variations, and (2) missing some big quality-of-life features that make working with it a little bit demotivating. See tracking issues
[#6](https://github.com/supposedly/dialect-museum/issues/6) and [#7](https://github.com/supposedly/dialect-museum/issues/7).

### How to add your own language if you really, really want to and also want to file a boatload of bug reports

<!-- CC0 :) -->
![Picture of a bug, namely a weevil, that's captioned "FEATURE"](https://user-images.githubusercontent.com/32081933/281660206-60f819eb-3dbf-4adc-9250-452a5af6c262.png)

Promise? In that case, you should fork this repository and follow the instructions below to add your language to the `src/languages` folder.

## Under-the-hood documentation

This project is written in [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html). It uses TypeScript's type system
to make sure, as much as possible, that you're writing exactly what you mean to write. The instructions below are mostly tailored to the editor
[Visual Studio Code](https://code.visualstudio.com/), but if you're comfortable enough with programming that you're set on using another IDE or editor,
I'll be assuming that that means you're comfortable translating any VSCodeisms (e.g. `Ctrl+.` for autocomplete) into their equivalents in your own toolchain.

One ideal for this project is for it not to require you to know any programming beyond what's required for it itself -- a **domain-specific-language**
sort of walled garden. As of writing, though, it does not achieve that goal :( That means the documentation below also assumes programming knowledge for now.

### Overarching model

This project works by taking **input** and applying **transformation rules** to it, over and over again, until it's been transformed into something
that no rules can apply to anymore. Your one big job is to write those rules.

Each rule itself takes in an input and defines what output it needs to turn into. For example, a simple rule might be one that turns `z` into `gl`
and `ee` into `or`. Feeding the input `zeep` into these rules will give you the transformations: `zeep` -> `gleep` -> `glorp`.

Nice and simple. But language is complicated, and it's really hard to model complex things using raw text and simple substitution-y transformations
like those. To approach complexity, our rules are going to need to be able to make their decision based on a lot of other factors. For example:

1. *What's the current value of our input?* &mdash; This is what our two `z` -> `gl` and `ee` -> `or` rules are based on: they take
   an input with the value `z` or `ee` and transform it into something else based on that info alone.
2. *What other stuff is **around** our input?* &mdash; This is called its "environment".
3. Our input is probably the product of other rules that have applied in the past. *What did it used to look like?*
4. Lastly, and this is the toughest one to reason about: *what will our input's environment look like **in the future**, after other rules have run?*
   - This info isn't needed for every rule. I've found two solid usecases for it so far, one hacky and one actually valid. The valid one is when
     you need to write a rule with **directionality**, i.e. one that applies iteratively from right to left or left to right, which I'll sell you more
     on below.
   - As it happens, this feature is also broken in the project's current implementation! That means that iterative stress rules are impossible to write
     efficiently for now &mdash; you have to duplicate the environment of, like, the entire word for every single stress location. Again, more later.

This is a screenshot of this project's visual debugger to help you (and me, I'm not gonna lie) understand how the actual process of transforming inputs into outputs works
under the hood.

![Graph of nodes with different colors. On the top is a group of three nodes, each of which is linked to each of its two neighbors by an arrow. This group is connected to another group of the same sort, except this one has a lot more nodes branching out from the original middle one. Lastly, this second group connects to an even-larger third group. Going forward, these groups will be called "stages".](https://user-images.githubusercontent.com/32081933/281906398-229ec8cf-65c6-4f15-8b62-39eaccaa72c8.png)

The input here is the middle node at the very top, which is an object of type "verb". That means that any rules that operate on verbs will apply to it. Internally, `verb` nodes also store some important info about themselves: the subject they conjugate for, their
[TAM](https://en.wikipedia.org/wiki/TAM) combo (tense, aspect, and mood), and their [root](https://en.wikipedia.org/wiki/Semitic_root) and [measure](https://en.wiktionary.org/wiki/Appendix:Arabic_verbs#Derived_stems). For this verb here, that's:

- **Subject:** They (third-person plural)
- **TAM:** Past
- **Root:** `K-T-B`
- **Measure:** `CaCaC`

The rule system's job is to conjugate this verb into its form in my dialect, `katabo`, by turning it into a bunch of nodes that each store one of those sounds (a node for `k`, one for `a`, etc). With the model I chose for Levantine Arabic specifically, a simplified
rundown of the way my rules go about that is:

1. First, generate the verb's stem. Because it's a `CaCaC` verb with the root `K-T-B`, its past-tense stem is `katab`.
2. Then, pop out an attached pronoun on each side of that stem. These nodes will literally be of type `pronoun` and match the subject of the verb, so they won't yet store any
   information about how they're actually pronounced.
3. Transform those pronouns into the appropriate conjugation prefix and suffix. Past-tense verbs don't have prefixes in Arabic, but the other pronoun will turn into `uu`
   because that's the best underlying form we can devise for the third-person plural's suffix conjugation.
4. Finally, perform all the necessary sound shifts in whatever dialect all these rules belong to. In my case, we just need to shorten and lax the final vowel: `uu` -> `u` -> `o`.

Every single time one of these changes applies, it leaves its mark on history. That's what the vertical dimension is for: whenever a rule applies to a node,
it pops its result out as a child node and stops being available to have rules run on it &mdash; that's its child's job now.

Notice how the nodes are organized into distinct rows (connected by red and green arrows)? Here's how applying the rules works with that in mind:

1. Find the bottommost row of nodes. Let's call this the "leading" row. Load up the first node in it.
2. Have it check **all** the rules that could apply to it, one by one, until one finds that this node is an actual match (i.e. the node's value and environment and everything
   else match what the rule is looking for). Then run that rule on the node's value and eject its output into a new row below. If no rule matches, though,
   continue to step 3 without doing anything.
3. Discard this node and load up the very next one, i.e. the one right after ours. Repeat step 2 on it.
4. When you've finished checking all the nodes in the row, all of the outputs you ejected will join together to form a new leading row below. Jump to the first node in this new row and repeat step 1.
5. When no more changes can be made (i.e. no more new nodes created from running all the rules), you're done.

There's one last catch: rules are organized into **stages**. Different stages have different types of nodes associated with them, color-coded respectively
on the graph above, and accordingly they have their own groups of rules that deal in those specific types of nodes. Rules have the option to
either eject children within the same stage or to jump ahead to the next stage, so what you really have to do when you start step 1 above is find the leading
row **for each stage** and run that stage's rules starting from there.

For Levantine Arabic, my model has four stages:

1. **Word templates**. This stage encodes morphology, namely part of speech and word form, as best it can. I have a morphology
   stage for two reasons: first, different varieties of the language differ as predictably in their morphology (e.g. verb
   conjugations, participle forms, stuff like that) as they do in their phonology, and second, there are certain sound-change
   rules that only apply in certain word classes, so it'll be useful in later stages to be able to check if some node `was` a
   verb/participle/what-have-you. All node types:
     - **Verb.** Stores root, TAM, subject, and measure.
     - **Participle.** Same!
     - **Masdar,** the Arabic name for verbal nouns/gerunds. Stores root and measure.
     - **'Special' word class,** which covers some of those classes that have specific sound shifts apply to them. The ones
       I've chosen to handle are elatives, CaCāCīC and CaCāCiC words, and CaCaCe and maCCaCe nouns where the -e is the feminine
       suffix.
     - **Affix**, **pronoun**, and **morpheme boundary**, for which see below.
2. **'Underlying' sounds and morphemes**. The "sounds" aren't too important here, but they're just consonants and vowels in some
   reconstructed form that can later be used to generate different dialects' sound systems. The morphemes are really the important
   part, and the full list of those is:
     - **Affix**, namely suffixes (like the feminine suffix or the [nisba](http://allthearabicyouneverlearnedthefirsttimearound.com/p1/p1-ch3/the-nisba-adjective/) suffix) and the b- prefix used on indicative verbs. These often are the subject or
     catalyst of morpheme-specific sound shifts &mdash; for example, that b- prefix becomes m- before the first-person-plural
     prefix n- in many Levantine varieties (e.g. mnektob 'we write'), but no sequence bn- from any other source gets the same regular treatment.
     - **Pronoun**. Stores the pronoun's person, gender, and number.
     - **Morpheme boundary**. This is specifically only for the boundary between a word and some enclitic pronoun, so it store
       the type of connection it joins the two with: either it's linking the base to an object pronoun, a possessive pronoun, or
       being used with the dative *l*.
3. **Sounds.** This stage only has consonants and vowels.
4. **Display.** This **should** really be a ton of different end-stages corresponding to different writing systems,
   but all I had time to implement was this one that outputs to
   [IPA](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet). The only node type in this stage is **literal**,
   which see below.

There are also two node types shared by most stages:
1. **Boundary,** found in all stages except display. It stores a flag that indicates what type of boundary it is.
   On **sounds**, the types of boundaries available include **morpheme**, **syllable**, **word**, **pause**, and **sentence**,
   while the other stages only have the last three types (morpheme boundaries are represented by a different node on
   earlier stages for either technical reasons or technical debt reasons... don't ask me which.)
2. **Literal,** which just stores a string of literal text. Punctuation can usually be implemented by using two nodes,
   one literal with the actual punctuation followed by one boundary that indicates what kind of boundary that punctuation
   represents.

> [!NOTE]  
> This isn't some perfect model! It feels pretty clunky, actually, both in terms of the distinctions I've chosen to make
> here and in terms of the linear procession of stages that this project requires all languages to stick to.
> 
> For this specific language, I think a
> smart design under the project's constraints could actually cut this down to just three stages and remove
> the difference between the "word templates" stage and the "underlying" stage. On top of that, a smart design in terms
> of project internals might actually tear down that wall between discrete 'stages' altogether and allow different node types to coexist in the same
> row no matter what stage of rule-application they're at (albeit with the eventual goal of getting all neighboring
> nodes to be of the same type). Much redesign work to do!

A different set of rules applies to the nodes of each stage, as mentioned earlier.

#### Mocks and fixtures

I've mentioned a couple times that you sometimes want to look at what a node's value or environment looked like during
a previous stage. To help keep this practical, all rules can choose to output one of two types of nodes: a **fixture**,
which is a permanent member of the historical record, and a **mock** node, which just pretends it never existed after
it's done what it needs to in terms of outputting rules. **Fixtures** are what shows up when you search back for
a node's value at some previous stage.

#### Target
This feature is broken right now. Don't read this section.
<details>
<summary>Don't read this section!</summary>
I said don't read. Anyway, another piece of info rules can check for when deciding whether to run is what a node's
<b>future</b> environment will look like. A node that checking for a rule like this will wait
until that future environment gets filled in (by rules running on other nodes) before it decides whether it can
run the rule or not. This is really useful for writing rules that run iteratively in one direction or the other,
like assigning stress in languages where the position of stress depends on factors like position and syllable
weight: you can start from the first stressable syllable, then have subsequent syllables check whether the one
before them <b>will end up</b> stressed or not before deciding whether to run their own stress rules.
</details>

#### One last thing about how rules are run

We've nearly understood the overall model in full now. The last thing I want to point out is pretty important: rules
apply in **discrete generations,** covering all nodes in the leading row before starting on the next generation.

> [!NOTE]
> While this makes for a good model of applying rules to each other, it makes it tricky to formalize concepts relating
> to rule-ordering, especially bleeding/counterbleeding. I'll flesh out this part later.

### Match library

Now that we understand how this all works on paper, we need to start talking about how to code it out. No matter
how you slice it, you're going to need to need some way to express boolean operations: what if you want
to run a rule on a node whose value is either something **or** something else, or a node that matches some condition
**and** another? This project includes a "match library" that you're going to rely on a lot in those contexts.

Let's say you want to write the number 1.

```ts
1
```

Good job! I knew you could do it.

Now let's say that you're writing the number 1 as part of the conditions a rule matches on to decide whether
it should run. In this project, **any** time you want to write any value whatsoever (any!) like that, you
can write it as is if you want &mdash; but you also have the option to shove it inside a **match** object.

```ts
{match: 'single', value: 1}
```

That's the exact same thing. You're telling the rule to match on the number 1. Congratulations again!

```ts
{match: 'any', value: [1, 2]}
```

This is new, though. It says that the rule can match either the number 1 **or** the number 2.

You don't always want to match a whole literal/primitive like that. Usually what you'll want to match on
is certain fields of an object. For example, say you're checking a node with a `{length: number}` field and you
want to make sure the length is either 1 or 2.

```ts
{match: 'any', value: [{length: 1}, {length: 2}]}
```
```ts
{length: {match: 'any', value: [1, 2]}}
```

Make sense?

Lastly, matching on an object only enforces that it matches the properties you **do** specify, and it doesn't care about
what the rest of the object looks like. For example, the above two schemas will match `{length: 1, foo: 'bar'}` just as easily
as they'll match `{length: 1}`, but they will **not** consider the objects `{foo: 'bar'}` or `{length: 3}`
to be a match.

> [!NOTE]
> One consequence of this is that the "spec" `{}` (or `{match: 'single', value: {}}`) matches everything that
> isn't null or undefined, since there isn't anything else in JavaScript whose properties aren't a superset of...
> nothing.

#### Types of matches

There are six different types of matches you can use, plus a seventh forbidden match only to be wielded by the high elders.

> [!IMPORTANT]
> The first time you reach this point in the document, you should just skim these without putting too much effort into
> internalizing everything. When you read further on and run into real usecases for this, that's when you should come back
> up here and put too much effort into internalizing everything.

##### Single
```ts
{match: 'single', value: schema}
```

This matches on one single value. You mostly don't have to use this because it's usually the same thing as just writing the
value directly (e.g. matching on `{match: 'single', value: 1}` is usually the same thing as matching on `1`).

##### Any
```ts
{match: 'any', value: [schema, schema, ...]}
```

This matches on any of the objects inside the `value` array.

##### All
```ts
{match: 'all', value: [schema, schema, ...]}
```

This only matches objects that match everything inside
the `value` array. I mostly use `all` in two cases:
1. To avoid using JavaScript's `...spread` syntax. For example, later in this document, I'll introduce two functions
   `before()` and `after()` that return objects to use as match schemas. You can **technically** just join them
   together like `{...before(foo), ...after(bar)}`, but that requires you to have secret internal knowledge that
   that's safe to do on their return values. Playing by the rules instead, it's better form to join them like this:
   ```ts
   {
     match: 'all',
     value: [
        before(foo),
        after(bar),
     ]
   }
   ```
2. To combine matches that absolutely can't be combined in any other way, like [`custom`](#Custom) below.

##### Type
```ts
{match: 'type', value: (see below)}
```
The value here can be any of:
- `'string'`
- `'number'`
- `'bigint'`
- `'boolean'`
- `'symbol'`
- `'undefined'`
- `'null'`

These are all JavaScript types (except for `null`, which is a value type of its own in TypeScript's type system but not in the JS runtime).
`'string'` will match any string, `'number'` any number, etc.

##### Array
```ts
{
  match: 'array',
  value: {
    length: numerical schema,
    fill: schema,
  }
}
```

This matches an array with the properties specified. `numerical schema` means any schema that resolves to a number.
Some examples of valid `value`s:

```ts
{
  length: 1,
  fill: schema,
}
```
```ts
{
  length: {match: 'any', value: [1, 2]},
  fill: schema,
}
```
```ts
{
  length: {match: 'type', value: 'number'},
  fill: schema,
}
```

> [!NOTE]
> `array` isn't the only way to match on an array! But there's no other way to match an array of unspecified
> length that has all of its elements matching a certain schema. If you want to match a tuple, or you
> only care about a specific few elements of your array, you can try match schemas like these instead:
> ```ts
> [0, 1, 2]  // matches a tuple that's literally [0, 1, 2]
> ```
> ```ts
> [0, {match: 'any', value: [1, 2]}]  // matches either the tuple [0, 1] or the tuple [0, 2]
> ```
> ```ts
> {length: {match: 'any', value: [3, 4]}}  // matches any array whose length is 3 or 4
> ```
> ```ts
> {2: {match: 'type', value: 'number'}}  // matches any array that has a third element whose value is a number
> ```

##### Custom
This lets you write a function to run your own match. Your function will automatically get passed
the object it needs to match on. For example, if you're writing a schema for something that you
know will be an array and you want to make sure that its first element equals (`===`) its third
element, you can do:

```ts
{
 match: 'custom',
 value: arr => arr[0] === arr[2],
}
```

There's no other way to express this constraint with the match library.

That example does assume the array actually has a first and third element. You can add an additional constraint
to ensure this by coding it into the `custom` function itself, **or** you can drop the custom match inside a `{match: 'all'}`
to enforce any additional constraints:

```ts
{
 match: 'custom',
 value: arr => arr[0] && arr[2] && arr[0] === arr[2],
}
```
```ts
{
  match: 'all',
  value: [
    {0: {}, 2: {}},  // or {length: 3} or whatever
    {match: 'custom', value: arr => arr[0] === arr[2]}
  ]
}
```

We've gone over the six main matches. I also mentioned that there was a "seventh, forbidden match only to be wielded by the high elders".
You may now learn its secrets. Proceed in earnest.

##### The forbidden match

Kidding. You're not worthy yet. It's in the next section, though.

#### What's the point of all this?

The really cool (and really fatally blocking) part of this match library is that it's actually enforced
**within TypeScript's type system itself**.

```ts
import {type MatchAsType, matchers} from 'src/lib/utils/match';

const schema = {
  match: 'array',
  value: {
    length: 3,
    fill: {match: 'type', value: 'number'},
  }
};

type Schema = MatchAsType<typeof schema>;
```
```ts
const test1: Schema = [];  // compile error

const test2: Schema = [1, 2];  // compile error!

const test3: Schema = [1, 2, 3];  // all good!!

const test4: Schema = [1, 2, 3, 4];  // all bad!!!

const test5: Schema = [1, 2, 'a']  // compile error!!!!
```

This gives 1:1 parity with the library's runtime component:

```ts
// using matchers.single() is basically like pretending the schema was {match: 'single', value: {match: 'array', value: ...}}
// as in, it will eventually route this request to matchers.array({length: 3, fill: {match: 'type', value: 'number'}}, test1)
matchers.single(schema, test1);  // => false (at runtime)

matchers.single(schema, test2);  // => false

matchers.single(schema, test3);  // => true!

matchers.single(schema, test4);  // => false

matchers.single(schema, test5);  // => false
```

What's more is that, in the type system, you can create matches that are subsets of other ones:

```ts
import {type MatchesExtending, matchers} from 'src/lib/utils/match';

const schema = {
  match: 'array',
  value: {
    length: 3,
    fill: {match: 'type', value: 'number'},
  }
};

// we're using a new type called MatchesExtending, not MatchAsType like previously
type Schema = MatchesExtending<typeof schema>;
```
```ts
const test1: Schema = {
  match: 'array',
  value: {
    length: 3,
    fill: {match: 'type', value: 'number'},  // all good!
  }
};

const test2: Schema = {
  match: 'array',
  value: {
    length: 3,
    fill: 1,  // all good!!
  }
};

const test3: Schema = {
  match: 'array',
  value: {
    length: 3,
    fill: {match: 'any', value: [1, 2]}  // all good!!
  }
};

const test3: Schema = {  // all good!!
  match: 'any',
  value: [
    [1, 2, 3],
    [4, 5, 6],
    {match: 'array', value: {length: 3, fill: {match: 'any', value: [3, 4]}}}
  ]
};
```

This is honestly what makes half this project tick. Remember for [`array`](#Array) when I said that
its value's `length` takes a "numeric schema"? That's enforced in the type system, to the point where
it won't even let you write something that doesn't eventually resolve to something numeric in there.
You can emulate the idea yourself:

```ts
import {type MatchSchemaOf, matchers} from '/lib/utils/match';

const lengthSchema = {match: 'type', value: 'number'};

// MatchSchemaOf basically combines MatchAsType and MatchesExtending
type LengthSchema = MatchSchemaOf<typeof schema>;
```
```ts
const test1: LengthSchema = 1; // all good!
const test2: LengthSchema = {match: 'any', value: [1, 2]};  // all good!
const test2: LengthSchema = {match: 'type', value: `number`};  // all good!
```

(TODO: mention `{match: 'literal'}` to match a literal object that could be mistaken for a special match object)

##### The forbidden matches

Open your eyes. A new dawn breaks. The veil of ignorance veils no more. You have not only passed but *sur*passed:
you are to be bestowed the sacred ken of not one but **two** forbidden matches. You attain enlightenment. Welcome to a new world.

The reason these two get to be called *forbidden* should make sense now: they ruin the match library's type-soundness!
`custom` kind of does too, but in my opinion it's indispensable, while these are less so. They're handy to have sometimes,
especially at runtime, but I'm not sure how to go about implementing them in the type system &mdash; especially when
[negated types](https://github.com/microsoft/TypeScript/issues/4196) is half Peter Pan's age and is probably also going
to (ahem) Never Land.

> [!NOTE]
> In fact, this is the main reason the match library is a little bit bare-bones. I'd love to be able to match numbers better
> without resorting to `custom` (e.g. some way to express `{length: (greater than 3)}`), but my hands are tied as long as
> I'm trying for feature parity between the runtime and compile-time parts of the match library.

###### **Not**

Don't do h6, kids. These poor headings.

This just negates whatever its `value` is. You can use it anywhere at runtime, but the type system will yell at you on the
TypeScript side of things because `'not'` isn't officially a sanctioned type of `match:`. You can write
`{match: 'not' as never, value: ...}` to shut it up.

```ts
{
  match: 'not',
  value: 3,  // matches anything except the number 3
}
```
```ts
{
  match: 'not',
  value: {
    match: 'any',
    value: [1, 2, 3],  // matches anything except the numbers 1, 2, 3
  },
}
```

###### **Danger**

```ts
{match: 'danger', value: (see below)}
```

`value` can be any of:
- `object`
- `array`
- `primitive`

Okay, after cooking up all that forbiddenness drama, I actually can't remember why this one was so much more dangerous than any of the
other matches that it had to be shunned into its own little corner. It might've been that I originally wanted this to be equivalent to
TypeScript's `any` and `unknown`, but that the correspondence kept contaminating my otherwise-tight types to the point where I gave up
and now it's more or less a different flavor of `{match: 'type'}`. Debt! Cruft! Yay!

I think you can use `{}` instead of `{match: 'danger', value: 'object'}`, come to think of it. This entire thing is probably redundant.

#### And now: the elephant in the room

Okay! I'm sorry! I know! The syntax is ugly. I know. It's horrendous. I didn't mean to make you think I thought it was normal. I'm sorry. I blew it.
I apologize.

I really would've liked for it to look more fluid, e.g. `match.array(3, match.type('string'))` or `match.array(3, match.type.string())` to match
a length-3 array of strings. Ideally those two functions together would just return `{match: 'array', value: {length: 3, fill: {match: 'type', value: 'string'}}}`
anyway, so it'd work the same under the hood with just some sweeter syntactic sugar for writing and reading it. But the problem is again with the type system.

Right now, the type system won't actually let you write a match that couldn't possibly resolve to the value expected. For example, if "the value expected" is an array of
strings and you're trying to write a match for it, it'll be a compiler error for you to write something completely unrelated like `{match: 'type', value: 'number'}`.
Try it yourself:

```ts
import {MatchSchemaOf} from 'src/lib/utils/match';

const expected = {
  match: 'array',
  value: {
    length: {
      match: 'type',
      value: 'number',
    },
    fill: {
      match: 'type',
      value: 'string',
    }
  },
} as const;

// remember, MatchSchemaOf is like a combo of MatchesExtending and MatchAsType
type Expected = MatchSchemaOf<typeof expected>;

const strings = ['a', 'b', 'c'] as const satisfies Expected;  // ok
const numbers = [1] as const satisfies Expected;  // wrong ofc
const arrayMatch = {match: 'array', value: {length: 1, fill: 'a'}} as const satisfies Expected;  // ok
const numMatch = {match: 'type', value: 'number'} as const satisfies Expected;  // wrong!
```

`'type'` won't even turn up as an autocomplete suggestion when you go to write that match:
![list of autocomplete suggestions for the string value of `match` in numMatch: all, any, array, custom, danger, and single](https://user-images.githubusercontent.com/32081933/286491585-386cfa7b-d0b2-49fe-a1c4-e491ec2ac6d9.png)

TypeScript can only do this when you're writing the object literal out yourself. Unfortunately, if I were to instead provide some helper functions that would
let you write e.g. `const expected = match.array(match.type('number'), match.type('string'))` or
`const expected = match.array(match.type.number(), match.type.string())` or something, you'd lose all of that in-situ compiler help and there'd be nothing
stopping you in the moment from writing `match.type('number')` or `match.type.number()` where you were supposed to write something satisfying `Expected`.
(It'd still be a compiler error, just a more-cryptic one that'd be more removed from the actual site of your error, and that plus losing autocomplete
is too much of a blow for me personally to consider implementing something like this.) TypeScript can't "see through" that function call to realize it
should be able to guide what you're writing there.

> [!WARNING]
> I need to add that the match library isn't 100% stable or sound yet on the typing side. There are some bugs below that arise purely from weird holes
> in the match library that I will only eventually get around to figuring out. Sorry! It's stable enough for normal use, though.

### Stages and alphabets

Now! Let's get started on what we came here for. I mentioned that the whole transformation shtick proceeds in stages and that each stage has a different
"type of data" that its rules operate on. I was right. Let's see how to define one of these stages.

```ts
import {alphabet} from 'src/lib/alphabet';

export default alphabet({
  name: 'can-i-buy-a-vowel',
  types: {
    vowel: {
      height: {match: 'any', value: ['high', 'mid', 'low']},
      backness: {match: 'any', value: ['front', 'mid', 'back']},
      tense: {match: 'type', value: 'boolean'},
      round: {match: 'type', value: 'boolean'},
    },
  },
  // ignore everything new below this line for now 👍
  context: {},
}, {});
```

You use this `alphabet()` function to define the format of a particular stage's data, i.e. the "alphabet" that its rules transform from and to. The function takes an object with your alphabet's **name** and any **types** that
you want to define.

The `types` are a bunch of match schemas [TBC]

```ts
import {alphabet} from 'src/lib/alphabet';

export default alphabet({
  name: 'can-i-buy-a-less-mid-vowel',
  types: {
    vowel: {
      high: {match: 'type', value: 'boolean'},
      low: {match: 'type', value: 'boolean'},
      back: {match: 'type', value: 'boolean'},
      front: {match: 'type', value: 'boolean'},
      tense: {match: 'type', value: 'boolean'},
      round: {match: 'type', value: 'boolean'},
    },
  },
  // ignore everything new below this line for now 👍
  context: {},
}, {});
```

```ts
import {alphabet} from 'src/lib/alphabet';

export default alphabet({
  name: 'demo',
  context: {},  // you ignore this for now 👍
  types: {
    consonant: {
      voiced: {match: 'type', value: 'boolean'},
      nasal: {match: 'type', value: 'boolean'},
      lateral: {match: 'type', value: 'boolean'},
      articulator: ['throat', 'tongue', 'lips'],
      location: [
        'glottis',
        'pharynx',
        'uvula',
        'velum',
        'palate',
        'bridge',
        'ridge',
        'teeth',
        'lips',
      ],
      manner: [
        'approximant',
        'flap',
        'fricative',
        'affricate',
        'stop',
      ],
    },
    vowel: {
      height: ['high', 'mid', 'low'],
      backness: ['front', 'mid', 'back'],
      tense: {match: 'type', value: 'boolean'},
      round: {match: 'type', value: 'boolean'},
    },
    boundary: {
      type: [
        'syllable',
        'morpheme',
        'word',
        'pause',  // 'petite pause'
        'sentence',  // 'grande pause'
      ],
    },
    literal: {
      value: {match: 'type', value: 'string'},
    },
  },
}, {});  // ignore this {} too
```

#### Letters

### Rule packs

### Finally: Profiles

## Web interface documentation

There's no web interface for now! At some point it'll be a repository of texts that you can choose to display in different accents and writing systems, and there'll
also be a page where you can explore morphology stuff like verb conjugation. But currently all that's there is the graph-visualization debugger.
