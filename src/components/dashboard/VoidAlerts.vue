<template>
    <div
        class="overflow-hidden rounded-lg border border-gray-100 bg-white px-4 pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-800 dark:text-white/90">Alertas de anulación</h3>
        </div>

        <div class="space-y-3">
            <div v-for="(alert, index) in voidAlerts" :key="index" class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="h-3 w-3 rounded-full" :class="alert.color"></div>
                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ alert.name }}</p>
                </div>
                <p class="text-sm font-medium text-gray-800 dark:text-white">${{ alert.amount }}</p>
            </div>
        </div>

        <div class="mt-4 mb-4 p-2 rounded-md bg-gray-100 dark:bg-gray-700">
            <p class="text-gray-900 font-medium dark:text-gray-300">Ventas netas: $892.31</p>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import data from '../../json/void_alerts.json'

    const voidAlerts = ref(data.list)
</script>