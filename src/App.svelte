<script lang="ts">
  import { Parser, Grammar } from "nearley";
  import * as grammar from "./backend/conversion/parsing/grammar.js";
  import underlying from "./backend/conversion/alphabets/underlying";
  import { Language } from "./backend/conversion/transformers/common/classes/capture.js";

  const compiledGrammar = Grammar.fromCompiled(grammar as any);

  const lang = new Language(
    { underlying },
    { phonic: underlying },
    { surface: { abc: {}, __types: new Set() } }
  );

  let input = ``;
  let res = [];

  $: try {
    res = new Parser(compiledGrammar).feed(input).results[0] || [];
  } catch (e) {
    console.error(e);
  }
</script>

<main>
  <h1>Getting there...</h1>
  <textarea bind:value={input} />
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
    font-family: Consolas, "Courier New", Courier, monospace;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
