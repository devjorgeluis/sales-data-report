<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Confirm Close-Out</h2>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to submit the close-out? This action cannot be undone.
            </p>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
                Total Expected: ${{ formatCurrency(props.expected?.total || 0) }}<br>
                Total Actual: ${{ formatCurrency(actualTotal || 0) }}<br>
                Variance: ${{ formatCurrency(computedVariance || 0) }}
            </p>
            <p v-if="props.notes" class="text-gray-700 dark:text-gray-300 mb-4">Notes: {{ props.notes }}</p>
            <p v-if="!props.canSubmit && computedVariance !== 0" class="text-red-500 mb-4">
                Please provide notes to explain the variance before submitting.
            </p>
            <div class="flex justify-end gap-4">
                <button @click="emit('cancel')"
                    class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors">
                    Cancel
                </button>
                <button @click="emit('confirm')"
                    :disabled="!props.canSubmit"
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    counts: Object,
    expected: Object,
    notes: String,
    variance: Number,
    canSubmit: Boolean,
});

const emit = defineEmits(['confirm', 'cancel']);

const actualTotal = computed(() => {
    return Object.values(props.counts || {}).reduce((sum, value) => sum + Number(value || 0), 0);
});

const computedVariance = computed(() => {
    return actualTotal.value - (props.expected?.total || 0);
});

const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}
</script>