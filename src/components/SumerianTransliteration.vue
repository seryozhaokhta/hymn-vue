<!-- src/components/SumerianTransliteration.vue -->

<template>
    <div class="sumerian-transliteration-container">
        <div class="sumerian-text">
            <span v-for="(symbolGroup, index) in symbolGroups" :key="'symbol-' + index"
                @mouseenter="setHoveredIndex(index)" @mouseleave="clearHoveredIndex"
                :class="{ 'highlighted-symbol': hoveredIndex === index }">
                <template v-for="(symbol, idx) in symbolGroup" :key="'sym-' + idx">
                    {{ symbol }}<span v-if="idx < symbolGroup.length - 1"> </span>
                </template>
            </span>
        </div>
        <div class="transliteration-text">
            <!-- Разделяем рендеринг на 'word' и 'separator' токены -->
            <span v-for="(token, index) in tokens" :key="'token-' + index"
                @mouseenter="isWordToken(token) ? setHoveredIndex(token.groupIndex) : null"
                @mouseleave="isWordToken(token) ? clearHoveredIndex() : null" :class="{
                    'highlighted-translit': isWordToken(token) && hoveredIndex === token.groupIndex,
                    'separator': token.type === 'separator'
                }">
                <template v-if="isWordToken(token)">
                    <template v-for="(part, idx) in splitMorpheme(token.value)" :key="idx">
                        <span v-if="part.style === 'normal'">{{ part.text }}</span>
                        <sub v-else-if="part.style === 'sub'">{{ part.text }}</sub>
                        <sup v-else-if="part.style === 'sup'">{{ part.text }}</sup>
                    </template>
                </template>
                <template v-else>
                    {{ token.value }}
                </template>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';

// Определение типов
type WordToken = {
    value: string;
    type: 'word';
    groupIndex: number;
};

type SeparatorToken = {
    value: string;
    type: 'separator';
};

type Token = WordToken | SeparatorToken;

interface MorphemePart {
    text: string;
    style: 'normal' | 'sup' | 'sub';
}

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
        morphemeToSymbolIndices: {
            type: Array as () => number[][],
            required: false,
            default: () => [],
        },
    },
    setup(props) {
        // Разбиваем sumerianText на символы
        const symbols = computed(() => props.sumerianText.trim().split(/\s+/));

        // Разбиваем transliterationText на токены, включая слова и разделители
        const tokens = computed<Token[]>(() => {
            // Регулярное выражение захватывает:
            // 1. Слова, возможно содержащие скобки
            // 2. Разделители: дефисы и подчёркивания
            const regex = /([^\s-_]+)|([-_])/g;
            const result: Token[] = [];
            let match;
            let groupIndex = 0;

            while ((match = regex.exec(props.transliterationText)) !== null) {
                const [, word, separator] = match;
                if (word) {
                    result.push({ value: word, type: 'word', groupIndex });
                    groupIndex++;
                } else if (separator) {
                    result.push({ value: separator, type: 'separator' });
                }
            }
            return result;
        });

        // Группируем символы на основе morphemeToSymbolIndices
        const symbolGroups = computed<string[][]>(() => {
            const groups: string[][] = [];
            if (props.morphemeToSymbolIndices.length > 0) {
                props.morphemeToSymbolIndices.forEach(indices => {
                    const group = indices.map(index => symbols.value[index]).filter(Boolean);
                    groups.push(group);
                });
            } else {
                // Если нет явного соответствия, сопоставляем по порядку
                let currentIndex = 0;
                tokens.value.forEach(token => {
                    if (token.type === 'word') {
                        const symbol = symbols.value[currentIndex];
                        if (symbol) {
                            groups.push([symbol]);
                        }
                        currentIndex++;
                    }
                });
            }
            return groups;
        });

        const hoveredIndex = ref<number | null>(null);

        const setHoveredIndex = (index: number) => {
            hoveredIndex.value = index;
        };

        const clearHoveredIndex = () => {
            hoveredIndex.value = null;
        };

        // Функция-защитник типа
        function isWordToken(token: Token): token is WordToken {
            return token.type === 'word';
        }

        /**
         * Функция для разделения морфемы на части с учётом скобок.
         * Символы внутри круглых скобок считаются надстрочными (sup).
         * Цифры вне скобок считаются подстрочными (sub).
         * @param morpheme
         * @returns Array of MorphemePart
         */
        const splitMorpheme = (morpheme: string): MorphemePart[] => {
            const parts: MorphemePart[] = [];
            let i = 0;

            while (i < morpheme.length) {
                const char = morpheme[i];

                if (char === '(') {
                    // Начало надстрочного сегмента
                    i++; // Пропускаем '('
                    let supText = '';
                    while (i < morpheme.length && morpheme[i] !== ')') {
                        supText += morpheme[i];
                        i++;
                    }
                    i++; // Пропускаем ')'
                    if (supText.length > 0) {
                        parts.push({ text: supText, style: 'sup' });
                    }
                } else if (/\d/.test(char)) {
                    // Начало подстрочного сегмента (цифра)
                    let num = char;
                    i++;
                    while (i < morpheme.length && /\d/.test(morpheme[i])) {
                        num += morpheme[i];
                        i++;
                    }
                    parts.push({ text: num, style: 'sub' });
                } else {
                    // Начало обычного сегмента
                    let normalText = char;
                    i++;
                    while (
                        i < morpheme.length &&
                        morpheme[i] !== '(' &&
                        !/\d/.test(morpheme[i])
                    ) {
                        normalText += morpheme[i];
                        i++;
                    }
                    if (normalText.length > 0) {
                        parts.push({ text: normalText, style: 'normal' });
                    }
                }
            }

            return parts;
        };

        // Проверяем соответствие количества символов и групп морфем
        watch(
            () => symbolGroups.value.length !== tokens.value.filter(t => t.type === 'word').length,
            (notEqual) => {
                if (notEqual) {
                    console.warn(
                        'Количество символов и морфем в транслитерации не совпадает.',
                        'Символов:', symbolGroups.value.length,
                        'Морфем:', tokens.value.filter(t => t.type === 'word').length
                    );
                }
            },
            { immediate: true }
        );

        return {
            symbols,
            tokens,
            symbolGroups,
            hoveredIndex,
            setHoveredIndex,
            clearHoveredIndex,
            isWordToken,
            splitMorpheme,
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
}

.transliteration-text span {
    transition: background-color 0.3s ease;
    cursor: pointer;
    /* Добавлено для интерактивности */
}

.highlighted-symbol {
    color: var(--primary-color);
}

.highlighted-translit {
    background-color: yellow;
    padding: 2px 4px;
    border-radius: 4px;
    color: var(--highlighted-translit-text-color);
}

sub {
    font-size: 0.75em;
    vertical-align: sub;
    color: var(--primary-color);
}

sup {
    font-size: 0.75em;
    vertical-align: super;
    color: var(--primary-color);
}

/* Стили для разделителей */
.transliteration-text span.separator {
    cursor: default;
    background-color: transparent;
    color: var(--transliteration-color);
}
</style>
