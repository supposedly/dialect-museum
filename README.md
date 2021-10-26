# [A Journey in Overthinking It](https://write.lebn.xyz)

## The problem

I don't like this.

<kbd aria-role="presentation">![A partial screenshot of the Oxford English Dictionary's definition of the word 'her'. It describes the word as a pronoun and noun and says it's pronounced "huhh" or "uhh" by Britons and "her" or "er" by Americans.](https://user-images.githubusercontent.com/32081933/136824054-6e3da3cc-6005-40d7-94d5-7d1845ad0e41.png)</kbd>

### Her? <!-- omit in toc -->

No, I hardly know her. What I don't like there is the bit about pronunciation.

That's a screenshot from the Oxford English Dictionary's online portal. The OED hit the Internet
before I was born (a couple decades ago) and came into existence just a bit earlier (a
couple centuries ago), making it one of the oldest and foremost dictionaries of English. It's spent
most of its life being the best paper dictionary it could be.

The online OED is pretty much the same old thing. It's a print dictionary with a web frontend,
meaning there's almost no difference in the experience from the book version. And the book version
has clearly proven its mettle, so what's not to like?

### What's not to like

<kbd aria-role="presentation">![A "meme", visibly edited from a meme that originally read "Inside Each of Us Are Two Wolves; One has depression, The other has depression; You Have Depression". The modified image reads: "Inside Each of Us Are Two (ACCENT). One has (R SOUND) the other has (NO R SOUND). You have (ENGLISH LANGUAGE)"](https://user-images.githubusercontent.com/32081933/137174170-78fe42cc-89c6-4412-903e-3b10a7038c9b.png)</kbd>

Look at the pronunciations they've got for the word "her". They come in two accents: a
British one that doesn't pronounce the R, and an American one that does. It does feel nice to
see them straddling the pond for us like that, but, hey, how wide to a side ought a straddle to
stride? How many accents per continent should they actually be covering? There sure isn't only one
kind of English spoken throughout the whole US, let alone all of Britain, let alone-alone the UK in
general. And I hear there's even a little bit of the rest of the world to contend with...

Well, they've got a few excuses to uses. Personally, I think a big, fat dictionary of English needs
to document as much of the English language as it can, but I'll admit that there's a lot hinging on
that very last word: *can*. A print dictionary has a few important tradeoffs to make when balancing
how much it *should* document with how much it *can* document. A lot of the time, it just isn't
possible or feasible to record everything there is to record.

For example, I'm betting that someone using a dictionary for normal-person reasons won't have much
fun looking at this:

| <figure><kbd aria-role="presentation"><img src="https://user-images.githubusercontent.com/32081933/136869976-acf84922-88ca-4ba0-8a7c-bc447a8575f5.png" alt="The above OED screenshot, just edited to show a flat-out-impractical number of different pronunciations." /></kbd><figcaption><sup><i>I've tactically concentrated all of my of errors into this one image to divert your attention from any other mistakes I might've made in this document.</i></sup></figcaption></figure> |
| - |

Doesn't that just suck? I mean, think of all the times you've forgotten a word as complicated as
"her". Imagine subjecting your eyeballs to all of those unsightly pronunciation runes every single
time you had to remind yourself how to read it. On top of that, imagine a dictionary trying to do
that for. Every. Single. Word. They'd run out of pages after, um, "aardwolf", which is
apparently what comes after "aardvark". (Promise I'm not lying. The next word is aardxylophone.)

Now, sure, we don't actually have to keep all of those different pronunciations in sight at all
times. We're talking about the online OED here, not the paper one. For instance, you see what
they've done with that **Forms** section right under our accent accident? That section is actually
huge, but through the magic of technology, they've taken the entire thing and shoved it behind a
**(Show More)** button that you're free to leave as unclicked as you like. We could take a leaf out
of their ebook<sub>(boomer joke, sue me)</sub> and hide all of our different pronunciations behind
something like that, too, but...

<details>
  <summary><b>(Show More)</b></summary>

  ...it just isn't great, is it? This didn't actually do anything to manage the clutter we created
  — it just let us furnish it with an element of surprise.

  Anyway, don't people usually check the pronunciation section just to get a quick idea of how to
  say the word they're looking at? I don't love the idea of forcing that kind of person to wade
  through a bunch of uninteresting variants just to find what they need, boring the daylights out of
  them in the sole interest of correctness. I mean, I do take an interest in correctness, possibly
  even a sole interest — I just don't think it should think it should come with such a huge
  tradeoff.
</details>

Besides, those detailed pronunciations I added aren't even totally correct. Part of it's on me for
not being Susie Dent (next life, maybe!), but even if I did know the world's Englishes inside and
out, I still wouldn't trust myself to keep my accuracy up if I always had to list so many of those out manually. Humans make mistakes doing things, and we make more mistakes doing more
things.

Let's break the pace with a recap.

### The state of our problem

#### On paper <!-- omit in toc -->

- We thought it could be pretty cool for our dictionary to acknowledge more accents and dialects
  than just two major ones. After all, more people speak the language than some standard-issue Brit
  and their Generically American friend.
- We can't do that comprehensively in a print dictionary, though:
  1. ❌ It'd waste a ton of valuable ink and paper.
  2. ❌ The dictionary's editors would have to compile all the different dialects' forms of each 
     word manually, and that process is just swarming with chances to mess up.
  3. ❌ Readers who just don't care would have no way to skip past it.

This is why dictionaries never bother fleshing out their pronunciation keys beyond a couple of
major dialects. It's a logistical nightmare if you're working in print.

But wait, we're not working in print. We're computer. The biggest difference is that, on a
computer, the text you show the reader **doesn't** have to be the exact same as the actual data you
recorded — you have some room to mess around with how you display it to format it digestibly. What
if an online dictionary took advantage of that and shed its paper shackles? Can we harness the
power of computer for great good?

#### Wow, look: digital style <!-- omit in toc -->

<kbd>![carsalesmeme](https://user-images.githubusercontent.com/32081933/137770895-d1c2b4be-0335-4a00-9d58-cf626628163a.png)</kbd>

Okay, so we're doing our stuff with computers now, not papyrus or whatever they used before 1970.
Here's what that means for us:

- ✔️ We don't have to worry about running out of ink and paper. A computer has, like, infinite
  amounts of that stuff in it.
- ❌ #2 is still a problem, though. Having a human enter all those different forms manually
  is just begging them to screw up at some point.
- ❌ And we haven't addressed #3. Accounting for all of the English accents in the world just
  makes for too much info! We tried hiding all of it behind an expandable widget, like with that
  **(Show More)** thing, but we found out that that doesn't exactly solve the problem... it's more
  like just shoving it inside a drawer.

We're making some progress, but we're still not all the way there. With 2/3 of our key issues still
unsolved, it's starting to look like a good idea to cut our losses and stay satisfied with our two
measly little accents, but I still need to write the rest of this README, so I'm going to pretend I
didn't say that. Onward!

As I see it, our big problem is that we're **still treating our computer dictionary like a print
dictionary.** We're still following that same old workflow where we record everything as raw text
and display it almost-unchanged. Instead, we should really be looking at ways to get our software
to cut out some of our work for us. For example, why do we have to be the ones to keep all of the
different accents of our language in our head? Could we somehow get some help with that?

## Thinking about a solution

### What's in an accent, anyway?

For our next step, we should start asking some questions about how accents actually work.  
For example, how do accents actually work? Also, how do they arise? And how are they related to
each other? Can we exploit any properties of theirs for our nefarious needs?

#### Spare some change, sir?

Here are three fun facts about language. (I'm simplifying a bit but not wrongifying)

1. Human languages are always changing. As long as a language is getting used for natural, everyday
   communication, it's going to be undergoing changes without its speakers even knowing it.
2. Much like something I can't quite remember right now, those changes only spread through
   real-life, face-to-face transmission. They can catch on really easily between speakers
   who are in constant contact with one another, but they don't grow wings and cross oceans
   if people don't physically carry them over.
3. This stuff arises totally randomly. We can never confidently predict what changes a language
   about to undergo. Also, it's super unlikely for lightning to strike twice and make the exact
   same changes repeat themselves in different locations. If you've got a language with a few
   groups of speakers that are pretty isolated from one another, that's practically a guarantee
   that they'll be undergoing different changes from each other.

So what happens if the groups from #3 never actually get back in touch? What happens to their
language if they hold onto it?

Well, the answer is nothing, kinda. They keep speaking it, the same as ever, and it keeps changing
and developing, just the same as ever. But, and this is also just like something I wish I could
remember, the isolation would have to catch up to them eventually. With all of those
divergent changes piling up over time, could things ever get to a point where they couldn't even
understand each other anymore? How long would that have to take?

A year? Nope, fortunately. There's this one case where linguists
[analyzed](https://www.scientificamerican.com/podcast/episode/linguists-hear-an-accent-begin/)
the difference between an Antarctic research team's English accents before and after they spent one
year alone in Antarctica, and to everyone's surprise, they did not come back speaking
English 2. Their vowels did change a teeny little bit, though!

A hundred years? Not quite. There's a
[community of Cretans](https://en.wikipedia.org/wiki/Al-Hamidiyah) who were granted refuge in
Syria at the turn of the 20th century, and according to my sample size of 1.5 (I asked the same
guy twice), their Greek language is still totally peggable as Cretan even though they've spent a
whole century in isolation from ~~mainisland~~ mainland Crete.

[Six thousand years and counting](https://www.youtube.com/watch?v=aQ283N_ZdKY)? Okay. Yeah. Now
we're talking.

New languages [usually](https://en.wikipedia.org/wiki/Nicaraguan_Sign_Language) don't just arise
out of nowhere. We all know about the Romance languages and how they all go back to Latin, for
example, right? That happened when the different Roman colonies, having not invented cellphones
yet, started racking up changes in their Latin language over centuries of no contact with the rest
of the entire expired empire. Naturally, some of those changes were thanks to influence from other
local languages — like,
[Romanian's got a few tales to tell](https://en.wikipedia.org/wiki/Slavic_influence_on_Romanian)
— but they also came from spending **ages** developing independently. After several hundred years,
that was enough to get us multiple different Romance languages out of what was once one Latin.

And what does Latin itself go back to? This is that six-thousand-years part. It's also the crazy
part. Something historical linguists are practically sure of is that a ton of languages from all
throughout Europe and India — Russian, Greek, Persian, English, German, the Scandinavian
languages, Icelandic, Hindi, etc., plus ancient languages like Latin and Sanskrit — were just
[one single language](https://en.wikipedia.org/wiki/Proto-Indo-European_language) more than 6,000
years ago! Its speakers spent about 3,000 years in their
[make-like-a-plot-and-scatter phase](https://en.wikipedia.org/wiki/Indo-European_migrations),
spreading their descendants over a huge swath of land and ensuring that their language would
splinter over multitudes of different paths for eons to come. This is the fate of any language that
gets split up, as long as it gets enough time to live the destiny out.

#### Okay, cool, but like... reel it in <!-- omit in toc -->

Right. We were only talking about accents and stuff. I just really wanted to highlight how cool it
is that it's all the same thing, and that what we call "accents" and "dialects" are just a little
bit early on the way to what we might call "languages".

So we've found out some stuff about what an accent is. We already knew that it had to do with how
people pronounce things differently from each other, and now we also know that those differences come
about when the language `c h a n g e s ✨` thanks to separation. But there's a huge question hidden
in there that I got too carried away to ask or answer.

What's change?

#### Spare some regular change, sir?

We're finally getting to the meaty bits. The one little thing that makes this entire project tick
is that sound changes are **regular** and **indiscriminate**. When a sound change happens, it
doesn't just affect individual sounds in random individual words — it wipes out the entire language
in one go. Any word that has that sound in the right spot feels the burn.

For example, let's head all the way back to the word "her". A stereotypical American would pronounce
the R sound at the end of it, while a stereotypical British person would pronounce no R at the end.
But it's not just that one word! That British accent doesn't pronounce any R at the end of any word
or syllable, and that American accent does pronounce them all.

This gives away a little something hidden in our Rs. What it tells us is that the English language
used to have an R sound that was always pronounced, and that the British people that came to
colonize North America still had that R in their accents. It was only after the standard American
accent had established itself that mainstream British pronunciation must've lost that R — by pure
chance!

### Running it home

Let's try applying what we know now to our dictionary problem.

If both pronunciations of "her" are related by a rule that applies consistently to our whole
language, couldn't we just get our software to know that rule for us instead of doing it ourselves?
That way, instead of forcing ourselves to write out both `/həː/` and `/həɹ/` (for example), we
could just...

1. Start with one single, original form. This is gonna be a form that has an R sound.
2. Pass that OG form off to our software. Teach it the rule we've come up with: in some accents,
   the R sound disappears at the end of a word or syllable.
3. Have it automatically generate our different forms for us. Brew an instant coffee in the
   meantime (a **really** instant coffee)

And that's it! It's not that much of a timesave for only two forms like `/həː/` and `/həɹ/`,
sure, but remember that one of our original plans was to expand our operations to all sorts of
different English accents worldwide. This lets us do that sustainably and scalably. Instead of
having to remember all of the different vowel–consonant combos and punch them in manually,
we can just teach our program all of the rules we already know, and make it generate them all
based on that.

## Further implications (wow)

### The state of our problem again

Where are we at after all of that?

- ✔️ Ink and paper? Still haven't run out.
- ✔️ Too many different pronunciations for a human to reliably keep track of? All good! We solved
  it by not making a human keep track of them anymore.
- ❌ Okay, we didn't exactly talk about the too-much-info problem... our different pronunciations
  are still going to clutter up the page. Our best duct-tape solution is still that **(Show More)**
  widget that we didn't love.

We're 2 for 3 now! Can we do anything about that third one?

### Data, data, data

cool thing about computers is transform data etc

dropdowns!!!

### Orthographomania

literally ANY orthography

----

# Arabic time

Why am I doing this for Lebanese Arabic? Where else could it apply? Etc

| <figure><kbd aria-role="presentation"><img src="https://user-images.githubusercontent.com/32081933/135920721-0405ee7b-e5dd-4336-aaeb-c1ffff458f34.png" alt="different ways of saying `she's getting up` throughout Lebanon, enumerated really inefficiently" /></kbd><figcaption><sup><i>A word like "she's getting up" makes a few of Lebanon's accent differences very noticeable. You'll find people living in Lebanon who pronounce it in any number of these ways, although I'm not sure if the crossed-out combinations exist. (The ones with "o" are stereotypically Northern, the ones with "q" are stereotypically Druze, and the ones with "g" are stereotypically Bedouin.)</i></sup></figcaption></figure> |
| - |

<kbd aria-role="presentation">![the `she's getting up` image from earlier, but instead of expanding the whole word into every possible permutation, we just list all the outcomes of each variable letter 'in place': the word can start with "q", "g", or an apostrophe, then have either "a", "e", or "o", and end with either "é", "i", or "a"](https://user-images.githubusercontent.com/32081933/135978861-8167930c-c718-4d84-8e20-3efbb163555a.png)</kbd>

<kbd aria-role="presentation">![An image showing the variant `'eymi`, where each of the three variable letters is conspicuously underscored with a line and an arrow. The last letter, which is the "é/i/a" variable, is shown being selected by a mouse cursor that's toggling between the three options. What jumps out is that this is actually readable at a glance, unlike the last image, because it only *shows* one letter at a time, even though it still lets you explore the full range of options](https://user-images.githubusercontent.com/32081933/135980997-eaf2f8e3-46a6-4401-9cc1-43b8b05a08db.png)</kbd>


## How this thing works

### Mistakes

### At a high level

### At a low lev... well, it's JS
