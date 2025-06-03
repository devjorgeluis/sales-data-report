<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 xl:col-span-6 space-y-6">
        <income-expenses />
      </div>
      <div class="col-span-12 xl:col-span-6 space-y-6">
        <income-summary />
      </div>
      <div class="col-span-12 xl:col-span-3 space-y-6">
        <star-items />
      </div>
      <div class="col-span-12 xl:col-span-3 space-y-6">
        <void-alerts />
      </div>
      <div class="col-span-12 xl:col-span-3 space-y-6">
        <discount-alert />
      </div>
      <div class="col-span-12 xl:col-span-3 space-y-6">
        <star-employees />
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import IncomeExpenses from '../components/dashboard/IncomeExpenses.vue'
import IncomeSummary from '../components/dashboard/IncomeSummary.vue'
import StarItems from '../components/dashboard/StarItems.vue'
import VoidAlerts from '../components/dashboard/VoidAlerts.vue'
import DiscountAlert from '../components/dashboard/DiscountAlert.vue'
import StarEmployees from '../components/dashboard/StarEmployees.vue'

export default {
  components: {
    AdminLayout,
    IncomeExpenses,
    IncomeSummary,
    StarItems,
    VoidAlerts,
    DiscountAlert,
    StarEmployees,
  },
  name: 'Dashboard',
}
</script>