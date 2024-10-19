// composables/useTheme.ts

import { ref, watch } from 'vue';

export function useTheme() {
    const isDarkMode = ref(false);

    const toggleTheme = () => {
        isDarkMode.value = !isDarkMode.value;
    };

    watch(isDarkMode, (newVal) => {
        if (newVal) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, { immediate: true });

    return {
        isDarkMode,
        toggleTheme,
    };
}
