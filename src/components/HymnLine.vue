<!-- src/components/HymnLine.vue -->

<template>
    <div class="translation-line" :style="{ opacity: isActive || !activeLineNumber ? 1 : 0.5 }">
        <span class="translation-text">{{ line.translation }}</span>
        <button class="toggle-details" @click="toggleDetails">
            <img :src="isExpanded ? hideIcon : expandIcon" alt="Toggle Details" />
        </button>
    </div>
    <div class="details" ref="detailsElement">
        <SumerianTransliteration :sumerianText="line.sumerian_text"
            :transliterationText="line.transliterations.transliteration"
            :morphemeToSymbolIndices="line.morpheme_to_symbol_indices" />
        <p class="word-by-word">{{ line.transliterations.word_by_word }}</p>
        <p class="simplified">{{ line.transliterations.simplified }}</p>
        <div class="explanation">
            <strong>{{ $t('explanation') }}:</strong>
            <p>{{ line.explanation }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    PropType,
    ref,
    watch,
    onMounted,
    computed,
} from 'vue';
import gsap from 'gsap';

import expandIcon from '@/assets/icons/expand-line.svg';
import hideIcon from '@/assets/icons/hide-line.svg';
import SumerianTransliteration from './SumerianTransliteration.vue';

interface Transliterations {
    transliteration: string;
    word_by_word: string;
    simplified: string;
}

interface HymnLineData {
    number: string;
    sumerian_text: string;
    transliterations: Transliterations;
    morpheme_to_symbol_indices?: number[][]; // Сделано опциональным
    translation: string;
    explanation: string;
}

export default defineComponent({
    name: 'HymnLine',
    components: {
        SumerianTransliteration,
    },
    props: {
        line: {
            type: Object as PropType<HymnLineData>,
            required: true,
        },
        activeLineNumber: {
            type: String as PropType<string | null>,
            default: null,
        },
    },
    emits: ['setActiveLine'],
    setup(props, { emit }) {
        const isExpanded = ref(false);
        const detailsElement = ref<HTMLElement | null>(null);

        const isActive = computed(() => {
            return props.activeLineNumber === props.line.number;
        });

        watch(
            () => isActive.value,
            (newVal) => {
                if (detailsElement.value) {
                    if (newVal) {
                        isExpanded.value = true;
                        gsap.fromTo(
                            detailsElement.value,
                            { height: 0, opacity: 0 },
                            {
                                height: 'auto',
                                opacity: 1,
                                duration: 0.3,
                                ease: 'power2.out',
                                onStart: () => {
                                    detailsElement.value!.style.display = 'block';
                                },
                                onComplete: () => {
                                    detailsElement.value!.style.height = 'auto';
                                },
                            }
                        );
                    } else {
                        gsap.to(detailsElement.value, {
                            height: 0,
                            opacity: 0,
                            duration: 0.3,
                            ease: 'power2.in',
                            onComplete: () => {
                                isExpanded.value = false;
                                detailsElement.value!.style.display = 'none';
                            },
                        });
                    }
                }
            },
            { immediate: true }
        );

        const toggleDetails = () => {
            if (isExpanded.value) {
                emit('setActiveLine', null);
            } else {
                emit('setActiveLine', props.line.number);
            }
        };

        onMounted(() => {
            if (detailsElement.value) {
                gsap.set(detailsElement.value, { height: 0, opacity: 0, display: 'none' });
            }
        });

        return {
            isExpanded,
            detailsElement,
            toggleDetails,
            expandIcon,
            hideIcon,
            isActive,
        };
    },
});
</script>

<style scoped>
.translation-line {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
}

.translation-text {
    flex: 1;
}

.toggle-details {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-details img {
    width: 20px;
    height: 20px;
}

.details {
    overflow: hidden;
    /* Добавлено для плавной анимации высоты */
}
</style>
