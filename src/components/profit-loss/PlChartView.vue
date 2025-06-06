<template>
    <div class="p-5">
        <div class="h-100">
            <apexchart
                v-if="chartOptions.series.length > 0"
                type="line"
                height="100%"
                :options="chartOptions"
                :series="chartOptions.series"
            />
            <div
                v-else
                class="bg-gray-100 dark:bg-gray-800 h-full rounded-lg flex items-center justify-center"
            >
                <p class="text-gray-500 dark:text-gray-400">No data available for the selected filters.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

defineOptions({
    components: {
        apexchart: VueApexCharts
    }
})

const props = defineProps({
    filteredData: {
        type: Array,
        required: true
    }
})

const aggregatedData = computed(() => {
    const dataByDate = {}

    props.filteredData.forEach(item => {
        const date = item.date.slice(0, 7)
        if (!dataByDate[date]) {
            dataByDate[date] = { revenue: 0, costOfGoodsSold: 0, grossProfit: 0, operatingExpenses: 0, netIncome: 0 }
        }
        dataByDate[date].revenue += Number(item.revenue.total) || 0
        dataByDate[date].costOfGoodsSold += Number(item.costOfGoodsSold.total) || 0
        dataByDate[date].grossProfit += (item.revenue.total - item.costOfGoodsSold.total) || 0
        dataByDate[date].operatingExpenses += Number(item.operatingExpenses.total) || 0
        dataByDate[date].netIncome += (item.revenue.total - item.costOfGoodsSold.total - item.operatingExpenses.total) || 0
    })

    return dataByDate
})

const chartOptions = computed(() => {
    const dates = Object.keys(aggregatedData.value).sort()

    const revenueData = dates.map(date => aggregatedData.value[date].revenue)
    const costOfGoodsSoldData = dates.map(date => aggregatedData.value[date].costOfGoodsSold)
    const grossProfitData = dates.map(date => aggregatedData.value[date].grossProfit)
    const operatingExpensesData = dates.map(date => aggregatedData.value[date].operatingExpenses)
    const netIncomeData = dates.map(date => aggregatedData.value[date].netIncome)

    return {
        series: [
            {
                name: 'Revenue',
                data: revenueData,
                color: '#2563EB'
            },
            {
                name: 'Cost of Goods Sold',
                data: costOfGoodsSoldData,
                color: '#DC2626'
            },
            {
                name: 'Gross Profit',
                data: grossProfitData,
                color: '#D97706'
            },
            {
                name: 'Operating Expenses',
                data: operatingExpensesData,
                color: '#7C3AED'
            },
            {
                name: 'Net Income',
                data: netIncomeData,
                color: '#16A34A'
            }
        ],
        chart: {
            type: 'line',
            height: '100%',
            toolbar: {
                show: false,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            }
        },
        xaxis: {
            categories: dates,
            title: {
                text: 'Month',
                style: {
                    color: '#9CA3AF',
                    fontSize: '12px'
                }
            },
            labels: {
                style: {
                    colors: '#9CA3AF'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Amount (USD)',
                style: {
                    color: '#9CA3AF',
                    fontSize: '12px'
                }
            },
            labels: {
                formatter: (value) => {
                    return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                },
                style: {
                    colors: '#9CA3AF'
                }
            }
        },
        tooltip: {
            y: {
                formatter: (value) => {
                    return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                }
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        grid: {
            borderColor: '#E5E7EB',
            strokeDashArray: 4
        },
        legend: {
            position: 'top',
            labels: {
                colors: '#9CA3AF'
            }
        },
        dataLabels: {
            enabled: false
        }
    }
})
</script>