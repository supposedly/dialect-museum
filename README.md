# Lebanese-orthography demo
## Three-bullet background (on the next part)

1. This repo is part of a larger project where I'm trying to make a dictionary of Lebanese Arabic.
2. A **really good** dictionary of Lebanese Arabic. I want it to take advantage of the fact that it's on the Internet, so I don't want to treat it like it's just a print dictionary that has a frontend.
3. That means doing stuff differently from how you'd do it on paper... including, for one example, pronunciation guides!

## Three-paragraph background (on the next part)

> Do I contradict myself?  
> Very well then I contradict myself,  
> (I am large, I contain multitudes.)  
> _— the Arabic language describing itself_  
> _(or just some guy named Walt)_

Arabic is big. The language spoken in Morocco is way different from the one spoken in Oman, for example, which makes sense, seeing as they've got 8,000km and more than 1,000 years of separation between them. No matter whether you call all of Arabic's different flavors "dialects" or "languages" (it mostly depends on the type of person you'd like to get yelled at by), there's no denying that they're **somehow** different from each other.

And you don't even need to cover all eight thousand of those kilometers to clock how strongly the language can differ. Like with a lot of other languages, just moving from one village to the next is enough to hear marked differences in the dialect. This means that convenient, blankety terms like "Moroccan Arabic" and "Omani Arabic" don't hold up so strongly when you take a closer look... there are zillions of different Moroccan Arabics between one end of the country and another.

So I'm gonna turn my focus to my own country of Lebanon now. It's barely the size of Rhode Island and Delaware put together (for any non-Americans: I mean Lebanon is roughly the size of Lebanon), but the Arabic spoken throughout it probably varies more than English does throughout the entire United States. So, if I tell you I'm trying to make a dictionary of "Lebanese Arabic", what Lebanese Arabic am I actually talking about?

## A pronunciation problem (the next part of the README)
Ideally, I'd be talking about all of Lebanese Arabic, right? It would be amazing to have a dictionary that's equipped to handle **all** of the varieties of whatever language it's about. The best place for that to shine would be in the "pronunciation" section of every entry, where it'd be awfully helpful to show off all the different ways each word can be pronounced in different accents.

<figure>
<img src="https://user-images.githubusercontent.com/32081933/135920721-0405ee7b-e5dd-4336-aaeb-c1ffff458f34.png" alt="different ways of saying `she's getting up` throughout Lebanon, enumerated really inefficiently" />
<figcaption><sup><i>A word like "she's getting up" makes a few of Lebanon's accent differences very noticeable. You'll find people living in Lebanon who pronounce it in any number of these ways, although I'm not sure if the crossed-out combinations exist. (The ones with "o" are stereotypically Northern, the ones with "q" are stereotypically Druze, and the ones with "g" are stereotypically Bedouin.)</i></sup></figcaption>
</figure>

&#x200B;

But, jeez, it's really inefficient to list out every imaginable variant of every single word. And that's pretty much the only way to do it if you want to be comprehensive, which makes comprehensiveness a huge waste of ink and paper overall. That's because — and this is about to be the lamest truism ever, but bear with me — in print, the text on a page **is** the data it represents, meaning you can't pack your data efficiently if you want to make it readable... and vice versa. In other words, if you want to record some data in your print dictionary, the reader is going to see it in the exact format you record it in, so they had better be able to consume it as is. In other words, there's no good way to compress that list of "she's getting up" variants into something space-efficient without making it totally impenetrable.

Most reference works get around all that by just making a beeline for the standard form&zwj;<!-- zwj apparently works like a zero-width nbsp -->(s) of the language, regional dialects be darnged. But vernacular Arabics are totally unstandardized, so we don't even have that! And it feels weird to try to fill in the gap by coming up with our own standard in order to follow in those footsteps. After all, we're kind of trying to document all sorts of Lebanese Arabic varieties here, and ditching half of them to focus on one arbitrary "standard" seems counterproductive — especially if we get lazy and pick some big-city dialect for convenience, since that's literally why some distinct rural dialects are on the decline and need documentation in the first place.

So it really feels like we're stuck here. We can't really justify recording all our words in just one arbitrary dialect, but at the same time, how do we even begin to find an efficient way of printing as many different forms as possible?

## Sorry, one sec, someone's at the door
![door getting knocked on](https://user-images.githubusercontent.com/32081933/135816561-5403e593-d2fe-42a4-8ac4-392be92aceb4.png)

Hey, they want to come in! I wonder who it is?

![door opening with Internet Explorer logo standing outside](https://user-images.githubusercontent.com/32081933/135820008-48345669-b108-4eb9-8088-49b14d572ac3.png)

Oh. It's just the Internet. Which... wait, has it been here this whole time?

I guess that's right, huh. We're on computers and web browsers right now, not papyrus or whatever they used before 1970. So why are we even talking about print dictionaries? How about we let our computers do their whole computer thing and help us out?

If you'll notice, the oopsie with that "she's getting up" picture above was that we had three variables — the orange letter (first), the blue letter (second), and the pink letter (last) — all co-varying in the same exact string. To try and permute that out into every single possible resulting word is to book a ticket straight into the pits of combinatorial hell, only to get scorched even harder the more variables our word has. But, well... we can totally tame those flames if we try expanding depthwise instead of breadthwise:

![the `she's getting up` image from earlier, but with each ](https://user-images.githubusercontent.com/32081933/135978861-8167930c-c718-4d84-8e20-3efbb163555a.png)

And our cool new problem is that this notation makes no sense at a glance, and that, even if you do understand what it's trying to say, it's still hard to get an intuitive feel for it. We couldn't publish this in a printed work and expect to help anyone.

But, again, well... this is computers:

![eyme-computer](https://user-images.githubusercontent.com/32081933/135980997-eaf2f8e3-46a6-4401-9cc1-43b8b05a08db.png)

That's right. I made you sit through a whole page of buildup so I could end with dropdowns. And just you wait for the rest of this README — we're going to push these dropdowns to their absolute limits.

The whole reason we were "even talking about print dictionaries" earlier is that some features of print dictionaries have managed to stow their way onto the Internet without ever being targeted for a touchup, even after all these years. Pronunciation guides are among the boldest of those stowaways in my book. The thing is that, on a computer, your raw data **doesn't** have to double as your displayed text; you have room to transform that data into all sorts of human-readable doohickiness before you actually show it to the reader, and there are so many different ways we could take advantage of that in a dictionary or language reference to get our info across more-completely and more-intuitively. But sites like [Wiktionary](https://en.wiktionary.org/wiki/Main_Page), as admirable as their scope is, are literally built around that sort of page-text-is-raw-data double duty, and it stops so many potential improvements from even being dreamt up.

So this whole idea isn't anything revolutionary when you look at it. It's literally dropdowns. But I still don't think it's been done before, and I think explaining why it's necessary is just as important as actually implementing it, so I sure hope that that run-up made some sense. Now, let's get into how this thing works.

## How this thing works

Just kidding. We'll get into that when I wake up tomorrow. In the meantime, laugh at my section headers:

### At a high level


### At a low... well, it's JS

...


## Development info
`npm run build` to build for production (to `/dist`) and `npm run serve` to develop.
