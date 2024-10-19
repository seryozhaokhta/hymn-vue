<!-- src/components/HeaderComponent.vue -->

<template>
    <header class="header">
        <div class="header-left">
            <h1>{{ $t('title') }}</h1>
        </div>
        <div class="header-right">
            <LanguageSwitcher />
            <button class="toggle-theme" @click="toggleTheme">
                <img :src="isDarkMode ? darkModeIcon : lightModeIcon" alt="Toggle Theme" />
            </button>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTheme } from '../composables/useTheme';
import LanguageSwitcher from './LanguageSwitcher.vue';

import darkModeIcon from '@/assets/icons/dark-mode.svg';
import lightModeIcon from '@/assets/icons/light-mode.svg';

export default defineComponent({
    name: 'HeaderComponent',
    components: {
        LanguageSwitcher,
    },
    setup() {
        const { isDarkMode, toggleTheme } = useTheme();

        return {
            isDarkMode,
            toggleTheme,
            darkModeIcon,
            lightModeIcon,
        };
    },
});
</script>

<style scoped src="../assets/styles/HeaderStyles.css"></style>
