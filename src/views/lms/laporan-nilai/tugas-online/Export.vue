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
  setCurrentPageBreadcrumbs("Export", ['LMS', 'Laporan Nilai', 'Tugas Online']);
  getNilai()
})

const store = useStore()

const router = useRouter()
const route = useRoute()

const ujianId = route.params.id
const kelasId = route.params.kelas

const kelasOption = ref()

const loading = ref(false)

const resReport = ref([])

const form = reactive({
  status_import: '',
  kelas_id: '',
  file: null,
})

function getNilai() {
  loading.value = true
    request.post('ujian/siswanilai', null, {
      params: {
        exam_id: ujianId,
        participant_id: kelasId,
      }
    }).then(res => {
      loading.value = false

      resReport.value = res.data.data[0]
    })
  }

  function generate() {

    const ws_data = [
      ['Rekap Nilai Ujian'],
      ['Guru', resReport.value.user_nama],
      ['Mapel', resReport.value.mapel_nama],
      ['Judul', resReport.value.exam_title],
      ['Kelas', resReport.value.kelas.kelas_nama],
      ['Soal', resReport.value.nilai[0].totPg + resReport.value.nilai[0].totEs],
      ['Pilihan Ganda', resReport.value.nilai[0].totPg],
      ['Essay', resReport.value.nilai[0].totEs],
      [''],
      ['No', 'Nama', 'Kelas', 'Total', 'Total', 'Total', 'Pilihan Ganda', 'Pilihan Ganda', 'Nilai Akhir', 'Keterangan'],
      ['No', 'Nama', 'Kelas', 'Nilai', 'Jawab', 'Tidak Jawab', 'Jawaban Benar', 'Jawaban Salah', 'Nilai Akhir', 'Keterangan'],
    ]
    resReport.value.nilai.forEach((report, index) => {
      ws_data.push([
        index+1,
        report.user_nama,
        resReport.value.kelas.kelas_nama,
        report.en_nilai,
        report.detJwb.length,
        report.notJwb.length,
        report.cBenar,
        report.cSalah,
        report.en_tot_nilai,
        report.en_desc,
      ])
    })

    const merges = [
      {s: {r: 0, c: 0}, e: {r: 0, c: 10}},
      {s: {r: 1, c: 1},e: {r: 1, c: 10}},
      {s: {r: 2, c: 1},e: {r: 2, c: 10}},
      {s: {r: 3, c: 1},e: {r: 3, c: 10}},
      {s: {r: 4, c: 1},e: {r: 4, c: 10}},
      {s: {r: 5, c: 1},e: {r: 5, c: 10}},
      {s: {r: 6, c: 1},e: {r: 6, c: 10}},
      {s: {r: 7, c: 1},e: {r: 7, c: 10}},
      {s: {r: 8, c: 0},e: {r: 8, c: 10}},
      {s: {r: 9, c: 0},e: {r: 10, c: 0}},
      {s: {r: 9, c: 1},e: {r: 10, c: 1}},
      {s: {r: 9, c: 2},e: {r: 10, c: 2}},
      {s: {r: 9, c: 3},e: {r: 9, c: 5}},
      {s: {r: 9, c: 6},e: {r: 9, c: 7}},
      {s: {r: 9, c: 8},e: {r: 10, c: 8}},
      {s: {r: 9, c: 9},e: {r: 10, c: 10}},
    ];

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    ws["!merges"] = merges;

    var name = `Rekap Nilai-${resReport.value.kelas.kelas_nama}-${resReport.value.exam_title}.xlsx`
    XLSX.writeFile(wb, name)
  }
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6 m-0">Export Absensi Siswa</h2>
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
              <p class="m-0 m-auto fs-5 text-black-50">Report Excel siap di Unduh, Klik tombol bawah untuk unduh</p>
              <div class="my-3">
                <a @click="getNilai()" class="btn btn-danger d-flex gap-3 align-items-center w-auto">
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