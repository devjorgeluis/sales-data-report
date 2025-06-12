<template>
    <div class="p-3 sm:p-5">
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
import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';

const props = defineProps({
    filteredCashFlows: {
        type: Array,
        required: true
    },
    filters: {
        type: Object,
        required: true
    }
})

defineOptions({
    components: {
        apexchart: VueApexCharts
    }
})

const aggregatedData = computed(() => {
    const dataByPeriod = {};

    if (props.filters.month) {
        props.filteredCashFlows.forEach(item => {
            if (item.date) {
                try {
                    const dateObj = parse(item.date, "EEEE d 'de' MMMM yyyy", new Date(), { locale: es });
                    if (isNaN(dateObj.getTime())) {
                        console.warn(`Invalid date format for item.date: ${item.date}`);
                        return;
                    }
                    
                    const itemMonth = format(dateObj, 'yyyy/MM');
                    if (itemMonth === props.filters.month) {
                        const day = format(dateObj, 'dd');
                        if (!dataByPeriod[day]) {
                            dataByPeriod[day] = { income: 0, expense: 0, balance: 0 };
                        }
                        dataByPeriod[day].income += Number(item.income) || 0;
                        dataByPeriod[day].expense += Number(item.expense) || 0;
                        dataByPeriod[day].balance += Number(item.balance) || 0;
                    }
                } catch (error) {
                    console.error(`Error parsing date ${item.date}:`, error);
                }
            }
        });
    } else {
        props.filteredCashFlows.forEach(item => {
            const month = item.month || 'Unknown';
            if (!dataByPeriod[month]) {
                dataByPeriod[month] = { income: 0, expense: 0, balance: 0 };
            }
            dataByPeriod[month].income += Number(item.income) || 0;
            dataByPeriod[month].expense += Number(item.expense) || 0;
            dataByPeriod[month].balance += Number(item.balance) || 0;
        });
    }

    return dataByPeriod;
});

const chartOptions = computed(() => {
    const periods = Object.keys(aggregatedData.value).sort((a, b) => {
        if (props.filters.month) {
            return parseInt(a) - parseInt(b);
        }
        return new Date(a) - new Date(b);
    });    

    const incomeData = periods.map(period => aggregatedData.value[period].income);
    const expenseData = periods.map(period => aggregatedData.value[period].expense);
    const balanceData = periods.map(period => aggregatedData.value[period].balance);

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
            categories: periods,
            title: {
                text: props.filters.month ? 'Day' : 'Month',
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