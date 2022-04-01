<template>
  <div class="container">
    <div class="invoice-view w-75">
      <router-link :to="{ name: 'home' }" replace class="nav-link">
        <icon-arrow-left />
        <span>GO back</span>
      </router-link>

      <!-- Header -->
      <div
        class="invoice-view__heading d-flex justify-content-between align-items-center"
      >
        <div class="left d-flex align-items-center gap-4">
          <span class="status">Status</span>
          <button
            class="btn--status"
            :class="{
              'btn--paid': currInvoice.invoicePaid,
              'btn--pending': currInvoice.invoicePending,
              'btn--draft': currInvoice.invoiceDraft,
            }"
          >
            <span v-if="currInvoice.invoicePaid">Paid</span>
            <span v-if="currInvoice.invoiceDraft">Draft</span>
            <span v-if="currInvoice.invoicePending">Pending</span>
          </button>
        </div>

        <div class="right d-flex align-items-center gap-4">
          <button class="darkPurple" @click="toggleEditInvoice">Edit</button>
          <button class="red" @click="deleteInvoice(currInvoice.docId)">
            delete
          </button>
          <button
            v-if="currInvoice.invoicePending"
            @click="updateToPaid(currInvoice.docId)"
            class="green"
          >
            Mark as paid
          </button>
          <button
            v-if="currInvoice.invoiceDraft || currInvoice.invoicePaid"
            @click="updateToPending(currInvoice.docId)"
            class="orange"
          >
            Mark as pending
          </button>
        </div>
      </div>

      <!-- Details -->
      <div class="invoice-view__details mb-5">
        <div
          class="invoice-view__details--heading d-flex justify-content-between"
        >
          <div class="left">
            <p class="id"><span>#</span>{{ currInvoice.invoiceId }}</p>
            <p class="description">{{ currInvoice.productDescription }}</p>
          </div>
          <div class="right">
            <p>{{ currInvoice.billerStreetAddress }}</p>
            <p>{{ currInvoice.billerCity }}</p>
            <p>{{ currInvoice.billerZipCode }}</p>
            <p>{{ currInvoice.billerCountry }}</p>
          </div>
        </div>

        <div class="invoice-view__details--info d-flex">
          <div class="date d-flex flex-column justify-content-between">
            <div>
              <h4 class="mb-4">Invoice Date</h4>
              <p>{{ currInvoice.invoiceDate }}</p>
            </div>
            <div>
              <h4 class="mb-4">Payment Date</h4>
              <p>{{ currInvoice.paymentDueDate }}</p>
            </div>
          </div>
          <div class="bill-to">
            <h4 class="mb-4">Bill To</h4>
            <p class="mb-3">{{ currInvoice.clientName }}</p>
            <p class="mb-1">{{ currInvoice.clientStreetAddress }}</p>
            <p class="mb-1">{{ currInvoice.clientCity }}</p>
            <p class="mb-1">{{ currInvoice.clientZipCode }}</p>
            <p>{{ currInvoice.clientCountry }}</p>
          </div>
          <div class="send-to">
            <h4 class="mb-4">Sent To</h4>
            <p>{{ currInvoice.clientEmail }}</p>
          </div>
        </div>

        <div class="invoice-view__details--billing">
          <div class="billing-items">
            <div class="heading d-flex mb-4">
              <h4>Item Name</h4>
              <h4>QTY</h4>
              <h4>Price</h4>
              <h4>Total</h4>
            </div>
            <div
              v-for="(item, index) in currInvoice.invoiceItemList"
              :key="index"
              class="info d-flex"
            >
              <p>{{ item.itemName }}</p>
              <p>{{ item.qty }}</p>
              <p>{{ item.price }}</p>
              <p>${{ item.total }}</p>
            </div>
          </div>
          <div class="total d-flex justify-content-between align-items-center">
            <h4>Amount Due</h4>
            <p>${{ currInvoice.invoiceTotal }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import iconArrowLeft from '@/components/icons/icon-arrow-left.vue';
import { computed, defineProps, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const props = defineProps({
  id: String,
});

store.dispatch('setCurrentInvoice', props.id);
const currInvoiceArray = computed(() => store.getters.getCurrentInvoice);
const currInvoice = ref(currInvoiceArray.value[0]);

const toggleEditInvoice = () => {
  store.dispatch('toggleInvoiceEdit');
  store.dispatch('toggleInvoiceModal');
};

const editInvoice = computed(() => store.getters.getEditInvoice);
watch(editInvoice, () => (currInvoice.value = currInvoiceArray.value[0]));

async function deleteInvoice(docId) {
  await store.dispatch('deleteInvoice', docId);
  router.replace({ name: 'home' });
}

function updateToPaid(payload) {
  store.dispatch('updateStatusToPaid', payload);
}
function updateToPending(payload) {
  store.dispatch('updateStatusToPending', payload);
}
</script>

<style lang="scss" scoped>
.invoice-view {
  margin: 0 auto;
  background-color: $black-soft;
  padding: 2rem 4rem;
  border-radius: 1rem;

  .nav-link {
    color: $white;
    display: flex;
    align-items: center;
    margin-bottom: 3rem;

    span {
      display: inline-block;
      margin-left: 1rem;
    }
  }

  &__heading {
    margin-bottom: 4rem;

    .left {
      span.status {
        color: $white;
      }
    }
  }

  &__details {
    color: $light-grey;

    &--heading {
      margin-bottom: 4rem;
      .left {
        .id {
          font-size: 3rem;
          color: $white-mute;
          span {
            color: $purple;
            margin-right: 0.5rem;
          }
        }

        .description {
          font-size: 2.5rem;
        }
      }
      .right {
        text-align: right;
      }
    }

    &--info {
      margin-bottom: 4rem;
      .date,
      .bill-to,
      .send-to {
        flex-basis: 25%;
      }

      .date p {
        color: $white;
      }
    }

    &--billing {
      .billing-items {
        background-color: #2b2945;
        padding: 2rem 4rem;
        border-radius: 1rem;
      }

      .heading h4,
      .info p {
        color: $white-mute;
        flex: 1;
        text-align: right;
        &:first-of-type {
          flex: 3;
          text-align: left;
        }
      }

      .info {
        &:not(:last-child) {
          margin-bottom: 1.5em;
        }
        p {
          padding-right: 0.5rem;
        }
      }

      .total {
        background-color: $bg-dark;
        padding: 2rem 4rem;
        border-radius: 1rem;
        color: $white-soft;

        p {
          color: $white;
          font-size: 2.5rem;
        }
      }
    }
  }
}
</style>
