# [Dialect museum](https://write.lebn.xyz)

This project isn't finished yet, but it's in the very last stages before it becomes viewable from the web.
This writeup explains what I'm trying to do here and how to make use of it.

**This is not complete documentation yet!** Currently, the only thing I've written here is a bit about the
mindset behind this project. I'll turn this README into actual documentation ASAP.

## What is this?

The short answer: I set out to make a tool to help you explore the unique features of different
dialects of Lebanese Arabic, which is good for learners and for native speakers interested in that heritage.
Along the way, the project turned into a much more general tool that will allow any language at all to get that
treatment.

What do I mean by "unique features"?

1. The sound system of each variety.
2. Morphology across the board. Morphology is how words change for different grammatical reasons.
3. The differing treatments of individual words.

This project explicitly caters to #1 and also allows for #2 if you're clever about it. Unfortunately, it isn't great
at #3 -- that would require it to be hooked up to a dictionary that attaches metadata to each specific
word it records. More details below.

### The sound system of each variety
A couple examples from Lebanon:
1. Most people pronounce the Arabic sound ق, originally a
  [uvular plosive](https://en.wikipedia.org/wiki/Voiceless_uvular_stop) /qˤ/, as a
  [glottal stop](https://en.wikipedia.org/wiki/Glottal_stop) /ʔ/. However, some Druze and even Christian
  communities are well-known to conserve the /q/ pronunciation of this sound.
2. The original Arabic sounds *ay* and *aw* are famously retained more commonly in Lebanon than anywhere
  else in the Arab world. However, the rules governing this retention differ. In my own variety, I turn
  them to *ē* and *ō* only in the final syllable of a word, nowhere else -- so "house" is *bēt*, but "my
  house" is *bayte*. Meanwhile, there are other speakers who retain both sounds perfectly: *bayt, bayte*.
  Still others, especially in regions of the Beqaa, retain them in final syllables by lengthening the
  vowel: *bāyt, bayte*. There are some speakers for whom it matters how many sounds are after the *ay*
  or *aw*: *bēt, bayte* are like me, but then "our house" is *bētna* while for me it's *baytna*.

As small as all of these little tidbits seem out of hand, they really contribute in an essential way to
the character of somebody's dialect. By trawling through all of the things like this that vary throughout
Lebanon, we can come up with a checklist to help us create an individual profile of each different dialect
we come across.

### Morphology across the board
This is the same idea, just on the level of how different parts of speech behave rather than single sounds.

1. I conjugate the verbs "we relaxed" and "we borrowed" as *rteħna*, *stʕerna*. Other Lebanese people might
   say *rtaħna*, *stʕarna* (or *staʕarna*). These changes hold across the entire class of verbs that each
   one of these two belongs to.
2. For "I've brushed my teeth", I say *mfarše* for the verb. "I've brushed them" is *mfaršīhon*. Other
   Lebanese people will very commonly say *mfaršíyon* instead, but moreover some people flip the last
   vowel altogether: *mfarša* and something like *mfaršēhon*. This holds for any verb like this that
   ends in a vowel.

Writing these changes out in prose is pretty tedious, but the fact that they're so regular across entire
classes of words means they're very likely to be possible to represent programmatically. (Spoiler warning!)

### Individual words
Again, this one is much less easy to cater to in a project like this without having it hooked up to an actual
dictionary. For example, about half of Lebanon's dialects say "still" as *baʕd*, while the other half uses
the stem *ʔessa*. Some people say "I mean" as something like *ʔaẓde*, while others will use a *ṣ* sound instead,
and there basically aren't any other words that alternate between a Z sound and an S sound like this.

## How this project tackles that

There are two parts to it.

### Behind the curtains: linguist work

As someone interested in documenting some language's varieties, you first have to come up with a representation
of the language that all of its other varieties can be generated from. This is a reconstruction exercise:
positing that the varieties you want to document all come from one single source, what can you infer about that
source from the varieties you have access to?

Once you have that, you need to think about what rules you can apply to get from that reconstruction to each
current variety. The fun part is that you can take shortcuts! You don't have to replay diachronic changes
step-by-step if you don't need to be 100% faithful to the exact chronology in order to produce the same
synchronic result. For example, something that likely happened on the way to my dialect:

1. The historic sound /r/ gains [emphasis](https://en.wikipedia.org/wiki/Emphatic_consonant) by default, becoming
   phonemically /rˤ/. This did not take place following a short *i* or long *ī*, where the sound remained /r/.
   This was evidenced by the behavior of the feminine suffix, which in Levantine Arabic dialects is characterized
   by varying between a high vowel like *-e* and a low one like *-a* depending on the preceding sound's emphasis:
   "tree" would've been _\*šaǧarˤa_, "gums" would've been _\*nīre_, "she thinks" would've been _\*m(V)fakkire_,
   "she's decided" would've been _\*m(V)qarrire_.
2. Short, unstressed high vowels syncopate in open syllables, although not between two consonants with identical PoA.
   We now get _\*mfakkre_, _\*mqarrire_, still attested in some more-southern Levantine varieties.
3. *r* regains its emphasis in places where it's no longer after an *i*, giving  _\*mfakkra_, _\*mqarrire_.
4. This analogically carries over to all participles (those two words are participles), even when the *i* actually never
   dropped out:  _\*mfakkra_, _\*mqarrira_! The current forms in my dialect are *mfakkra*, *mʔarira*.

I could definitely just replay this chronology to generate the two forms *mfakkra*, *mʔarira* from original _\*mufakkira_,
_\*muqarrira_ (these are reconstructions for before step 1)... or I can say that in my dialect and dialects
like mine, you just make *r* emphatic even when it does come after a short *i* in step 1.

You input all this into this project in four steps:

1. Divide your rules up into stages. What info do the rules at each stage actually need about the words they're
   transforming? For example, some rules might care about what part of speech a word is. Other rules might only
   care about the raw sounds they're looking at.
2. Each of those stages is called "layers" in this project, and each layer has an "alphabet" associated with it.
   Define those alphabets. Each one encodes the info each layer's rules need. For Arabic, my first layer encodes parts of
   speech, my next one encodes morphemes (prefixes, suffixes, pronouns, etc), my third layer encodes raw sounds,
   and anything after that is for writing systems.
3. Think about the dialects you want to record. In what ways do they vary? Record all possible variants. For example,
   "sound A can become B, C, or D in such-and-such environment".
4. Finally, record specific "profiles" that pick specific variants to produce, e.g. "in this dialect sound A becomes
   B in that environment".

### The frontend

On the frontend, you'll be presented with your pick of:

1. Texts from individual dialects to explore the look and feel of in other dialects.
2. Different dialects to 'read' that text in.
3. Different writing systems to display the current dialect in.
