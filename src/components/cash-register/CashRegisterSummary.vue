<template>
    <div class="p-5 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Summary</h2>
        <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th class="border-t p-3 font-medium text-left text-gray-500 text-theme-xs dark:text-gray-400 w-1/4">Category</th>
                        <th class="border-t p-3 font-medium text-left text-gray-500 text-theme-xs dark:text-gray-400 w-1/4">Expected</th>
                        <th class="border-t p-3 font-medium text-left text-gray-500 text-theme-xs dark:text-gray-400 w-1/4">Actual</th>
                        <th class="border-t p-3 font-medium text-left text-gray-500 text-theme-xs dark:text-gray-400 w-1/4">Variance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border-t p-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">Cash</td>
                        <td class="border-t p-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">${{ formatCurrency(props.expected?.cash || 0) }}</td>
                        <td class="border-t p-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">${{ formatCurrency(props.counts?.cash || 0) }}</td>
                        <td class="border-t p-3 text-left text-theme-sm"
                            :class="{ 'text-red-500 dark:text-red-400': variance.cash < 0, 'text-green-500 dark:text-green-400': variance.cash > 0 }">
                            ${{ formatCurrency(variance.cash || 0) }}
                        </td>
                    </tr>
                    <tr>
                        <td class="border-t p-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">Credit Cards</td>
                        <td class="border-t p-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">${{ formatCurrency(props.expected?.creditCards || 0) }}</td>
                        <td class="border-t p-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">${{ formatCurrency(props.counts?.creditCards || 0) }}</td>
                        <td class="border-t p-3 text-left text-theme-sm"
                            :class="{ 'text-red-500 dark:text-red-400': variance.creditCards < 0, 'text-green-500 dark:text-green-400': variance.creditCards > 0 }">
                            ${{ formatCurrency(variance.creditCards || 0) }}
                        </td>
                    </tr>
                    <tr>
                        <td class="border-t p-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">Total</td>
                        <td class="border-t p-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">${{ formatCurrency(props.expected?.total || 0) }}</td>
                        <td class="border-t p-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">${{ formatCurrency(actualTotal || 0) }}</td>
                        <td class="border-t p-3 text-left text-theme-sm"
                            :class="{ 'text-red-500 dark:text-red-400': (totalVariance || 0) < 0, 'text-green-500 dark:text-green-400': (totalVariance || 0) > 0 }">
                            ${{ formatCurrency(totalVariance || 0) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    counts: Object,
    expected: Object,
});

const variance = computed(() => ({
    cash: (props.counts?.cash || 0) - (props.expected?.cash || 0),
    creditCards: (props.counts?.creditCards || 0) - (props.expected?.creditCards || 0),
}));

const actualTotal = computed(() => {
    const counts = props.counts || {};
    const total = Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0);
    return total;
});

const totalVariance = computed(() => {
    const variance = actualTotal.value - (props.expected?.total || 0);
    return variance;
});

const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}
</script>