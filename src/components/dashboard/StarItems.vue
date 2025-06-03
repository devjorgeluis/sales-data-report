<template>
    <div
        class="overflow-hidden rounded-lg border border-gray-100 bg-white px-4 pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-800 dark:text-white/90">Artículos estrella</h3>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
            <div class="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <StaredIcon />
            </div>
            <div class="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-white">
                <InfoIcon />
            </div>
            <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-white">
                <BoxCubeIcon />
            </div>
            <div class="h-10 w-10 rounded-full bg-red-200 flex items-center justify-center text-white">
                <ArchiveIcon />
            </div>
        </div>

        <div class="space-y-3">
            <div v-for="(item, index) in starItems" :key="index">
                <div class="flex justify-between items-center mb-1">
                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ item.name }}</p>
                    <p class="text-sm font-medium text-gray-800 dark:text-white">${{ item.price }}</p>
                </div>
                <div class="h-2 w-full rounded-full" :class="item.color">
                    <div class="h-full rounded-full" :style="{ width: item.percentage }"></div>
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
    import { StaredIcon, InfoIcon, BoxCubeIcon, ArchiveIcon } from '@/icons'
    import data from '../../json/star_items.json'

    const starItems = ref(data.list)
</script>