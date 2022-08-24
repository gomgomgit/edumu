<script setup>
  import { computed, onMounted, reactive, ref } from "vue";
  import ServerSideTable from "@/components/ServerSideTable.vue";
  import FilterSelect from "@/components/filter-select";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import { request } from "@/util";
import QueryString from "qs";
import { useToast } from "vue-toast-notification";
import ModalBlokir from './ModalBlokir.vue'
  
  onMounted(() => {
    setCurrentPageBreadcrumbs("Mutasi Kelas", ['Sekolah', "Akademik"]);
    getKelas()
    getPesanUjian()
  })

  function getKelas () {
    request.post('kelas', null, {
      params: {
      }
    }).then(res=>{
      kelas.value = res.data.data
    })
  }
  
  function getPesanUjian () {
    request.post('pesan/detail', null, {
      params: {
        menu: 'exam',
        type: 'block',
      }
    }).then(res => {
      pesanUjian.value = res.data.data
    })
  }
  function getSiswaUjian (payload) {
    request.post('siswa_data_ujian', null, {
      params: {
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC',
        kelas_id: kelasSelect.value ?? ''
      }
    }).then(res => {
      dataSiswaUjian.rows = res.data.data.data
      dataSiswaUjian.totalRows = res.data.data.total
    })
  }
  function getSiswaNonUjian (payload) {
    request.post('siswa_data_non_ujian', null, {
      params: {
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC',
        kelas_id: kelasSelect.value ?? ''
      }
    }).then(res => {
      dataSiswaNonUjian.rows = res.data.data.data
      dataSiswaNonUjian.totalRows = res.data.data.total
    })
  }
  
  const dataSiswaUjian = reactive({
    columns: [
      { label: 'Siswa', field: 'user_nama', sortable: false },
    ],
    rows: [],
    totalRows: 0,
  })

  const selectedSiswaUjian = ref([])
  const selectedSiswaNonUjian = ref([])

  const dataSiswaNonUjian = reactive({
    columns: [
      { label: 'Siswa', field: 'user_nama', sortable: false },
    ],
    rows: [],
    totalRows: 0,
  })

  const kelas = ref([])

  const kelasSelect = ref('')

  const pesanUjian = ref()
  const showModalBlokir = ref(false)

  function changeKelas() {
    getSiswaUjian()
    getSiswaNonUjian()
  }

  function moveSiswaToNon() {
    request.post('/siswa/update_ujian', QueryString.stringify({
      allow_exam: 0,
      kelas_id: kelasSelect.value,
      siswa_selected: selectedSiswaUjian.value
    }))
      .then(res => {
        useToast().success('Berhasil Update data!')
        getSiswaUjian()
        getSiswaNonUjian()
      })
  }
  function moveSiswaToUjian() {
    request.post('/siswa/update_ujian', QueryString.stringify({
      allow_exam: 1,
      kelas_id: kelasSelect.value,
      siswa_selected: selectedSiswaNonUjian.value
    }))
      .then(res => {
        useToast().success('Berhasil update kelas!')
        getSiswaUjian()
        getSiswaNonUjian()
      })
  }
  function selectionSiswaUjian(params) {
    var finalArray = params.selectedRows.map((obj) => {
      return obj.siswa_id
    })
    selectedSiswaUjian.value = finalArray
  }
  function selectionSiswaNon(params) {
    var finalArray = params.selectedRows.map((obj) => {
      return obj.siswa_id
    })
    selectedSiswaNonUjian.value = finalArray
  }
</script>

<template>
  <div>
    <div class="row g-4">
      <div class="row-12">
        <div class="card mb-5 mb-3">
          <div class="card-body pt-5 pb-5">
            <div class="d-flex justify-content-between align-items-center">
              <h2 class="fs-1">Data Siswa Peserta Ujian</h2>
              <div>
                <FilterSelect v-model:filterValue="kelasSelect" @changeFilter="changeKelas"
                  placeholder="Pilih Kelas">
                  <el-option v-for="item, index in kelas" :key="index" :label="item.kelas_nama"
                    :value="item.kelas_id" />
                </FilterSelect>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-12 col-xl-6">
        <div class="card mb-5 mb-xxl-8">
          <div class="card-body pt-5 pb-5">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2 class="fs-1">Data Siswa</h2>
                <p class="text-black-50 fw-bold mb-0">Bisa Ujian</p>
              </div>

              <div class="position-relative d-flex ">
                <a @click.prevent="moveSiswaToNon()" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <span>
                    Simpan
                  </span>
                </a>
              </div>
            </div>
            <div class="separator border-black-50 border-3 my-4"></div>
            <div class="page-content">
              <div class="mb-5 mb-xxl-8">
                <ServerSideTable 
                  @selected-rows-change="selectionSiswaUjian"
                  :totalRows="dataSiswaUjian.totalRows || 0" 
                  :columns="dataSiswaUjian.columns"
                  :select-options="{
                    enabled: true,
                    selectOnCheckboxOnly: false, // only select when checkbox is clicked instead of the row
                    selectionInfoClass: 'custom-class',
                    selectionText: 'rows selected',
                    clearSelectionText: 'clear',
                    disableSelectInfo: true, // disable the select info panel on top
                    selectAllByGroup: true, 
                  }"
                  :rows="dataSiswaUjian.rows" @loadItems="getSiswaUjian">
                  <template #table-row="{column, row}">
                    <div v-if="column.field == 'user_nama'">
                      <span class="fw-bold">{{row.user_nama}}</span> - {{row.kelas_nama}}
                    </div>
                  </template>
                </ServerSideTable>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-12 col-xl-6">
        <div class="card mb-5 mb-xxl-8">
          <div class="card-body pt-5 pb-5">

            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2 class="fs-1">Data Siswa</h2>
                <p class="text-black-50 fw-bold mb-0">Tidak Bisa Ujian</p>
              </div>
              <div class="position-relative d-flex gap-4">
                <a @click.prevent="showModalBlokir = true" class="btn btn-danger d-flex gap-3 align-items-center w-auto">
                  <span>
                    Pesan Blokir
                  </span>
                </a>
                <a @click.prevent="moveSiswaToUjian()" class="btn btn-danger d-flex gap-3 align-items-center w-auto">
                  <span>
                    Hapus
                  </span>
                </a>
              </div>
            </div>
            <div class="separator border-black-50 border-3 my-4"></div>
            <div class="page-content">
              <div class="mb-5 mb-xxl-8">
                <ServerSideTable 
                  @selected-rows-change="selectionSiswaNon"
                  :totalRows="dataSiswaNonUjian.totalRows || 0" 
                  :columns="dataSiswaNonUjian.columns"
                  :select-options="{
                    enabled: true,
                    selectOnCheckboxOnly: false, // only select when checkbox is clicked instead of the row
                    selectionInfoClass: 'custom-class',
                    selectionText: 'rows selected',
                    clearSelectionText: 'clear',
                    disableSelectInfo: true, // disable the select info panel on top
                    selectAllByGroup: true, 
                  }"
                  :rows="dataSiswaNonUjian.rows" @loadItems="getSiswaNonUjian">
                  <template #table-row="{column, row}">
                    <div v-if="column.field == 'user_nama'">
                      <span class="fw-bold">{{row.user_nama}}</span> - {{row.kelas_nama}}
                    </div>
                  </template>
                </ServerSideTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalBlokir 
    :show="showModalBlokir"
    :data="pesanUjian"
    @close="showModalBlokir = false"
    @dismiss="showModalBlokir = false"
    @submit="() => {
      showModalBlokir = false
      getPesanUjian()
    }"
    />
  </div>
</template>