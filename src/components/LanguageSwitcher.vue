<!-- src/components/LanguageSwitcher.vue -->

<template>
    <div class="language-switcher">
        <div class="highlight" ref="highlight"></div>
        <button class="language-button" :class="{ active: currentLocale === 'en' }" @click="switchLanguage('en')"
            ref="enButton">
            EN
        </button>
        <button class="language-button" :class="{ active: currentLocale === 'ru' }" @click="switchLanguage('ru')"
            ref="ruButton">
            RU
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';
import throttle from 'lodash/throttle'; // Изменён способ импорта

export default defineComponent({
    name: 'LanguageSwitcher',
    setup() {
        const { locale } = useI18n();
        const enButton = ref<HTMLElement | null>(null);
        const ruButton = ref<HTMLElement | null>(null);
        const highlight = ref<HTMLElement | null>(null);

        const switchLanguage = (lang: string) => {
            if (locale.value !== lang) {
                locale.value = lang;
            }
        };

        const updateHighlight = throttle(() => {
            const activeButton = locale.value === 'en' ? enButton.value : ruButton.value;
            if (activeButton && highlight.value) {
                gsap.to(highlight.value, {
                    left: activeButton.offsetLeft,
                    width: activeButton.offsetWidth,
                    duration: 0.5, // Увеличили длительность для плавности
                    ease: 'power2.out', // Изменили тип easing для более плавной анимации
                });
            }
        }, 100); // Throttle до раз в 100мс

        watch(locale, () => {
            updateHighlight();
        });

        onMounted(() => {
            updateHighlight();
            window.addEventListener('resize', updateHighlight);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', updateHighlight);
        });

        return {
            enButton,
            ruButton,
            highlight,
            switchLanguage,
            currentLocale: locale,
        };
    },
});
</script>

<style scoped src="@/assets/styles/HeaderStyles.css"></style>
