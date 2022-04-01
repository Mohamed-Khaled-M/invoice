<template>
  <div v-if="!mobile">
    <div v-if="invoiceLoaded" class="app d-flex flex-column flex-md-row">
      <the-navigation />
      <div class="app__content d-flex flex-column" @click.self="close">
        <transition name="show">
          <invoice-modal v-if="isInvoiceModalVisible" />
        </transition>
        <router-view />
      </div>
    </div>
    <page-loader v-else />
  </div>
  <div v-else class="mobile-message">
    <h2>Sorry, this app is not supported on Mobile Devices</h2>
    <p>To use this app, please use a computer or Tablet</p>
  </div>
</template>

<script setup>
import TheNavigation from './components/layout/TheNavigation.vue';
import InvoiceModal from './components/invoice/InvoiceModal.vue';
import PageLoader from './components/common/PageLoader.vue';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';

const mobile = ref(null);
function checkScreen() {
  const windowWidth = window.innerWidth;
  if (windowWidth <= 750) {
    mobile.value = true;
  } else {
    mobile.value = false;
  }
}
checkScreen();
window.addEventListener('resize', checkScreen);

const store = useStore();
const close = () => store.dispatch('closeInvoiceModal');
const isInvoiceModalVisible = computed(() => store.getters.getInvoiceModal);

store.dispatch('getInvoices');
const invoiceLoaded = computed(() => store.getters.isInvoicesLoaded);
</script>

<style lang="scss">
.app {
  min-height: 100vh;

  &__content {
    position: relative;
    padding: 6rem 0;
    flex: 1;

    .show-enter-from,
    .show-leave-to {
      transform: translateX(-150%);
    }
    .show-enter-active,
    .show-leave-active {
      transition: 0.5s;
    }
    .show-enter-to,
    .show-leave-from {
      transform: translateX(0);
    }
  }
}

.mobile-message {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  padding: 10rem 3rem;
  text-align: center;
  h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  p {
    font-size: 2rem;
  }
}
</style>
