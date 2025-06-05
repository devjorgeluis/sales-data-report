<template>
    <div class="p-5 border-b border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${{ formatCurrency(summaryTotals.income) }}</p>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">${{ formatCurrency(summaryTotals.expense) }}</p>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400">Net Balance</p>
            <p class="text-2xl font-bold"
                :class="summaryTotals.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                ${{ formatCurrency(summaryTotals.balance) }}
            </p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    summaryTotals: {
        type: Object,
        required: true
    }
})

const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}
</script>