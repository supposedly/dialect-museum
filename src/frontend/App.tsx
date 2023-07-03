import {createEffect, type Component, createSignal, createRenderEffect, Setter, ErrorBoundary} from 'solid-js';

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

function parse(input: string) {
  try {
    return {
      success: true,
      value: JSON.stringify(new Parser(compiledGrammar).feed(input).results, null, 2),
    };
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {
      success: false,
      value: e.toString(),
    };
  }
}

const App: Component = () => {
  const [input, setInput] = createSignal(``);
  const result = () => parse(input());
  return <div>
    <input type="text" use:bind={[input, setInput]}></input>
    <pre style={{color: result().success ? undefined : `red`}}>{result().value}</pre>
  </div>;
};

export default App;
