<template>
  <div id="app">
    <h1>Exaltation of Inanna</h1>
    <HymnVisualizer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HymnVisualizer from './components/HymnVisualizer.vue';

export default defineComponent({
  name: 'App',
  components: {
    HymnVisualizer,
  },
});
</script>

<style>
/* Глобальные стили */
body {
  font-family: var(--font-family);
  background-color: var(--background-color);
  color: var(--text-color);
  margin: 0;
  padding: 20px;
}

#app {
  max-width: 800px;
  margin: 0 auto;
}
</style>
