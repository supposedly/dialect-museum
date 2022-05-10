<script lang="ts">
  import { Parser, Grammar } from "nearley";
  import * as grammar from "./backend/conversion/parsing/grammar.js";
  import underlying from "./backend/conversion/alphabets/underlying";
  import { Language } from "./backend/conversion/transformers/common/classes/capture.js";

  const compiledGrammar = Grammar.fromCompiled(grammar as any);

  const lang = new Language(
    { underlying },
    { phonic: underlying },
    { surface: {} }
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
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
