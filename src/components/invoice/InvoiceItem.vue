<template>
  <router-link
    class="invoice-link d-flex justify-content-between align-items-center mb-4"
    :to="{ name: 'invoice', params: { id: invoice.invoiceId } }"
  >
    <div class="left">
      <span>#{{ invoice.invoiceId }}</span>
      <span>{{ invoice.paymentDueDate }}</span>
      <span>{{ invoice.clientName }}</span>
    </div>

    <div class="right">
      <span class="price">${{ invoice.invoiceTotal }}</span>
      <button
        class="btn--status"
        :class="{
          'btn--paid': invoice.invoicePaid,
          'btn--pending': invoice.invoicePending,
          'btn--draft': invoice.invoiceDraft,
        }"
      >
        <span v-if="invoice.invoicePaid">Paid</span>
        <span v-if="invoice.invoiceDraft">Draft</span>
        <span v-if="invoice.invoicePending">Pending</span>
      </button>

      <icon-arrow-right />
    </div>
  </router-link>
</template>

<script setup>
import iconArrowRight from '../icons/icon-arrow-right.vue';
import { defineProps } from 'vue';

defineProps({
  invoice: Object,
});
</script>

<style lang="scss" scoped>
.invoice-link {
  color: $white;
  background-color: $black-soft;
  padding: 2rem 4rem;
  border-radius: 1rem;
  column-gap: 3rem;

  &,
  &:visited {
    color: $white;
  }

  .left {
    flex-basis: 60%;
    display: flex;
    column-gap: 3rem;
    align-items: center;
    span {
      flex: 1;
      font-size: 1.4rem;
    }
  }
  .right {
    flex-basis: 40%;
    display: flex;
    column-gap: 20%;
    justify-content: flex-end;
    align-items: center;

    .price {
      font-weight: 600;
    }
  }
}
</style>
