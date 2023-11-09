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
- **Step 3.** Politely ask computer to do it for us.

In broad strokes, steps 2 and 3 are the idea behind [comparative reconstruction](https://en.wikipedia.org/wiki/Comparative_method).
Language change tends to be regular enough that, for any 2+ language varieties that used to be one single language in the past,
you can often suss out the changes they each must've undergone to get to where they are. Rewinding these changes gets you the magic from
step 2, and you can unrewind them as in step 3 to get from there to any variety you want to check out.

<details>
<summary>Shortcuts</summary>
The fun part is that you can cut corners here! You don't have to replay diachronic changes
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
easy to represent within the constraints of this framework and also achieves the correct end result.
</details>

### History and prior art
One way to conceive of this project is as a kind of [sound change applier](https://linguifex.com/wiki/Guide:Conlanging_tools#Sound_change_appliers).
It spent a long time not knowing it was one, but I think any kind of linguisticsy tool that tries to transform things into other things
will carcinize soon enough into an advanced, featural SCA. Personally, from casual brush-ins with conlanging, my image of SCAs was just simple web tools
that operate on raw text, so I was really surprised to do a proper review of the space and find how much depth people have put into these things.
A couple particular giants I think I should pay respects to are [Phonix](https://gitlab.com/jaspax/phonix) and
[Lexurgy](https://www.meamoria.com/lexurgy/html/sc-tutorial.html).

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

### How to add your own language if you really, really want to and just can't wait to file a ton of bug reports

<!-- CC0 :) -->
![Picture of a bug captioned "FEATURE"](https://user-images.githubusercontent.com/32081933/281660206-60f819eb-3dbf-4adc-9250-452a5af6c262.png)

Promise? In that case, you should fork this repository and follow the instructions below to add your language to the `src/languages` folder.

## The documentation

This project is written in [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html). It uses TypeScript's type system
to make sure, as much as possible, that you're writing exactly what you mean to write. Everything below assumes that you're using
[Visual Studio Code](https://code.visualstudio.com/). If you're comfortable enough with programming that you're set on using another IDE or editor,
I'll be assuming that that means you know enough to translate any VSCodeisms (e.g. `Ctrl+.` for autocomplete) into their equivalents in your own toolchain.

The real goal here is to give you as much of a **domain-specific language** sort of playground as possible within TypeScript, which will mean that you'll
be able to work with this project without knowing how to program in a broader sense. As of writing, it does not achieve that goal. There are cases where
you'll have to write your own JavaScript functions and cases where you'll have to force TypeScript to realize that you're writing something correct when it
thinks it's wrong. That means this documentation also assumes programming knowledge, at least for now. :(

### Overarching model

This project works by taking an input and applying transformation rules to it until there aren't any changes left to make. Your job is to define how the
input needs to be structured and what those rules exactly are. For example, you might have two rules: one that turns `z` into `gl` and another that turns
`ee` into `or`. Feeding `zeep` into the **engine**, the part of the program that runs your rules, results in the transformations `zeep` -> `gleep` -> `glorp`.

Under the hood, 

### Match library

### Layers and alphabets

#### Letters

### Rule packs

### 
