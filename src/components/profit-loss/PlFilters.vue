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
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
    totalData: {
        type: Object,
        required: true,
    }
});

const emit = defineEmits(['update:filters', 'export-to-pdf', 'export-to-excel']);

const localFilters = ref({ ...props.filters });
const datePicker = ref(null);

onMounted(() => {
    flatpickr(datePicker.value, {
        mode: "range",
        dateFormat: "m/d/Y",
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

const now = new Date();
const formatCurrency = (value) => {
    return value !== 0 ? Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) : "-";
};

const capitalizeFirstLetter = (str) => {
    return str.replace(/^./, (char) => char.toUpperCase());
};

const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = [];

    if (props.filteredData && props.filteredData.length) {
        props.filteredData.forEach((item) => {
            tableData.push([
                { content: capitalizeFirstLetter(item.name) + ":", styles: { fontStyle: 'bold', halign: 'left', fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
                '', '', ''
            ]);

            if (item.list && item.list.length) {
                item.list.forEach((subItem) => {
                    const isSubItemWithList = subItem.list && subItem.list.length > 0;
                    const subItemRow = [
                        { content: `    ${capitalizeFirstLetter(subItem.name)}${isSubItemWithList ? " - " : ""}`, styles: { halign: 'left', fillColor: isSubItemWithList ? [255, 255, 255] : [254, 249, 194], textColor: [0, 0, 0] } },
                        { content: '$', styles: { halign: 'center', fillColor: isSubItemWithList ? [255, 255, 255] : [254, 249, 194], textColor: [0, 0, 0] } },
                        { content: formatCurrency(subItem.total?.price ?? subItem.price ?? 0), styles: { halign: 'right', fillColor: isSubItemWithList ? [255, 255, 255] : [254, 249, 194], textColor: [0, 0, 0] } },
                        { content: (subItem.total?.percent ?? subItem.percent ?? 0) + '%', styles: { halign: 'right', fillColor: isSubItemWithList ? [255, 255, 255] : [254, 249, 194], textColor: [0, 0, 0] } }
                    ];
                    tableData.push(subItemRow);

                    if (subItem.list && subItem.list.length) {
                        subItem.list.forEach((grandSubItem) => {
                            tableData.push([
                                { content: `        ${capitalizeFirstLetter(grandSubItem.name)}`, styles: { halign: 'left', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                                { content: '$', styles: { halign: 'center', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                                { content: formatCurrency(grandSubItem.price ?? 0), styles: { halign: 'right', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                                { content: (grandSubItem.percent ?? 0) + '%', styles: { halign: 'right', fillColor: [254, 249, 194], textColor: [0, 0, 0] } }
                            ]);
                        });
                    }

                    if (subItem.total) {
                        tableData.push([
                            { content: `Total ${subItem.name}`, styles: { halign: 'center', fillColor: [128, 128, 128], textColor: [255, 255, 0] } },
                            { content: '$', styles: { halign: 'center', fillColor: [128, 128, 128], textColor: [255, 255, 0] } },
                            { content: formatCurrency(subItem.total.price), styles: { halign: 'right', fillColor: [128, 128, 128], textColor: [255, 255, 0] } },
                            { content: subItem.total.percent + '%', styles: { halign: 'right', fillColor: [128, 128, 128], textColor: [255, 255, 0] } }
                        ]);
                    }
                });
            }

            tableData.push([
                { content: `Total ${item.name}`, styles: { halign: 'left', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                { content: '$', styles: { halign: 'center', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                { content: formatCurrency(item.total?.price ?? item.price ?? 0), styles: { halign: 'right', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                { content: (item.total?.percent ?? item.percent ?? 0) + '%', styles: { halign: 'right', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } }
            ]);

            if (item.production_cost) {
                tableData.push([
                    { content: 'Costo de Produccion', styles: { halign: 'left', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                    { content: '$', styles: { halign: 'center', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                    { content: formatCurrency(item.production_cost?.price ?? '-'), styles: { halign: 'right', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                    { content: (item.production_cost?.percent ?? 0) + '%', styles: { halign: 'right', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } }
                ]);
            }

            tableData.push([{ content: '', colSpan: 4, styles: { cellWidth: 'auto', fillColor: [255, 255, 255] } }]); // Spacer row
        });

        if (props.totalData) {
            tableData.push([
                { content: 'Ganancia Operativa Bruta', styles: { halign: 'left', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                { content: '$', styles: { halign: 'center', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                { content: formatCurrency(props.totalData.profit.price), styles: { halign: 'right', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                { content: props.totalData.profit.percent + '%', styles: { halign: 'right', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } }
            ]);
            tableData.push([
                { content: 'Impuestos SAT', styles: { halign: 'left', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                { content: '$', styles: { halign: 'center', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                { content: formatCurrency(props.totalData.tax.price), styles: { halign: 'right', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                { content: props.totalData.tax.percent + '%', styles: { halign: 'right', fillColor: [254, 249, 194], textColor: [0, 0, 0] } }
            ]);
            tableData.push([
                { content: 'Préstamos Bancarios', styles: { halign: 'left', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                { content: '$', styles: { halign: 'center', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                { content: formatCurrency(props.totalData.bank_loans.price), styles: { halign: 'right', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                { content: props.totalData.bank_loans.percent + '%', styles: { halign: 'right', fillColor: [254, 249, 194], textColor: [0, 0, 0] } }
            ]);
            tableData.push([
                { content: 'Intereses', styles: { halign: 'left', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                { content: '$', styles: { halign: 'center', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                { content: formatCurrency(props.totalData.interest.price), styles: { halign: 'right', fillColor: [254, 249, 194], textColor: [0, 0, 0] } },
                { content: props.totalData.interest.percent + '%', styles: { halign: 'right', fillColor: [254, 249, 194], textColor: [0, 0, 0] } }
            ]);
            tableData.push([
                { content: 'Ganancia Bruta antes de Impuestos', styles: { halign: 'left', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                { content: '$', styles: { halign: 'center', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                { content: formatCurrency(props.totalData.profit_without_tax.price), styles: { halign: 'right', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                { content: props.totalData.profit_without_tax.percent + '%', styles: { halign: 'right', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } }
            ]);
            tableData.push([
                { content: 'TOTAL GASTOS', styles: { halign: 'left', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                { content: '$', styles: { halign: 'center', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                { content: formatCurrency(props.totalData.expense.price), styles: { halign: 'right', fillColor: [0, 0, 0], textColor: [255, 255, 0], fontStyle: 'bold' } },
                ''
            ]);
        }
    } else {
        tableData.push(['No data', '-', '-', '-']);
    }

    autoTable(doc, {
        body: tableData,
        startY: 10,
        theme: 'plain',
        styles: { cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 10 },
            2: { cellWidth: 40 },
            3: { cellWidth: 30 }
        }
    });

    const filename = `profit_loss_report${now.toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    emit('export-to-pdf');
};

const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ProfitLoss');

    props.filteredData.forEach((item) => {
        worksheet.addRow([
            capitalizeFirstLetter(item.name),
            formatCurrency(item.total ? item.total.price : item.price),
            (item.total ? item.total.percent : item.percent) + '%'
        ]);
        if (item.list) {
            item.list.forEach((subItem) => {
                worksheet.addRow([
                    '  ' + capitalizeFirstLetter(subItem.name),
                    formatCurrency(subItem.total ? subItem.total.price : subItem.price),
                    (subItem.total ? subItem.total.percent : subItem.percent) + '%'
                ]);
                if (subItem.list) {
                    subItem.list.forEach((grandSubItem) => {
                        worksheet.addRow([
                            '    ' + capitalizeFirstLetter(grandSubItem.name),
                            formatCurrency(grandSubItem.price),
                            grandSubItem.percent + '%'
                        ]);
                    });
                }
            });
        }
    });

    worksheet.addRow([
        'Ganancia Operativa Bruta',
        formatCurrency(props.totalData.profit.price),
        props.totalData.profit.percent + '%'
    ]);
    worksheet.addRow([
        'Impuestos SAT',
        formatCurrency(props.totalData.tax.price),
        props.totalData.tax.percent + '%'
    ]);
    worksheet.addRow([
        'Préstamos Bancarios',
        formatCurrency(props.totalData.bank_loans.price),
        props.totalData.bank_loans.percent + '%'
    ]);
    worksheet.addRow([
        'Intereses',
        formatCurrency(props.totalData.interest.price),
        props.totalData.interest.percent + '%'
    ]);
    worksheet.addRow([
        'Ganancia Bruta antes de Impuestos',
        formatCurrency(props.totalData.profit_without_tax.price),
        props.totalData.profit_without_tax.percent + '%'
    ]);
    worksheet.addRow([
        'TOTAL GASTOS',
        formatCurrency(props.totalData.expense.price),
        ' '
    ]);

    const filename = `profit_loss_report${now.toISOString().split('T')[0]}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);

    emit('export-to-excel');
};
</script>