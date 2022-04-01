<template>
  <div class="container">
    <div class="home w-75">
      <header class="header d-flex justify-content-between align-items-center">
        <div class="left">
          <h1>Invoices</h1>
          <span>There are {{ filteredData.length }} total invoices</span>
        </div>

        <div class="right d-flex align-items-center">
          <div
            class="filter d-flex align-items-center"
            @click="toggleFilterList"
          >
            <div>
              <span class="filter__visible">
                <span>
                  Filter by status<span v-if="filteredInvoice"
                    >: {{ filteredInvoice }}</span
                  >
                </span>
                <icon-arrow-down />
              </span>
            </div>

            <ul class="filter__list" v-show="showFilter">
              <li @click="filterInvoices">Draft</li>
              <li @click="filterInvoices">Pending</li>
              <li @click="filterInvoices">Paid</li>
              <li @click="filterInvoices">Clear filter</li>
            </ul>
          </div>

          <button class="btn" @click="newInvoice">
            <span class="btn--icon">
              <icon-plus />
            </span>
            Add invoice
          </button>
        </div>
      </header>

      <!-- Invoices -->
      <div v-if="invoiceData.length > 0">
        <invoice-item
          v-for="(invoice, index) in filteredData"
          :key="index"
          :invoice="invoice"
        />
      </div>
      <div
        v-else
        class="d-flex justify-content-center flex-column align-items-center"
      >
        <illustration-empty />
        <h3 class="my-4">There is nothing here</h3>
        <p>Create a new invoice by clicking the new invoice button</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconArrowDown from '@/components/icons/icon-arrow-down.vue';
import IconPlus from '@/components/icons/icon-plus.vue';
import IllustrationEmpty from '@/components/icons/illustration-empty.vue';
import InvoiceItem from '@/components/invoice/InvoiceItem.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const showFilter = ref(null);
const filteredInvoice = ref(null);

function toggleFilterList() {
  showFilter.value = !showFilter.value;
}
function newInvoice() {
  store.dispatch('toggleInvoiceModal');
}

function filterInvoices(e) {
  if (e.target.textContent === 'Clear filter') {
    filteredInvoice.value = null;
  } else {
    filteredInvoice.value = e.target.textContent;
  }
}

const invoiceData = computed(() => store.getters.getInvoiceData);
const filteredData = computed(() =>
  invoiceData.value.filter((invoice) => {
    if (filteredInvoice.value === 'Draft') {
      return invoice.invoiceDraft === true;
    }
    if (filteredInvoice.value === 'Pending') {
      return invoice.invoicePending === true;
    }
    if (filteredInvoice.value === 'Paid') {
      return invoice.invoicePaid === true;
    }
    return invoice;
  })
);
</script>

<style lang="scss" scoped>
.home {
  color: $white;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 2rem;
  border-radius: 1rem;
  margin: 0 auto;

  .header {
    margin-bottom: 4rem;
    .left {
      h1 {
        font-weight: 600;
        font-size: 3.5rem;
      }
      span {
        font-size: 1.5rem;
      }
    }

    .right {
      column-gap: 4rem;

      .filter {
        position: relative;
        z-index: 99;

        &__visible {
          font-size: 1.5rem;
          display: flex;
          column-gap: 1rem;
          align-items: center;
          cursor: pointer;
        }

        &__list {
          position: absolute;
          background-color: $bg-dark;
          box-shadow: 5px 5px 1rem 0rem rgb(0 0 0 / 40%);
          top: 110%;
          width: 100%;
          padding: 0.5rem 0;
          border-radius: 0 0 1rem 1rem;

          li {
            color: $white;
            padding: 0.5rem 1rem;
            font-size: 1.5rem;
            transition: 0.3s;
            cursor: pointer;
            &:hover {
              margin-left: 0.5rem;
            }
          }
        }
      }

      .btn {
        background-color: $purple;
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 1rem;
        font-weight: 600;

        &--icon {
          background-color: white;
          height: 2.5rem;
          width: 2.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
