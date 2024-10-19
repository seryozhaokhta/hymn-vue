<!-- src/App.vue -->

<template>
  <div id="app">
    <HeaderComponent />
    <HymnVisualizer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from './components/HeaderComponent.vue';
import HymnVisualizer from './components/HymnVisualizer.vue';

export default defineComponent({
  name: 'App',
  components: {
    HeaderComponent,
    HymnVisualizer,
  },
});
</script>

<style>
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
