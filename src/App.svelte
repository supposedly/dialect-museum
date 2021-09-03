<script>
    import {Parser, Grammar} from 'nearley';
    import * as grammar from './backend/conversion/parsing/grammar.js';
  import {Cap, Word} from './backend/conversion/transformers/common/classes';
  import wordType from './backend/conversion/parsing/type';
  import {type as segType} from './backend/conversion/objects';
  import {alphabet as abc, articulator} from './backend/conversion/symbols';

  const compiledGrammar = Grammar.fromCompiled(grammar);

  function join(res, delim=` `, pre=``, post=``) {
    const joined = res.map(word => {
      if (Array.isArray(word)) {
        return join(word, `/`, ...(word.length > 1 ? [`(`, `)`] : []));
      }
      word = new Word(word);
      const cap = new Cap(word);

      cap.just({value: `fem`})(({word, wordType: type, prevVowel, prevConsonant, next}) => {
        prevConsonant = word[prevConsonant];
        prevVowel = word[prevVowel];
        next = word[next];
        if (type === wordType.verb) {
          return [{value: prevVowel.value === `i` ? `it` : `at`}];
        }
        if (next) {
          return [{value: `it`}];
        }
        if (prevConsonant.value === `r` && (prevVowel.value === `i` || prevVowel.value === `ii`)) {
          return [abc.e, abc.i];
        }
        if (
          prevConsonant.value === `r`
          || prevConsonant.meta.intrinsic.ly.emphatic
          || prevConsonant.meta.intrinsic.articulator < articulator.back
        ) {
          return [abc.a];
        }
        return [abc.e, abc.i];
      });
      // XXX TODO: the fact that this works means i'm accidentally shallow-copying the word in Word, fix that lol
      return word.value.map(letter => {
        switch (letter.value) {
          case `noschwa`:
            return ``;
          case `schwa`:
            return `ᵊ`;
          case `fem`:
            return `c`;
          case `fplural`:
            return `aat`;
          case `dual`:
            return `ayn`;
          case `plural`:
            return `iin`;
          case `stressed`:
            return `\u0301`;
          case `nasalized`:
            return `\u0303`;
          default:
            return letter.value;
        }
      }).join(``);
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

<svelte:head>
  <title>Bruh</title>
</svelte:head>

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
