<script setup>
import { reactive, ref } from "vue"
import { useRoute } from "vue-router"
import ServerSideTable from "@/components/ServerSideTable.vue";
import { request } from "@/util";
import { useStore } from "vuex";
import ModalKonfirmasi from "./ModalKonfirmasi.vue"


const route = useRoute()
const transaksiId = route.params.id

const store = useStore()
const currentUser = store.getters.currentUser;
const imageLink = `https://apistaging.edumu.id/${currentUser.sekolah_kode}/apischool/public`;

const dataKonfirmasi = ref(null)

const transaksiDetail = reactive({
  columns: [
    { label: 'Finance', field: 'item_nama', sortable: false },
    { label: 'Nominal', field: 'nominal', sortable: false },
    { label: 'Status', field: 'status', sortable: false },
    { label: 'Tanggal Bayar', field: 'create_date', sortable: false, width: '200px' },
  ],
  rows: [],
  totalRows: 0,
})
const transaksiConfirm = reactive({
  columns: [
    { label: 'Bukti', field: 'image', sortable: false },
    { label: 'Nominal', field: 'ptc_nominal', sortable: false },
    { label: 'Tanggal', field: 'ptc_created_date', sortable: false },
    { label: 'Opsi', field: 'option', sortable: false, width: '200px' },
  ],
  rows: [],
  totalRows: 0,
})
const transaksiData = reactive({
  payment_nominal: null,
  payment_status: null,
})

function getTransaksi (payload) {
	request.get(`iuran/transaksi/${transaksiId}`)
  .then(res => {
    transaksiData.value = res.data.data
    
    transaksiDetail.rows = res.data.data.detail
    transaksiConfirm.rows = res.data.data.confirm
	})
}
</script>

<template>
<div>
	<div class="card mb-5 mb-xxl-8">
    <div class="card-body">
      <div class="page-content">
        <div class="d-flex flex-wrap justify-content-between align-items-center">
          <div class="d-flex gap-4">
            <h2 class="fs-1 fw-bold py-6 m-0">Detail Pembayaran</h2>
          </div>
        </div>
        <div class="separator border-black-50 border-2 my-3"></div>
      </div>
      <ServerSideTable
        ref="tableRef"
        :totalRows="transaksiDetail.totalRows || 0"
        :columns="transaksiDetail.columns"
        :rows="transaksiDetail.rows"
        :pagination-options="{
          enabled: false
        }"
        @loadItems="getTransaksi">
        <template #table-row="{column, row}">
          <div v-if="column.field == 'payment_code'">
              #{{row.payment_code}}
          </div>
          <div v-if="column.field == 'status'">
            <span :class="'badge badge-light-' + (row.payment_status == 'Berhasil' ? 'success' : 'danger')">
              {{row.payment_status}}
            </span>
          </div>
        </template>
      </ServerSideTable>
      <div>
        <div>
          <span class="fw-bold fs-4">Total Bayar : </span><span>{{transaksiData.payment_nominal}}</span>
        </div>
        <div>
          <span class="fw-bold fs-4">Status : </span><span>{{transaksiData.payment_status}}</span>
        </div>
      </div>
    </div>
  </div>
	<div class="card mb-5 mb-xxl-8">
    <div class="card-body">
      <div class="page-content">
        <div class="d-flex flex-wrap justify-content-between align-items-center">
          <div class="d-flex gap-4">
            <h2 class="fs-1 fw-bold py-6 m-0">Konfirmasi Pembayaran</h2>
          </div>
        </div>
        <div class="separator border-black-50 border-2 my-3"></div>
      </div>
      <ServerSideTable
        ref="tableRef"
        :totalRows="transaksiConfirm.totalRows || 0"
        :columns="transaksiConfirm.columns"
        :rows="transaksiConfirm.rows"
        :pagination-options="{
          enabled: false
        }"
        @loadItems="getTransaksi">
        <template #table-row="{column, row}">
          <div v-if="column.field == 'image'">
            <img :src="imageLink + '/images/payment/' + row.ptc_image" alt="bukti" style="max-width: 200px">
          </div>
          <div v-if="column.field == 'option'">
            <button @click="dataKonfirmasi = row" class="btn btn-icon btn-bg-light btn-active-color-info btn-sm">
              <span class="svg-icon svg-icon-3">
                <i class="bi bi-clipboard-check-fill"></i>
              </span>
            </button>
          </div>
        </template>
      </ServerSideTable>
    </div>
  </div>

  <ModalKonfirmasi 
    :imageLink="imageLink"
		 :activeData="dataKonfirmasi"
		 @close="dataKonfirmasi = null"
  />
</div>
</template>