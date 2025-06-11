<template>
    <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
            <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th v-for="column in columns" :key="column.key" class="px-5 py-3 text-left sm:px-6 cursor-pointer" :class="{
                        'text-right': column.align === 'right',
                        'text-center': column.align === 'center'
                    }" @click="sortColumn(column.key)" :style="{ width: column.width }">
                        <p class="flex items-center font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                            {{ column.label }}
                            <span v-if="sortKey === column.key" class="ml-2">
                                <svg v-if="sortDirection === 'asc'" class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 15l7-7 7 7H5z"/>
                                </svg>
                                <svg v-else class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5l7 7 7-7H5z"/>
                                </svg>
                            </span>
                        </p>
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in paginatedData" :key="index"
                    class="border-t border-gray-100 dark:border-gray-800 even:bg-gray-200 odd:bg-white dark:even:bg-gray-500 dark:odd:bg-gray-700">
                    <td v-for="column in columns" :key="column.key" class="px-5 py-4 sm:px-6" :class="{
                        'text-right': column.align === 'right',
                        'text-center': column.align === 'center'
                    }" :style="{ width: column.width }">
                        <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                            <p class="text-gray-500 text-theme-sm dark:text-gray-400 min-w-[80px]">
                                {{ column.format ? column.format(item[column.key]) : item[column.key] }}
                            </p>
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
            <div class="flex items-center min-w-fit">
                <label class="mr-2 text-sm text-gray-600 dark:text-gray-400">Items per page:</label>
                <select v-model="itemsPerPage"
                    class="px-2 py-1 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </div>

            <div class="flex items-center space-x-1 min-w-fit" v-if="filteredData.length > 0">
                <span class="text-sm text-gray-600 dark:text-gray-400">
                    Showing {{ paginationInfo.from }}-{{ paginationInfo.to }} of {{ filteredData.length }}
                </span>
            </div>

            <div class="flex space-x-1">
                <button @click="goToPage(1)" :disabled="currentPage === 1"
                    class="px-2 py-1 rounded-md text-sm border border-gray-300 dark:border-gray-600"
                    :class="currentPage === 1 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'">
                    <PreviousIcon />
                </button>
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-2 py-1 rounded-md text-sm border border-gray-300 dark:border-gray-600"
                    :class="currentPage === 1 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'">
                    <AngleLeftIcon />
                </button>

                <div class="flex space-x-1">
                    <button v-for="page in displayedPages" :key="page" @click="goToPage(page)"
                        class="px-3 py-1 rounded-md text-sm border"
                        :class="currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'">
                        {{ page }}
                    </button>
                </div>

                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="px-2 py-1 rounded-md text-sm border border-gray-300 dark:border-gray-600"
                    :class="currentPage === totalPages ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'">
                    <AngleRightIcon />
                </button>
                <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
                    class="px-2 py-1 rounded-md text-sm border border-gray-300 dark:border-gray-600"
                    :class="currentPage === totalPages ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'">
                    <NextIcon />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { NextIcon, PreviousIcon, AngleRightIcon, AngleLeftIcon } from '@/icons'

const props = defineProps({
    columns: {
        type: Array,
        required: true,
        default: () => []
    },
    filteredData: {
        type: Array,
        required: true,
        default: () => []
    },
    itemsPerPageOptions: {
        type: Array,
        default: () => [10, 20, 50, 100]
    }
})

const emit = defineEmits(['page-change'])

const currentPage = ref(1)
const itemsPerPage = ref(props.itemsPerPageOptions[1] || 20)
const sortKey = ref(null)
const sortDirection = ref('asc')

const totalPages = computed(() => Math.ceil(props.filteredData.length / itemsPerPage.value) || 1)

const displayedPages = computed(() => {
    const range = 2
    let start = Math.max(1, currentPage.value - range)
    let end = Math.min(totalPages.value, currentPage.value + range)

    if (currentPage.value <= range) {
        end = Math.min(1 + range * 2, totalPages.value)
    } else if (currentPage.value > totalPages.value - range) {
        start = Math.max(1, totalPages.value - range * 2)
    }

    const pages = []
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

const paginatedData = computed(() => {
    let data = [...props.filteredData]
    if (sortKey.value) {
        data.sort((a, b) => {
            const aValue = a[sortKey.value]
            const bValue = b[sortKey.value]

            if (aValue == null || bValue == null) {
                return aValue == null ? 1 : -1
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection.value === 'asc' ? 
                    aValue.toLowerCase().localeCompare(bValue.toLowerCase()) : 
                    bValue.toLowerCase().localeCompare(aValue.toLowerCase())
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
            }

            return sortDirection.value === 'asc' ? 
                String(aValue).localeCompare(String(bValue)) : 
                String(bValue).localeCompare(String(aValue))
        })
    }
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value
    return data.slice(startIndex, endIndex)
})

const paginationInfo = computed(() => {
    const from = props.filteredData.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
    const to = Math.min(currentPage.value * itemsPerPage.value, props.filteredData.length)
    return { from, to }
})

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    emit('page-change', page)
}

const sortColumn = (key) => {
    if (sortKey.value === key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = key
        sortDirection.value = 'asc'
    }
}

watch(() => props.filteredData, () => currentPage.value = 1)
watch(itemsPerPage, () => currentPage.value = 1)
</script>