<template>
    <admin-layout>
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard>
                <cash-filters :filters="filters" :categories="categories" :types="types" @update:filters="filters = $event" @export-to-pdf="exportToPDF" @export-to-excel="exportToExcel" />

                <cash-summary :summary-totals="summaryTotals" />

                <toggle-view :view-mode="viewMode" @update:viewMode="viewMode = $event" />

                <table-view v-if="viewMode === 'table'" :filtered-cash-flows="filteredCashFlows" @page-change="handlePageChange" />

                <chart-view v-else-if="viewMode === 'chart'" />
            </ComponentCard>
        </div>
    </admin-layout>
</template>

<script setup>
    import AdminLayout from "@/components/layout/AdminLayout.vue";
    import ComponentCard from "@/components/common/ComponentCard.vue";
    import CashFilters from "@/components/cash-flow/CashFilters.vue";
    import CashSummary from "@/components/cash-flow/CashSummary.vue";
    import ToggleView from "@/components/cash-flow/ToggleView.vue";
    import TableView from "@/components/cash-flow/TableView.vue";
    import ChartView from "@/components/cash-flow/ChartView.vue";

    import { ref, computed, onMounted, watch } from 'vue'
    import data from '../json/cash_flow.json'

    const allCashFlows = ref([])
    const viewMode = ref('table')
    const currentPage = ref(1)
    const itemsPerPage = ref(20)

    const filters = ref({
        startDate: '',
        endDate: '',
        category: '',
        type: ''
    })

    onMounted(() => {
        const items = []
        data.list.forEach(monthData => {
            if (monthData.list && Array.isArray(monthData.list)) {
                monthData.list.forEach(item => {
                    items.push(item)
                })
            }
        })
        allCashFlows.value = items
    })

    const categories = computed(() => {
        const uniqueCategories = new Set()
        allCashFlows.value.forEach(item => {
            if (item.category) uniqueCategories.add(item.category)
        })
        return Array.from(uniqueCategories)
    })

    const types = computed(() => {
        const uniqueTypes = new Set()
        allCashFlows.value.forEach(item => {
            if (item.type) uniqueTypes.add(item.type)
        })
        return Array.from(uniqueTypes)
    })

    const filteredCashFlows = computed(() => {
        return allCashFlows.value.filter(item => {
            if (filters.value.startDate && filters.value.endDate) {
                const itemDate = new Date(item.date)
                const startDate = new Date(filters.value.startDate)
                const endDate = new Date(filters.value.endDate)

                if (itemDate < startDate || itemDate > endDate) {
                    return false
                }
            }

            if (filters.value.category && item.category !== filters.value.category) {
                return false
            }

            if (filters.value.type && item.type !== filters.value.type) {
                return false
            }

            return true
        })
    })

    watch([filters, itemsPerPage], () => {
        currentPage.value = 1
    })

    const summaryTotals = computed(() => {
        const totals = {
            income: 0,
            expense: 0,
            balance: 0
        }

        filteredCashFlows.value.forEach(item => {
            totals.income += Number(item.income) || 0
            totals.expense += Number(item.expense) || 0
        })

        totals.balance = totals.income - totals.expense
        return totals
    })

    const handlePageChange = ({ page, itemsPerPage: newItemsPerPage }) => {
        currentPage.value = page
        itemsPerPage.value = newItemsPerPage
    }

    const exportToPDF = () => {
        alert('Export to PDF functionality to be implemented using a library like jsPDF')
    }

    const exportToExcel = () => {
        alert('Export to Excel functionality to be implemented using a library like xlsx')
    }
</script>