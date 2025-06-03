<template>
    <div
        class="overflow-hidden rounded-lg border border-gray-100 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex items-center justify-between mb-4 px-4">
            <h3 class="text-lg font-medium text-gray-800 dark:text-white/90">Ingresos & Egresos</h3>
            <button
                class="inline-flex items-center gap-2 rounded-lg text-theme-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400">
                View all
            </button>
        </div>

        <div class="max-w-full overflow-x-auto custom-scrollbar max-h-[300px]">
            <table class="min-w-full">
                <thead class="sticky top-0">
                    <tr class="border-gray-100 dark:border-gray-800">
                        <th class="py-2 px-3 text-left bg-gray-100 dark:bg-gray-700">
                            <p class="font-medium text-gray-800 text-theme-md dark:text-gray-400">Categoria</p>
                        </th>
                        <th class="py-2 px-3 text-left bg-gray-100 dark:bg-gray-700">
                            <p class="font-medium text-gray-800 text-theme-md dark:text-gray-400">Ingreso</p>
                        </th>
                        <th class="py-2 px-3 text-left bg-gray-100 dark:bg-gray-700">
                            <p class="font-medium text-gray-800 text-theme-md dark:text-gray-400">Gasto</p>
                        </th>
                        <th class="py-2 px-3 text-left bg-gray-100 dark:bg-gray-700">
                            <p class="font-medium text-gray-800 text-theme-md dark:text-gray-400">Saldo</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in list" :key="index"
                        class="border-t border-gray-200 dark:border-gray-800">
                        <td class="py-2 px-3 whitespace-nowrap">
                            <p class="text-gray-700 text-theme-sm dark:text-gray-600">{{ item.category }}</p>
                        </td>
                        <td class="py-2 px-3 whitespace-nowrap">
                            <p class="text-gray-700 text-theme-sm dark:text-gray-600">{{ item.income }}</p>
                        </td>
                        <td class="py-2 px-3 whitespace-nowrap">
                            <p class="text-gray-700 text-theme-sm dark:text-gray-600">{{ item.expense }}</p>
                        </td>
                        <td class="py-2 px-3 whitespace-nowrap">
                            <p class="text-gray-700 text-theme-sm dark:text-gray-600">{{ item.balance }}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import data from '../../json/income_expense.json'

    const list = ref(data.list);
</script>