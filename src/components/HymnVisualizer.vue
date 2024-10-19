<!-- src/components/HymnVisualizer.vue -->
<template>
    <div id="hymn-container">
        <div v-for="(section, sectionIndex) in data.sections" :key="sectionIndex" class="hymn-section">
            <h2>{{ section.name }}</h2>
            <div v-for="(line, lineIndex) in section.lines" :key="lineIndex">
                <HymnLine :line="line" :activeLineNumber="activeLineNumber" @setActiveLine="setActiveLine" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import HymnLine from './HymnLine.vue';
import dataEn from '@/assets/data/data-en.json';
import dataRu from '@/assets/data/data-ru.json';
import { useI18n } from 'vue-i18n';

interface Section {
    name: string;
    lines: HymnLineData[];
}

interface HymnLineData {
    number: string;
    sumerian_text: string;
    transliterations: Transliterations;
    translation: string;
    explanation: string;
}

interface Transliterations {
    transliteration: string;
    word_by_word: string;
    simplified: string;
}

export default defineComponent({
    name: 'HymnVisualizer',
    components: {
        HymnLine,
    },
    setup() {
        const { locale } = useI18n();

        const data = computed<{
            sections: Section[];
        }>(() => {
            return locale.value === 'ru' ? dataRu : dataEn;
        });

        const activeLineNumber = ref<string | null>(null);

        const setActiveLine = (lineNumber: string | null) => {
            activeLineNumber.value = lineNumber;
        };

        return {
            data,
            activeLineNumber,
            setActiveLine,
        };
    },
});
</script>

<style scoped>
#hymn-container {
    margin-top: 20px;
}

.hymn-section {
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 0.5px solid var(--border-color);
}

.hymn-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.hymn-section h2 {
    margin-top: 0;
}
</style>
