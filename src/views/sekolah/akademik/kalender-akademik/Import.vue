<script setup>
import { onMounted, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import ServerSideTable from "@/components/ServerSideTable.vue";
import { request } from '@/util';
import QueryString from 'qs';
import { useToast } from 'vue-toast-notification';
import { useRouter } from 'vue-router';
import FileDrop from '@/components/file-dropzone/Index.vue';
import { useStore } from 'vuex';

import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

onMounted(() => {
  setCurrentPageBreadcrumbs("Import Data", ['Sekolah', 'Akademik', 'Kalender Akademik']);
})

const store = useStore()
const userId = store.getters.currentUser.user_id 

const router = useRouter()

const selectedKelas = ref()

const form = reactive({
  status_import: '',
  kelas_id: '',
  file: null,
})

const dataKelas = reactive({
  columns: [
    { label: 'Kelas', field: 'kelas_nama', sortable: false },
  ],
  rows: [],
  totalRows: 0,
})

function getKelas() {
  request.post('kelas', null).then(res => {
    dataKelas.rows = res.data.data
  })
}

function postData() {
  const formData = new FormData()
  formData.append('file', form.file)
  formData.append('user_id', userId)

  request.post('libur/import', formData, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
    router.push('/sekolah/akademik/kalender-akademik')
  })
}

function selectionClass(params) {
    var finalArray = params.selectedRows.map(obj => {
      return obj.kelas_id
    })
    selectedKelas.value = finalArray
}

function generate() {
    if (!selectedKelas.value) {
      Swal.fire({
        icon: 'error',
        title: 'Harap Pilih Kelas'
      })
    }
    var items = [
      ['Tanggal', 'Kelas', 'Deskripsi'],
      ['(02/11/2022)', selectedKelas.value.toString(), '']
    ]

    var items = items; 
    var name = 'Format Import Libur.xlsx'

    const data = XLSX.utils.aoa_to_sheet(items)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, data, 'libur')
    XLSX.writeFile(wb, name)
}
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6 m-0">Import Data</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="mb-4">
            <p class="mb-2 fs-4 fw-bold">File Import</p>
            <div>
              <p class="mb-2">*Tentukan kelas mana yang anda ingin import, Lalu generate excel format</p>
              <p class="mb-2">*Pastikan file sesuai formatnya seperti yg anda generate</p>
              <p class="mb-2">*Gunakan tanda () untuk format tanggal nya </p>
            </div>
        </div>
        <div>
          <FileDrop v-model:fileInputData="form.file"></FileDrop>
        </div>
        <div>
          <div class="d-flex justify-content-end gap-4">
            <a @click.prevent="router.push('/sekolah/profil-pengguna/siswa')" href="#" class="btn btn-light">Batal</a>
            <a @click.prevent="postData" class="btn btn-primary">Import</a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="fs-1 fw-bold py-6 m-0">Pilih Kelas</h2>
          
          <div>
            <a @click="generate" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
              <span>
                Generate Excel Format
              </span>
            </a>
          </div>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="page-content">
            <div class="mb-5 mb-xxl-8">
              <ServerSideTable 
                @selected-rows-change="selectionClass"
                :paginationOptions="{enabled: false}"
                :totalRows="dataKelas.totalRows || 0" 
                :columns="dataKelas.columns"
                :select-options="{
                  enabled: true,
                  selectOnCheckboxOnly: false, // only select when checkbox is clicked instead of the row
                  selectionInfoClass: 'custom-class',
                  selectionText: 'rows selected',
                  clearSelectionText: 'clear',
                  disableSelectInfo: true, // disable the select info panel on top
                  selectAllByGroup: true, 
                }"
                :rows="dataKelas.rows" @loadItems="getKelas">
                <template #table-row="{column, row}">
                  <div v-if="column.field == 'user_nama'">
                    <span class="fw-bold">{{row.user_nama}}</span>
                  </div>
                </template>
              </ServerSideTable>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>