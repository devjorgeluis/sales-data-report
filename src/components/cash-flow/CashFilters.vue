<template>
    <div class="p-3 sm:p-5 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-wrap gap-4 items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Cash Flow</h2>
            <div class="flex flex-wrap gap-3">
                <button @click="exportToPDF"
                    class="px-4 py-2 bg-yellow-400 text-sm text-black rounded-lg hover:bg-yellow-500 transition-colors">
                    Export to PDF
                </button>
                <button @click="exportToExcel"
                    class="px-4 py-2 bg-yellow-400 text-sm text-black rounded-lg hover:bg-yellow-500 transition-colors">
                    Export to Excel
                </button>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
                <select v-model="localFilters.month" @change="$emit('update:filters', localFilters)"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">All Months</option>
                    <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select v-model="localFilters.category" @change="$emit('update:filters', localFilters)"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">All Categories</option>
                    <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select v-model="localFilters.type" @change="$emit('update:filters', localFilters)"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">All Types</option>
                    <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const props = defineProps({
    filters: {
        type: Object,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    types: {
        type: Array,
        required: true
    },
    months: {
        type: Array,
        required: true
    },
    filteredCashFlows: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:filters', 'export-to-pdf', 'export-to-excel'])

const localFilters = ref({ ...props.filters })

watch(() => props.filters, (newFilters) => {
    localFilters.value = { ...newFilters }
})

const now = new Date();
const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)

    const headers = ['Date', 'Type', 'Category', 'Description', 'Income', 'Expense', 'Balance']
    const data = props.filteredCashFlows.map(item => [
        item.date || '',
        item.type || '',
        item.category || '',
        item.description || '',
        item.income ? `$${formatCurrency(item.income)}` : '-',
        item.expense ? `$${formatCurrency(item.expense)}` : '-',
        item.balance ? `$${formatCurrency(item.balance)}` : '-'
    ])

    autoTable(doc, {
        head: [headers],
        body: data,
        startY: 10,
        styles: {
            fontSize: 8
        },
        headStyles: { fillColor: [0, 102, 204] },
        margin: { top: 10 }
    })

    const filename = `cash_flow_report_${now.toISOString().split('T')[0]}.pdf`
    doc.save(filename)
}

const exportToExcel = () => {
    const data = props.filteredCashFlows.map(item => ({
        Date: item.date || '',
        Type: item.type || '',
        Category: item.category || '',
        Description: item.description || '',
        Income: item.income ? `$${formatCurrency(item.income)}` : '-',
        Expense: item.expense ? `$${formatCurrency(item.expense)}` : '-',
        Balance: item.balance ? `$${formatCurrency(item.balance)}` : '-'
    }))

    const ws = XLSX.utils.json_to_sheet(data)

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Cash Flow')

    const filename = `cash_flow_report_${now.toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, filename)
}
</script>