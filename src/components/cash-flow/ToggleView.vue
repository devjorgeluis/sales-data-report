<template>
    <div class="p-5 border-b border-gray-200 dark:border-gray-700">
        <div class="flex gap-4">
            <button @click="updateViewMode('table')" class="px-4 py-2 rounded-lg"
                :class="viewMode === 'table' ? 'bg-gray-200 dark:bg-gray-700 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white'">
                Table View
            </button>
            <button @click="updateViewMode('chart')" class="px-4 py-2 rounded-lg"
                :class="viewMode === 'chart' ? 'bg-gray-200 dark:bg-gray-700 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white'">
                Chart View
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    viewMode: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['update:viewMode'])

const localViewMode = ref(props.viewMode)

watch(() => props.viewMode, (newViewMode) => {
    localViewMode.value = newViewMode
})

const updateViewMode = (mode) => {
    localViewMode.value = mode
    emit('update:viewMode', mode)
}
</script>