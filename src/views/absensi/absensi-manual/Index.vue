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
import moment from "moment";
import FormModal from'./FormModal'

  onMounted(() => {
    setCurrentPageBreadcrumbs("Absensi Manual", ["Absensi"]);
    getClass()
  })

  function getManualSiswa (payload) {
    request.post('reportnottaken', null, {
      params: {
        level: 'siswa',
        siswa: filterSiswa.value,
        kelas: filterKelasSiswa.value,
        dateStart: filterDateSiswaStart.value,
        dateEnd: filterDateSiswaEnd.value,
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
        manualSiswa.rows = res.data.data.data
        manualSiswa.totalRows = res.data.data.total
    }).catch(err => {
        manualSiswa.rows = []
        manualSiswa.tot = 0
    })
  }
  function getManualGuru (payload) {
    request.post('reportnottaken', null, {
      params: {
        level: 'guru',
        guru: filterGuru.value,
        dateStart: filterDateGuruStart.value,
        dateEnd: filterDateGuruEnd.value,
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      manualGuru.rows = res.data.data.data
      manualGuru.totalRows = res.data.data.total
    }).catch(err => {
      manualGuru.rows = []
      manualGuru.totalRows = 0
    })
  }
  function getClass (payload) {
    request.post('kelas')
    .then(res => {
      classOption.value = res.data.data
    })
  }


  const manualSiswa = reactive({
    columns: [
      { label: 'Nama Siswa', field: 'name', sortable: false },
      { label: 'Tipe', field: 'type', sortable: false },
      { label: 'Tanggal', field: 'date', sortable: false },
      { label: 'Action', field: 'action', sortable: false },
    ],
    rows: [],
    totalRows: 0,
  })
  const manualGuru = reactive({
    columns: [
      { label: 'Nama Guru', field: 'name', sortable: false },
      { label: 'Tipe', field: 'type', sortable: false },
      { label: 'Tanggal', field: 'date', sortable: false },
      { label: 'Action', field: 'action', sortable: false },
    ],
    rows: [],
    totalRows: 0,
  })

  const activeData = ref()
  const formMode = ref()

  const filterSiswa = ref('')
  const filterKelasSiswa = ref('')
  const filterGuru = ref('')
  const classOption = ref([])

  const filterDateSiswaStart = ref(moment().format('YYYY-MM-DD'))
  const filterDateSiswaEnd = ref(moment().format('YYYY-MM-DD'))
  const filterDateGuruStart = ref(moment().format('YYYY-MM-DD'))
  const filterDateGuruEnd = ref(moment().format('YYYY-MM-DD'))

  function handleSubmit() {
    getManualSiswa()
    getManualGuru()
    activeData.value = {}
    formMode.value = ''
  }
  
  function handleEdit (row) {
    console.log(row)
    activeData.value = row
    formMode.value = 'Edit Data'
  }
  function handleFormClose (row) {
    activeData.value = {}
    formMode.value = ''
  }
</script>

<template>
<div>
  <div class="row">
    <div class="col-12 col-lg-6">
      <div class="card mb-5 mb-xxl-8">
        <div class="card-body py-6">
          <div class="py-6 d-flex justify-content-between align-items-center">
            <h2 class="fs-1 fw-bold">Data Siswa</h2>
            
            <FilterSelect v-model:filterValue="filterKelasSiswa"
              @changeFilter="getManualSiswa"
              placeholder="Pilih Kelas">
              <el-option v-for="kelas in classOption" :value="kelas.kelas_id" :label="kelas.kelas_nama">
              </el-option>
            </FilterSelect>
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
          <div>
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-4">
              <div class="d-flex w-100 gap-4">
                  <el-input
                    v-model="filterSiswa"
                    @input="getManualSiswa"
                    clearable
                    class=""
                    placeholder="Cari Siswa"
                  >
                    <template #append>
                      <el-button aria-disabled="true" class="pe-none" :icon="Search" />
                    </template>
                  </el-input>
              </div>
              
              <div class="d-flex w-100 justify-content-end gap-4">
                <el-date-picker
                  v-model="filterDateSiswaStart"
                  type="date"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  value-format="YYYY-MM-DD"
                  :default-time="defaultTime"
                  :clearable="false"
                  @change="getManualSiswa()"
                />
                <el-date-picker
                  v-model="filterDateSiswaEnd"
                  type="date"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  value-format="YYYY-MM-DD"
                  :default-time="defaultTime"
                  :clearable="false"
                  @change="getManualSiswa()"
                />
              </div>
            </div>
          </div>
          <div class="my-5 mb-xxl-8">
            <ServerSideTable 
              @selected-rows-change="selectionChangedGps"
              :totalRows="manualSiswa.totalRows || 0" 
              :columns="manualSiswa.columns" 
              :rows="manualSiswa.rows"
              @loadItems="getManualSiswa">
              <template #table-row="{column, row}">
                <div v-if="column.field == 'type'">
                  <span :class="`badge badge-light-${row.type == 'in' ? 'success' : 'danger'}`">{{row.type}}</span>
                </div>
                <div v-if="column.field == 'action'">
                  <a @click="handleEdit(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                    <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                    </span>
                  </a>
                </div>
              </template>
            </ServerSideTable>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-6">
      <div class="card mb-5 mb-xxl-8">
        <div class="card-body py-6">
          <div class="py-6 d-flex justify-content-between align-items-center">
            <h2 class="fs-1 fw-bold">Data Guru</h2>
            
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
          <div>
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-4">
              <div class="d-flex w-100 gap-4">
                  <el-input
                    v-model="filterGuru"
                    @input="getManualGuru"
                    clearable
                    class=""
                    placeholder="Cari Guru"
                  >
                    <template #append>
                      <el-button aria-disabled="true" class="pe-none" :icon="Search" />
                    </template>
                  </el-input>
              </div>
              
              <div class="d-flex w-100 justify-content-end gap-4">
                <el-date-picker
                  v-model="filterDateGuruStart"
                  type="date"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  value-format="YYYY-MM-DD"
                  :default-time="defaultTime"
                  :clearable="false"
                  @change="getManualGuru()"
                />
                <el-date-picker
                  v-model="filterDateGuruEnd"
                  type="date"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  value-format="YYYY-MM-DD"
                  :default-time="defaultTime"
                  :clearable="false"
                  @change="getManualGuru()"
                />
              </div>
            </div>
          </div>
          <div class="my-5 mb-xxl-8">
            <ServerSideTable 
              :totalRows="manualGuru.totalRows || 0" 
              :columns="manualGuru.columns" 
              :rows="manualGuru.rows"
              @loadItems="getManualGuru">
              <template #table-row="{column, row}">
                <div v-if="column.field == 'type'">
                  <span :class="`badge badge-light-${row.type == 'in' ? 'success' : 'danger'}`">{{row.type}}</span>
                </div>
                <div v-if="column.field == 'action'">
                  <a @click="handleEdit(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                    <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                    </span>
                  </a>
                </div>
              </template>
            </ServerSideTable>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <FormModal 
    :mode="formMode"
    :activeData="activeData"
    @close="handleFormClose"
    @submit="handleSubmit()" />
</div>
</template>