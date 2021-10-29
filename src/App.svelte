<script>
  import {Parser, Grammar} from "nearley";
  import * as grammar from "./backend/conversion/parsing/grammar.js";
  import {Word, keys} from "./backend/conversion/transformers/common/classes";
  import wordType from "./backend/conversion/parsing/type";
  import {type as segType} from "./backend/conversion/objects";
  import {
    alphabet as abc,
    location,
    tamToken,
    wazn,
  } from "./backend/conversion/symbols";
  import type from "./backend/conversion/parsing/type";
  import match from "./backend/conversion/transformers/common/match.js";

  import {Tabs, Tab, TabList, TabPanel} from "svelte-tabs";

  const compiledGrammar = Grammar.fromCompiled(grammar);

  function join(res, delim = ` `, pre = ``, post = ``) {
    const joined = res
      .map((word) => {
        if (Array.isArray(word)) {
          return join(word, `/`, ...(word.length > 1 ? [`(`, `)`] : []));
      }

        word = new Word(word, {underlying: abc, phonic: abc, surface: {}});
        // const {underlying, phonic, surface} = word.abc;

        word.capture.underlying
          .suffix(
            (p) => p.gender.fem() && p.number.singular() && p.person.third()
          )
          .expand({
            into: [
              [phonic.i, phonic.t],
              [phonic.a, phonic.t],
            ],
            where: {
              word: {
                was: type.verb,
                tam: tamToken.pst,
                wazn: match.not(wazn.i),
            },
              next: {$exists: true},
          },
            because: `Many people always use "-it" when they conjugate verbs for هي, but some turn this into "-at" when there's anything after it in the same word. Some others, especially outside of Lebanon, even use "-at" no matter what.`,
            // diachronically it's a retention ofc but synchronically the default form is -it
        })
          .expand({
            into: phonic => [[phonic.i, phonic.t]],
            where: {
              word: {was: type.verb, tam: tamToken.pst},
          },
        });

        word.capture.underlying.letter.c(keys`{value}`)
        word.capture.underlying
          .segment(abc => abc.c, keys`{value}`)
          .expand({
            into: phonic => [[phonic.i, phonic.t]],
            where: match.any(
              {next: {$exists: true}},
              {word: {was: type.idafe}}
            ),
        })
          .expand({
            into: (abc) => [[abc.a]],
            where: {
              prevConsonant: {
                meta: {
                  features: match.any(
                    {emphatic: true},
                    {location: (val) => val < location.velum}
                  ),
              },
            },
          },
            because: `just testin`,
        })
          .expand({
            into: [[word.abc.phonic.e], [word.abc.phonic.i]],
            odds: [0.5, 0.5],
            because: `The ة's default pronunciation in Lebanon, like most of the Levant, is a high unrounded vowel.`,
        });

        word.init();

        return `\
      layer 0: ${word
        .collect(0)
        .map((segment) => (segment ? segment.value : `-`))
        .join(``)},
      layer 1: ${word
        .collect(1)
        .map((segment) =>
          segment
            ? Array.isArray(segment)
              ? segment[0].value
              : segment.value
            : `-`
        )
        .join(``)}`;
    })
      .join(delim);
    return `${pre}${joined}${post}`;
}

  let input = ``;
  let res = [];
  let joined = ``;
  let err = ``;

  $: try {
    res = new Parser(compiledGrammar).feed(input).results[0] || [];
    joined = join(res);
    err = ``;
} catch (e) {
    err = e;
    console.error(e);
}
</script>

<main>
  <nav>
    <h1>In progress...</h1>
    <a href="https://fundahope.com/campaigns/categories"
      >Donate for Lebanese people</a
    >
  </nav>
  <Tabs>
    <TabList>
      <Tab>Raw input</Tab>
    </TabList>

    <TabPanel>
      <div class="display-area">
        <textarea bind:value={input} />
        <section>
          <h2>Hi!</h2>
          <p>
            I'm in the middle of working on this site. Check back in a month or
            so and it'll rock (or your money back). In the meantime, feel free
            to mess around typing stuff in the big box and see what big outputs
            you get.
          </p>
          <h3>But what is it?</h3>
          <p>Arabic in Japanese katakana.</p>
          <h3>What?</h3>
          <p>What?</p>
          <p>
            Okay, that's not the actual end goal. Maybe. What this actually is
            is a niche Lebanese Arabic linguisticsy thing.
          </p>
          <p>
            Once it's done, this page will be able to render words and passages
            in Lebanese Arabic, but with a twist: you'll be able to click on
            words and letters to change the accent they're pronounced in, and on
            top of that, you'll be able to switch the entire text from one
            writing system to another, like the Arabic script (عربي) vs.
            3arabizi (3arabe) vs. IPA (/ʕarabe/) vs. anything whatsoever.
            Right, that includes katakana.
          </p>
          <h3>What?</h3>
          <p>
            Alright, here's the deal. There are a few sites online that document
            specific dialects of vernacular Arabic, like <a
              href="http://levantinedictionary.com">LevantineDictionary</a
            >, <a href="https://derja.ninja">derja.ninja</a>,
            <a href="https://en.wiktionary.org/wiki/Category:Regional_Arabic"
              >Wiktionary</a
            >, etc., not to mention smaller, one-off projects started by
            individuals on a whim. They always run into a hurdle that's really
            hard to pass, though: Arabic is crazy diverse, and even individual
            "dialects" are guaranteed to hold a ton of variation within
            themselves, especially in the way of pronunciation. Think of a word
            like "your heart" throughout the Levant: <i>albik</i>,
            <i>galbik</i>, <i>qalbik</i>,
            <i>kalbich</i>, <i>qalbich</i> -- and that's just pronunciations,
            not even getting into all the different kinds of Romanization
            systems there are! So <span class="small">(yo, dawg...)</span> how do
            you deal with all the dialects in your dialect?
          </p>
          <p>
            Well, you could just not. Instead of regularly clocking into
            combinatorial hell and typing out every single possible
            pronunciation of every single word in your dictionary, you could
            just write everything in some big-city dialect and call it a wrap.
            Think of all the time saved. (This is what all of these sites
            currently do.)
          </p>
          <p>
            But!!! We're on computers here. We aren't slapping our dictionaries
            down on papyrus or whatever they used before 1970. And computers are
            actually pretty good at streamlining stuff like that! So what if we
            came up with a way to let people really explore all the different
            ways our Arabic is spoken?
          </p>
          <p>
            So the idea is just to make each letter of each word a dropdown
            where you can select whichever pronunciation or transcription of it
            you want to see. That's... not all of it, but it's pretty much it.
            It works because it hides and/or splits up the whole combinatorial
            explosion of different word forms: compare the list above to the
            representation <i>"(null/k/q/g)albi(k/ch)"</i> and you'll get what I'm
            going for. What a breakthrough. But I hope this implementation is smooth
            enough to inspire a shift away from print-style Arabic dictionaries now
            that we have the whole Internet and all.
          </p>
        </section>
      </div>
      <p>{joined}</p>

      {#if err}
        <pre style="color:red;" i>{err}</pre>
      {:else}
        <pre>{JSON.stringify(res, null, 2)}</pre>
      {/if}
    </TabPanel>
  </Tabs>
</main>

<style>
  main {
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
}

  pre {
    text-align: left;
}

  nav {
    position: top;
    background-color: #fef;
    width: 100%;
    margin-top: 0;
    padding-top: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: default;
}

  nav h1 {
    color: black;
    /* text-transform: uppercase; */
    font-family: "Inter", "Arial", sans-serif;
    font-size: 2em;
    font-weight: 800;
    padding: 10px;
    margin: 0;
}

  nav a {
    text-decoration: none;
    font-size: 1.5em;
    font-weight: 500;
    padding: 10px;
}

  textarea {
    font-family: Consolas, "Courier New", Courier, monospace;
    height: 100%;
    flex: 1.5;
}

  .display-area section {
    flex: 1;
    margin-left: 20px;
}

  .display-area {
    display: flex;
    justify-content: flex-start;
    height: 30vh;
    width: 90vw;
    padding: 10px;
}

  a {
    text-decoration: none;
}

  .small {
    font-size: 0.8em;
}

  @media (min-width: 640px) {
    main {
      max-width: none;
  }
}
</style>
