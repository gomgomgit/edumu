<script setup>
  import { computed, onMounted, reactive, ref } from "vue";
  import ServerSideTable from "@/components/ServerSideTable.vue";
  import FilterSelect from "@/components/filter-select";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import { request } from "@/util";
import QueryString from "qs";
import { useToast } from "vue-toast-notification";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
  
  onMounted(() => {
    setCurrentPageBreadcrumbs("Penetapan Iuran", ['Iuran', 'Master Iuran']);
    getDataTetapan()
    getKelas()
  })
  const route = useRoute()

  const store = useStore()
  const userId = store.getters.currentUser.user_id 
  const masterId = route.params.id
  const groupName = route.params.group

  function getKelas () {
    request.post('kelas', null, {
      params: {
      }
    }).then(res=>{
      kelas.value = res.data.data
    })
  }
  
  function getDataTetapan (payload) {
    request.get('iuran/penetapan_master', {
      params: {
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC',
        kelas_id: kelasTetapan.value ?? '',
        finance_id: masterId
      }
    }).then(res => {
      dataSiswaBelum.rows = res.data.data

      dataSiswaSudah.rows = res.data.data_tetapan
    }).catch(err => {
      dataSiswaBelum.rows = []

      dataSiswaSudah.rows = []
    })

  }
  
  const dataSiswaBelum = reactive({
    columns: [
      { label: 'Siswa', field: 'user_nama', sortable: false },
    ],
    rows: [],
    totalRows: 0,
  })

  const selectedBelum = ref([])
  const selectedSudah = ref([])

  const dataSiswaSudah = reactive({
    columns: [
      { label: 'Siswa', field: 'user_nama', sortable: false },
    ],
    rows: [],
    totalRows: 0,
  })

  const tahunAjar = ref('')
  const kelas = ref([])
  const kelasTetapan = ref('')

  const filterkelas = ref('')

  function changeKelas() {
    getDataTetapan()
  }

  function tetapkan() {
    request.post('/siswa/finance/add', QueryString.stringify({
      finance_id: masterId,
      finance_tipe: 'iuran',
      created_by: userId,
      siswa_id: selectedBelum.value
    }))
      .then(res => {
        useToast().success('Berhasil Ditetapkan!')
        getDataTetapan()
      })
  }
  function kembalikan() {
    request.post('/siswa/finance/delete', QueryString.stringify({
      finance_id: masterId,
      finance_tipe: 'iuran',
      created_by: userId,
      siswa_id: selectedSudah.value
    }))
      .then(res => {
        useToast().success('Berhasil Dikembalikan!')
        getDataTetapan()
      })
  }
  function selectionChangedSiswaBelum(params) {
    var finalArray = params.selectedRows.map(obj => {
      return obj.siswa_id
    })
    selectedBelum.value = finalArray
  }
  function selectionChangedSiswaSudah(params) {
    var finalArray = params.selectedRows.map(obj => {
      return obj.siswa_id
    })
    selectedSudah.value = finalArray
  }

</script>

<template>
  <div class="row g-8">
    <div class="col-12">
      <div class="card">
        <div class="card-body pt-5 pb-5">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="fs-2">Master Iuran</h2>
              <div class="d-flex gap-6">
                <div class="w-100px">
                  <h2 class="fs-4">Nama Grup </h2>
                </div>
                <div class="">
                  <h2 class="fs-4">: {{groupName}} </h2>
                </div>
              </div>
            </div>
            <div class="d-flex gap-6 align-items-center">
                <FilterSelect v-model:filterValue="kelasTetapan" @changeFilter="changeKelas"
                  placeholder="Filter Kelas">
                  <el-option v-for="item, index in kelas" :key="index" :label="item.kelas_nama"
                    :value="item.kelas_id" />
                </FilterSelect>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-6">
      <div class="card mb-5 mb-xxl-8">
        <div class="card-body pt-5 pb-5">
          <div class="d-flex justify-content-between align-items-center py-4">
            <div>
              <h2 class="fs-1">Data Siswa</h2>
              <p class="text-black-50 fw-bold m-0">Belum Ditetapkan</p>
            </div>
            
            <div class="position-relative d-flex ">
              <a @click.prevent="tetapkan" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <span>
                  Tetapkan
                </span>
              </a>
            </div>
          </div>
          <div class="separator border-black-50 border-3 my-4"></div>
          <div class="page-content">
            <div class="mb-5 mb-xxl-8">
              <ServerSideTable 
                @selected-rows-change="selectionChangedSiswaBelum"
                :paginationOptions="{enabled: false}"
                :totalRows="dataSiswaBelum.totalRows || 0" 
                :columns="dataSiswaBelum.columns"
                :select-options="{
                  enabled: true,
                  selectOnCheckboxOnly: false, // only select when checkbox is clicked instead of the row
                  selectionInfoClass: 'custom-class',
                  selectionText: 'rows selected',
                  clearSelectionText: 'clear',
                  disableSelectInfo: true, // disable the select info panel on top
                  selectAllByGroup: true, 
                }"
                :rows="dataSiswaBelum.rows" @loadItems="getDataTetapan">
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
    <div class="col-12 col-lg-6">
      <div class="card mb-5 mb-xxl-8">
        <div class="card-body pt-5 pb-5">
          <div class="d-flex justify-content-between align-items-center py-4">
            <div>
              <h2 class="fs-1">Data Siswa</h2>
              <p class="text-black-50 fw-bold m-0">Sudah Ditetapkan</p>
            </div>
            
            <div class="position-relative d-flex ">
              <a @click.prevent="kembalikan" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <span>
                  Kembalikan
                </span>
              </a>
            </div>
          </div>
          <div class="separator border-black-50 border-3 my-4"></div>
          <div class="page-content">
            <div class="mb-5 mb-xxl-8">
              <ServerSideTable 
                @selected-rows-change="selectionChangedSiswaSudah"
                :paginationOptions="{enabled: false}"
                :totalRows="dataSiswaSudah.totalRows || 0" 
                :columns="dataSiswaSudah.columns"
                :select-options="{
                  enabled: true,
                  selectOnCheckboxOnly: false, // only select when checkbox is clicked instead of the row
                  selectionInfoClass: 'custom-class',
                  selectionText: 'rows selected',
                  clearSelectionText: 'clear',
                  disableSelectInfo: true, // disable the select info panel on top
                  selectAllByGroup: true, 
                }"
                :rows="dataSiswaSudah.rows" @loadItems="getDataTetapan">
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
  </div>
</template>