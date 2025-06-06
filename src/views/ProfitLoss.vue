<template>
    <admin-layout>
        <div class="p-6 space-y-6 bg-gray-50 min-h-screen dark:bg-gray-900">
            <ComponentCard class="shadow-lg rounded-xl bg-white dark:bg-gray-800">
                <pl-filters :filters="filters" :filtered-data="filteredData" @update:filters="filters = $event"
                    @export-to-pdf="exportToPDF" @export-to-excel="exportToExcel" />

                <pl-summary :summary-totals="summaryTotals" />

                <toggle-view :view-mode="viewMode" @update:viewMode="viewMode = $event" />

                <pl-detail-view v-if="viewMode === 'detail'" :filtered-data="filteredData"
                    @page-change="handlePageChange" />

                <pl-summary-view v-else-if="viewMode === 'summary'" :filtered-data="filteredData" />

                <pl-chart-view v-else-if="viewMode === 'chart'" :filtered-data="filteredData" />
            </ComponentCard>
        </div>
    </admin-layout>
</template>

<script setup>
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import PlFilters from "@/components/profit-loss/PlFilters.vue";
import PlSummary from "@/components/profit-loss/PlSummary.vue";
import ToggleView from "@/components/profit-loss/ToggleView.vue";
import PlDetailView from "@/components/profit-loss/PlDetailView.vue";
import PlSummaryView from "@/components/profit-loss/PlSummaryView.vue";
import PlChartView from "@/components/profit-loss/PlChartView.vue";

import { ref, computed, onMounted, watch } from 'vue';
import profitLossData from '@/json/profit_loss.json';

const transformPlData = (jsonData) => {
    const monthlyData = {};
    Object.entries(jsonData['Ventas']).forEach(([date, ventas]) => {
        const monthKey = date.split('-')[0] + '/' + date.split('-')[1];
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                date: monthKey,
                revenue: { total: 0, subCategories: [] },
                costOfGoodsSold: { total: 0, subCategories: [] },
                operatingExpenses: { total: 0, subCategories: [] },
            };
        }

        const costoDeVenta = jsonData['Costo de Venta'][date] || {};
        const gastosFijosVariables = jsonData['Gastos Fijos o Variables'][date] || {};
        const gastosFijos = jsonData['Gastos Fijos'][date] || {};

        monthlyData[monthKey].revenue.total += ventas['Total Ventas']?.value || 0;
        monthlyData[monthKey].revenue.subCategories = [
            { name: 'Alimento', amount: (monthlyData[monthKey].revenue.subCategories.find(c => c.name === 'Alimento')?.amount || 0) + (ventas['Alimento']?.value || 0) },
            { name: 'Licor', amount: (monthlyData[monthKey].revenue.subCategories.find(c => c.name === 'Licor')?.amount || 0) + (ventas['Licor']?.value || 0) },
            { name: 'Cerveza', amount: (monthlyData[monthKey].revenue.subCategories.find(c => c.name === 'Cerveza')?.amount || 0) + (ventas['Cerveza']?.value || 0) },
            { name: 'Vino', amount: (monthlyData[monthKey].revenue.subCategories.find(c => c.name === 'Vino')?.amount || 0) + (ventas['Vino']?.value || 0) },
            { name: 'Refrescos', amount: (monthlyData[monthKey].revenue.subCategories.find(c => c.name === 'Refrescos')?.amount || 0) + (ventas['Refrescos']?.value || 0) },
            { name: 'Otra Mercancia', amount: (monthlyData[monthKey].revenue.subCategories.find(c => c.name === 'Otra Mercancia')?.amount || 0) + (ventas['Otra Mercancia']?.value || 0) },
        ].filter(c => c.amount > 0);

        monthlyData[monthKey].costOfGoodsSold.total += costoDeVenta['Total Costo de Venta']?.value || 0;
        monthlyData[monthKey].costOfGoodsSold.subCategories = [
            { name: 'Alimento', amount: (monthlyData[monthKey].costOfGoodsSold.subCategories.find(c => c.name === 'Alimento')?.amount || 0) + (costoDeVenta['Alimento']?.value || 0) },
            { name: 'Bar', amount: (monthlyData[monthKey].costOfGoodsSold.subCategories.find(c => c.name === 'Bar')?.amount || 0) + (costoDeVenta['Bar']?.value || 0) },
            { name: 'Desechables', amount: (monthlyData[monthKey].costOfGoodsSold.subCategories.find(c => c.name === 'Desechables')?.amount || 0) + (costoDeVenta['Desechables']?.value || 0) },
        ].filter(c => c.amount > 0);

        monthlyData[monthKey].operatingExpenses.total += (gastosFijosVariables['Total Gastos Fijos o Variables']?.value || 0) + (gastosFijos['Total Gastos Fijos']?.value || 0);
        monthlyData[monthKey].operatingExpenses.subCategories = [
            { name: 'Gastos Directos Operativos', amount: (monthlyData[monthKey].operatingExpenses.subCategories.find(c => c.name === 'Gastos Directos Operativos')?.amount || 0) + (gastosFijosVariables['Gastos Directos Operativos']?.value || 0) },
            { name: 'Música & Entretenimiento', amount: (monthlyData[monthKey].operatingExpenses.subCategories.find(c => c.name === 'Música & Entretenimiento')?.amount || 0) + (gastosFijosVariables['Música & Entretenimiento']?.value || 0) },
            { name: 'Mercadotecnia', amount: (monthlyData[monthKey].operatingExpenses.subCategories.find(c => c.name === 'Mercadotecnia')?.amount || 0) + (gastosFijosVariables['Mercadotecnia']?.value || 0) },
            { name: 'Servicios', amount: (monthlyData[monthKey].operatingExpenses.subCategories.find(c => c.name === 'Servicios')?.amount || 0) + (gastosFijosVariables['Servicios']?.value || 0) },
            { name: 'Gastos Generales & Admin', amount: (monthlyData[monthKey].operatingExpenses.subCategories.find(c => c.name === 'Gastos Generales & Admin')?.amount || 0) + (gastosFijosVariables['Gastos Generales & Admin']?.value || 0) },
            { name: 'Reparaciones & Mantenimiento', amount: (monthlyData[monthKey].operatingExpenses.subCategories.find(c => c.name === 'Reparaciones & Mantenimiento')?.amount || 0) + (gastosFijosVariables['Reparaciones & Mantenimiento']?.value || 0) },
            { name: 'Costos de Ocupación', amount: (monthlyData[monthKey].operatingExpenses.subCategories.find(c => c.name === 'Costos de Ocupación')?.amount || 0) + (gastosFijos['Costos de Ocupación']?.value || 0) },
            { name: 'Arrendamiento de Equipo', amount: (monthlyData[monthKey].operatingExpenses.subCategories.find(c => c.name === 'Arrendamiento de Equipo')?.amount || 0) + (gastosFijos['Arrendamiento de Equipo']?.value || 0) },
            { name: 'Depreciación & Amortización', amount: (monthlyData[monthKey].operatingExpenses.subCategories.find(c => c.name === 'Depreciación & Amortización')?.amount || 0) + (gastosFijos['Depreciación & Amortización']?.value || 0) },
        ].filter(c => c.amount > 0);
    });

    return Object.values(monthlyData);
};

const allPlData = ref([]);
const viewMode = ref('summary');
const currentPage = ref(1);
const itemsPerPage = ref(20);

const filters = ref({
    startDate: '',
    endDate: '',
});

onMounted(() => {
    allPlData.value = transformPlData(profitLossData);
});

const filteredData = computed(() => {
    return allPlData.value.filter(item => {
        if (filters.value.startDate && filters.value.endDate) {
            const itemDate = new Date(item.date);
            const startDate = new Date(filters.value.startDate);
            const endDate = new Date(filters.value.endDate);
            if (itemDate < startDate || itemDate > endDate) {
                return false;
            }
        }
        return true;
    });
});

watch([filters, itemsPerPage], () => {
    currentPage.value = 1;
});

const summaryTotals = computed(() => {
    let revenue = 0;
    let costOfGoodsSold = 0;
    let operatingExpenses = 0;

    filteredData.value.forEach(item => {
        revenue += Number(item.revenue.total) || 0;
        costOfGoodsSold += Number(item.costOfGoodsSold.total) || 0;
        operatingExpenses += Number(item.operatingExpenses.total) || 0;
    });

    const grossProfit = revenue - costOfGoodsSold;
    const netIncome = grossProfit - operatingExpenses;

    const grossProfitMargin = revenue ? ((grossProfit / revenue) * 100).toFixed(2) + '%' : '0%';
    const netProfitMargin = revenue ? ((netIncome / revenue) * 100).toFixed(2) + '%' : '0%';

    return {
        revenue,
        costOfGoodsSold,
        grossProfit,
        operatingExpenses,
        netIncome,
        grossProfitMargin,
        netProfitMargin,
    };
});

const handlePageChange = ({ page, itemsPerPage: newItemsPerPage }) => {
    currentPage.value = page;
    itemsPerPage.value = newItemsPerPage;
};

const exportToPDF = () => {
};

const exportToExcel = () => {
};
</script>