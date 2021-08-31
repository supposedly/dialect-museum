<script>
    import nearley from 'nearley';
    import * as grammar from './backend/conversion/parsing/grammar.js';

    let input = ``;
    
</script>

<main>
    <h1>Getting there...</h1>
	<input type="text" bind:value={input} />
    <p>{input}</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		/* text-transform: uppercase; */
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
