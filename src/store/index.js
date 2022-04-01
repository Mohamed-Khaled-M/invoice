import { createStore } from 'vuex';
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import db from '@/firebase/firebaseInit';

export default createStore({
  state: {
    invoiceModal: false,
    invoiceData: [],
    invoicesLoaded: null,
    currentInvoice: null,
    editInvoice: false,
  },

  mutations: {
    TOGGLE_INVOICE_MODAL: (state) => (state.invoiceModal = !state.invoiceModal),
    CLOSE_INVOICE_MODAL: (state) => {
      state.invoiceModal = false;
      state.editInvoice = false;
    },
    OPEN_INVOICE_Edit: (state) => (state.editInvoice = true),
    SET_INVOICE_DATA: (state, payload) => state.invoiceData.push(payload),
    INVOICES_LOADED: (state) => (state.invoicesLoaded = true),
    SET_CURRENT_INVOICE: (state, payload) => {
      state.currentInvoice = state.invoiceData.filter(
        (invoice) => invoice.invoiceId === payload
      );
    },
    DELETE_INVOICE: (state, payload) => {
      state.invoiceData = state.invoiceData.filter(
        (invoice) => invoice.docId !== payload
      );
    },
    UPDATE_STATUS_TO_PAID: (state, payload) => {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = true;
          invoice.invoicePending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING: (state, payload) => {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;
        }
      });
    },
  },

  actions: {
    toggleInvoiceModal: ({ commit }) => commit('TOGGLE_INVOICE_MODAL'),
    closeInvoiceModal: ({ commit }) => commit('CLOSE_INVOICE_MODAL'),
    toggleInvoiceEdit: ({ commit }) => commit('OPEN_INVOICE_Edit'),
    async getInvoices({ commit, state }) {
      const result = await getDocs(collection(db, 'invoices'));
      result.forEach((item) => {
        if (!state.invoiceData.some((invoice) => invoice.docId === item.id)) {
          const data = {
            docId: item.id,
            invoiceId: item.data().invoiceId,
            billerStreetAddress: item.data().billerStreetAddress,
            billerCity: item.data().billerCity,
            billerZipCode: item.data().billerZipCode,
            billerCountry: item.data().billerCountry,
            clientName: item.data().clientName,
            clientEmail: item.data().clientEmail,
            clientStreetAddress: item.data().clientStreetAddress,
            clientCity: item.data().clientCity,
            clientZipCode: item.data().clientZipCode,
            clientCountry: item.data().clientCountry,
            invoiceDateUnix: item.data().invoiceDateUnix,
            invoiceDate: item.data().invoiceDate,
            paymentTerms: item.data().paymentTerms,
            paymentDueDateUnix: item.data().paymentDueDateUnix,
            paymentDueDate: item.data().paymentDueDate,
            productDescription: item.data().productDescription,
            invoiceItemList: item.data().invoiceItemList,
            invoiceTotal: item.data().invoiceTotal,
            invoicePending: item.data().invoicePending,
            invoiceDraft: item.data().invoiceDraft,
            invoicePaid: item.data().invoicePaid,
          };
          commit('SET_INVOICE_DATA', data);
        }
      });
      commit('INVOICES_LOADED');
    },
    setCurrentInvoice: ({ commit }, payload) => {
      commit('SET_CURRENT_INVOICE', payload);
    },
    async updateInvoice({ commit, dispatch }, { docId, routeId }) {
      commit('DELETE_INVOICE', docId);
      await dispatch('getInvoices');
      commit('CLOSE_INVOICE_MODAL');
      commit('SET_CURRENT_INVOICE', routeId);
    },
    async deleteInvoice({ commit }, payload) {
      const dataBase = doc(collection(db, 'invoices'), payload);
      await deleteDoc(dataBase);
      commit('DELETE_INVOICE', payload);
    },

    async updateStatusToPaid({ commit }, payload) {
      const dataBase = doc(collection(db, 'invoices'), payload);
      await updateDoc(dataBase, {
        invoicePaid: true,
        invoicePending: false,
      });
      commit('UPDATE_STATUS_TO_PAID', payload);
    },
    async updateStatusToPending({ commit }, payload) {
      const dataBase = doc(collection(db, 'invoices'), payload);
      await updateDoc(dataBase, {
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      });
      commit('UPDATE_STATUS_TO_PENDING', payload);
    },
  },

  getters: {
    getInvoiceModal: (state) => state.invoiceModal,
    getInvoiceData: (state) => state.invoiceData,
    isInvoicesLoaded: (state) => state.invoicesLoaded,
    getCurrentInvoice: (state) => state.currentInvoice,
    getEditInvoice: (state) => state.editInvoice,
  },

  modules: {},
});
