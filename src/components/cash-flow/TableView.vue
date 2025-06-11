<template>
    <div>
        <DataTable :columns="columns" :filtered-data="filteredCashFlows" :items-per-page-options="[10, 20, 50, 100]"
            @page-change="handlePageChange">
            <template #cell-income="{ value }">
                <p class="text-green-600 text-theme-sm dark:text-green-400" v-if="value > 0">
                    ${{ formatCurrency(value) }}
                </p>
                <p class="text-gray-400 text-theme-sm dark:text-gray-500" v-else>-</p>
            </template>

            <template #cell-expense="{ value }">
                <p class="text-red-600 text-theme-sm dark:text-red-400" v-if="value > 0">
                    ${{ formatCurrency(value) }}
                </p>
                <p class="text-gray-400 text-theme-sm dark:text-gray-500" v-else>-</p>
            </template>

            <template #cell-balance="{ value }">
                <p class="text-theme-sm"
                    :class="value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    ${{ formatCurrency(value) }}
                </p>
            </template>
        </DataTable>
    </div>
</template>

<script setup>
import DataTable from '../common/DataTable.vue'

const props = defineProps({
    filteredCashFlows: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['page-change'])

const columns = [
    { key: 'date', label: 'Date', align: 'left', width: '30%' },
    { key: 'type', label: 'Type', align: 'left', width: '10%' },
    { key: 'category', label: 'Category', align: 'left', width: '10%' },
    { key: 'description', label: 'Description', align: 'left', width: '20%' },
    { key: 'income', label: 'Income', align: 'left', width: '10%' },
    { key: 'expense', label: 'Expense', align: 'left', width: '10%' },
    { key: 'balance', label: 'Balance', align: 'left', width: '10%' }
]

const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

const handlePageChange = (event) => {
    emit('page-change', event)
}
</script>