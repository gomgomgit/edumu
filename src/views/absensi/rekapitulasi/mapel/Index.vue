<script setup>
  import { ref, onMounted, reactive } from "vue";
  import { request } from '@/util'
  import Modal from "@/components/modals/CustomModal.vue";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import { deleteConfirmation } from "@/core/helpers/deleteconfirmation";
  import ServerSideTable from '@/components/ServerSideTable.vue'
  import FilterSelect from '@/components/filter-select'
  import { Search } from '@element-plus/icons-vue'
  import QueryString from 'qs';
  import { useToast } from 'vue-toast-notification';
  import ChangePassword from "@/components/change-password/Index.vue";
import * as XLSX from 'xlsx';
import moment from "moment";
import Swal from "sweetalert2";

  onMounted(() => {
    setCurrentPageBreadcrumbs("Mapel", ["Absensi", "Rekapitulasi"]);
    getData()
  })
  
  const reportMapel = reactive({
    columns: [
      { label: 'Nama Guru', field: 'user_nama', sortable: false },
      { label: 'Kelas', field: 'kelas_nama', sortable: false },
      { label: 'Mapel', field: 'mapel_nama', sortable: false },
      { label: 'Siswa Hadir', field: 'siswa_hadir', sortable: false },
      { label: 'Siswa Tdk Hadir', field: 'siswa_off', sortable: false },
      { label: 'Tgl Mengajar', field: 'pg_create_date', sortable: false },
      { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })

  const kelasOption = ref([])
  const mapelOption = ref([])
  const guruOption = ref([])

  const searchMapel = ref('')
  const kelasFilter = ref('')
  const mapelFilter = ref('')
  const guruFilter = ref('')
  const dateRangeStart = ref(moment().format('YYYY-MM-DD'))
  const dateRangeEnd = ref(moment().format('YYYY-MM-DD'))
  
  function getReportMapel (payload) {
    request.post('reportmapel', null, {
      params: {
        cari: searchMapel.value,
        user: guruFilter.value,
        mapel: mapelFilter.value,
        kelas: kelasFilter.value,
        tglMulai: dateRangeStart.value,
        tglEnd: dateRangeEnd.value,
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      reportMapel.rows = res.data.data.data
      reportMapel.totalRows = res.data.data.total
    })
  }

  function getData() {
    request.post('user', null, {params: {level: 'guru'}})
    .then(res => {
      guruOption.value = res.data.data
    })
    request.post('kelas', null)
    .then(res => {
      kelasOption.value = res.data.data
    })
    request.post('mapel', null)
    .then(res => {
      mapelOption.value = res.data.data
    })
  }

  function exportData() {
    if (reportMapel.rows.length > 0) {
      generateExcel()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Tidak ada data!'
      })
    }
  }

  function generateExcel() {
    let row = [["Nama Guru","Kelas","Mapel", "Siswa Hadir", "Siswa tidak hadir", "Tanggal"]]

    reportMapel.rows.map((item,i) => {
      row.push([
          item.user_nama,
          item.kelas_nama,
          item.mapel_nama,
          item.siswa_hadir,
          item.siswa_off,
          item.pg_create_date,
      ])
		})

    const data = XLSX.utils.aoa_to_sheet(row)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, data, 'Report')

    var fileName = 'Rekap Data Presensi Mapel per ' 
    XLSX.writeFile(wb, fileName + moment().format("DD-MMMM-YYYY") +".xlsx")
  }
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6">Data Absensi Mapel</h2>
            </div>

            <div class="position-relative d-flex gap-4">
              <div class="d-flex align-items-center">
                <a @click="exportData()" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <span>
                    Export
                  </span>
                  <i class="bi bi-cloud-arrow-up fs-1"></i>
                </a>
              </div>
              <div class="d-flex align-items-center">
                <a @click="getReportMapel" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <span>
                    Sync
                  </span>
                  <i class="bi bi-arrow-repeat fs-1"></i>
                </a>
              </div>
            </div>
          </div>                   
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div>
          <div class="d-flex flex-wrap justify-content-between gap-4">
            <div class="d-flex flex-column gap-4">
              <div class="d-flex align-items-center gap-4">
                <FilterSelect v-model:filterValue="guruFilter" placeholder="Pilih Guru" @changeFilter="getReportMapel()">
                  <el-option
                    v-for="guru in guruOption"
                    :key="guru.user_id"
                    :label="guru.user_nama"
                    :value="guru.user_id"
                  />
                </FilterSelect>
                <FilterSelect v-model:filterValue="mapelFilter" placeholder="Pilih Mapel" @changeFilter="getReportMapel()">
                  <el-option
                    v-for="mapel in mapelOption"
                    :key="mapel.mapel_id"
                    :label="mapel.mapel_nama"
                    :value="mapel.mapel_id"
                  />
                </FilterSelect>
                <FilterSelect v-model:filterValue="kelasFilter" placeholder="Pilih Kelas" @changeFilter="getReportMapel()">
                  <el-option
                    v-for="kelas in kelasOption"
                    :key="kelas.kelas_id"
                    :label="kelas.kelas_nama"
                    :value="kelas.kelas_id"
                  />
                </FilterSelect>
              </div>

              <div class="d-flex align-items-center gap-4">
                <el-date-picker
                  v-model="dateRangeStart"
                  type="date"
                  placeholder="Range Tanggal awal"
                  size="large"
                  value-format="YYYY-MM-DD"
                  @change="getReportMapel"
                />
                <el-date-picker
                  v-model="dateRangeEnd"
                  type="date"
                  placeholder="Range Tanggal akhir"
                  size="large"
                  value-format="YYYY-MM-DD"
                  @change="getReportMapel"
                />
              </div>
            </div>
            
            <div class="d-flex w-100 w-lg-50 w-xl-25 gap-4">
              <div>
                <el-input
                  v-model="searchMapel"
                  @input="getReportMapel"
                  clearable
                  class="m-2"
                  placeholder="Cari Mapel"
                >
                  <template #append>
                    <el-button aria-disabled="true" class="pe-none" :icon="Search" />
                  </template>
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="my-5 mb-xxl-8">
          <ServerSideTable 
            :key="searchMapel"
            :totalRows="reportMapel.totalRows || 0" 
            :columns="reportMapel.columns" 
            :rows="reportMapel.rows"
            @loadItems="getReportMapel">
            <template #table-row="{column, row}">
              <div v-if="column.field == 'action'">
                <router-link :to="'/absensi/rekapitulasi/mapel/detail/' + row.pg_id" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/files/fil001.svg" />
                  </span>
                </router-link>
              </div>
            </template>
          </ServerSideTable>
        </div>
      </div>
    </div>
  </div>
</template>