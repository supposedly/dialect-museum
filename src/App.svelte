<script>
    import {Parser, Grammar} from 'nearley';
    import * as grammar from './backend/conversion/parsing/grammar.js';

	const compiledGrammar = Grammar.fromCompiled(grammar);

    let input = ``;
	let res = [];
	let err = ``;

	$: try {
		res = new Parser(compiledGrammar).feed(input).results;
		err = ``;
	} catch (e) {
		err = e;
		console.error(e);
	};
    
</script>

<main>
    <h1>Getting there...</h1>
	<textarea bind:value={input} />
	<p>{res.length}</p>

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
