<template>
    <div class="p-5 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-wrap gap-4 items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Cash Flow</h2>
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
                <div class="flex gap-2">
                    <input type="date" v-model="localFilters.startDate" @input="$emit('update:filters', localFilters)"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <input type="date" v-model="localFilters.endDate" @input="$emit('update:filters', localFilters)"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select v-model="localFilters.category" @change="$emit('update:filters', localFilters)"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">All Categories</option>
                    <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select v-model="localFilters.type" @change="$emit('update:filters', localFilters)"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">All Types</option>
                    <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    filters: {
        type: Object,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    types: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:filters', 'export-to-pdf', 'export-to-excel'])

const localFilters = ref({ ...props.filters })

watch(() => props.filters, (newFilters) => {
    localFilters.value = { ...newFilters }
})

const exportToPDF = () => {
    emit('export-to-pdf')
}

const exportToExcel = () => {
    emit('export-to-excel')
}
</script>