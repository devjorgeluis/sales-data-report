<template>
    <div class="p-5 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div class="flex flex-col gap-2 w-[300px]">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Date Range</h2>
                <input ref="datePicker" 
                    class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200" 
                    placeholder="Select date range" />
            </div>
            <div class="flex flex-wrap gap-3">
                <button @click="exportToPDF"
                    class="px-4 py-2 bg-blue-500 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Export to PDF
                </button>
                <button @click="exportToExcel"
                    class="px-4 py-2 bg-green-500 text-sm text-white rounded-lg hover:bg-green-700 transition-colors">
                    Export to Excel
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const props = defineProps({
    filters: {
        type: Object,
        required: true,
    },
    filteredData: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['update:filters', 'export-to-pdf', 'export-to-excel']);

const localFilters = ref({ ...props.filters });
const datePicker = ref(null);
onMounted(() => {
    flatpickr(datePicker.value, {
        mode: "range",
        dateFormat: "Y/m/d",
        defaultDate: [localFilters.value.startDate, localFilters.value.endDate],
        onChange: (selectedDates) => {
            if (selectedDates.length === 2) {
                localFilters.value.startDate = selectedDates[0].toISOString().split('T')[0];
                localFilters.value.endDate = selectedDates[1].toISOString().split('T')[0];
            }
        },
    });
});

watch(localFilters, (newFilters) => {
    newFilters = { ...newFilters };
    emit('update:filters', newFilters);
}, { deep: true });

const now = new Date();
const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const exportToPDF = () => {
    const doc = new jsPDF();

    const formattedDate = now.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Los_Angeles',
    }).replace(',', '');
    doc.setFontSize(16);
    doc.text(`Profit & Loss Report - ${formattedDate} PDT`, 10, 10);

    const headers = ['Date', 'Revenue', 'Cost of Goods Sold', 'Gross Profit', 'Operating Expenses', 'Net Income'];
    const data = props.filteredData.map(item => [
        item.date || '',
        `$` + formatCurrency(item.revenue.total) || '-',
        `$` + formatCurrency(item.costOfGoodsSold.total) || '-',
        `$` + formatCurrency(item.revenue.total - item.costOfGoodsSold.total) || '-',
        `$` + formatCurrency(item.operatingExpenses.total) || '-',
        `$` + formatCurrency(item.revenue.total - item.costOfGoodsSold.total - item.operatingExpenses.total) || '-',
    ]);

    autoTable(doc, {
        head: [headers],
        body: data,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [0, 102, 204] },
        margin: { top: 10 },
    });

    const filename = `profit_loss_report_${now.toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
};

const exportToExcel = () => {
    const data = props.filteredData.map(item => ({
        Date: item.date || '',
        'Revenue': `$` + formatCurrency(item.revenue.total) || '-',
        'Cost of Goods Sold': `$` + formatCurrency(item.costOfGoodsSold.total) || '-',
        'Gross Profit': `$` + formatCurrency(item.revenue.total - item.costOfGoodsSold.total) || '-',
        'Operating Expenses': `$` + formatCurrency(item.operatingExpenses.total) || '-',
        'Net Income': `$` + formatCurrency(item.revenue.total - item.costOfGoodsSold.total - item.operatingExpenses.total) || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Profit & Loss');

    const filename = `profit_loss_report_${now.toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
};
</script>