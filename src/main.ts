// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';

import i18n from './i18n';

import './assets/styles/variables.css';
import './assets/styles/styles.css';

createApp(App)
    .use(i18n)
    .mount('#app');
