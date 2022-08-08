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
import moment from "moment";

  onMounted(() => {
    setCurrentPageBreadcrumbs("Guru", ["Absensi", "Rekapitulasi"]);
    getData()
  })
  
  const reportGuru = reactive({
    columns: [
      { label: 'Nama Lengkap', field: 'user_nama', sortable: false },
      { label: 'Hadir', field: 'tot.hadir', sortable: false },
      { label: 'Telat', field: 'tot.telat', sortable: false },
      { label: 'Izin', field: 'tot.izin', sortable: false },
      { label: 'Alpha', field: 'tot.alpha', sortable: false },
      { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })

  const userOption = ref([])

  const userFilter = ref('')
  const dateRangeStart = ref(moment().format('YYYY-MM-DD'))
  const dateRangeEnd = ref(moment().format('YYYY-MM-DD'))
  
  function getReportGuru (payload) {
    request.post('reportguru', null, {
      params: {
        user: userFilter.value,
        tglMulai: dateRangeStart.value,
        tglEnd: dateRangeEnd.value,
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      reportGuru.rows = res.data.data.data
      reportGuru.totalRows = res.data.data.total
    })
  }

  function getData() {
    request.post('user', null, {
      params: {
        level: 'guru'
      }
    })
    .then(res => {
      userOption.value = res.data.data
    })
  }
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6">Data Absensi Guru</h2>
            </div>

            <div class="position-relative d-flex gap-4">
              <div class="d-flex align-items-center">
                <router-link :to="{
                    path: '/absensi/rekapitulasi/guru/export',
                    query: {
                      level:'guru',user: userFilter, tglMulai: dateRangeStart, tglEnd: dateRangeEnd
                    }
                  }" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <span>
                    Export
                  </span>
                  <i class="bi bi-cloud-arrow-up fs-1"></i>
                </router-link>
              </div>
              <div class="d-flex align-items-center">
                <a @click="getReportGuru" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
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
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-4">
            <div class="d-flex align-items-center gap-4">
              <el-date-picker
                v-model="dateRangeStart"
                type="date"
                placeholder="Range Tanggal awal"
                size="large"
                value-format="YYYY-MM-DD"
                @change="getReportGuru"
              />
              <el-date-picker
                v-model="dateRangeEnd"
                type="date"
                placeholder="Range Tanggal akhir"
                size="large"
                value-format="YYYY-MM-DD"
                @change="getReportGuru"
              />
            </div>

            <div class="d-flex align-items-center">
              <FilterSelect v-model:filterValue="userFilter" placeholder="Pilih Guru" @changeFilter="getReportGuru()">
                <el-option
                  v-for="user, index in userOption"
                  :key="user.user_id"
                  :label="user.user_nama"
                  :value="user.user_id"
                />
              </FilterSelect>
            </div>
          </div>
        </div>
        <div class="my-5 mb-xxl-8">
          <ServerSideTable 
            :key="searchSiswa"
            :totalRows="reportGuru.totalRows || 0" 
            :columns="reportGuru.columns" 
            :rows="reportGuru.rows"
            @loadItems="getReportGuru">
            <template #table-row="{column, row}">
              <div v-if="column.field == 'action'">
                <router-link :to="`/absensi/rekapitulasi/guru/detail/${row.guru_id}/${dateRangeStart}/${dateRangeEnd}`" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
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