import {createEffect, type Component, createSignal, createRenderEffect, Setter} from 'solid-js';

import {Parser, Grammar} from "nearley";
import styles from './App.module.css';

import grammar from "../backend/conversion/parsing/grammar";

const compiledGrammar = Grammar.fromCompiled(grammar);

declare module "solid-js" {
  namespace JSX {
    // this sucks
    interface Directives {
      bind: [Accessor<string>, Setter<string>];
    }
  }
}

function bind(el: HTMLInputElement, accessor: typeof createSignal<string>) {
  const [s, set] = accessor(``);
  el.addEventListener(`input`, e => set((e.currentTarget as HTMLInputElement).value));
  createRenderEffect(() => {
    el.value = s();
  });
}

const App: Component = () => {
  const [input, setInput] = createSignal(``);
  return <div>
    <input type="text" use:bind={[input, setInput]}></input>
    <pre>{JSON.stringify(new Parser(compiledGrammar).feed(input()).results, null, 2)}</pre>
  </div>;
};

export default App;
