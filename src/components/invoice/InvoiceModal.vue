<template>
  <div class="invoice-modal">
    <form @submit.prevent="submitForm" class="form">
      <loading-animation v-show="loading" />
      <h2 v-if="editInvoice" class="mb-5">Edit invoice</h2>
      <h2 v-else class="mb-5">New invoice</h2>

      <!-- Bill from -->
      <div class="mb-5">
        <h3>Bill from</h3>
        <div class="form__group">
          <label for="billerAddress">Street address</label>
          <!-- eslint-disable-next-line prettier/prettier -->
          <input type="text" name="billerAddress" id="billerAddress" required v-model="billerStreetAddress" />
        </div>
        <div class="row">
          <div class="form__group col-4">
            <label for="billerCity">City</label>
            <!-- eslint-disable-next-line prettier/prettier -->
            <input type="text" name="billerCity" id="billerCity" required v-model="billerCity" />
          </div>
          <div class="form__group col-4">
            <label for="billerZipCode">Zip code</label>
            <!-- eslint-disable-next-line prettier/prettier -->
            <input type="text" name="billerZipCode" id="billerZipCode" required v-model="billerZipCode" />
          </div>
          <div class="form__group col-4">
            <label for="billerCountry">Country</label>
            <!-- eslint-disable-next-line prettier/prettier -->
            <input type="text" name="billerCountry" id="billerCountry" required v-model="billerCountry" />
          </div>
        </div>
      </div>

      <!-- Bill to -->
      <div class="mb-5">
        <h3>Bill to</h3>
        <div class="form__group">
          <label for="clientName">Client's name</label>
          <!-- eslint-disable-next-line prettier/prettier -->
          <input type="text" name="clientName" id="clientName" required v-model="clientName" />
        </div>
        <div class="form__group">
          <label for="clientEmail">Client's email</label>
          <!-- eslint-disable-next-line prettier/prettier -->
          <input type="email" name="clientEmail" id="clientEmail" required v-model="clientEmail" />
        </div>
        <div class="form__group">
          <label for="clientAddress">Street address</label>
          <!-- eslint-disable-next-line prettier/prettier -->
          <input type="text" name="clientAddress" id="clientAddress" required v-model="clientStreetAddress" />
        </div>

        <div class="row">
          <div class="form__group col-4">
            <label for="clientCity">City</label>
            <!-- eslint-disable-next-line prettier/prettier -->
            <input type="text" name="clientCity" id="clientCity" required v-model="clientCity" />
          </div>
          <div class="form__group col-4">
            <label for="clientZipCode">Zip code</label>
            <!-- eslint-disable-next-line prettier/prettier -->
            <input type="text" name="clientZipCode" id="clientZipCode" required v-model="clientZipCode" />
          </div>
          <div class="form__group col-4">
            <label for="clientCountry">Country</label>
            <!-- eslint-disable-next-line prettier/prettier -->
            <input type="text" name="clientCountry" id="clientCountry" required v-model="clientCountry" />
          </div>
        </div>
      </div>

      <!-- Invoice work details -->
      <div class="mb-5">
        <div class="row">
          <div class="form__group col-6">
            <label for="invoiceDate">Invoice date</label>
            <!-- eslint-disable-next-line prettier/prettier -->
            <input type="text" name="invoiceDate" id="invoiceDate" v-model="invoiceDate" required />
          </div>
          <div class="form__group col-6">
            <label for="paymentDate">Payment due</label>
            <!-- eslint-disable-next-line prettier/prettier -->
            <input type="text" name="paymentDate" id="paymentDate" v-model="paymentDueDate" required disabled />
          </div>
        </div>

        <div class="form__group">
          <label for="paymentTerms">Payment terms</label>
          <!-- eslint-disable-next-line prettier/prettier -->
          <select name="paymentTerms" id="paymentTerms" v-model="paymentTerms" required>
            <option value="30">Net 30 days</option>
            <option value="60">Net 60 days</option>
          </select>
        </div>
        <div class="form__group">
          <label for="pDescription">Product description</label>
          <!-- eslint-disable-next-line prettier/prettier -->
          <input type="text" name="pDescription" id="pDescription" required v-model="productDescription" />
        </div>

        <div class="work-items">
          <h4>Item list</h4>

          <table class="table mb-4 w-100">
            <thead class="table__heading">
              <tr class="d-flex justify-content-between mb-3">
                <th class="item-name">Item name</th>
                <th class="qty">Qty</th>
                <th class="price">Price</th>
                <th class="total">Total</th>
              </tr>
            </thead>

            <tbody>
              <tr
                class="table__items d-flex align-items-start justify-content-center"
                v-for="(item, index) in invoiceItemList"
                :key="index"
              >
                <div class="d-flex justify-content-between mb-4">
                  <td class="item-name form__group mb-0">
                    <input v-model="item.itemName" type="text" />
                  </td>
                  <td class="qty form__group mb-0">
                    <input v-model="item.qty" type="text" />
                  </td>
                  <td class="price form__group mb-0">
                    <input v-model="item.price" type="text" />
                  </td>
                  <td class="total form__group mb-0">
                    ${{ (item.total = item.qty * item.price) }}
                  </td>
                </div>
                <td class="delete-icon">
                  <icon-delete @click="deleteInvoiceItem(item.id)" />
                </td>
              </tr>
            </tbody>
          </table>

          <button class="btn" type="button" @click="addNewInvoice">
            <span class="btn--icon">
              <icon-plus />
            </span>
            Add new item
          </button>
        </div>
      </div>

      <div class="save d-flex justify-content-between align-items-center">
        <div>
          <button class="red" type="button" @click="closeInvoice">
            Cancel
          </button>
        </div>
        <div>
          <button
            v-if="!editInvoice"
            class="darkPurple me-4"
            @click="saveDraft"
          >
            Save draft
          </button>
          <button v-if="!editInvoice" class="purple" @click="publishInvoice">
            Create invoice
          </button>
          <button v-if="editInvoice" class="purple">Update invoice</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import db from '@/firebase/firebaseInit';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { uid } from 'uid';
import { reactive, ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import IconPlus from '@/components/icons/icon-plus.vue';
import IconDelete from '../icons/icon-delete.vue';
import LoadingAnimation from './LoadingAnimation.vue';

const dateOptions = reactive({
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
const docId = ref(null);
const loading = ref(null);
const billerStreetAddress = ref(null);
const billerCity = ref(null);
const billerZipCode = ref(null);
const billerCountry = ref(null);
const clientName = ref(null);
const clientEmail = ref(null);
const clientStreetAddress = ref(null);
const clientCity = ref(null);
const clientZipCode = ref(null);
const clientCountry = ref(null);
const invoiceDateUnix = ref(null);
const invoiceDate = ref(null);
const paymentTerms = ref(30);
const paymentDueDateUnix = ref(null);
const paymentDueDate = ref(null);
const productDescription = ref(null);
const invoicePending = ref(null);
const invoiceDraft = ref(null);
const invoiceItemList = ref([]);
const invoiceTotal = ref(0);

const store = useStore();
const route = useRoute();

const closeInvoice = () => store.dispatch('closeInvoiceModal');
const editInvoice = computed(() => store.getters.getEditInvoice);

// Set invoice date
if (!editInvoice.value) {
  invoiceDateUnix.value = Date.now();
  // eslint-disable-next-line prettier/prettier
  invoiceDate.value = new Date(invoiceDateUnix.value).toLocaleDateString('en-eg', dateOptions);
} else {
  // Set invoice form data if edit btn clicked
  const currInvoiceArray = computed(() => store.getters.getCurrentInvoice);
  const currInvoice = currInvoiceArray.value[0];
  docId.value = currInvoice.docId;
  billerStreetAddress.value = currInvoice.billerStreetAddress;
  billerCity.value = currInvoice.billerCity;
  billerZipCode.value = currInvoice.billerZipCode;
  billerCountry.value = currInvoice.billerCountry;
  clientName.value = currInvoice.clientName;
  clientEmail.value = currInvoice.clientEmail;
  clientStreetAddress.value = currInvoice.clientStreetAddress;
  clientCity.value = currInvoice.clientCity;
  clientZipCode.value = currInvoice.clientZipCode;
  clientCountry.value = currInvoice.clientCountry;
  invoiceDateUnix.value = currInvoice.invoiceDateUnix;
  invoiceDate.value = currInvoice.invoiceDate;
  paymentTerms.value = currInvoice.paymentTerms;
  paymentDueDateUnix.value = currInvoice.paymentDueDateUnix;
  paymentDueDate.value = currInvoice.paymentDueDate;
  productDescription.value = currInvoice.productDescription;
  invoicePending.value = currInvoice.invoicePending;
  invoiceDraft.value = currInvoice.invoiceDraft;
  invoiceItemList.value = currInvoice.invoiceItemList;
  invoiceTotal.value = currInvoice.invoiceTotal;
}

// Set payment due
const setPaymentDueDate = () => {
  const futureDate = new Date();
  paymentDueDateUnix.value = futureDate.setDate(
    futureDate.getDate() + parseInt(paymentTerms.value)
  );
  paymentDueDate.value = new Date(paymentDueDateUnix.value).toLocaleDateString(
    'en-eg',
    dateOptions
  );
};
setPaymentDueDate();
watch(paymentTerms, setPaymentDueDate);

const addNewInvoice = () => {
  invoiceItemList.value.push({
    id: uid(),
    itemName: '',
    qty: '',
    price: 0,
    total: 0,
  });
};

const deleteInvoiceItem = (itemId) => {
  const selectedItem = invoiceItemList.value.find((item) => item.id === itemId);
  invoiceItemList.value.splice(selectedItem, 1);
};

const calcInvoiceTotal = () => {
  invoiceTotal.value = 0;
  invoiceItemList.value.forEach((item) => (invoiceTotal.value += item.total));
};

const publishInvoice = () => (invoicePending.value = true);
const saveDraft = () => (invoiceDraft.value = true);

async function uploadInvoice() {
  if (invoiceItemList.value.length <= 0) {
    alert('Please fill out work items');
  } else {
    loading.value = true;
    calcInvoiceTotal();

    const dataBase = doc(collection(db, 'invoices'));
    await setDoc(dataBase, {
      invoiceId: uid(6),
      billerStreetAddress: billerStreetAddress.value,
      billerCity: billerCity.value,
      billerZipCode: billerZipCode.value,
      billerCountry: billerCountry.value,
      clientName: clientName.value,
      clientEmail: clientEmail.value,
      clientStreetAddress: clientStreetAddress.value,
      clientCity: clientCity.value,
      clientZipCode: clientZipCode.value,
      clientCountry: clientCountry.value,
      invoiceDate: invoiceDate.value,
      invoiceDateUnix: invoiceDateUnix.value,
      paymentTerms: paymentTerms.value,
      paymentDueDate: paymentDueDate.value,
      paymentDueDateUnix: paymentDueDateUnix.value,
      productDescription: productDescription.value,
      invoiceItemList: invoiceItemList.value,
      invoiceTotal: invoiceTotal.value,
      invoicePending: invoicePending.value,
      invoiceDraft: invoiceDraft.value,
      invoicePaid: null,
    });

    loading.value = false;
    store.dispatch('getInvoices');
    closeInvoice();
  }
}

async function updateInvoice() {
  if (invoiceItemList.value.length <= 0) {
    alert('Please fill out work items');
  } else {
    loading.value = true;
    calcInvoiceTotal();

    const dataBase = doc(collection(db, 'invoices'), docId.value);
    await updateDoc(dataBase, {
      billerStreetAddress: billerStreetAddress.value,
      billerCity: billerCity.value,
      billerZipCode: billerZipCode.value,
      billerCountry: billerCountry.value,
      clientName: clientName.value,
      clientEmail: clientEmail.value,
      clientStreetAddress: clientStreetAddress.value,
      clientCity: clientCity.value,
      clientZipCode: clientZipCode.value,
      clientCountry: clientCountry.value,
      paymentTerms: paymentTerms.value,
      paymentDueDate: paymentDueDate.value,
      paymentDueDateUnix: paymentDueDateUnix.value,
      productDescription: productDescription.value,
      invoiceItemList: invoiceItemList.value,
      invoiceTotal: invoiceTotal.value,
    });

    loading.value = false;

    const data = reactive({
      docId: docId.value,
      routeId: route.params.id,
    });
    store.dispatch('updateInvoice', data);
  }
}

const submitForm = () => {
  if (editInvoice.value) {
    updateInvoice();
  } else {
    uploadInvoice();
  }
};
</script>

<style lang="scss" scoped>
.invoice-modal {
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: scroll;
  width: 100%;
  max-width: 70rem;
  height: 100%;
  background-color: $bg-dark;
  color: $white;
  z-index: 2;
  box-shadow: 1rem 0.4rem 0.6rem -1px rgba(0, 0, 0, 0.2),
    0 2px 0.4rem -1px rgba(0, 0, 0, 0.06);

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    left: 7rem;
  }

  .form {
    padding: 3rem 5rem;

    h2 {
      font-size: 3.5rem;
      font-weight: 600;
    }
    h3 {
      color: $purple;
      font-size: 2.3rem;
      margin-bottom: 2rem;
    }
    h4 {
      color: $light-grey;
      font-size: 2.3rem;
      margin-bottom: 1.5rem;
      padding-top: 1rem;
    }

    &__group {
      margin-bottom: 2rem;
      label {
        display: inline-block;
        margin-bottom: 0.7rem;
      }
      input,
      select {
        display: block;
        width: 100%;
        height: 3.5rem;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        border: 2px solid transparent;
        outline: none;
        font-size: inherit;
        background-color: #2e2a67;
        color: $white;
        transition: 0.3s;

        &:focus {
          border: 2px solid $green;
        }
      }

      input[disabled] {
        background-color: #0f0761;
      }
    }

    .table {
      .item-name {
        flex-basis: 40%;
        max-width: 40%;
        text-align: left;
      }
      .qty {
        flex-basis: 10%;
        max-width: 10%;
        text-align: left;
      }
      .price,
      .total {
        flex-basis: 20%;
        max-width: 20%;
        text-align: left;
      }
      .delete-icon {
        cursor: pointer;
      }
    }

    .btn {
      background-color: #1f1d36;
      width: 100%;
    }
  }
}
</style>
