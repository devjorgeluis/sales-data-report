<template>
    <div class="max-w-full overflow-x-auto custom-scrollbar p-5">
        <table class="w-full border-collapse">
            <thead>
                <tr>
                    <th class="border-t p-3 font-medium text-left text-gray-500 text-theme-xs dark:text-gray-400">Date</th>
                    <th class="border-t p-3 font-medium text-right text-gray-500 text-theme-xs dark:text-gray-400">Revenue</th>
                    <th class="border-t p-3 font-medium text-right text-gray-500 text-theme-xs dark:text-gray-400">Cost of Goods Sold</th>
                    <th class="border-t p-3 font-medium text-right text-gray-500 text-theme-xs dark:text-gray-400">Gross Profit</th>
                    <th class="border-t p-3 font-medium text-right text-gray-500 text-theme-xs dark:text-gray-400">Operating Expenses</th>
                    <th class="border-t p-3 font-medium text-right text-gray-500 text-theme-xs dark:text-gray-400">Net Income</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in filteredData" :key="item.date">
                    <td class="border-t p-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">{{ item.date }}</td>
                    <td class="border-t p-3 text-right text-theme-sm text-blue-600 dark:text-blue-400">${{ formatCurrency(item.revenue.total) }}</td>
                    <td class="border-t p-3 text-right text-theme-sm text-red-600 dark:text-red-400">${{ formatCurrency(item.costOfGoodsSold.total) }}</td>
                    <td class="border-t p-3 text-right text-theme-sm text-yellow-600 dark:text-yellow-400">
                        ${{ formatCurrency(item.revenue.total - item.costOfGoodsSold.total) }}
                    </td>
                    <td class="border-t p-3 text-right text-theme-sm text-indigo-600 dark:text-indigo-400">${{ formatCurrency(item.operatingExpenses.total) }}</td>
                    <td class="border-t p-3 text-right text-theme-sm text-green-600 dark:text-green-400">
                        ${{ formatCurrency(item.revenue.total - item.costOfGoodsSold.total - item.operatingExpenses.total) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    filteredData: Array,
});

const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}
</script>