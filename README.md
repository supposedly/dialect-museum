# [Dialect museum](https://write.lebn.xyz)

This project isn't finished yet, but it's in the very last stages of development before it becomes usable from the web.
I am currently procrastinating finding out whether the last fix I need to implement is going to be broken or not,
so I'll take the opportunity to actually document this thing in the meantime :)

## What is this?

The short answer: I set out to make a tool to help you explore the unique features of different
dialects of Lebanese Arabic, which is helpful for learners and for native speakers who are curious about that heritage.
Along the way, the project turned into a way-more-general tool that can be used to give that treatment to any language at all.

There are a lot of dimensions that language varieties can vary in, like the sentence structures they use, their sound systems,
the way they change words for different grammatical reasons, and their vocabulary. This project is good at two of those,
give or take, plus an unexpected challenger for good measure:

1. it's mostly about sounds, aka phonology and phonetics,
2. it also allows you to represent morphology, the way words change for grammatical purposes (e.g. verb conjugations),
3. and it even lets you explore different writing systems using the exact same tools.

This project stems from a desire to give dictionaries a run for their money. Historically, dictionaries haven't documented
much more than a couple standard or standard-ish accents of whatever language they're for, and I'd bet it's because manually
punching in all of the different pronunciation variants you can think of is really time-consuming and super msitake-prone.
But what if we could outsource it to a computer instead?

- **Step 1.** Obtain computer.
- **Step 2.** Devise magic representation of our language that encodes **every** variety in one go. That way we don't have to type a bunch of different ones out ourselves.
- **Step 3.** Devise rules we can apply to transform magic representation into any variety we want.
- **Step 4.** Politely ask computer to do it for us.

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
will carcinize soon enough into an advanced, featural SCA. Personally I was really surprised to do a proper review of the SCA toolspace and find how
much depth people have put into these things. A couple particular giants I think I should pay respects to are [Phonix](https://gitlab.com/jaspax/phonix)
and [Lexurgy](https://www.meamoria.com/lexurgy/html/sc-tutorial.html). You'll notice lots of convergences between their design and what's below!

### Why are there like 600 commits?
Between school and the horrors of life, it took me a long time to hit on a workable design for this project. The current architecture
is the result of two months of thinking and coding and thinking and coding, but it's built atop a good couple years of intermittently
messing around and crash-landing. Glad to finally be here! There's only more work ahead.

## What's in a language

Not much, what's in a language with you?

There are three parts to defining a language with this thing. You have to get your **alphabets** in order, then you have to write **rule packs**, and finally
you can build off of those into specific **profiles** of individual speakers of a dialect.

Let me go over what each of those things are. If you want to try and go from there to get this thing working for your own language, my present advice is **don't.**

### How to add your own language

Don't.

> [!IMPORTANT]  
> Don't!

The beast just isn't ready yet in its current state. This is the very first draft of a working design, and because it's a first draft there are a lot of
pain points you'll run into. I'll go into more detail below, but the main ones are that the type system randomly breaks in at least two (fortunately avoidable) cases
and is weirdly slow in at least one other case, and the part where you actually define your language is (1) kind of disappointingly inflexible, so you have
to copy/paste your entire setup to create another one with minor variations, and (2) missing some big quality-of-life features that make working with it a
little bit demotivating. See tracking issues [#6](https://github.com/supposedly/dialect-museum/issues/6) and [#7](https://github.com/supposedly/dialect-museum/issues/7).

### How to add your own language if you really, really want to and also want to file a boatload of bug reports

<!-- CC0 :) -->
![Picture of a bug captioned "FEATURE"](https://user-images.githubusercontent.com/32081933/281660206-60f819eb-3dbf-4adc-9250-452a5af6c262.png)

Promise? In that case, you should fork this repository and follow the instructions below to add your language to the `src/languages` folder.

## The documentation

This project is written in [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html). It uses TypeScript's type system
to make sure, as much as possible, that you're writing exactly what you mean to write. The instructions below are mostly tailored to the editor
[Visual Studio Code](https://code.visualstudio.com/), but if you're comfortable enough with programming that you're set on using another IDE or editor,
I'll be assuming that that means you're comfortable translating any VSCodeisms (e.g. `Ctrl+.` for autocomplete) into their equivalents in your own toolchain.

One ideal for this project is for it not to require you to know any programming beyond what's required for it itself -- a **domain-specific-language**
sort of walled garden. As of writing, though, it does not achieve that goal :( That means the documentation below also assumes programming knowledge for now.

### Overarching model

This project works by taking **input** and applying **transformation rules** to it until there aren't any changes left to make. Your one big job is
to write those rules.

Each rule itself takes in an input and defines what output it needs to turn into. For example, a simple rule might be one that turns `z` into `gl`
and `ee` into `or`. Feeding the input `zeep` into these rules will give you the transformations: `zeep` -> `gleep` -> `glorp`.

Nice and simple. But language is complicated, and it's really hard to model complex things using raw text and simple substitution-y transformations.
To approach that complexity, our rules are going to need to be able to make their decision based on a lot of different factors. For example:

1. What's the current value of our input? This is what our two `z` -> `gl` and `ee` -> `or` rules are based on: they take
   an input with the value `z` or `ee` and transform it into something else based on that info alone.
2. What other stuff is **around** our input? This is called its "environment".
3. Our input is probably the product of other rules that have applied in the past. What did it used to look like?
4. Lastly, and this is the toughest one to reason about: what will our input's environment look like **in the future**, after other rules have run?
   - This info isn't needed for every rule. I've found two solid usecases for it so far, one hacky and one actually valid. The valid one is when
     you need to write a rule with **directionality**, i.e. one that applies iteratively from right to left or left to right, which I'll sell you harder
     on below.

![Graph of nodes with different colors. On the top is a layer of three nodes, each of which is linked to each of its two neighbors by an arrow. This layer is connected to another layer of the same sort, except this one has a lot more nodes branching out from the original middle one. Lastly, this second layer connects to an even-larger third layer.](https://user-images.githubusercontent.com/32081933/281906398-229ec8cf-65c6-4f15-8b62-39eaccaa72c8.png)

This is a screenshot of this project's visual debugger to help you (and me, I'm not gonna lie) understand how the actual process of transforming inputs into outputs works
under the hood.

The input here is the middle node at the very top, which is an object of type "verb". That means that any rules that operate on verbs will apply to it. Between you and me,
that node also carries info inside it that doesn't show up in the debugger -- specifically, `verb` nodes also store the subject they conjugate for, their
[TAM](https://en.wikipedia.org/wiki/TAM) combo (tense, aspect, and mood), and their [root](https://en.wikipedia.org/wiki/Semitic_root) and [measure](https://en.wiktionary.org/wiki/Appendix:Arabic_verbs#Derived_stems). For this verb here, that's:

- **Subject:** They (third-person plural)
- **TAM:** Past
- **Root:** `K-T-B`
- **Measure:** `CaCaC`

The rule system's job is to conjugate this verb into its form in my dialect, `katabo`. With the model I chose for Levantine Arabic specifically, a simplified
rundown of the way my rules go about that is:

1. First, generate the verb's stem. Because it's a `CaCaC` verb with the root `K-T-B`, its past-tense stem is `katab`.
2. Then, pop out an attached pronoun on each side of that stem. These nodes will literally be of type `pronoun` and match the subject of the verb, so they won't yet store any
   information about how they're actually pronounced.
3. Transform those pronouns into the appropriate conjugation prefix and suffix. Past-tense verbs don't have prefixes in Arabic, but the other pronoun will turn into `uu`
   because that's the best underlying form we can devise for the third-person plural's suffix conjugation.
4. Finally, perform all the necessary sound shifts in whatever dialect all these rules belong to. In my case, we just need to shorten and lax the final vowel: `uu` -> `u` -> `o`.

Every single time one of these changes applies, it leaves its mark on history.

### Match library

### Layers and alphabets

#### Letters

### Rule packs

### 
