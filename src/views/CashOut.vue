<template>
    <admin-layout>
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard>
                <div class="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto print:max-w-full">
                    <!-- Header -->
                    <div class="text-center mb-6 text-gray-600 dark:text-gray-300">
                        <p>LA BARCAZA METROCENTO</p>
                        <p>LA BARCAZA OYSTER BAR</p>
                        <p>BARCAZA COLOSIO SA DE CV</p>
                        <p>BCO241017EN4</p>
                        <p>BLVD. LUIS DONALDO COLOSIO 450</p>
                        <p>COLONIA METROCENTRO</p>
                        <p>HERMOSILLO, SONORA. CP 83250</p>
                        <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl font-semibold my-3">**LUGAR DE EXPEDICION**</h3>
                        <p>BLVD. LUIS DONALDO COLOSIO 450</p>
                        <p>COLONIA METROCENTRO</p>
                        <p>HERMOSILLO, SONORA. CP 83250</p>
                    </div>

                    <!-- Corte de Caja Section -->
                    <section class="mb-6 pb-6 border-b">
                        <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">**CORTE DE CAJA X**</h3>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                            <p>FECHA Y HORA DE IMPRESION: Sat, May 31, 2025 11:15:10 PM</p>
                            <p>APERTURA DE CAJA: Sat, May 31, 2025 1:00:01 PM</p>
                            <p>TURNO: 1</p>
                            <p>ESTACION: CAJA 1</p>
                        </div>
                    </section>

                    <!-- Cash Summary -->
                    <section class="mb-6 pb-6 border-b">
                        <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">CAJA</h3>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                            <div class="flex flex-col gap-2">
                                <p>+ FONDO INICIAL: $600.00</p>
                                <p>+ VENTA EFECTIVO: $24,238.00</p>
                                <p>+ DEPOSITOS: $1,019.72</p>
                            </div>
                            <div class="flex flex-col gap-2">
                                <p>- RETIROS: $0.00</p>
                                <p>- COMPRAS / GASTOS EFECTIVO: $0.00</p>
                                <p>- PROPINAS PAGADAS: $1,058.40</p>
                                <p>- RETENCIONES PAGADAS: $3.20</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300 mt-4">
                            <p>= EFECTIVO FINAL TEORICO: $21,539.32</p>
                            <p>= EFECTIVO REAL: $21,538.80</p>
                            <p>= FALTANTE / SOBRANTE: -$0.52</p>
                        </div>
                    </section>

                    <!-- Payment Breakdown -->
                    <section class="mb-6 pb-6 border-b">
                        <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">
                            VENTAS TOTALES CON IVA</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                            <div class="flex flex-col gap-2">
                                <p>EFECTIVO: $24,238.00</p>
                                <p>TARJETA CON PROPINAS: $36,531.00</p>
                                <p class="font-semibold text-gray-800 dark:text-white">TOTAL METODO DE PAGO NETO: $60,769.00</p>
                            </div>
                            <div class="flex flex-col gap-2">
                                <p>PROPINAS TARJETA: $4,168.65</p>
                                <p class="font-semibold text-gray-800 dark:text-white">TOTAL EN TARJETAS: $40,699.65</p>
                            </div>
                        </div>
                        <!-- Sales Breakdown -->
                        <section class="mt-3">
                            <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">
                                DESGLOSE DE VENTA</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                                <p>SUBTOTAL: $52,387.07</p>
                                <p>IVA: $8,381.93</p>
                                <p class="font-semibold text-gray-800 dark:text-white">TOTAL NETO: $60,769.00</p>
                            </div>
                        </section>
                    </section>

                    <!-- Transactions -->
                    <section class="mb-6 pb-6 border-b">
                        <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">
                            TRANSACCIONES</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                            <div class="flex flex-col gap-2">
                                <p>MESAS ATENDIDAS: 29</p>
                                <p>INVITADOS ATENDIDOS: 107</p>
                            </div>
                            <div>
                                <p>TICKET PROMEDIO / MESA: $2,095.48</p>
                                <p>TICKET PROMEDIO / PAX: $567.93</p>
                                <p>TICKET PROMEDIO / TIPS: $143.75</p>
                            </div>
                        </div>
                    </section>

                    <!-- Cancellations and Discounts -->
                    <section class="mb-6 pb-6 border-b">
                        <h3 class="text-gray-800 dark:text-white text-lg lg:text-xl text-center font-semibold my-3">
                            CANCELACIONES Y DESCUENTOS</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 dark:text-gray-300">
                            <div class="flex flex-col gap-2">
                                <p>PRODUCTOS CANCELADOS: 0</p>
                                <p>MONTO DE VENTA: $0.00</p>
                                <p>MONTO DE COSTO: $0.00</p>
                            </div>
                            <div class="flex flex-col gap-2">
                                <p>PRODUCTOS ANULADOS: 0</p>
                                <p>SUPUESTA VENTA: $0.00</p>
                                <p>SUPUESTO COSTO: $0.00</p>
                            </div>
                            <div class="flex flex-col gap-2">
                                <p>NUMERO DE DESCUENTOS: 0</p>
                                <p>MONTO DE DESCUENTO: $0.00</p>
                                <p>CUENTAS ABIERTAS: 0</p>
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
</script>