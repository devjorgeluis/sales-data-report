<template>
    <div class="p-3 sm:p-5 max-w-full overflow-x-auto custom-scrollbar">
        <table class="w-full">
            <tbody>
                <template v-if="filteredData && filteredData.length">
                    <template v-for="(item, index) in filteredData" :key="index">
                        <tr class="bg-white dark:bg-gray-700 dark:text-gray-400">
                            <td class="font-bold capitalize" colspan="4">
                                {{ item.name }}:
                            </td>
                        </tr>

                        <template v-if="item.list && item.list.length">
                            <template v-for="(subItem, subIndex) in item.list" :key="`${index}-${subIndex}`">
                                <tr :class="subItem.list && subItem.list.length > 0 ? 'bg-white dark:bg-gray-700 dark:text-gray-400' : 'bg-yellow-100 dark:bg-yellow-200'">
                                    <td class="px-2 capitalize" :class="{ 'font-bold': subItem.list && subItem.list.length > 0 }" :colspan="subItem.list && subItem.list.length === 0 ? '4' : '1'">
                                        {{ subItem.name }} {{ subItem.list && subItem.list.length > 0 ? "-" : "" }}
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
                                        <td class="px-2 text-center font-bold">
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

                        <tr class="font-bold bg-black dark:bg-gray-700 text-yellow-300 dark:text-yellow-500 capitalize">
                            <td class="px-2 py-1 capitalize">
                                total {{ item.name }}
                            </td>
                            <td class="px-2 py-1 text-center">
                                $
                            </td>
                            <td class="px-2 py-1 text-right">
                                {{ item.total ? formatCurrency(item.total.price) : formatCurrency(item.price) }}
                            </td>
                            <td class="px-2 py-1 text-right">
                                {{ item.total ? item.total.percent : item.percent }}%
                            </td>
                        </tr>

                        <tr class="font-bold bg-black dark:bg-gray-700 text-yellow-300 dark:text-yellow-500 capitalize">
                            <td class="px-2 py-1">
                                Costo de Produccion
                            </td>
                            <td class="px-2 py-1 text-center">
                                $
                            </td>
                            <td class="px-2 py-1 text-right">
                                {{ item.production_cost ? formatCurrency(item.production_cost.price) : "-" }}
                            </td>
                            <td class="px-2 py-1 text-right">
                                {{ item.production_cost ? item.production_cost.percent : 0 }}%
                            </td>
                        </tr>
                        <tr class="h-[20px]"></tr>
                    </template>
                    <template v-if="totalData">
                        <tr class="bg-black dark:bg-gray-700 mt-3">
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 capitalize">Ganancia Operativa Bruta</td>
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 text-center">$</td>
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 text-right">
                                {{ formatCurrency(totalData.profit.price) }}
                            </td>
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 text-right">
                                {{ totalData.profit.percent }}%
                            </td>
                        </tr>
                        <tr class="bg-yellow-100 dark:bg-yellow-200">
                            <td class="px-2 capitalize">Impuestos SAT</td>
                            <td class="px-2 capitalize font-bold text-center">$</td>
                            <td class="px-2 text-right font-bold">{{ formatCurrency(totalData.tax.price) }}</td>
                            <td class="px-2 text-right font-bold">{{ totalData.tax.percent }}%</td>
                        </tr>
                        <tr class="bg-yellow-100 dark:bg-yellow-200">
                            <td class="px-2 capitalize">Préstamos Bancarios</td>
                            <td class="px-2 capitalize font-bold text-center">$</td>
                            <td class="px-2 text-right font-bold">{{ formatCurrency(totalData.bank_loans.price) }}</td>
                            <td class="px-2 text-right font-bold">{{ totalData.bank_loans.percent }}%</td>
                        </tr>
                        <tr class="bg-yellow-100 dark:bg-yellow-200">
                            <td class="px-2 capitalize">Intereses</td>
                            <td class="px-2 capitalize font-bold text-center">$</td>
                            <td class="px-2 text-right font-bold">{{ formatCurrency(totalData.interest.price) }}</td>
                            <td class="px-2 text-right font-bold">{{ totalData.interest.percent }}%</td>
                        </tr>
                        <tr class="bg-black dark:bg-gray-700">
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 capitalize">Ganancia Bruta antes de Impuestos</td>
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 text-center">$</td>
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 text-right">
                                {{ formatCurrency(totalData.profit_without_tax.price) }}
                            </td>
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 text-right">
                                {{ totalData.profit_without_tax.percent }}%
                            </td>
                        </tr>
                        <tr class="bg-black dark:bg-gray-700">
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 capitalize">TOTAL GASTOS</td>
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 text-center">$</td>
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 text-right">
                                {{ formatCurrency(totalData.expense.price) }}
                            </td>
                            <td class="px-2 py-1 font-bold text-yellow-300 dark:text-yellow-500 text-right">
                                
                            </td>
                        </tr>
                    </template>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="4" class="px-2 text-center">No data available</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    filteredData: Array,
    totalData: Object
});

const formatCurrency = (value) => {
    return value !== 0 ? Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) : "-";
}
</script>