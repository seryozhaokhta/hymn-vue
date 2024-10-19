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
import { defineComponent, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import darkModeIcon from '@/assets/dark-mode.svg';
import lightModeIcon from '@/assets/light-mode.svg';

export default defineComponent({
    name: 'HeaderComponent',
    setup() {
        const { locale } = useI18n();

        const currentLocale = computed({
            get: () => locale.value,
            set: (val: string) => {
                locale.value = val;
            },
        });

        const isDarkMode = ref(false);

        // Следим за изменениями isDarkMode и обновляем класс на body
        watch(isDarkMode, (newVal) => {
            if (newVal) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        }, { immediate: true });

        const toggleTheme = () => {
            isDarkMode.value = !isDarkMode.value;
        };

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
