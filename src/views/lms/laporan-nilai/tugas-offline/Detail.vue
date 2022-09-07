<script setup>
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import { request } from '@/util';
import moment from 'moment';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import FilterSelect from '@/components/filter-select/index.vue';
import { Search } from '@element-plus/icons-vue'
import ServerSideTable from '@/components/ServerSideTable.vue';
import * as XLSX from 'xlsx';

onMounted(() => {
  getData()
  setCurrentPageBreadcrumbs('Detail Nilai', ['LMS', 'Laporan Nilai', 'Tugas Offline'])
})

const route = useRoute()
const tugasId = route.params.id
const detailData = ref([])
const kelasFilter = ref()
const searchSiswa = ref('')

const dataJawab = reactive({
  columns: [
    { label: 'Nama', field: 'user_nama', sortable: false },
    { label: 'Status', field: 'status', sortable: false },
  ],
  rows: [],
})
const dataBelumJawab = reactive({
  columns: [
    { label: 'Nama', field: 'user_nama', sortable: false },
    { label: 'Status', field: 'status', sortable: false },
  ],
  rows: [],
})

function getData() {
  request.post(`tugas/siswa`, null, {
    params: {
      tugas_id: tugasId,
      participant_id: kelasFilter.value,
      cari: searchSiswa.value
    }
  }).then(res => {
    console.log(res)
    detailData.value = res.data.data

    dataJawab.rows = res.data.data.jawab
    dataBelumJawab.rows = res.data.data.notJawab
  })
}

function exportNilai() {
  let presensi = [["Guru",detailData.value.user_nama]]
        presensi.push(["Mata Pelajaran",detailData.value.mapel_nama])
        presensi.push(["Tanggal Mulai",detailData.value.tugas_create_date])
        presensi.push(["Batas Pengumpulan",detailData.value.tugas_due_date])
        presensi.push([""])
        presensi.push(["NAMA", "NISN", "NILAI"])

        detailData.value.jawab.map(item => {
            presensi.push([
                item.user_nama,
                item.siswa_nisn,
                item.ta_nilai
            ])
        })

        let notExam = [["NAMA", "NISN", "NILAI"]]

        detailData.value.notJawab.map(item => {
            notExam.push([
                item.user_nama,
                item.siswa_nisn,
                '0',
                ''
            ])
        })

        const wb = XLSX.utils.book_new()
        const wsAll = XLSX.utils.aoa_to_sheet(presensi)
        const wsNotEx = XLSX.utils.aoa_to_sheet(notExam)

        XLSX.utils.book_append_sheet(wb, wsAll, detailData.value.kelasNama + 'Ujian')
        XLSX.utils.book_append_sheet(wb, wsNotEx, detailData.value.kelasNama + 'Belum')

        XLSX.writeFile(wb, "Rekap Nilai-"+ detailData.value.kelasNama+"-"+ detailData.value.tugas_judul +".xlsx")
}

function formatingDate(date) {
  return {
    date: moment(date).format('DD/MM/Y'),
    time: moment(date).format('LT')
  }
}
</script>
<template>
  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="mb-4 d-flex justify-content-between">
          <h2 class="fs-1 fw-bold py-6">Detail Laporan Nilai Tugas Offline</h2>
          <div class="d-flex align-items-center">
            <a @click="exportNilai()" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
              <span>
                Export Nilai
              </span>
              <i class="bi bi-printer-fill fs-2"></i>
            </a>
          </div>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-8 py-4">
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Guru</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{detailData.user_nama}}</h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Kelas</h4></div>
            <div class="col-10 d-flex gap-1">
              <div>
                <h4 class="fw-bold">:</h4>
              </div>
              <div>
                <h4 class="fw-bold" v-for="detailKelas, index in detailData.kelas"> {{detailKelas.kelas_nama}}</h4>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Mata Pelajaran</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{detailData.mapel_nama}}</h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Tanggal Ujian</h4></div>
            <div class="col-10"><h4 class="fw-bold">: 
              <span class="badge badge-primary fs-5 p-3 me-4">{{formatingDate(detailData.tugas_create_date).date}} <i class="ms-3 bi bi-calendar2 text-white"></i></span>
              <span class="badge badge-primary fs-5 p-3 me-4">{{formatingDate(detailData.tugas_create_date).time}} <i class="ms-3 bi bi-clock text-white"></i></span>
            </h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Tanggal Ujian</h4></div>
            <div class="col-10"><h4 class="fw-bold">: 
              <span class="badge badge-primary fs-5 p-3 me-4">{{formatingDate(detailData.tugas_due_date).date}} <i class="ms-3 bi bi-calendar2 text-white"></i></span>
              <span class="badge badge-primary fs-5 p-3 me-4">{{formatingDate(detailData.tugas_due_date).time}} <i class="ms-3 bi bi-clock text-white"></i></span>
            </h4></div>
          </div>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex justify-content-between">
          <div>
            <FilterSelect v-model:filterValue="kelasFilter" placeholder="Pilih Kelas" @changeFilter="getData()">
              <el-option
                v-for="kelas, index in detailData.kelas"
                :key="kelas.kelas_id"
                :label="kelas.kelas_nama"
                :value="kelas.kelas_id"
              />
            </FilterSelect>
          </div>
          <div class="d-flex w-100 w-lg-50 w-xl-25 gap-4">
            <el-input
              v-model="searchSiswa"
              clearable
              class="m-2"
              placeholder="Cari Siswa"
              @input="getData()"
            >
              <template #append>
                <el-button aria-disabled="true" class="pe-none" :icon="Search" />
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-12 col-lg-6">
      <div class="card mb-5 mb-xxl-8">
        <div class="card-body pt-5 pb-5">
          <div class="page-content">
            <div class="mb-4">
              <div class="d-flex justify-content-between">
                <h2 class="fs-1 fw-bold py-6">Data Siswa Upload Tugas</h2>
              </div>
    
            </div>
            <div class="separator border-black-50 border-2 my-6"></div>
            <div>
              <ServerSideTable
                :totalRows="dataJawab.totalRows || 0"
                :columns="dataJawab.columns"
                :rows="dataJawab.rows"
                @loadItems="getData"
              >
                <template #table-row="{column, row}">
                  <div v-if="column.field == 'status'">
                    <span class='badge badge-light-success'>Sudah Upload Tugas</span>
                  </div>
                </template>
              </ServerSideTable>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-6">
      <div class="card mb-5 mb-xxl-8">
        <div class="card-body pt-5 pb-5">
          <div class="page-content">
            <div class="mb-4">
              <div class="d-flex justify-content-between">
                <h2 class="fs-1 fw-bold py-6">Data Siswa Belum Upload Tugas</h2>
              </div>
            </div>
            <div class="separator border-black-50 border-2 my-6"></div>
            <div>
              <ServerSideTable
                :totalRows="dataBelumJawab.totalRows || 0"
                :columns="dataBelumJawab.columns"
                :rows="dataBelumJawab.rows"
                @loadItems="getData"
              >
                <template #table-row="{column, row}">
                  <div v-if="column.field == 'status'">
                    <span class='badge badge-light-warning'>Belum Upload Tugas</span>
                  </div>
                </template>
              </ServerSideTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>