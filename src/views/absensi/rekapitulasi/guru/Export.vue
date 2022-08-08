<script setup>
import { onMounted, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from '@/util';
import QueryString from 'qs';
import { useToast } from 'vue-toast-notification';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Loading from 'vue3-loading-overlay'

import * as XLSX from 'xlsx';

onMounted(() => {
  setCurrentPageBreadcrumbs("Export Presensi", ['Absensi', 'Rekapitulasi', 'Guru']);
  getDownloadData()
})

const store = useStore()
const userId = store.getters.currentUser.user_id 

const router = useRouter()
const route = useRoute()

const exportData = ref([])
const exportDate = ref('')

const loading = ref(true)

const form = reactive({
  status_import: '',
  kelas_id: '',
  file: null,
})

function getDownloadData() {
  console.log(route.query)
  loading.value = true
  request.post('downloadreportguru', null, {
    params: {
      level: 'guru',
      user: route.query.user,
      tglMulai: route.query.tglMulai,
      tglEnd: route.query.tglEnd
    }
  }).then(res => {
    if (res.data.success == true) {
      exportData.value = res.data.data
      exportDate.value = res.data.created_at

      loading.value = false
    } else {

      loading.value = false
    }
  })
}

function generate() {
    const ws_data = [
      ['Rekap Presensi'],
      ['Periode : ' + route.query.tglMulai + ' sampai ' + route.query.tglEnd],
      [''],
      ['No', 'Nama', 'In/Out', 'Rekap', 'Rekap', 'Rekap', 'Rekap', 'Total Hadir'],
      ['No', 'Nama', 'In/Out', 'Telat', 'Izin', 'Sakit', 'Alpha', 'Keterangan'],
    ]
    var presenceDates = exportData.value[0].pre.map((val) => {
      return val.tanggal
    })
    var tglFormat = exportData.value[0].pre.map((val) => {
      return 'Tanggal'
    })
// return console.log(presenceDates)
    ws_data[3].splice(3, 0, ...tglFormat);
    ws_data[4].splice(3, 0, ...presenceDates)
    
    const merges = [
      {s: {r: 0, c: 0}, e: {r: 0, c: 10}},
      {s: {r: 1, c: 0},e: {r: 1, c: 10}},
      {s: {r: 2, c: 0},e: {r: 2, c: 10}},
      {s: {r: 3, c: 0},e: {r: 4, c: 0}},
      {s: {r: 3, c: 1},e: {r: 4, c: 1}},
      {s: {r: 3, c: 2},e: {r: 4, c: 2}},
      {s: {r: 3, c: 3},e: {r: 3, c: 2 + presenceDates.length}},
      {s: {r: 3, c: 3 + presenceDates.length},e: {r: 3, c: 6 + presenceDates.length}},
      {s: {r: 3, c: 7 + presenceDates.length},e: {r: 4, c: 7 + presenceDates.length}},
    ];
    
    function getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }

    exportData.value.forEach((report, index) => {
      let data = [
        index+1,
        report.user_nama,
        'In/Out',
        report.tot.telat,
        report.tot.izin,
        report.tot.sakit,
        report.tot.alpha,
        report.tot.hadir,
      ]
      let onDays = report.pre.map((val) => {
        return getKeyByValue(val, '1')
      })
      data.splice(3, 0, ...onDays)
      ws_data.push(data)
    })

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    XLSX.utils.book_append_sheet(wb, ws, "report presensi");

    ws["!merges"] = merges;

    var name = `Report Presensi.xlsx`
    XLSX.writeFile(wb, name)
}
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6 m-0">Export Absensi Guru</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="bg-light-primary rounded p-6">
          <div v-if="loading" class="d-flex flex-column align-items-center">
              <Loading 
                :active="loading" 
                color="#41B883"
                :is-full-page="false">
              </Loading>
              <p class="m-0 m-auto mt-3 fs-5 text-black-50 fw-bold">Harap Tuggu, Data sedang diproses</p>
          </div>
          <div v-if="!loading" class="d-flex flex-column align-items-center">
            <p class="m-0 m-auto fs-5 text-black-50">Report Excel siap di Unduh, Klik tombol bawah untuk unduh laporan presensi</p>
            <p class="m-0 m-auto fs-5 text-black-50">{{exportDate}}</p>
            <div class="my-3">
              <a @click="getQueue()" class="btn btn-danger d-flex gap-3 align-items-center w-auto">
                <span>
                  Generate ulang
                </span>
                <i class="bi bi-arrow-repeat fs-1"></i>
              </a>
            </div>
            <div class="my-3">
              <a @click="generate()" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <span>
                  Download File
                </span>
                <i class="bi bi-cloud-arrow-down fs-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>