<!-- src/components/HeaderComponent.vue -->

<template>
    <header class="header">
        <div class="left">
            <h1>{{ $t('title') }}</h1>
        </div>
        <div class="right">
            <button class="toggle-theme" @click="toggleTheme">
                <img :src="isDarkMode ? darkModeIcon : lightModeIcon" alt="Toggle Theme" />
            </button>
            <select v-model="currentLocale">
                <option value="en">English</option>
                <option value="ru">Русский</option>
            </select>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from '../composables/useTheme';

import darkModeIcon from '@/assets/icons/dark-mode.svg';
import lightModeIcon from '@/assets/icons/light-mode.svg';

export default defineComponent({
    name: 'HeaderComponent',
    setup() {
        const { locale } = useI18n();
        const { isDarkMode, toggleTheme } = useTheme();

        const currentLocale = computed({
            get: () => locale.value,
            set: (val: string) => {
                locale.value = val;
            },
        });

        return {
            currentLocale,
            isDarkMode,
            toggleTheme,
            darkModeIcon,
            lightModeIcon,
        };
    },
});
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.left h1 {
    margin: 0;
}

.right {
    display: flex;
    align-items: center;
}

.right select {
    margin-left: 10px;
}

.toggle-theme {
    background: none;
    border: none;
    cursor: pointer;
}

.toggle-theme img {
    width: 24px;
    height: 24px;
}
</style>
