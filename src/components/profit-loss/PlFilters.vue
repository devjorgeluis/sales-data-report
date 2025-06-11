<template>
    <div class="p-3 sm:p-5 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div class="flex flex-col gap-2 w-[300px]">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Date Range</h2>
                <input ref="datePicker" 
                    class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200" 
                    placeholder="Select date range" />
            </div>
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
                emit('update:filters', { ...localFilters.value });
            }
        },
    });
});

watch(localFilters, (newFilters) => {
    emit('update:filters', { ...newFilters });
}, { deep: true });

const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = [];

    if (props.filteredData && props.filteredData.length) {
        props.filteredData.forEach((item) => {
        tableData.push([
            item.name,
            formatCurrency(item.total?.price ?? item.price ?? 0),
            (item.total?.percent ?? item.percent ?? 0) + '%'
        ]);

        if (item.list?.length) {
            item.list.forEach((subItem) => {
            tableData.push([
                `  ${subItem.name}`,
                formatCurrency(subItem.total?.price ?? subItem.price ?? 0),
                (subItem.total?.percent ?? subItem.percent ?? 0) + '%'
            ]);

            if (subItem.list?.length) {
                subItem.list.forEach((grandSubItem) => {
                tableData.push([
                    `${grandSubItem.name}`,
                        formatCurrency(grandSubItem.price ?? 0),
                        (grandSubItem.percent ?? 0) + '%'
                    ]);
                });
            }
            });
        }
        });
    } else {
        tableData.push(['No data', '-', '-']);
    }

    autoTable(doc, {
        body: tableData,
        startY: 10,
        theme: 'striped',
        styles: { halign: 'right', cellPadding: 2 },
        columnStyles: {
            0: { halign: 'left', cellWidth: 100 },
            1: { halign: 'right', cellWidth: 50 },
            2: { halign: 'right', cellWidth: 30 }
        }
    });

    doc.save('profit_loss_report.pdf');
    emit('export-to-pdf');
};

const exportToExcel = () => {
    const worksheetData = [];
    const headers = ['Concepto', 'Importe ($)', '%'];

    worksheetData.push(headers);
    props.filteredData.forEach((item) => {
        worksheetData.push([item.name, formatCurrency(item.total ? item.total.price : item.price), (item.total ? item.total.percent : item.percent) + '%']);
        if (item.list) {
            item.list.forEach((subItem) => {
                worksheetData.push(['  ' + subItem.name, formatCurrency(subItem.total ? subItem.total.price : subItem.price), (subItem.total ? subItem.total.percent : subItem.percent) + '%']);
                if (subItem.list) {
                    subItem.list.forEach((grandSubItem) => {
                        worksheetData.push(['    ' + grandSubItem.name, formatCurrency(grandSubItem.price), grandSubItem.percent + '%']);
                    });
                }
            });
        }
    });

    worksheetData.push(['Total Ventas', formatCurrency(props.filteredData[0]?.total?.price || 0), props.filteredData[0]?.total?.percent + '%']);
    worksheetData.push(['Total Costo de Venta', formatCurrency(props.filteredData[1]?.total?.price || 0), props.filteredData[1]?.total?.percent + '%']);
    worksheetData.push(['Total Mano de Obra', formatCurrency(props.filteredData[2]?.total?.price || 0), props.filteredData[2]?.total?.percent + '%']);
    worksheetData.push(['Total Gastos Fijos o Variables', formatCurrency(props.filteredData[3]?.total?.price || 0), props.filteredData[3]?.total?.percent + '%']);
    worksheetData.push(['Total Gastos Fijos', formatCurrency(props.filteredData[4]?.total?.price || 0), props.filteredData[4]?.total?.percent + '%']);
    worksheetData.push(['Costo de Producción', formatCurrency(props.filteredData[3]?.production_cost?.price || 0), props.filteredData[3]?.production_cost?.percent + '%']);

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ProfitLoss');

    XLSX.writeFile(workbook, 'profit_loss_report.xlsx');
    emit('export-to-excel');
};
</script>