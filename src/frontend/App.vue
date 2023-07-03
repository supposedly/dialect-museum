<script setup lang="ts">
import { ref, computed } from 'vue';

import { Parser, Grammar } from 'nearley';
import grammar from "../backend/conversion/parsing/grammar";

const compiledGrammar = Grammar.fromCompiled(grammar);

const input = ref(``);
const result = computed(() => {
  try {
    const result = new Parser(compiledGrammar).feed(input.value).results[0];
    return {
      success: true,
      value: result,
      display: JSON.stringify(result, null, 2),
    };
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error(e);
    return {
      success: false,
      value: e,
      display: e.toString(),
    };
  }
})
</script>

<template>
  <input type="text" v-model.trim="input" />
  <pre :class="{ err: !result.success }">{{
    result.display
  }}</pre>
</template>

<style scoped>
.err {
  color: red;
}
</style>
