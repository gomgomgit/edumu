<script setup>
  import { ref, onMounted, reactive } from "vue";
  import { request } from '@/util'
  import Modal from "@/components/modals/CustomModal.vue";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import ServerSideTable from '@/components/ServerSideTable.vue'
  import FilterSelect from '@/components/filter-select'
  import { Search } from '@element-plus/icons-vue'
import { useToast } from "vue-toast-notification";
import { deleteConfirmation } from "@/core/helpers/deleteconfirmation";
import QueryString from "qs";
import { useStore } from "vuex";

  onMounted(() => {
    setCurrentPageBreadcrumbs("Skema Absensi", ["Absensi"]);
    getClass()
  })

  const store = useStore()
  const userId = store.getters.currentUser.user_id 

  function getSiswaGps (payload) {
    request.post('siswa_pkl', null, {
      params: {
        kelas_id: filterSiswa.value,
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      siswaGps.rows = res.data.data.data
      siswaGps.totalRows = res.data.data.total
    })
  }
  function getSiswaNonGps (payload) {
    request.post('siswa_non_pkl', null, {
      params: {
        kelas_id: filterSiswaNon.value,
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      siswaNonGps.rows = res.data.data.data
      siswaNonGps.totalRows = res.data.data.total
    })
  }
  function getClass (payload) {
    request.post('kelas')
    .then(res => {
      classOption.value = res.data.data
    })
  }


  const siswaGps = reactive({
    columns: [
      { label: 'Siswa', field: 'user_nama', sortable: false },
      { label: 'Kelas', field: 'kelas_nama', sortable: false },
      { label: 'Status', field: 'def_loc', sortable: false },
    ],
    rows: [],
    totalRows: 0,
  })
  const siswaNonGps = reactive({
    columns: [
      { label: 'Siswa', field: 'user_nama', sortable: false },
      { label: 'Kelas', field: 'kelas_nama', sortable: false },
    ],
    rows: [],
    totalRows: 0,
  })

  const searchFilter = ref('')

  const filterSiswa = ref('')
  const filterSiswaNon = ref('')
  const classOption = ref([])

  const selectedGps = ref([])
  const selectedNonGps = ref([])

  function selectionChangedNonGps(params) {
    var finalArray = params.selectedRows.map(function (obj) {
      return obj.siswa_id;
    });
    selectedNonGps.value = finalArray
  }
  function selectionChangedGps(params) {
    var finalArray = params.selectedRows.map(function (obj) {
      return obj.siswa_id;
    });
    selectedGps.value = finalArray
  }

  function setGps(gps, del = '', rand = '') {
    request.post('siswa/pkl', QueryString.stringify({
      user_id: userId,
      ...(gps && {siswa_pkl: selectedGps.value}),
      ...(!gps && {siswa_non_pkl: selectedNonGps.value}),
      opsi:	gps ? "1" : "0",
      resetloc:	del,
      setloc:	rand,
    })).then(res => {
      useToast().success('Data Berhasil diubah!')
      getSiswaGps()
      getSiswaNonGps()
    })
  }
</script>

<template>
  <div class="row">
    <div class="col-5">
      <div class="card mb-5 mb-xxl-8">
        <div class="card-body py-6">
          <div class="py-6 d-flex justify-content-between align-items-center">
            <h2 class="fs-1 fw-bold">Skema Absensi - Absensi Non GPS</h2>
            
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
          <div>
            <div class="d-flex flex-wrap justify-content-between align-items-center">
              <div class="position-relative d-flex gap-4">
                <div>
                  <FilterSelect v-model:filterValue="filterSiswaNon"
                    @changeFilter="getSiswaNonGps()"
                    placeholder="Pilih Kelas">
                    <el-option v-for="kelas in classOption" :value="kelas.kelas_id" :label="kelas.kelas_nama">
                    </el-option>
                  </FilterSelect>
                </div>
              </div>
  
              <div class="d-flex gap-4">
                <a @click="setGps(0)" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <span>
                    Set Absen GPS
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div class="my-5 mb-xxl-8">
            <ServerSideTable 
              @selected-rows-change="selectionChangedNonGps"
              :totalRows="siswaNonGps.totalRows || 0" 
              :columns="siswaNonGps.columns" 
              :rows="siswaNonGps.rows"
              :select-options="{
                enabled: true,
                selectOnCheckboxOnly: false, // only select when checkbox is clicked instead of the row
                selectionInfoClass: 'custom-class',
                selectionText: 'rows selected',
                clearSelectionText: 'clear',
                disableSelectInfo: true, // disable the select info panel on top
                selectAllByGroup: true, 
              }"
              @loadItems="getSiswaNonGps">
            </ServerSideTable>
          </div>
        </div>
      </div>
    </div>
    <div class="col-7">
      <div class="card mb-5 mb-xxl-8">
        <div class="card-body py-6">
          <div class="py-6 d-flex justify-content-between align-items-center">
            <h2 class="fs-1 fw-bold">Skema Absensi - Absensi GPS</h2>
            
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
          <div>
            <div class="d-flex flex-wrap justify-content-between align-items-center">
              <div class="position-relative d-flex gap-4">
                <div>
                  <FilterSelect v-model:filterValue="filterSiswa"
                    @changeFilter="getSiswaGps"
                    placeholder="Pilih Kelas">
                    <el-option v-for="kelas in classOption" :value="kelas.kelas_id" :label="kelas.kelas_nama">
                    </el-option>
                  </FilterSelect>
                </div>
              </div>
  
              <div class="d-flex gap-4">
                <a @click="setGps(1, 1, 1)" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <span>
                    Lokasi Acak
                  </span>
                </a>
                <a @click="setGps(1, 1)" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <span>
                    Hapus Lokasi
                  </span>
                </a>
                <a @click="setGps(1)" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <span>
                    Set Absen Non GPS
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div class="my-5 mb-xxl-8">
            <ServerSideTable 
              @selected-rows-change="selectionChangedGps"
              :totalRows="siswaGps.totalRows || 0" 
              :columns="siswaGps.columns" 
              :rows="siswaGps.rows"
              :pagination-options="{
                enabled: false,
              }"
              :select-options="{
                enabled: true,
                selectOnCheckboxOnly: false, // only select when checkbox is clicked instead of the row
                selectionInfoClass: 'custom-class',
                selectionText: 'rows selected',
                clearSelectionText: 'clear',
                disableSelectInfo: true, // disable the select info panel on top
                selectAllByGroup: true, 
              }"
              @loadItems="getSiswaGps">
              <template #table-row="{column, row}">
                <div v-if="column.field == 'def_loc'">
                  {{row.def_loc ? 'Lokasi Acak' : 'Lokasi Tetap'}}
                </div>
              </template>
            </ServerSideTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>