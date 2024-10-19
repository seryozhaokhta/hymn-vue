<template>
    <div id="hymn-container">
        <div v-for="(section, sectionIndex) in data.sections" :key="sectionIndex" class="hymn-section">
            <div v-for="(line, lineIndex) in section.lines" :key="lineIndex">
                <HymnLine :line="line" :activeLineNumber="activeLineNumber" @setActiveLine="setActiveLine" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import HymnLine from './HymnLine.vue';
import data from '@/assets/data.json';

export default defineComponent({
    name: 'HymnVisualizer',
    components: {
        HymnLine,
    },
    setup() {
        const hymnData = ref(data);
        const activeLineNumber = ref<string | null>(null);

        const setActiveLine = (lineNumber: string | null) => {
            activeLineNumber.value = lineNumber;
        };

        return {
            data: hymnData,
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
</style>
