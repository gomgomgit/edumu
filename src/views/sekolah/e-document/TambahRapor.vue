<script setup>
import { onMounted, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from '@/util';
import QueryString from 'qs';
import { useToast } from 'vue-toast-notification';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue'
import ServerSideTable from '@/components/ServerSideTable.vue'
import FileDrop from '@/components/file-dropzone/Index.vue';
import { useStore } from 'vuex';

onMounted(() => {
  setCurrentPageBreadcrumbs("Tambah Rapor", ['Sekolah', 'E Dokumen']);
  getData()
})

const store = useStore()
const userId = store.getters.currentUser.user_id 

const router = useRouter()
const kelasOption = ref()
const kategoriOption = ref()

const searchSiswa = ref()

const selectedSiswa = ref([])

const form = reactive({
  kelas_id: '',
})

const siswa = reactive({
  columns: [
    { label: 'Siswa', field: 'user_nama', sortable: false },
    { label: 'NISN', field: 'siswa_nisn', sortable: false },
    { label: 'Kelas', field: 'kelas_nama', sortable: false }
  ],
  rows: [],
  totalRows: 0,
})

function getData() {
  request.post('kelas')
  .then(res => {
    kelasOption.value = res.data.data
  })
}

function getSiswa(payload) {
  request.post('arsip/siswa-part', null, {
    params: {
      cari: searchSiswa.value,
      participant_id: form.kelas_id,
      page: payload?.page ?? 1,
      sortby: payload?.sort?.type ?? 'ASC'
    }
  }).then(res => {
    siswa.rows = res.data.data
  })
}

function postData() {
  const formData = new FormData()
  formData.append('arsip_cat_id', '')
  formData.append('arsip_type', 'rapor')
  formData.append('siswaSelect', selectedSiswa.value)
  formData.append('user_id', userId)
  formData.append('kelas_id', form.kelas_id)
  formData.append('file', form.file)

  request.post('arsip/upload', formData, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
    useToast().success('Berhasil upload rapor!')
    router.push('/sekolah/e-document/rapor')
  })
}

function selectionChangedSiswa(params) {
  var finalArray = params.selectedRows.map((obj) => {
    return obj.user_id
  })
  selectedSiswa.value = finalArray
}

</script>

<template>
  <div>
    <div class="row">
      <div class="col-12 col-lg-6">
        <div class="card mb-5 mb-xxl-8">
          <div class="card-body py-6">
            <div>
              <h2 class="fs-1 fw-bold py-6 m-0">Tambah Rapor</h2>
            </div>
            <div class="separator border-black-50 border-2 my-6"></div>
            <div class="d-flex flex-column gap-4">
              <div class="row">
                <div class="col-3 align-items-center d-flex">
                  <p class="m-0 fs-4 fw-bold">Pilih Kelas</p>
                </div>
                <div class="col-9 align-items-center d-flex gap-4">
                  <el-select @change="getSiswa()" class="w-100" v-model="form.kelas_id" filterable clearable placeholder="Select">
                    <el-option v-for="kelas in kelasOption" :key="kelas.kelas_id" :label="kelas.kelas_nama"
                      :value="kelas.kelas_id" />
                  </el-select>
                </div>
              </div>
            </div>
            
            <div class="w-100 my-4">
              <el-input
                v-model="searchSiswa"
                clearable
                class=""
                placeholder="Nama Siswa"
                @input="getSiswa()"
              >
                <template #append>
                  <el-button aria-disabled="true" class="pe-none" :icon="Search" />
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="card mb-5 mb-xxl-8">
          <div class="card-body py-6">
            <div>
              <h2 class="fs-1 fw-bold py-6 m-0">Upload Data</h2>
            </div>
            <div class="separator border-black-50 border-2 my-6"></div>
            <div class="">
              <div class="mb-3">
                <p class="m-0 fs-7">
                  *Cara upload per siswa:
                </p>
                <p class="m-0 fs-7">
                  -Pastikan nama file menggunakan nama NISN.pdf (contoh: 001234.pdf)
                </p>
                <p class="m-0 fs-7">
                  -Pastikan memilih siswa terlebih dahulu dan tidak perlu di zip
                </p>
                <p class="m-0 fs-7">
                  *Cara upload banyak siswa:
                </p>
                <p class="m-0 fs-7">
                  -Pastikan nama file menggunakan nama NISN.pdf (contoh: 001234.pdf)
                </p>
                <p class="m-0 fs-7">
                  -Silahkan zip file dengan cara select file lalu zip dengan zip tool
                </p>
              </div>

              <div class="">
                <FileDrop v-model:fileInputData="form.file"></FileDrop>
              </div>
              <div class="separator border-black-50 border-2 my-6"></div>
              <div class="d-flex justify-content-end gap-4">
                <a @click.prevent="router.go(-1)" href="#" class="btn btn-light">Batal</a>
                <a @click.prevent="postData" class="btn btn-primary">Simpan</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6 m-0">Siswa</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="my-5 mb-xxl-8">
          <ServerSideTable 
            @selected-rows-change="selectionChangedSiswa"
            :totalRows="siswa.totalRows || 0" 
            :columns="siswa.columns" 
            :rows="siswa.rows"
            :select-options="{
              enabled: true,
              selectOnCheckboxOnly: false, // only select when checkbox is clicked instead of the row
              selectionInfoClass: 'custom-class',
              selectionText: 'rows selected',
              clearSelectionText: 'clear',
              disableSelectInfo: true, // disable the select info panel on top
              selectAllByGroup: true, 
            }"
            @loadItems="getSiswa">
          </ServerSideTable>
        </div>
      </div>
    </div>
  </div>
</template>