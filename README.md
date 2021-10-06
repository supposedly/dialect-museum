# [Lebanese-orthography demo](https://write.lebn.xyz)

**Introduction**

1. [Quick background](#quick-background)
2. [Unquick background](#unquick-background)
3. [A pronunciation problem](#a-pronunciation-problem)

**Technical info**

4. [How this thing works](#how-this-thing-works)<!--comment to stop vsc from inserting toc-->
     1. [At a high level](#at-a-high-level)
     2. [At a low lev... well, it's JS](#at-a-low-lev-well-its-js)
5. [Development info](#development-info)
## Quick background

1. This repo is part of a larger project where I'm trying to make a dictionary of Lebanese Arabic.
2. A **really good** dictionary of Lebanese Arabic.
   1. I want it to be as comprehensive as possible.
   2. I also want it to take advantage of the fact that it's on the Internet, so I don't want to treat it like it's just a print dictionary with a frontend.
3. That means doing some stuff differently from how you'd do it on paper.

In this repo, I'm describing a way for a dictionary to represent **all** ways a word can be 
pronounced, not just a select few.

## Unquick background

> I am large, I contain multitudes. *—Walt Whitman describing the Arabic language (probably)*

Arabic is big. The language spoken in Morocco is way different from the one spoken in Oman, for
example, which makes sense, seeing as they've got 8,000km and more than 1,000 years of separation
between them. No matter whether you call all of Arabic's different flavors "dialects" or
"languages" (it mostly depends on the type of person you'd like to get yelled at by), there's no
denying that they're **somehow** different from each other.

You don't even need to cover all eight thousand of those kilometers to clock how strongly they can differ. Like with a lot of other languages, just moving from one village to the next
is enough to hear marked differences in the dialect. This means that convenient, blankety terms
like "Moroccan Arabic" and "Omani Arabic" don't hold up so strongly when you take a closer look...
there are zillions of different Moroccan Arabics between one end of the country and another.

I'm gonna turn my focus to my own country of Lebanon with that in mind. It's barely the size of
Rhode Island and Delaware put together (for non-Americans, that means it's roughly the size of
Lebanon), but the Arabic spoken throughout it probably varies more than English does throughout
the entire United States. So, if I tell you I'm trying to make a dictionary of "Lebanese Arabic",
which Lebanese Arabic am I actually talking about?

## A pronunciation problem

Ideally, I'd be talking about all "Lebanese Arabics", right? It would be amazing to have a
dictionary that's equipped to handle **all** of the varieties of whatever language it's covering.
The place for that to shine would be in the "pronunciation" section of every entry, where it'd be
awfully helpful to show off all the different ways each word can be pronounced in different
accents or dialects.

<figure>
<img src="https://user-images.githubusercontent.com/32081933/135920721-0405ee7b-e5dd-4336-aaeb-c1ffff458f34.png" alt="different ways of saying `she's getting up` throughout Lebanon, enumerated really inefficiently" />
<figcaption>
    <sup><i>A word like "she's getting up" makes a few of Lebanon's accent differences very
    noticeable. You'll find people living in Lebanon who pronounce it in any number of these ways,
    although I'm not sure if the crossed-out combinations exist. (The ones with "o" are
    stereotypically Northern, the ones with "q" are stereotypically Druze, and the ones with "g"
    are stereotypically Bedouin.)</i></sup>
</figcaption>
</figure>

&#x200B;

But, jeez, it's really inefficient to list out every imaginable variant of every single word. And
the fact that you have to do it that way in order to be comprehensive makes
comprehensiveness a huge waste of ink and paper overall. That's because — and this is about to be
the lamest truism ever, but bear with me — in print, the text on a page **_is_** the data it
represents, meaning you can't pack your data efficiently if you want to make it readable (and vice
versa). If you want to record some data in your print dictionary, the reader is going to see it in
the exact format you record it in, so they had better be able to consume it as is. In other words,
there's no good way to compress that list of "she's getting up" variants into something
space-efficient without making it totally impenetrable.

Most language references and dictionaries get around all that by just making a beeline for the
standard form&zwj;<!-- zwj apparently works like a zero-width nbsp -->(s) of the language,
regional dialects be darmbed. For example, the Oxford English Dictionary only gives itself room to
care about the U.S. and British standard pronunciations, ignoring other UK dialects and regional US
ones. But
vernacular Arabics are totally unstandardized, so we can't even take that route here! And it would
feel weird to try to fill in the gap by coming up with our own standard to follow in those
footsteps with. After all, we're kind of trying to document all sorts of Lebanese Arabic varieties
here, and ditching half of them to focus on one arbitrary "standard" seems counterproductive —
especially if we get lazy and just pick some big-city dialect for convenience, since that's
literally why some distinct rural dialects are on the decline and need documentation in the first
place.

So it really feels like we're stuck here. We can't really justify recording all our words in just
one arbitrary dialect, but at the same time, how do we even begin to find an efficient way of
writing down as many different forms as possible?

## Sorry, one sec, someone's at the door

![door getting knocked on](https://user-images.githubusercontent.com/32081933/135816561-5403e593-d2fe-42a4-8ac4-392be92aceb4.png)

Hey, they want to come in! I wonder who it is?

![door opening with Internet Explorer logo standing outside](https://user-images.githubusercontent.com/32081933/135820008-48345669-b108-4eb9-8088-49b14d572ac3.png)

Oh. It's just the Internet. Which... wait, has it been here this whole time?

Huh, I guess that's right. We're on computers and web browsers right now, not papyrus or whatever
they used before 1970. So why are we even talking about print dictionaries? Why don't we let our
computers do their whole computer thing and give us a little help?

If you'll notice, the oopsie in that "she's getting up" picture above was that we had three
variables — orange (the first letter), blue (second), and pink (last) — all varying together in the same exact word. When we tried to permute that out into every single possible resulting string
we booked ourselves a ticket straight into the pits of combinatorial hell. But, well... we can
totally tame those flames if we try expanding depthwise instead of breadthwise:

![the `she's getting up` image from earlier, but instead of expanding the whole word into every possible permutation, we just list all the outcomes of each variable letter 'in place': the word can start with "q", "g", or an apostrophe, then have either "a", "e", or "o", and end with either "é", "i", or "a"](https://user-images.githubusercontent.com/32081933/135978861-8167930c-c718-4d84-8e20-3efbb163555a.png)

And our cool new problem is that this notation makes zero sense at a glance, and that, even if you
do understand what it's trying to say, it's still hard to get an intuitive feel for it. We
couldn't publish this in a printed work and expect to help anyone.

But, again, well... we have the technology:

![An image showing the variant `'eymi`, where each of the three variable letters is conspicuously underscored with a line and an arrow. The last letter, which is the "é/i/a" variable, is shown being selected by a mouse cursor that's toggling between the three options. What jumps out is that this is actually readable at a glance, unlike the last image, because it only *shows* one letter at a time, even though it still lets you explore the full range of options](https://user-images.githubusercontent.com/32081933/135980997-eaf2f8e3-46a6-4401-9cc1-43b8b05a08db.png)

That's right. I made you sit through a whole page of buildup so I could end up explaining
dropdowns. And just you wait for the rest of this README.

Anyway. The whole reason we were "even talking about print dictionaries" earlier is that some
features of
print dictionaries have managed to stow their way onto the Internet without ever being targeted
for a touchup, even after all these years. Pronunciation guides are among the boldest of those
stowaways in my book. The thing is that, on a computer, your raw data **doesn't** have to double
as your displayed text; you have time to transform that data into all sorts of human-readable
doohickiness before you actually show it to the reader, and there are so many different ways we
could take advantage of that in a dictionary or language reference to get our info across
comprehensively and intuitively. But sites like
[Wiktionary](https://en.wiktionary.org/wiki/Main_Page),
as admirable as they are in scope, are literally built around that sort of
page-text-is-raw-data double duty, and it stops so many potential improvements from even being
dreamt up.

So this whole idea isn't anything revolutionary when you look at it. It's literally dropdowns. But
I still don't think it's been done before, and I think explaining why it's necessary is just as
important as actually implementing it, so I sure hope that that run-up made some sense. Now, let's
get into how this thing works.

## How this thing works

Until now, I've been picking between the words "dialect" and "accent" by flipping a
two-sided die. From here on, though, I'll stick to "accent" alone, since that's more what this specific project's about.

### At a high level

The big idea is that the different accents of a language don't just arise randomly. They're
related to each other in consistent, predictable ways, and if you know the ways, you can
confidently work out what forms a particular word could take in another accent. For
example, how do Americans know to imitate British accents by saying stuff like
"Bri'ish" and "Chewsday"? They've intuitively picked up on how a "T" sound between two vowels can
[get deleted](https://en.wikipedia.org/wiki/T-glottalization)
in some UK dialects, and how one that's before a "Y" sound can get
[CH-ified](https://en.wikipedia.org/wiki/Yod-coalescence).

And, say, what if we wanted to try unifying both the British and American pronunciations
of that second word under one single spelling? By working backwards to determine a system of consistent, predictable spelling rules, we might end up at something that looks like
"Tuesday", which is consistent and predictable because... wait...

Okay, so English actually has a real spelling system that technically already
unifies all its different dialects, but lets ignor Inglish spelling fur now so we can
concoct our own system instead. If we try to improvise some phonetic spellings to start
with, we might say that there are three main ways to say Tuesday: "Choozday" (UK), "Toozday"
(American), and "Tyoozday" (UK/both). But what's the logic underpinning
those differences?

With some solid knowledge of English sound shifts, we can figure out that the "Choozday"
pronunciation smacks of what's called
[yod-coalescence](https://en.wikipedia.org/wiki/Yod-coalescence),
and, in comparison, the "Toozday" one looks a lot like
[yod-dropping](https://en.wikipedia.org/wiki/Yod-dropping). Basically, lots of UK dialects
of English tend to blend a sequence of "t" plus "y" into a single "ch" sound, while lots of American
dialects tend to drop the "y" altogether there. So... what it seems like we've found out is that
"Tyoozday" is the original pronunciation. What's more is that we actually have some regular rules we
can use to transform this original word, "Tyoozday", into the forms it can take in some dialects:

- For some American dialects, if there's a "y" right after a sound that uses the tip of the
  tongue (like "t"), just drop the "y".
  - Applying this rule to "Tyoozday" produces **"Toozday"**.
- For some UK dialects, if there's a "t" with a "y" right after it, blend them together
  into "ch".
  - Applying this rule to "Tyoozday" produces **"Choozday"**.
- For some other American and UK dialects, don't do either of those things.
  - Applying this rule to "Tyoozday" just gives us **"Tyoozday"** right back.

You see where this is going? What if we could feed the original spelling, "Tyoozday", into a
computer, and have it automatically spit both "Toozday" and "Choozday" back out at us? It should
be able to figure them out if we give it those rules, after all.

Going a step further, building off of that dropdown idea from earlier, what if we could let our
reader explore all the different pronunciations of the word "Tuesday" at once? We could store
it under the hood like `[t, ch][y, ∅]oozday` to let the user toggle between
<code>[<u>t</u>](#)[<u>y</u>](#)oozday</code>, <code>[<u>ch</u>](#)oozday</code>, and
<code>[<u>t</u>](#)oozday</code> via the frontend.

Also, we don't even have to stick to our improvised phonetic writing system. If
our entire language is just a system of rules that transform symbols into other symbols,
those symbols could actually be whatever we'd like them to be, couldn't they? We could have our
program display those options as `/ˈtjuzde͡ɪ/, /ˈt͡ʃuzde͡ɪ/, /ˈtuzde͡ɪ/` in the
[IPA](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet),
`tyo͞ozdā, CHo͞ozdā, to͞ozdā` in the pronunciation alphabet Google's dictionary uses,
`𐐓𐐷𐐭𐑆𐐼𐐩/𐐓𐑏𐑆𐐼𐐩, 𐐕𐑏𐑆𐐼𐐩, 𐐓𐐭𐑆𐐼𐐩` in the
[Deseret alphabet](https://en.wikipedia.org/wiki/Deseret_alphabet) (why not), and anything else
in any other script we want. Unfortunately, this system doesn't work so well with English's
actual orthography, since it relies on a word's spelling being uniquely derivable from its
pronunciation, but — fortunately — we're going to be working with Lebanese Arabic going forward, not
English 😎

### At a low lev... well, it's JS

...


## Development info
`npm run build` to build for production (to `/dist`) and `npm run serve` to develop.
