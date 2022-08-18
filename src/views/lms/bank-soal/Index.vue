<script setup>
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import { onMounted, reactive, ref } from 'vue';
import FilterSelect from '@/components/filter-select/index.vue';
  import { Search } from '@element-plus/icons-vue'
import { request } from '@/util';
import ServerSideTable from '@/components/ServerSideTable.vue';
import FormModalQuestion from './FormModalQuestion'
import QueryString from 'qs';

onMounted(() => {
  setCurrentPageBreadcrumbs('Bank Soal', ['LMS'])
  getData()
})

const guruOption = ref()
const mapelOption = ref()

const guruFilter = ref()
const mapelFilter = ref()
const tipeFilter = ref()
const searchSoal = ref()

const mode = ref()
const activeData = ref()

const soal = reactive({
  columns: [
    { label: 'Mapel', field: 'mapel_nama', sortable: false },
    { label: 'Pertanyaan', field: 'question', sortable: false, width: '350px' },
    { label: 'Tags', field: 'tags', sortable: false },
    { label: 'Type', field: 'question_type', sortable: false },
    { label: 'Guru', field: 'user_nama', sortable: false },
    { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
  ],
  rows: [],
  totalRows: 0,
})

function getData() {
  request.post("user", null, {
    params: {
      level: 'guru'
    }
  }).then(res => {
    guruOption.value = res.data.data
  })
  request.post("mapel")
  .then(res => {
    mapelOption.value = res.data.data
  })
}
function getSoal(payload) {
  request.post("soal", QueryString.stringify({
    mapel: mapelFilter.value,
    user: guruFilter.value,
    question_type: tipeFilter.value,
    cari: searchSoal.value,
    page: payload?.page ?? 1,
  })).then(res => {
    soal.rows = res.data.data.data
    soal.totalRows = res.data.data.total
  })
}

function handleCloseForm() {
  mode.value = null
  activeData.value = null
}
function handleSubmitForm() {
  mode.value = null
  activeData.value = null
  getSoal()
}
function handleEditData(data) {
  mode.value = 'Edit Data'
  activeData.value = data
}
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body pt-5 pb-5">
        <div class="page-content">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6">Data Pertanyaan</h2>
            </div>
            <div class="d-flex gap-4">
              <a @click="mode = 'Tambah Data'" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-plus fs-1"></i>
                <span>
                  Tambah Soal
                </span>
              </a>
              <!-- <router-link :to="'/lms/bank-soal/tambah'" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-plus fs-1"></i>
                <span>
                  Tambah Soal
                </span>
              </router-link> -->
              <router-link to="/lms/bank-soal/import" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-cloud-arrow-down fs-1"></i>
                <span>
                  Import Soal
                </span>
              </router-link>
            </div>
          </div>
          <div class="separator border-2 border-black-50 my-6"></div>

          <!-- <div class="row g-4 mb-6">
            <div class="col-4">
              <div class="p-5 bg-primary rounded">
                <p class="fs-1 text-white">Soal Ditambahkan</p>
                <p class="display-5 text-white bg-light-primary d-inline-block p-3 rounded text-primary">90</p>
              </div>
            </div>
            <div class="col-4">
              <div class="p-5 bg-primary rounded">
                <p class="fs-1 text-white">Total Pilihan Ganda</p>
                <p class="display-5 text-white bg-light-primary d-inline-block p-3 rounded text-primary">90</p>
              </div>
            </div>
            <div class="col-4">
              <div class="p-5 bg-primary rounded">
                <p class="fs-1 text-white">Total Essay</p>
                <p class="display-5 text-white bg-light-primary d-inline-block p-3 rounded text-primary">90</p>
              </div>
            </div>
          </div> -->

          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <div>
                <FilterSelect v-model:filterValue="guruFilter" placeholder="Pilih Guru" @change="getSoal">
                  <el-option v-for="guru in guruOption" :value="guru.user_id" :label="guru.user_nama"></el-option>
                </FilterSelect>
              </div>
              <div>
                <FilterSelect v-model:filterValue="mapelFilter" placeholder="Pilih Mapel" @change="getSoal">
                  <el-option v-for="mapel in mapelOption" :value="mapel.mapel_id" :label="mapel.mapel_nama"></el-option>
                </FilterSelect>
              </div>
              <div>
                <FilterSelect v-model:filterValue="tipeFilter" placeholder="Pilih Tipe" @change="getSoal">
                  <el-option value="single" label="Single Option"></el-option>
                  <el-option value="essay" label="Essay"></el-option>
                </FilterSelect>
              </div>
            </div>

            <div class="d-flex w-100 w-lg-50 w-xl-25 gap-4">
              <!-- <el-input
                v-model="searchSoal"
                clearable
                class="p-2"
                placeholder="Cari Soal"
              >
                <template #append>
                  <el-button aria-disabled="true" class="pe-none" :icon="Search" />
                </template>
              </el-input> -->
            </div>
          </div>

          <div class="my-5 mb-xxl-8">
            <ServerSideTable
              :totalRows="soal.totalRows || 0" 
              :columns="soal.columns" 
              :rows="soal.rows"
              @loadItems="getSoal">
              <template #table-row="{column, row}">
                <div v-if="column.field == 'question'">
                  <p v-html="row.question_text"></p>
                </div>
                <div v-if="column.field == 'tags'">
                  <template v-for="tag in row.keterangan">
                    <span class="badge badge-success">{{tag}}</span>
                  </template>
                </div>
                <div v-if="column.field == 'action'">
                  <a @click="handleEditData(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                    <span class="svg-icon svg-icon-3">
                      <inline-svg src="media/icons/duotune/art/art005.svg" />
                    </span>
                  </a>
                  <!-- <router-link :to="'/lms/bank-soal/edit/' + row.question_id" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                    <span class="svg-icon svg-icon-3">
                      <inline-svg src="media/icons/duotune/art/art005.svg" />
                    </span>
                  </router-link> -->
                  <router-link :to="'/lms/bank-soal/detail/' + (row.question_id)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
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

    <FormModalQuestion 
      :mode="mode"
      :activeData="activeData"
      :guruOption="guruOption"
      :mapelOption="mapelOption"
      @close="handleCloseForm"
      @submit="handleSubmitForm"
    />
  </div>
</template> 