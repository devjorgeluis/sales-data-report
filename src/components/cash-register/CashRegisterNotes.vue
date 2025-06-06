<template>
    <div class="p-5">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notes (Required for Variances)</h2>
        <textarea
            v-model="notesValue"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            rows="4"
            placeholder="Enter notes explaining the variance..."
        ></textarea>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const notesValue = ref(props.modelValue || '');

watch(notesValue, (newValue) => {
    emit('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
    if (newValue !== notesValue.value) {
        notesValue.value = newValue || '';
    }
});
</script>