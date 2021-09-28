<script>
  import {Parser, Grammar} from 'nearley';
  import * as grammar from './backend/conversion/parsing/grammar.js';
  import {Word, keys} from './backend/conversion/transformers/common/classes';
  import wordType from './backend/conversion/parsing/type';
  import {type as segType} from './backend/conversion/objects';
  import {alphabet as abc, location, tamToken} from './backend/conversion/symbols';
  import type from './backend/conversion/parsing/type';
  import match from './backend/conversion/transformers/common/match.js';

  const compiledGrammar = Grammar.fromCompiled(grammar);

  function join(res, delim=` `, pre=``, post=``) {
    const joined = res.map(word => {
      if (Array.isArray(word)) {
        return join(word, `/`, ...(word.length > 1 ? [`(`, `)`] : []));
      }

      word = new Word(word, {underlying: abc, phonic: abc, surface: {}});

      word.capture.underlying.suffix(p => p.gender.fem() && p.number.singular() && p.person.third())
        .expand({
          into: [[word.abc.phonic.t]],
          where: {
            word: {was: type.verb, tam: tamToken.pst}
          }
        });

      word.capture.underlying.segment(word.abc.underlying.c, keys`{value}`)
        .expand({
          into: [[word.abc.phonic.i, word.abc.phonic.t]],
          where: match.any(
            {next: {$exists: true}},
            {word: {was: type.idafe}}
          )
        })
        .expand({
          into: [[word.abc.phonic.a]],
          where: {
            prevConsonant: {
              meta: {
                features: match.any(
                  {emphatic: true},
                  {location: val => val < location.velum}
                )
              }
            }
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
      layer 0: ${word.collect(0).map(segment => (segment ? segment.value : `-`)).join(``)},
      layer 1: ${word.collect(1).map(segment => (segment ? (Array.isArray(segment) ? segment[0].value : segment.value) : `-`)).join(``)}`;
    }).join(delim);
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
  };
</script>

<main>
    <h1>Getting there...</h1>
  <textarea bind:value={input} />
  <p>{joined}</p>

  {#if err}
    <pre style="color:red;" i>{err}</pre>
  {:else}
      <pre>{JSON.stringify(res, null, 2)}</pre>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  pre {
    text-align: left;
  }

  h1 {
    color: #ff3e00;
    /* text-transform: uppercase; */
    font-size: 4em;
    font-weight: 100;
  }

  textarea {
    font-family: Consolas, 'Courier New', Courier, monospace;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
