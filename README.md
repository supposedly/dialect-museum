# [A Journey in Overthinking It](https://write.lebn.xyz)

This project isn't finished, but I wanted to have something to show for it while it's underway.
Hope this README helps explain some stuff!

The short writeup is that I'm trying to make a dictionary,
and this is an attempt to rework the way dictionaries handle pronunciation. The
medium writeup is on [the project's homepage](https://write.lebn.xyz). The long writeup is write up
next.

## The problem

I don't like this.

<kbd aria-role="presentation">![A partial screenshot of the Oxford English Dictionary's definition of the word 'her'. It describes the word as a pronoun and noun and says it's pronounced "huhh" or "uhh" by Britons and "her" or "er" by Americans.](https://user-images.githubusercontent.com/32081933/136824054-6e3da3cc-6005-40d7-94d5-7d1845ad0e41.png)</kbd>

### Her?

No, I hardly know her. What I don't like there is the bit about pronunciation.

That's a screenshot from the Oxford English Dictionary's online portal. The OED hit the Internet
before I was born (a couple decades ago) and came into existence just a little bit earlier
(a couple centuries ago), making it one of the oldest and foremost dictionaries of English.
It's spent most of that life being the best ink-and-paper dictionary it could possibly be.

The print and online dictionaries are pretty much the same exact thing. There's almost no difference between the
experiences you get between the two. It makes sense: Oxford does know what they're doing when it comes to
dictionaries (and possibly other things), and their print dictionary's style has been sufficient for a good couple
hundred years. If it ain't broke, why break it?

### Why break it

<kbd aria-role="presentation">![There was this meme that originally went "Inside Each of Us Are Two Wolves; One has depression, The other has depression; You Have Depression". This is edited to: "Inside Each of Us Are Two ACCENT. One has R SOUND the other has NO R SOUND. You have ENGLISH LANGUAGE"](https://user-images.githubusercontent.com/32081933/214675441-1690f38f-633f-4a49-b7a7-6de6053b538a.png)</kbd>

Look at the pronunciations they've got for the word "her" up there. They come in two accents: a
British one that doesn't pronounce the R, and an American one that does. It does feel nice to
see them straddling the pond for us like that, but (forgive this) how wide to a side ought a straddle
to stride? How many accents per continent should they actually be covering? There sure isn't only one
kind of English spoken throughout the whole US, let alone all of Britain, let alone-alone the UK in
general. And I hear there's even the rest of the world to contend with...

Well, when it comes to not documenting 100% of the breadth of English accents, they've got a few excuses to uses.
Personally, I think a big fat dictionary of English **needs** to document as much of the English language as it can,
but I'll admit that there's a lot hinging on the word *can*: a print dictionary has got a few important tradeoffs
to make when balancing how much it *should* document with how much it *can* document. A lot of the time, it just
isn't possible or feasible to record everything there is to record.

For example, I'm betting that someone looking up the word "her" for normal-person reasons won't have much
fun looking at this:

| <figure><kbd aria-role="presentation"><img src="https://user-images.githubusercontent.com/32081933/136869976-acf84922-88ca-4ba0-8a7c-bc447a8575f5.png" alt="The above OED screenshot, just edited to show a flat-out-impractical number of different pronunciations." /></kbd><figcaption><sup><i>Hypothetical bad dictionary. Also, I've tactically concentrated all of my of mistakes into this one image to divert your attention from any other ones I might've made in this document.</i></sup></figcaption></figure> |
| :-: |

Wouldn't that be awful to use? I mean, think of all the times you've forgotten a word as complicated as
"her". Now imagine subjecting your eyes to all of those crazy pronunciation runes every single
time you had to look up how to say it. On top of that, imagine a dictionary trying to list out
**every single one** of those pronunciations for every. Single. Word. They'd run out of pages after, um,
"aardwolf", which is apparently the word after "aardvark". (Promise I'm not lying. The next word is
aardxylophone.)

Maybe the fix is to quit with this silliness at once and return straight to how English was
meant to be: two accents, no more, no less. Unfortunately, I've spent ages of my life
(~~two~~ three ages) refusing to consider that exact solution, so you won't hear any more of it here.
Instead, my ultimate goal is to be able to represent as much variation as possible as succinctly as possible.

A quick fix would just be to hide that whole mess of pronunciation guides until someone purposely asks to see it.
You've probably noticed that I've been showing you the online OED instead of a paper dictionary, and, as you know...

<details>
  <summary><b>(Show More)</b></summary>

  ...on a computer, **you don't have to show your whole hand all at once!** You have some freedom to play with how
  you display your data: render only part of it, hide some other part, show different bits of it interactively, etc.
  
  This **(Show More)** thing could work. But we wouldn't be getting rid of any of the mess from that last screenshot
  — we'd just be shoving it into a drawer to forget about until later. That means anyone who's interested in learning how
  to pronounce this word in some particular accent will still have to wade through a bunch of uninteresting
  variants to get to what they need.
  
  Can we do better?
</details>

And another thing I want you to keep in mind for later: In that last screenshot, I added all those
pronunciations to the page with my own, human hands. **And I made mistakes doing it!** Part of that is totally
on me for not being Susie Dent (next life, maybe), but even if I did know the world's Englishes inside and
out, I **still** wouldn't trust myself to keep my accuracy up if I always had to list so many of those forms out
manually. Humans make mistakes doing things, and we make lots and lots of mistakes doing lots and lots of things.
It'd sure be easier to make sure all of our detailed pronunciations are correct if a computer, not a human,
took care of the hard part of keeping track of everything.

This all sound good? Let's break the pace with a recap.

### The state of our problem

#### On paper

- We thought it could be pretty cool for our dictionary to acknowledge more accents and dialects
  than just two major ones. After all, Generic Brit and Standard-Issue American aren't the only
  two people who speak our language.
- We can't do that comprehensively in a print dictionary, though:
  1. ❌ It'd waste a ton of valuable ink and paper.
  2. ❌ Our dictionary's human editors would have to compile all the different dialects' forms of each 
     word manually, and that process is just swarming with chances to mess up.
  3. ❌ Readers who don't care about all this would have no way to skip past it.

Something in this vein is why dictionaries never bother fleshing out their pronunciation keys beyond a couple of
major dialects. It's just a logistical nightmare if you're working in print.

But wait, we're not working in print. We're computer. Once again, the biggest difference is that, on a
computer, the text you show the reader **doesn't** have to be the exact same as the actual data you
recorded! You have some room to mess around with how you display it to format it digestibly. So what
if an online dictionary took advantage of that and shed its paper shackles? Can we harness the
power of computer for great good?

#### Wow, look: digital style

<kbd aria-role="presentation">![Edited version of a car-salesman meme. "*Slaps roof of PC* this bad boy can fit so many (USELESS INFORMATION) in it"](https://user-images.githubusercontent.com/32081933/214670987-8476df5d-d3a1-4bd9-85cc-59a6b8ebff3c.png)</kbd>

Okay, so we're doing our stuff with computers now, not the town abacus or whatever they used before
1970. This is what that means for us:

- ✅ We never have to worry about running out of ink and paper. A computer has so much of
  that stuff in it.
- ❌ #2 is still a problem, though. Having humans enter all those different forms manually
  is just begging them to mess up at some point.
- ❌ And we haven't addressed #3 at all. Accounting for all of the English accents in the world still just
  makes for too much info! We tried hiding all of it behind an expandable widget with that **(Show
  More)** thing, but we found out that that doesn't exactly solve the problem... it's more like
  just shoving it all under the desk to forget about until later.

We're making some progress, but we're still not all the way there. With 2/3 of our key issues still
unsolved, it's continuing to look like a good idea to cut our losses and be happy with our two
measly little accents, but I still need to write the rest of this README, so I'm going to pretend I
didn't say that. Onward!

As I see it, our big problem is that **we're still treating our computer dictionary as if it's a print
dictionary.** We're still following that same old ink-and-paper workflow where we record everything as
raw text and display it almost-unchanged.

Is that the computer way? Not exactly. We should really be looking at ways to get our software
to cut out some of our work for us. For example, do we really have to be the ones to keep all of
the different accents of our language in our head? Could we somehow get some help with that?

## Thinking about a solution

### What's in an accent, anyway?

For our next step, we should start asking some questions about how accents actually work.  
For example, how do accents actually work? Also, how do they arise? And how are they related to
each other? Can we exploit any properties of theirs for our needs?

#### Spare some change, sir?

Here are three fun facts about language. (I'm simplifying a bit but not wrongifying)

1. Human languages are always changing. As long as a language is getting used for natural, everyday
   communication, it's going to be undergoing changes without its speakers even having to know it.
2. Much like something I can't quite remember right now (context: I am writing this in 2021), those
   changes only spread through real-life, face-to-face transmission. They can catch on really easily
   between speakers who are in constant contact with one another, but they don't grow wings and cross
   oceans if people don't physically carry them over.
3. And all this stuff arises totally randomly. We can never confidently predict what changes a language
   is about to undergo. Not to mention, it's super unlikely for lightning to strike twice and make the exact
   same changes repeat themselves in different locations. If you've got a language with a few
   groups of speakers that are pretty isolated from one another, that's practically a guarantee
   that the changes they'll each be undergoing will be totally different from one another.

Let's think more about those groups from #3. Suppose they never actually get back in touch with
each other. What happens to their language if they hold onto it?

Okay, so they keep speaking it, the same as ever, and it keeps changing and developing, just the same as ever.
But, and this is also just like something I wish I could remember, the isolation would have to catch
up to them eventually. With all of those divergent changes piling up over time, could things ever get to a point
where they couldn't even understand each other anymore? How long would that have to take?

A year? Nope, fortunately. There's this one case where linguists
[analyzed](https://www.scientificamerican.com/podcast/episode/linguists-hear-an-accent-begin/)
the difference between a research team's English accents before and after they spent one year alone
in Antarctica, and to everyone's surprise, they did not come back speaking English 2. Their vowels
did change a teeny little bit, though!

A hundred years? Not quite. There's a
[community of Cretans](https://en.wikipedia.org/wiki/Al-Hamidiyah) who were granted refuge in Syria
at the turn of the 20th century, and according to my sample size of 1.5 (I asked the same guy
twice), their Greek language is still totally peggable as Cretan even though they've spent a whole
century in isolation from ~~mainland~~ mainisland Crete.

[Six thousand years and counting](https://www.youtube.com/watch?v=aQ283N_ZdKY)?

| <figure><kbd aria-role="presentation"><img src="https://user-images.githubusercontent.com/32081933/138953290-c9f4c8b9-33c9-4c86-858d-5e2612a8772e.png" alt="Map of the Expansion of the Indo-European languages." /></kbd><br/><figcaption><sup><i>[Greenhill SJ et al.](https://simon.net.nz/articles/mapping-the-origins-and-expansion-of-the-indo-european-language-family/) 2012. Mapping the Origins and Expansion of the Indo-European Language Family. Science, 337: 957-960.</i></sup></figcaption></figure> |
| :-: |

Okay. Yeah. Something like that.

If you jump that far into the future, you can definitely expect your little language to have given
way to between one and one gajillion completely different little languages, all of which are going
to be practically unrecognizable to you. That's how
[the Indo-European languages](https://en.wikipedia.org/wiki/Indo-European_languages), pictured above,
have been developing ever since the original Indo-Europeans got over their 3,000-year
[make-like-a-plot-and-scatter phase](https://en.wikipedia.org/wiki/Indo-European_migrations). You
can even get those kinds of differences at way-smaller time depths as long as everyone is isolated
from everyone else: we all remember being there when Latin blipped into the Romance languages once
the entire empire'd expired, right? That only took a handful of centuries, tops.

#### Okay, cool, but, like, reel it in

Sure. That was a fun diversion, but we were just talking about accents, not entire languages.

Well! The cool part is that those are actually the same thing. They're just at different
stages of the same process. Language differences first manifest in what we call accents and dialects,
then slowly, over the course of time (specifically, a whole lot of course of a whole lot of time),
get the chance to develop into what we'd call languages.

We just saw how that's how language families end up manifesting (like Romance and Indo-European). But on
top of that, it's also why differences in language tend to only *gradually* get more pronounced the further
away you move from any specific region. If you have people in areas nearby each other, it often means they and their languages
haven't been 'separated' for too long if they both migrated there from the same place at some point in the past — plus, their
proximity gives them a high chance of interacting with each other regularly and thus sharing their sound changes
with each other. That gives them way less chance to drift apart from each other in language than from people
farther away.

But they still **do** drift apart. In a lot of areas, especially ones that have had lots of time to
settle language-wise, practically every village has a unique accent or dialect. Why? And how do they differ,
exactly?

#### Spare some regular change, sir?

We're finally getting to the meaty bits. There's one little fact that makes this entire project here tick,
and it's that sound changes tend to be two things: first, **regular**, and second, **indiscriminate**. Generally, when a
sound change happens, it doesn't just affect individual sounds in random words — it wipes out the
entire language in one go. Any word that has the same sound in the right spot feels the burn.

When you're looking at words that different accents of a language pronounce in their own ways, each word is a
testimony to exactly what sound changes each accent has undergone since the instant it split off from all
the rest. Almost any other word in the language that has the same sounds will reflect those sound changes in
that accent, too. What that means is that, if you gather up enough words and figure out enough sound-change
relationships between accents, you can (theoretically) be–kind–rewind the whole entire language back to that
(theoretical) stage where there (theoretically) weren't any accents at all. Plus, once you've gotten to that
(theoretical) rewinded stage of the language, you can fast-forward it using **any** accent's sound-change rules
to get an idea of how a word might sound in any accent whatsoever.

### Running it home

Let's try applying what we know now to our dictionary problem.

If both pronunciations of "her" are related by a rule that applies consistently to our entire
language, we should just be able to get our program to "know" that rule for us instead of having
to bother ourselves with it. That way, instead of forcing ourselves to write out both `/həː/`
and `/həɹ/` (for example), we could just...

1. Start with one single original form that we propose. For the word "her", this is naturally gonna be a form that has an R sound.
3. Pass that OG form off to our software. Teach it the rule we've come up with: in some accents,
   the R sound disappears at the end of a word or syllable.
3. Have it automatically generate our different forms for us. Brew an instant coffee in the
   meantime (a really instant coffee).

And that's it! It's not that much of a timesave for only two forms like `/həː/` and `/həɹ/`,
sure, but remember that one of our original plans was to expand our operations to all sorts of
different accents worldwide. This lets us get there both efficiently and scalably. Instead
of having to remember all of the word's different vowel–consonant combos ourselves and punch them in manually, we
can just teach our program the sets of sound-change rules we already know, and make it generate all
of the different forms we need for us.

## Further implications (wow)

### The state of our problem again

Sweet. Where are we at after all of that?

- ✅ Ink and paper? Still not an issue anymore.
- ✅ Too many different pronunciations for a human to reliably keep track of? All good: We solved
  it by not making a human have to keep track of them anymore!
- ❌ Okay, we still haven't really done anything about the too-much-to-read problem. Our different 
  pronunciations are still going to clutter up the page, and our best duct-tape solution is still that
  **(Show More)** widget that we didn't love.

But, hey, we're 2 for 3 now! Can't we do anything about that third one?

### Data, data, data

Seeing as a computer's entire job is to transform data, there's no way our answer isn't a yes.
Here's a quick solution I thought of.

Remember our old friends, these pictures?

<kbd aria-role="presentation">![A partial screenshot of the Oxford English Dictionary's definition of the word 'her'. It describes the word as a pronoun and noun and says it's pronounced "huhh" or "uhh" by Britons and "her" or "er" by Americans.](https://user-images.githubusercontent.com/32081933/136824054-6e3da3cc-6005-40d7-94d5-7d1845ad0e41.png)</kbd>

<kbd aria-role="presentation"><img src="https://user-images.githubusercontent.com/32081933/136869976-acf84922-88ca-4ba0-8a7c-bc447a8575f5.png" alt="The above OED screenshot, just edited to show a flat-out-impractical number of different pronunciations." /></kbd>

I've been focusing on the R, but there's one other thing in this word's n-*H*-ure: we don't
always say the H at the start, especially if we're speaking fast. Try saying something like
"talk to her" quickly: for me, it comes out as either "talk tuh her" (with an H sound) or "talk tooer"
(with no H).

That actually isn't a difference between accents, but it still strikes me as something you'd want
to let people know about if you're teaching them how to say the word. The easy way would be to list
the H and no-H pronunciations separately, like this:

<kbd aria-role="presentation">![](https://user-images.githubusercontent.com/32081933/138950143-98b9fdec-365e-41bd-9bd4-66088163d09d.png)</kbd>

But the actual OED didn't do it that way. They used parentheses, as in `(h)`, to let us know that
an H could either be there or been't there. That's a pretty efficient way of compressing two
pronunciations into one.

I'll stop my train of thought here, but please keep it in mind. We'll come back to this after the break.

### Orthographomania

Here's one other unrelated thing I have to fit in: notice that the OED's English pronunciations are in the
[International Phonetic Alphabet](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet),
or the "IPA" for short. The IPA is a great way to represent English pronunciation, but it sure isn't
the only way, because there happen to be a whole lot of idiosyncratic conventions for spelling
English out sound-by-sound. You might be familiar with a few yourself.

For instance, I have a copy of some dictionary called Webster's that writes *hʉr*. I also have a random
children's dictionary that does *hûr*. Google's dictionary has *hər*, and the
[Deseret Alphabet](https://en.wikipedia.org/wiki/Deseret_alphabet) hexes us with *𐐸𐐲𐑉*.
[Benjamin Franklin's phonetic alphabet](https://en.wikipedia.org/wiki/Benjamin_Franklin%27s_phonetic_alphabet)
would've had *hɥr* (you'll never guess the title of that article before clicking the link), while
[Isaac Newton's](https://www.jstor.org/stable/3718012), in which he spelled a sentence like
"I am much more sorry" as *Oy am mutש mωωr sory*, finishes us off with an anticlimactic *her*.

The Deseret Alphabet doesn't work great because it kinda forces you to get the vowel wrong (and trust me, it
totally would've caught on otherwise), but with the exception of that, these are all tidy
ways to represent English pronunciation. That's because they only give you one way to spell any
particular sound, unlike English's normal spelling scheme, in which the ending of "her" could also
be badly spelled "ur", "ir", or even wacky stuff like "ere" if you want to get mischievous.

Put differently, these 'phonetic' spellings are all regularly derivable from a word's underlying form. If you think
about it, that's kind of exactly what we've been talking about in this document, even though it has to do with
writing instead of speech! Isn't that nice? This should mean that we can use our program to write any word out in
**any** phonetic-spelling system we want.

In other words, just like how we can transform sounds into other sounds depending on what's around them, we can
also transform them into letters using the exact same technique. We could even transliterate English words
using other languages' scripts if we wanted. This is the most-powerful application of our future application
in my opinion, and it was actually the only reason I originally wanted to code it.

So I think that's all the big intro stuff out of the way.

----

# Arabic time

Alright, jig's up. I'm not even really working on English. This whole project is a part of a
Lebanese Arabic dictionary I was planning on making. My holy grail/hraily goal was for it to not only
be a dictionary of Lebanese Arabic, but a **really good** dictionary of Lebanese Arabic. That means
it needed to be two things:

1. Comprehensive. I wanted it to be as thorough as possible. And, even if I couldn't make it 100% comprehensive
   all by myself, I wanted to outfit it with the **ability** to be as thorough and comprehensive as possible. That means
   leaving room for new information to be added seamlessly, like new accents or definitions.
2. Comprehensible. I wanted it to be as accessible as possible. That means taking advantage of the
   medium (computer!) and embracing the technology we're on (computer!), not just making a print
   dictionary and giving it some fancy buttons. This sub-project that you're reading about right now was a good
   outlet to put that mindset to the test.

Enough with the word "her" for now, then! Here's a new example that shows a nice variety of
Lebanese accents and dialects: how would we say "she's getting up"?

| <figure><kbd aria-role="presentation"><img src="https://user-images.githubusercontent.com/32081933/135920721-0405ee7b-e5dd-4336-aaeb-c1ffff458f34.png" alt="Different ways of saying `she's getting up` throughout Lebanon, enumerated really inefficiently. There's stuff like 'aymi', 'ayma', 'oymi', 'qaymi', 'qayma', and 'gayma'." /></kbd><br/><figcaption><sup><i>You'll find people living in Lebanon who pronounce it in any number of these ways, although I'm not sure if the crossed-out combinations exist. (The ones with "o" are stereotypically Northern and coastal, the ones with "q" stereotypically Druze but also a feature of some Christian accents, and the ones with "g" stereotypically Bedouin.)</i></sup></figcaption></figure> |
| - |

Jeez, that list wouldn't look nice at all in a book or transplanted verbatim onto a webpage. But we've learned a bit about
accents and lists since the last time we saw something like this. Can we use our newfound knowledge to
compress the whole shebang into something presentable?

Sure can. If you really look at it, you'll notice that there are three "variables": three sounds that can change between accents.
I've colored them orange, blue, and magenta, respectively the consonant at the beginning, the long vowel
right after it, and the short vowel at the very end that marks the word as feminine. And each one of these three
happens to have three possible pronunciations depending on accent.

When we put them all together and try to enumerate all the possible resulting words, we blow open the doors to combinatorial hell
and end up with twenty-seven whole forms to deal with. And sure, we can nix a few of them if
we know they're not real, like how I crossed out `qoymé` and didn't list `goymi` at all, but that
still leaves us with way too much to skim. How can we do better?

Well. What if we just didn't let that combinatorial explosion happen in the first place? Let's just not expand
anything out, period. I'm thinking something like this:

<kbd aria-role="presentation">![The `she's getting up` image from earlier, but instead of expanding the whole word into every possible permutation of different pronunciations, we just list all the outcomes of each variable letter 'in place': the word can start with "q", "g", or an apostrophe, then have either "a", "e", or "o", and end with either "é", "i", or "a"](https://user-images.githubusercontent.com/32081933/135978861-8167930c-c718-4d84-8e20-3efbb163555a.png)</kbd>

That's compact! Now, anyone reading this can do the math in their head without making us
spoon-feed them with every single possible combination. For example, you can combine them by picking "q" from the first list, "a" from the
second list, and "i" from the third list to conclude that one way to pronounce this word is "qaymi".

Or: you can pick "g" from the first list, "o" from the second list, and "i" from the last one to
get the pronunciation "goymi", which... was one of the ones we said probably doesn't exist...
okay, pause. It looks like this system forces us to lose some of the precision we had earlier, because
now we have no way to exclude invalid forms like "goymi".

On top of that, it's just kind of an eyesore, isn't it? Before, when we had too many forms to even
peruse, at least each individual one was readable on its own. Here, we don't even have that, since
you definitely can't intuitively grasp the word's pronunciation at a glance. So, once more: how can
we do better?

<kbd aria-role="presentation">![An image showing the variant `'eymi`, where each of the three variable letters is conspicuously underscored with a line and an arrow. The last letter, which is the "é/i/a" variable, is shown being selected by a mouse cursor that's toggling between the three options. What jumps out is that this is actually readable at a glance, unlike the last image, because it only *shows* one letter at a time, even though it still lets you explore the full range of options by toggling them with the dropdowns](https://user-images.githubusercontent.com/32081933/135980997-eaf2f8e3-46a6-4401-9cc1-43b8b05a08db.png)</kbd>

That's right. Dropdowns. You just sat through four or five pages of README to get to dropdowns.

If we drop down to the core of this new idea, it's kinda just a visual version of what we already know. Each individual
sound in a word changes consistently depending on where it is in a word and what sounds surround it, so by actually
recognizing that in our presentation of the word by letting the letters we display change depending on its surroundings,
we can **finally** solve all three of our problems:

- ✅ **Waste of ink and paper?** Still N/A.
- ✅ **Hard to input different pronunciations without messing up?** Still solved! Our software is
  still doing the grunt work here for us.
- ✅ **Hard to read because of visual clutter?** Not at all anymore :) Only one form is displayed
  at a time, but unlike in the OED's solution, you can easily explore the full range of possible
  pronunciations if you'd like to.

With that done, I think it's about time to drop the abstract stuff and get into how this thing
really works.

# How this thing really works [WIP]

A quick note: This is the weirdest project I've ever worked on in terms of timeline. It started
life as a weekend project in December 2020 — no idea how I tricked myself into believing I was gonna make
that work — and after loads of desperate thonking, two 3-month hiatuses thanks to school, and a still-ongoing-ish
third hiatus, it's managed to balloon into taking up two entire years of my life and counting. If you ask me, the
solution I'm arriving at isn't even all that complicated or tough. It just took me an absurdly long time to get
to it.

Since it's been in the works for that long, the project has some bizarre holdovers from early
decisions that I don't stand by anymore. I still have to explain them below, though. When I discuss
those bits, I'll add a big red ❌ before them and explain what a better technique would be.

## At a high level

For the word "she's getting up", we start by passing our program the spelling `qAymc`. This isn't
a human-readable version of the word! It's designed specifically for our code to process. The `q`
stands for the original Arabic sound of [ق](https://en.wikipedia.org/wiki/Qoph), the capital `A`
stands for a long [alif ا](https://en.wikipedia.org/wiki/Aleph#Arabic), and the `c` stands for
a suffix that marks the word as feminine.

At the same time, we give our program a bunch of rules that teach it all about different Lebanese
accents. Without going into too much detail, it'll transform each letter as follows:

- `q` becomes either *[ʔ](https://en.wikipedia.org/wiki/Glottal_stop)* or, among Druze and certain
  others, *[q](https://en.wikipedia.org/wiki/Voiceless_uvular_stop)*.
- `A` becomes either a long "eh" sorta sound (similar to French *é* or *è*), a long *o*, or a long
  *a* as in either "cat" or "father".
- The letters `y` and `m` don't do anything special. They just stay true to themselves.
- `c` stands for either a short "eh" (again, like French *é* or *è*), a short *i*, or a short *a*.

Let's say we fire up the page and see _**ʔa**ym**i**_ first thing. We can click on the *i* and get
the same list of options as in that last picture above; we can click on the *a* and get the options
*o*, *a*, and *é*; and we can click on the *ʔ* to get the options *ʔ* and *q*. If we pick *o* for
the second letter, for example, the word updates to _**ʔo**ym**i**_, and we can go back to
_**ʔa**ym**i**_ by doing the same thing.

Now, remember how we said that people who have *q* aren't usually the same people who'd have an *o*
for the second sound? Our program knows that rule, too. If we select *q* to update the word to
_**qa**ym**i**_ now, *o* will stop being an option for the second letter! When we click on the *a*
in _**qa**ym**i**_, we'll only get to pick between *a* and *é*.

That happens because each letter keeps track of ones that depend on it for some rule or another.
When we update a letter ourselves by picking a new option, it tells all of its dependents to check
that it still satisfies whatever rule they're using. If not, they have to recalculate the possible
values they can take.

## At a low lev... well, it's JS

### The secret, robot-eyes-only alphabet

This is what we saw above with the word `qAymc`. This internal alphabet tries to do three things at
once:

1. Be composed only of single letters, not digraphs (e.g. no using pairs like "sh" or "ch" for
   [one single sound](https://en.wikipedia.org/wiki/Voiceless_palato-alveolar_fricative)), for
   compactness.  
   We can make an exception for letters that represent modified versions of other sounds, like how
   the sound of [ص](https://en.wikipedia.org/wiki/Tsade#Arabic_%E1%B9%A3%C4%81d) is an
   [emphatic](https://en.wikipedia.org/wiki/Emphatic_consonant) version of the "s" sound of
   [س](https://en.wikipedia.org/wiki/Shin_%28letter%29#Arabic_%C5%A1%C4%ABn/s%C4%ABn). Instead of
   using a whole new letter for each of these combos like Semitic scripts do, we'll allow ourselves
   to cut down on the size of our alphabet by composing them out of the normal sound's character
   plus a modifier.  
   For example, س corresponds to `s` in our alphabet, while ص corresponds to `s*` instead of a
   totally separate symbol.
2. Use ASCII characters that are typeable on a normal English keyboard for ease of use.
3. Identify sounds that vary consistently between different Lebanese accents and dialects, then
   ensure they can only be written in one way (e.g. with one single letter) that unifies all of those
   variants.

So that's why we had our three special letters in "she's getting up": `q`, `A`, & `c`. We know that
that first sound can be either *q* or *ʔ* in different dialects, and that that sound behaves that
way consistently throughout the language's entire vocabulary, so we need to unify them under one
single symbol; I picked `q` because the *q* pronunciation happens to be older. As for `c`, it's a
suffix that has a few weird features: it's pronounced *e* or *i* by default and *a* if there's a
'throaty' sound before it, but in this specific type of word, it can also be pronounced *a* no
matter what; if it's followed by any other suffix, it turns into *it*, and in this specific type
of word it can even become *iit* in some dialects; etc. All of those oddities mean that it won't
do to just write it with `e` or `i` or `a` or something, because we need a single symbol that
our **software** can pick the right pronunciation for depending on its context. That's why our
letter for it is unique: `c`.

#### What's wrong with the Arabic abjad?

If you know the Arabic script, I can see the look you're giving me through the screen.
Doesn't the Arabic script already solve those problems?

**(WIP)** Problems using traditional spelling:

- New developments (loaned vowels e o, schwa, different kasras, new emphatics, new ة behavior) and old cruft (ء أ إ ئ ؤ)
- Not efficient bc not intentionally/artificially designed (ص ض ط)
- Ambiguous (ـه and ـا and stuff)
- etc

Problems extending it:

- Not designed to be extensible
- Ugly (extra symbols would mess up the cursive, have to hack on weird combinations of tashkil...)
- Hard to justify why some emphatics would continue having their own symbols
- etc


#### Boring list of letters

I'm going to be explaining these sounds with reference to American English.

You might get the impression that I'm working with too many letters here. I think I get that
impression too. But! I also think it's a better plan to overshoot than to undershoot. Our code can
always merge two of these symbols into the same sound if they don't need to be told apart, but if
we instead went the economical route and accidentally ended up with only one letter for what should
be two, it might not be possible at all for our code to fix that for us.

##### Vowels

- `a`: A short *a* vowel, like in the word `damm` دم "blood". If it's in an unstressed open
  syllable, "open" meaning that there aren't any sounds after it in its own syllable, it gets
  deleted in some dialects: they pronounce `katabt` كتبت "I wrote" as if it's `ktabt`.
- `A`: A long *aa* vowel, like in `bAl` بال "mind"/"state of mind". It has a few different
  pronunciations, but here's a rough breakdown:
  - By default (if there's nothing else affecting its pronunciation), most Lebanese dialects
    pronounce it as *é*. The traditional Sidon accent pronounces it like *a* as in *cat*, though,
    and if it's in the last syllable of a word, the traditional Southern Lebanese dialect
    pronounces it like *ee* as in *peep* instead.
  - If it's after a consonant that comes out of the throat (anywhere further back than *k*), some
    dialects will keep it as above, but others will use the sound of *a* as in *cat* or even as
    in *father*. And, instead of the *a* as in *father*, certain Northern accents will use an *o*
    sound like in *pole*. This is the case in a word like `qAl` قال "he said".
  - If it's near an [emphatic](https://en.wikipedia.org/wiki/Emphatic_consonant) consonant, most
    dialects will pronounce it like the *a* in *father* or something slightly throatier. Those
    Northern accents from above will again use an *o* sound here. The word `2ijjAs*` إجّاص (where
    `2` stands for the *[ʔ](https://en.wikipedia.org/wiki/Glottal_stop)* we talked about earlier)
    is an example.
- `&`: This is a symbol I'm using for an `A` that **always** sounds like the *a* in *father* no
  matter what, like in the word `xAy` شاي "tea" (`x` stands for *sh*). Some accents don't tell
  this sound apart from the `A` as in `2ijjAs*`, so our code can merge `&` into that sound in
  those accents.
- `{`: This is an ugly symbol I'm using for an `A` that **always** sounds like the *a* in *cat*,
  which happens in proper nouns and some foreign words like `nAn` نان "Naan bread". (The only
  reason `{` is a recognizable symbol for this sound is that it happens to be the
  [ASCII International Phonetic Alphabet](https://en.wikipedia.org/wiki/X-SAMPA)'s symbol for it.)
- `i`: A short *i* vowel, like in the word `timm` "mouth". By default, it sounds like the *i* in
  *bit*. A long time ago, this `i` got deleted from most unstressed open syllables (for example,
  the word `klAb` كلاب "dogs" was originally `kilAb`), but in cases where it survived or got
  restored in that position, it can also sound like a short *ee* for some speakers. For example,
  `2ibtisAmc` إبتسامة "a smile" (from Standard Arabic ابتسامة) can sound like either
  *ib-tih-SÉ-meh* or *ib-tee-SÉ-meh*, and one way of pronouncing `jukattitI` "my jacket" (for 
  people whose word for "jacket" is `jukatta` جوكتا) is either `joo-KET-tih-ti` or
  `joo-KET-tee-ti`.
- `1`: A short *i* vowel that can **never** sound like an *ee* and can also be deleted. For
  example, `m1xAn` مشان "because"/"for the sake of" sounds like either *mih-SHÉN* or *m-shén*,
  but never *mee-SHÉN*.
- `I`: A long *ee* vowel, like in `mIn` "who?". In the traditional Southern dialect, it sounds like
  a long *é* if it's in the last syllable of a word with a consonant after it. Also, in most
  Lebanese dialects, it sounds like a short *é* if it's at the very end of a word with nothing
  after it. Some rural dialects pronounce it as *ay* word-finally, merging it with th e `Y` symbol
  down below.
- `u`: A short *u* vowel, like in `lubnAn` لبنان "Lebanon". In most Lebanese dialects, this vowel
  has merged into `i` in many words. In open syllables where it's still around, it alternates with
  a short *oo* sound in the same way as `i`.
- `0`: This is a short *u* vowel that can never sound like *oo*, like how `1` works.
- `U`: A long *oo* vowel. It's related to the *o* sound in the same way `I` is related to the *é*
  sound. Some rural dialects pronounce this as *aw* word-finally, merging it with the `W` symbol
  down below.
- `e`: A normal *é* or *è* vowel. This goes at the ends of words like `huwwe` "he" and `hiyye`
  "she", and we only use it if a word doesn't actually end in `I` or `c`. It also shows up in
  foreign loanwords and proper nouns like `fetta` "Feta cheese" and the name *Elie*.
- `E`: A long version of the `e` sound. This mainly shows up in foreign words like `motEr` "motor"
  (from French *moteur*), although it also appears in the word `tEtA` تيتا/تاتا "grandma" for
  some of us.
- `o`: A normal *o* vowel. This is mostly for foreign words like `sbIrto` "rubbing alcohol"
  (from Italian *spirito*). A rare few Syrian dialects also have it in the native word `hinno`,
  which means "they" when referring specifically to a group of males or of unknown gender (whereas
  `hinne` is the feminine version), but I don't think that's a thing in any Lebanese varieties,
  where we instead have `hinne` as a gender-neutral third-person plural pronoun.
- `O`: A long version of `o`. This is again for foreign words like `bOt` "(certain types of) shoes"
  or `bant*alOn` بنطلون "pants". For some speakers, it can merge into `W` down below: "pants" can
  be `bant*alWn`.
- `Y`: A sound that's either a diphthong *ay* or a long vowel that sounds like `E`. There was
  originally nothing like `Y` in Arabic because it was once just a normal `a` followed by a `y`,
  but over the ages, the sequence of two sounds has merged into one single long vowel that makes
  the most sense when you see it as a unit in itself. Most people pronounce `Y` as if it's `ay` or
  `ey` when it's the very last sound in its syllable and as `E` otherwise, but there are four or
  five other ways it breaks down throughout different Lebanese accents.
- `W`: A sound that's either a diphthong *aw* or a long vowel sound like `O`. Everything above
  about `Y` applies here too.

##### Consonants

WIP
