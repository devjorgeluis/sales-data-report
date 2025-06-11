<template>
    <admin-layout>
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard>
                <pl-filters :filters="filters" :filtered-data="filteredData" @update:filters="filters = $event"
                    @export-to-pdf="exportToPDF" @export-to-excel="exportToExcel" />

                <pl-table :filtered-data="filteredData" :total-data="profitLossData.total" />
            </ComponentCard>
        </div>
    </admin-layout>
</template>

<script setup>
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import PlFilters from "@/components/profit-loss/PlFilters.vue";
import PlTable from "@/components/profit-loss/PlTable.vue";

import { ref, computed } from 'vue';
import profitLossData from '@/json/profit_loss.json';

const filters = ref({
    startDate: '',
    endDate: '',
});

const filteredData = computed(() => {
    const filterByDate = (items) => {
        if (!filters.value.startDate || !filters.value.endDate) return items;

        return items.map(item => {
            if (item.list) {
                return {
                    ...item,
                    list: item.list.map(subItem => ({
                        name: subItem.name,
                        price: subItem.price || (subItem.total ? subItem.total.price : 0),
                        percent: subItem.percent || (subItem.total ? subItem.total.percent : 0),
                        total: subItem.total,
                        list: subItem.list?.filter(grandSubItem => {
                            let startDate = new Date(grandSubItem.date || '2025-06-01'); // Default date if not present
                            const filterStart = new Date(filters.value.startDate);
                            const filterEnd = new Date(filters.value.endDate);
                            return startDate >= filterStart && startDate <= filterEnd;
                        }).map(grandSubItem => ({
                            name: grandSubItem.name,
                            price: grandSubItem.price,
                            percent: grandSubItem.percent,
                            date: grandSubItem.date // Preserve date for filtering
                        }))
                    })).filter(subItem => subItem.list?.length > 0 || !subItem.list)
                };
            }
            return {
                name: item.name,
                price: item.total ? item.total.price : 0,
                percent: item.total ? item.total.percent : 0,
                total: item.total,
                date: item.date // Preserve date for top-level items if needed
            };
        }).filter(item => item.list?.length > 0 || !item.list);
    };

    return filterByDate(profitLossData.list || []);
});

const exportToPDF = () => console.log("Exporting to PDF...");
const exportToExcel = () => console.log("Exporting to Excel...");

const handlePageChange = (page) => {
    console.log("Page changed to:", page);
};
</script>