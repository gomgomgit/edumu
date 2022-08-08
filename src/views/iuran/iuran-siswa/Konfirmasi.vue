<script setup>
import { onMounted, reactive, ref } from "vue"
import { useRoute } from "vue-router"
import ServerSideTable from "@/components/ServerSideTable.vue";
import { request } from "@/util";
import { useStore } from "vuex";
import ModalKonfirmasi from "./ModalKonfirmasi.vue"

onMounted(() => {
  getTransaksi()
})

const route = useRoute()
const transaksiId = route.params.id

const store = useStore()
const currentUser = store.getters.currentUser;
const imageLink = `https://apistaging.edumu.id/${currentUser.sekolah_kode}/apischool/public`;

const formMode = ref(null)
const dataKonfirmasi = ref([])

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
    transaksiData.payment_nominal = res.data.data.payment_nominal
    transaksiData.payment_status = res.data.data.payment_status
    
    transaksiDetail.rows = res.data.data.detail
    transaksiConfirm.rows = res.data.data.confirm
	})
}
function konfirmasi(data) {
  dataKonfirmasi.value = data
  formMode.value = 'konfirmasi'
}
function handleFormClose() {
  dataKonfirmasi.value = []
  formMode.value = null
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
        :totalRows="transaksiDetail.totalRows || 0"
        :columns="transaksiDetail.columns"
        :rows="transaksiDetail.rows"
        :pagination-options="{
          enabled: false
        }">
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
      <div class="mt-3 fs-3 ">
        <div>
          <span class="fw-bold">Total Bayar : </span><span>{{transaksiData.payment_nominal}}</span>
        </div>
        <div>
          <span class="fw-bold">Status : </span><span :class="`badge badge-${transaksiData.payment_status == 'Berhasil' ? 'success' : 'danger'}`">{{transaksiData.payment_status}}</span>
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
        :totalRows="transaksiConfirm.totalRows || 0"
        :columns="transaksiConfirm.columns"
        :rows="transaksiConfirm.rows"
        :pagination-options="{
          enabled: false
        }">
        <template #table-row="{column, row}">
          <div v-if="column.field == 'image'">
            <img :src="imageLink + '/images/payment/' + row.ptc_image" alt="bukti" style="max-width: 200px">
          </div>
          <div v-if="column.field == 'option'">
            <button @click="konfirmasi(row)" class="btn btn-icon btn-bg-light btn-active-color-info btn-sm">
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
    :formMode="formMode"
    :activeData="dataKonfirmasi"
    @close="handleFormClose()"
  />
</div>
</template>