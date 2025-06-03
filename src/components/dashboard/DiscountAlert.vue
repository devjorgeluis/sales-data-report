<template>
    <div
        class="overflow-hidden rounded-lg border border-gray-100 bg-white px-4 pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-800 dark:text-white/90">Alerta de descuento</h3>
        </div>

        <div class="space-y-3">
            <div v-for="(alert, index) in discountAlerts" :key="index">
                <div class="flex justify-between items-center mb-1">
                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ alert.name }}</p>
                    <p class="text-sm font-medium text-gray-800 dark:text-white">${{ alert.amount }}</p>
                </div>
                <div class="h-2 w-full rounded-full" :class="alert.color">
                    <div class="h-full rounded-full" :style="{ width: alert.percentage }"></div>
                </div>
            </div>
        </div>

        <div class="mt-4 mb-4 p-2 rounded-md bg-gray-100 dark:bg-gray-700">
            <p class="text-gray-900 font-medium dark:text-gray-300">Ventas netas: $892.31</p>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import data from '../../json/discount_alert.json'

    const discountAlerts = ref(data.list)
</script>