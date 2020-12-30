<template>
  <h1>
    Under constructɩon.
  </h1>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped lang="scss">
// Dunno if putting this here makes the page flicker-prone or anything
@font-face {
  font-family: 'Inter';
  src: url('./assets/fonts/Inter.var.woff2') format('woff2'),
       url('./assets/fonts/Inter.var.ttf') format('truetype');
}

h1 {
  text-align: center;
  color: #2c3e50;
  font-size: 4vw;
  font-weight: 100;
  font-variation-settings: 'wght' 250;
  // text-transform: uppercase;
}
</style>

<style> /* 360 no scope */
#app {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}
</style>
