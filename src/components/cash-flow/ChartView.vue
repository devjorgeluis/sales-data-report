<template>
    <div class="p-5">
        <div class="h-100">
            <apexchart v-if="chartOptions.series.length > 0" type="line" height="100%" :options="chartOptions"
                :series="chartOptions.series" />
            <div v-else class="bg-gray-100 dark:bg-gray-800 h-full rounded-lg flex items-center justify-center">
                <p class="text-gray-500 dark:text-gray-400">No data available for the selected filters.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
    filteredCashFlows: {
        type: Array,
        required: true
    }
})

defineOptions({
    components: {
        apexchart: VueApexCharts
    }
})

const aggregatedData = computed(() => {
    const dataByMonth = {}

    props.filteredCashFlows.forEach(item => {
        const month = item.month || 'Unknown'
        if (!dataByMonth[month]) {
            dataByMonth[month] = { income: 0, expense: 0, balance: 0 }
        }
        dataByMonth[month].income += Number(item.income) || 0
        dataByMonth[month].expense += Number(item.expense) || 0
        dataByMonth[month].balance += Number(item.balance) || 0
    })

    return dataByMonth
})

const chartOptions = computed(() => {
    const months = Object.keys(aggregatedData.value).sort()

    const incomeData = months.map(month => aggregatedData.value[month].income)
    const expenseData = months.map(month => aggregatedData.value[month].expense)
    const balanceData = months.map(month => aggregatedData.value[month].balance)

    return {
        series: [
            {
                name: 'Income',
                data: incomeData,
                color: '#2563EB'
            },
            {
                name: 'Expense',
                data: expenseData,
                color: '#DC2626'
            },
            {
                name: 'Balance',
                data: balanceData,
                color: '#16A34A'
            }
        ],
        chart: {
            type: 'line',
            height: '100%',
            toolbar: {
                show: true,
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
            categories: months,
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