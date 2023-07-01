import {createEffect, type Component} from 'solid-js';

import {Parser, Grammar} from "nearley";
import styles from './App.module.css';

import grammar from "../backend/conversion/parsing/grammar";

const compiledGrammar = Grammar.fromCompiled(grammar);

const App: Component = () => {
  console.log(new Parser(compiledGrammar).feed(`bruh`).results);
  return <div class={styles.App}>
    <header class={styles.header}>
      {/* <img src={logo} class={styles.logo} alt="logo" /> */}
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        class={styles.link}
        href="https://github.com/solidjs/solid"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn Solid
      </a>
    </header>
  </div>;
};

export default App;
