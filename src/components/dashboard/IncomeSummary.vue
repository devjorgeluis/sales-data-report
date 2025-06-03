<template>
    <div
        class="overflow-hidden rounded-lg border border-gray-100 bg-white px-4 pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-800 dark:text-white/90">Estado de Resultados Sumario</h3>
            <button
                class="inline-flex items-center gap-2 rounded-lg text-theme-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400">
                View all
            </button>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar">
            <div id="inventoryRotationChart" class="-ml-5 min-w-[650px] xl:min-w-full">
                <VueApexCharts type="bar" height="300" :options="chartOptions" :series="series" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import VueApexCharts from 'vue3-apexcharts'
    import data from '../../json/summary.json'

    const filteredSales = computed(() => {
        return data.list;
    });

    const series = ref([
        {
            name: 'Sales Percentage',
            data: computed(() => filteredSales.value.map(item => item.percent)),
        },
    ]);

    const chartOptions = ref({
        colors: ['#333333'],
        chart: {
            fontFamily: 'Outfit, sans-serif',
            type: 'bar',
            toolbar: {
                show: false,
            },
            states: {
                hover: {
                    filter: {
                        type: 'none', // Disable hover effect
                    }
                }
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '40%'
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 4,
            colors: ['transparent'],
        },
        xaxis: {
            categories: computed(() => filteredSales.value.map(item => item.name)),
            axisBorder: {
                show: true,
                color: '#E2E8F0',
                height: 1,
            },
            axisTicks: {
                show: true,
                color: '#E2E8F0',
                height: 6,
            },
            labels: {
                show: true,
                style: {
                    colors: '#64748B',
                    fontSize: '12px',
                },
            },
        },
        yaxis: {
            min: 0,
            max: 100,
            tickAmount: 5,
            axisBorder: {
                show: true,
                color: '#E2E8F0',
            },
            axisTicks: {
                show: true,
                color: '#E2E8F0',
                width: 6,
            },
            labels: {
                show: true,
                style: {
                    colors: '#64748B',
                    fontSize: '12px',
                },
                formatter: function(val) {
                    return val;
                },
            },
        },
        grid: {
            show: true,
            strokeDashArray: 0,
            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + '%';
                },
            },
        },
    });
</script>