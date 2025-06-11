<template>
    <admin-layout>
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard>
                <div class="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto print:max-w-full">
                    <!-- Datepicker Section -->
                    <section class="mb-6 pb-6 border-b">
                        <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">**CORTE DE CAJA X**</h3>
                        <div class="flex justify-center mb-5">
                            <input ref="datePicker" type="text" class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200" placeholder="Select date" />
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                            <p>FECHA Y HORA DE IMPRESION: {{ currentDateTime }}</p>
                            <p>APERTURA DE CAJA: {{ openingTime }}</p>
                            <p>TURNO: {{ shift }}</p>
                            <p>ESTACION: {{ station }}</p>
                        </div>
                    </section>

                    <!-- Cash Summary -->
                    <section class="mb-6 pb-6 border-b">
                        <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">CAJA</h3>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                            <div class="flex flex-col gap-2">
                                <p>+ FONDO INICIAL: ${{ formatCurrency(initialFund) }}</p>
                                <p>+ VENTA EFECTIVO: ${{ formatCurrency(totalCashSales) }}</p>
                                <p>+ DEPOSITOS: ${{ formatCurrency(deposits) }}</p>
                            </div>
                            <div class="flex flex-col gap-2">
                                <p>- RETIROS: ${{ formatCurrency(withdrawals) }}</p>
                                <p>- COMPRAS / GASTOS EFECTIVO: ${{ formatCurrency(cashExpenses) }}</p>
                                <p>- PROPINAS PAGADAS: ${{ formatCurrency(tipsPaid) }}</p>
                                <p>- RETENCIONES PAGADAS: ${{ formatCurrency(retentionsPaid) }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300 mt-4">
                            <p>= EFECTIVO FINAL TEORICO: ${{ formatCurrency(theoreticalCashEnd) }}</p>
                            <p>= EFECTIVO REAL: ${{ formatCurrency(realCashEnd) }}</p>
                            <p>= FALTANTE / SOBRANTE: ${{ formatCurrency(shortageSurplus) }}</p>
                        </div>
                    </section>

                    <!-- Payment Breakdown -->
                    <section class="mb-6 pb-6 border-b">
                        <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">
                            VENTAS TOTALES CON IVA</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                            <div class="flex flex-col gap-2">
                                <p>EFECTIVO: ${{ formatCurrency(totalCashSales) }}</p>
                                <p>TARJETA CON PROPINAS: ${{ formatCurrency(cardSalesWithTips) }}</p>
                                <p class="font-semibold text-gray-800 dark:text-white">TOTAL METODO DE PAGO NETO: ${{ formatCurrency(totalNetPayment) }}</p>
                            </div>
                            <div class="flex flex-col gap-2">
                                <p>PROPINAS TARJETA: ${{ formatCurrency(cardTips) }}</p>
                                <p class="font-semibold text-gray-800 dark:text-white">TOTAL EN TARJETAS: ${{ formatCurrency(totalCard) }}</p>
                            </div>
                        </div>
                        <!-- Sales Breakdown -->
                        <section class="mt-3">
                            <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">
                                DESGLOSE DE VENTA</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                                <p>SUBTOTAL: ${{ formatCurrency(subtotal) }}</p>
                                <p>IVA: ${{ formatCurrency(iva) }}</p>
                                <p class="font-semibold text-gray-800 dark:text-white">TOTAL NETO: ${{ formatCurrency(totalNet) }}</p>
                            </div>
                        </section>
                    </section>

                    <!-- Transactions -->
                    <section class="mb-6 pb-6 border-b">
                        <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">
                            TRANSACCIONES</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                            <div class="flex flex-col gap-2">
                                <p>MESAS ATENDIDAS: {{ tablesServed }}</p>
                                <p>INVITADOS ATENDIDOS: {{ guestsServed }}</p>
                            </div>
                            <div>
                                <p>TICKET PROMEDIO / MESA: ${{ formatCurrency(avgTicketPerTable) }}</p>
                                <p>TICKET PROMEDIO / PAX: ${{ formatCurrency(avgTicketPerGuest) }}</p>
                                <p>TICKET PROMEDIO / TIPS: ${{ formatCurrency(avgTicketPerTip) }}</p>
                            </div>
                        </div>
                    </section>

                    <!-- Cancellations and Discounts -->
                    <section class="mb-6">
                        <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">
                            CANCELACIONES Y DESCUENTOS</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 dark:text-gray-300">
                            <div class="flex flex-col gap-2">
                                <p>PRODUCTOS CANCELADOS: {{ cancellations }}</p>
                                <p>MONTO DE VENTA: ${{ formatCurrency(cancellationSales) }}</p>
                                <p>MONTO DE COSTO: ${{ formatCurrency(cancellationCost) }}</p>
                            </div>
                            <div class="flex flex-col gap-2">
                                <p>PRODUCTOS ANULADOS: {{ voids }}</p>
                                <p>SUPUESTA VENTA: ${{ formatCurrency(voidSales) }}</p>
                                <p>SUPUESTO COSTO: ${{ formatCurrency(voidCost) }}</p>
                            </div>
                            <div class="flex flex-col gap-2">
                                <p>NUMERO DE DESCUENTOS: {{ discountsCount }}</p>
                                <p>MONTO DE DESCUENTO: ${{ formatCurrency(discountAmount) }}</p>
                                <p>CUENTAS ABIERTAS: {{ openAccounts }}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </ComponentCard>
        </div>
    </admin-layout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ComponentCard from '@/components/common/ComponentCard.vue';
import { ref, computed, onMounted } from 'vue';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import cashoutData from '@/json/cashout_data.json';

const datePicker = ref(null);
const selectedDate = ref(null);
const openingTime = ref('Sat, May 31, 2025 1:00:01 PM');
const shift = ref('1');
const station = ref('CAJA 1');
const currentDateTime = ref(new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
}).replace(',', ''));

onMounted(() => {
    flatpickr(datePicker.value, {
        dateFormat: "m/d/Y",
        maxDate: new Date(),
        onChange: (selectedDates) => {
            if (selectedDates.length > 0) {
                selectedDate.value = selectedDates[0].toDateString();
            } else {
                selectedDate.value = null;
            }
        },
    });
});

const filteredData = computed(() => {
    if (!selectedDate.value) return null;
    const reportDate = new Date(selectedDate.value);
    return cashoutData.list.find(item => 
        item.list.some(entry => new Date(entry.date).toDateString() === reportDate.toDateString())
    ) || null;
});

const initialFund = computed(() => filteredData.value?.summary?.initialFund || 0);
const deposits = computed(() => filteredData.value?.summary?.deposits || 0);
const withdrawals = computed(() => filteredData.value?.summary?.withdrawals || 0);
const cashExpenses = computed(() => filteredData.value?.summary?.cashExpenses || 0);
const realCashEnd = computed(() => filteredData.value?.summary?.realCashEnd || 0);
const cardSalesWithTips = computed(() => filteredData.value?.summary?.cardSalesWithTips || 0);
const cardTips = computed(() => filteredData.value?.summary?.cardTips || 0);
const subtotal = computed(() => filteredData.value?.summary?.subtotal || 0);
const iva = computed(() => filteredData.value?.summary?.iva || 0);
const tablesServed = computed(() => filteredData.value?.summary?.tablesServed || 0);
const guestsServed = computed(() => filteredData.value?.summary?.guestsServed || 0);
const cancellations = computed(() => filteredData.value?.summary?.cancellations || 0);
const cancellationSales = computed(() => filteredData.value?.summary?.cancellationSales || 0);
const cancellationCost = computed(() => filteredData.value?.summary?.cancellationCost || 0);
const voids = computed(() => filteredData.value?.summary?.voids || 0);
const voidSales = computed(() => filteredData.value?.summary?.voidSales || 0);
const voidCost = computed(() => filteredData.value?.summary?.voidCost || 0);
const discountsCount = computed(() => filteredData.value?.summary?.discountsCount || 0);
const discountAmount = computed(() => filteredData.value?.summary?.discountAmount || 0);
const openAccounts = computed(() => filteredData.value?.summary?.openAccounts || 0);

const filteredCashFlows = computed(() => filteredData.value?.list || []);

const totalCashSales = computed(() => filteredCashFlows.value.filter(entry => entry.description === 'Venta Efectivo').reduce((sum, entry) => sum + (entry.income || 0), 0));
const tipsPaid = computed(() => filteredCashFlows.value.filter(entry => entry.description === 'Propinas Pagadas').reduce((sum, entry) => sum + (entry.expense || 0), 0));
const retentionsPaid = computed(() => filteredCashFlows.value.filter(entry => entry.description === 'Retenciones Pagadas').reduce((sum, entry) => sum + (entry.expense || 0), 0));

const theoreticalCashEnd = computed(() => initialFund.value + totalCashSales.value + deposits.value - withdrawals.value - cashExpenses.value - tipsPaid.value - retentionsPaid.value);
const shortageSurplus = computed(() => realCashEnd.value - theoreticalCashEnd.value);

const totalCard = computed(() => cardSalesWithTips.value + cardTips.value);
const totalNetPayment = computed(() => totalCashSales.value + totalCard.value);
const totalNet = computed(() => subtotal.value + iva.value);

const avgTicketPerTable = computed(() => (tablesServed.value > 0 ? totalNetPayment.value / tablesServed.value : 0));
const avgTicketPerGuest = computed(() => (guestsServed.value > 0 ? totalNetPayment.value / guestsServed.value : 0));
const avgTicketPerTip = computed(() => (guestsServed.value > 0 ? (tipsPaid.value + cardTips.value) / guestsServed.value : 0));

const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};
</script>