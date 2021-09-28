<script>
    import {Parser, Grammar} from 'nearley';
    import * as grammar from './backend/conversion/parsing/grammar.js';
  import {Word, keys} from './backend/conversion/transformers/common/classes';
  import wordType from './backend/conversion/parsing/type';
  import {type as segType} from './backend/conversion/objects';
  import {alphabet as abc, location} from './backend/conversion/symbols';
  import type from './backend/conversion/parsing/type';

  const compiledGrammar = Grammar.fromCompiled(grammar);

  function join(res, delim=` `, pre=``, post=``) {
    const joined = res.map(word => {
      if (Array.isArray(word)) {
        return join(word, `/`, ...(word.length > 1 ? [`(`, `)`] : []));
      }
      word = new Word(word, {underlying: abc, phonic: abc, surface: {}});
      word.capture.underlying.segment(word.abc.underlying.c, keys`{value}`)
        .transform({
          into: [word.abc.underlying.a],
          where: {},
          because: `just testin`,
        });
      word.init();
      return word.collect(0).map(segment => segment.value).join(``);
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
