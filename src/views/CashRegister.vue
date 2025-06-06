<template>
    <admin-layout>
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard>
                <cash-register-form v-model="counts" />
                <cash-register-summary :counts="counts" :expected="expectedTotals" />
                <cash-register-notes v-if="showNotes" v-model="notes" />
                <div class="p-5 text-right">
                    <button @click="openConfirmation" :disabled="isSubmitting || !canSubmit"
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                        Submit Close-Out
                    </button>
                </div>
            </ComponentCard>
        </div>
    </admin-layout>
    <cash-register-confirmation
        v-if="showConfirmation"
        :counts="counts"
        :expected="expectedTotals"
        :notes="notes"
        :variance="totalVariance"
        :can-submit="canSubmit"
        @confirm="submitCloseOut"
        @cancel="showConfirmation = false"
    />
</template>

<script setup>
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import CashRegisterForm from '@/components/cash-register/CashRegisterForm.vue';
import CashRegisterSummary from '@/components/cash-register/CashRegisterSummary.vue';
import CashRegisterNotes from '@/components/cash-register/CashRegisterNotes.vue';
import CashRegisterConfirmation from '@/components/cash-register/CashRegisterConfirmation.vue';
import { ref, computed, watch } from 'vue';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const counts = ref({
    cash: 0,
    creditCards: 0,
    vouchers: 0,
    tips: 0,
    adjustments: 0,
});

const notes = ref('');
const showNotes = ref(false);
const showConfirmation = ref(false);
const isSubmitting = ref(false);

const expectedTotals = ref({
    cash: 21539.32,
    creditCards: 46769.65,
    total: 68299.97,
});

const actualTotal = computed(() => {
    const total = Object.values(counts.value).reduce((sum, value) => sum + Number(value || 0), 0);
    return total;
});

const totalVariance = computed(() => {
    const variance = actualTotal.value - (expectedTotals.value?.total || 0);
    return variance;
});

const hasVariance = computed(() => {
    const hasVar = Math.abs(totalVariance.value) > 0.01;
    return hasVar;
});

const canSubmit = computed(() => {
    const canSubmitValue = !hasVariance.value || (hasVariance.value && notes.value.trim().length > 0);
    return canSubmitValue;
});

watch(counts, () => {
    showNotes.value = hasVariance.value;
}, { deep: true });

const openConfirmation = () => {
    showConfirmation.value = true;
};

const submitCloseOut = async () => {
    isSubmitting.value = true;
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        generatePrintableSummary();
        showConfirmation.value = false;
        notes.value = '';
        showNotes.value = false;
        counts.value = { cash: 0, creditCards: 0, vouchers: 0, tips: 0, adjustments: 0 };
    } catch (error) {
        console.error('Error submitting close-out:', error);
    } finally {
        isSubmitting.value = false;
    }
};

const formatCurrency = (value) => {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

const generatePrintableSummary = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).replace(',', '').replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1');

    doc.setFontSize(16);
    doc.text(`Cash Register Close-Out - ${currentDate} PDT`, 10, 10);

    const tableData = [
        ['Category', 'Expected', 'Actual', 'Variance'],
        ['Cash', `$${formatCurrency(expectedTotals.value.cash)}`, `$${formatCurrency(counts.value.cash)}`, `$${formatCurrency(counts.value.cash - expectedTotals.value.cash)}`],
        ['Credit Cards', `$${formatCurrency(expectedTotals.value.creditCards)}`, `$${formatCurrency(counts.value.creditCards)}`, `$${formatCurrency(counts.value.creditCards - expectedTotals.value.creditCards)}`],
        ['Vouchers', '$0.00', `$${formatCurrency(counts.value.vouchers)}`, `$${formatCurrency(counts.value.vouchers)}`],
        ['Tips', '$0.00', `$${formatCurrency(counts.value.tips)}`, `$${formatCurrency(counts.value.tips)}`],
        ['Adjustments', '$0.00', `$${formatCurrency(counts.value.adjustments)}`, `$${formatCurrency(counts.value.adjustments)}`],
        ['Total', `$${formatCurrency(expectedTotals.value.total)}`, `$${formatCurrency(actualTotal.value)}`, `$${formatCurrency(totalVariance.value)}`],
    ];

    autoTable(doc, {
        head: [['Category', 'Expected', 'Actual', 'Variance']],
        body: tableData.slice(1),
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [0, 102, 204] },
        margin: { top: 10 },
    });

    if (notes.value) {
        doc.setFontSize(10);
        doc.text(`Notes: ${notes.value}`, 10, doc.lastAutoTable.finalY + 10);
    }

    doc.save(`cash_register_closeout_${new Date().toISOString().split('T')[0]}.pdf`);
};
</script>