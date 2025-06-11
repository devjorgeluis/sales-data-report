<template>
    <div class="max-w-full overflow-x-auto custom-scrollbar p-5">
        <table class="w-full">
            <tbody>
                <template v-if="filteredData && filteredData.length">
                    <template v-for="(item, index) in filteredData" :key="index">
                        <tr class="bg-white dark:bg-gray-700 dark:text-gray-400">
                            <td class="px-2 font-bold capitalize" colspan="4">
                                {{ item.name }}:
                            </td>
                        </tr>
                        
                        <template v-if="item.list && item.list.length">
                            <template v-for="(subItem, subIndex) in item.list" :key="`${index}-${subIndex}`">
                                <tr :class="subItem.list && subItem.list.length > 0 ? 'bg-white dark:bg-gray-700 dark:text-gray-400' : 'bg-yellow-100 dark:bg-yellow-200'">
                                    <td class="px-2 capitalize" :class="{ 'font-bold': subItem.list && subItem.list.length > 0 }" :clospan="subItem.list && subItem.list.length === 0 ? '4' : '1'">
                                        {{ subItem.name }}
                                    </td>
                                    <td class="px-2 font-bold text-center">
                                        $
                                    </td>
                                    <td class="px-2 font-bold text-right">
                                        {{ subItem.total ? formatCurrency(subItem.total.price) : formatCurrency(subItem.price) }}
                                    </td>
                                    <td class="px-2 font-bold text-right">
                                        {{ subItem.total ? subItem.total.percent : subItem.percent }}%
                                    </td>
                                </tr>
            
                                <template v-if="subItem.list && subItem.list.length">
                                    <tr class="bg-yellow-100 dark:bg-yellow-200" v-for="(grandSubItem, grandIndex) in subItem.list" :key="`${index}-${subIndex}-${grandIndex}`">
                                        <td class="px-2 pl-12 capitalize">
                                            {{ grandSubItem.name }}
                                        </td>
                                        <td class="px-2 capitalize text-center">
                                            $
                                        </td>
                                        <td class="px-2 text-right font-bold">
                                            {{ formatCurrency(grandSubItem.price) }}
                                        </td>
                                        <td class="px-2 text-right font-bold">
                                            {{ grandSubItem.percent }}%
                                        </td>
                                    </tr>
                                </template>
            
                                <tr v-if="subItem.total" class="bg-gray-500">
                                    <td class="px-2 font-regular text-center text-yellow-300">
                                        Total {{ subItem.name }}
                                    </td>
                                    <td class="px-2 font-bold text-yellow-300 text-center">
                                        $
                                    </td>
                                    <td class="px-2 text-right font-bold text-yellow-300">
                                        {{ formatCurrency(subItem.total.price) }}
                                    </td>
                                    <td class="px-2 text-right font-bold text-yellow-300">
                                        {{ subItem.total.percent }}%
                                    </td>
                                </tr>
                            </template>
                        </template>

                        <tr>
                            <td class="px-2 py-1 font-bold bg-black dark:bg-gray-700 text-yellow-300 dark:text-yellow-500 capitalize">
                                total {{ item.name }}
                            </td>
                            <td class="px-2 py-1 font-bold bg-black dark:bg-gray-700 text-yellow-300 dark:text-yellow-500 text-center">
                                $
                            </td>
                            <td class="px-2 py-1 font-bold bg-black dark:bg-gray-700 text-yellow-300 dark:text-yellow-500 text-right">
                                {{ item.total ? formatCurrency(item.total.price) : formatCurrency(item.price) }}
                            </td>
                            <td class="px-2 py-1 font-bold bg-black dark:bg-gray-700 text-yellow-300 dark:text-yellow-500 text-right">
                                {{ item.total ? item.total.percent : item.percent }}%
                            </td>
                        </tr>
                    </template>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="3" class="px-2 text-center">No data available</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script setup>

const props = defineProps({
    filteredData: Array
});

const formatCurrency = (value) => {
    return value !== 0 ? Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) : "-";
}

</script>