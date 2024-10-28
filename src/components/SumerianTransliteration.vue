<!-- src/components/SumerianTransliteration.vue -->
<template>
    <div class="sumerian-transliteration-container">
        <div class="sumerian-text">
            <span v-for="(symbol, index) in symbols" :key="'symbol-' + index" @mouseenter="setHoveredIndex(index)"
                @mouseleave="clearHoveredIndex" :class="{ 'highlighted-symbol': hoveredIndex === index }">
                {{ symbol }}
            </span>
        </div>
        <div class="transliteration-text">
            <span v-for="(word, index) in transliterationWords" :key="'translit-' + index"
                :class="{ 'highlighted-translit': hoveredIndex === index }">
                <template v-for="(part, idx) in splitWord(word)" :key="idx">
                    <span v-if="!isDigit(part)">{{ part }}</span>
                    <sub v-else>{{ part }}</sub>
                </template>
                <!-- Добавляем пробел после каждого слова, кроме последнего -->
                <span v-if="index < transliterationWords.length - 1"> </span>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';

export default defineComponent({
    name: 'SumerianTransliteration',
    props: {
        sumerianText: {
            type: String,
            required: true,
        },
        transliterationText: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const symbols = computed(() => props.sumerianText.split(' '));
        const transliterationWords = computed(() => props.transliterationText.split(' '));

        const hoveredIndex = ref<number | null>(null);

        const setHoveredIndex = (index: number) => {
            hoveredIndex.value = index;
        };

        const clearHoveredIndex = () => {
            hoveredIndex.value = null;
        };

        // Функция для разделения слова на буквы и цифры
        const splitWord = (word: string): string[] => {
            return word.match(/[^0-9]+|[0-9]+/g) || [word];
        };

        // Функция для проверки, является ли символ цифрой
        const isDigit = (char: string): boolean => {
            return /^\d+$/.test(char);
        };

        // Если количество символов и слов транслитерации не совпадает, выводим предупреждение в консоль
        watch(
            () => symbols.value.length !== transliterationWords.value.length,
            (changed) => {
                if (changed) {
                    console.warn(
                        'Количество символов и слов транслитерации не совпадает.',
                        symbols.value.length,
                        transliterationWords.value.length
                    );
                }
            }
        );

        return {
            symbols,
            transliterationWords,
            hoveredIndex,
            setHoveredIndex,
            clearHoveredIndex,
            splitWord,
            isDigit,
        };
    },
});
</script>

<style scoped>
.sumerian-transliteration-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.sumerian-text {
    font-size: 24px;
    color: var(--sumerian-text-color);
    line-height: 1.5;
    letter-spacing: 0.1em;
    /* Добавляем межбуквенный интервал для раздвижения символов */
}

.transliteration-text {
    font-size: 16px;
    color: var(--transliteration-color);
    line-height: 1.5;
}

.sumerian-text span {
    cursor: pointer;
    transition: color 0.3s ease;
    margin-right: 8px;
    /* Добавляем правый отступ для раздвижения символов */
}

.transliteration-text span {
    transition: background-color 0.3s ease;
}

.highlighted-symbol {
    color: var(--primary-color);
}

.highlighted-translit {
    background-color: yellow;
    padding: 2px 4px;
    border-radius: 4px;
    color: var(--highlighted-translit-text-color);
    /* Используем новую переменную */
}

sub {
    font-size: 0.75em;
    vertical-align: sub;
    color: var(--primary-color);
    /* Можно изменить цвет субскрипта по желанию */
}
</style>
