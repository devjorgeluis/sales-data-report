<template>
    <div class="p-5 border-b border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${{ formatCurrency(summaryTotals.revenue) }}</p>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400">Cost of Goods Sold</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">${{ formatCurrency(summaryTotals.costOfGoodsSold) }}</p>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400">Gross Profit</p>
            <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">${{ formatCurrency(summaryTotals.grossProfit) }}</p>
            <p class="text-xs text-green-600">Margin: {{ summaryTotals.grossProfitMargin }}</p>
        </div>
        <div class="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400">Operating Expenses</p>
            <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${{ formatCurrency(summaryTotals.operatingExpenses) }}</p>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400">Net Income</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">${{ formatCurrency(summaryTotals.netIncome) }}</p>
            <p class="text-xs text-green-600">Margin: {{ summaryTotals.netProfitMargin }}</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    summaryTotals: Object,
});

const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}
</script>