<script setup>
  import { ref, onMounted, reactive } from "vue";
  import { request } from '@/util'
  import qs from 'qs'
  import Modal from "@/components/modals/CustomModal.vue";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import ServerSideTable from '@/components/ServerSideTable.vue'
  import FilterSelect from '@/components/filter-select'
  import { useToast } from "vue-toast-notification"
  import { deleteConfirmation } from "@/core/helpers/deleteconfirmation";
  import FormModal from './FormModal.vue'

  onMounted(() => {
    setCurrentPageBreadcrumbs("Kalender Akademik", ['Sekolah', "Akademik"]);
    getKelas()
  })

  function getKalender (payload) {
    request.post('libur', null, {
      params: {
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      kalender.rows = res.data.data.data
      kalender.totalRows = res.data.data.total
    })
  }
 
  function getKelas() {
    request.post('kelas', null, {
      params: {
      }
    }).then(res => {
      kelas.value = res.data.data
    })
  }

  const kelas = ref()
  const formMode = ref()
  const activeData = ref()

  const kalender = reactive({
    columns: [
      { label: 'Tanggal', field: 'libur_tanggal', sortable: false },
      { label: 'Kelas', field: 'kelas_nama', sortable: false },
      { label: 'Deskripsi', field: 'libur_desc', sortable: false },
      { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })


  function changeFilter(changed){
    console.log(changed)
  }

  function deleteData(id) {
    deleteConfirmation(function() {
      request.get('libur/delete/' + id)
      .then(res => {
        useToast().success('Data Berhasil Dihapus!')
        getKalender()
      })
    })
  }
  
  function handleClose() {
    formMode.value = null
    activeData.value = null
  }
  function handleSubmit() {
    formMode.value = null
    activeData.value = null
    getKalender()
  }
  function handleEdit(row) {
    formMode.value = 'Edit Data'
    activeData.value = row
  }
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body pt-5 pb-5">
        
        <!-- Page Content -->
        <div class="page-content">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6 m-0">Data Kalender Akademik</h2>

              <!-- <div>
                <FilterSelect v-model:filterValue="semesterFilter" :options="semesterOption" @changeFilter="changeFilter('semester')" placeholder="Pilih Semester" />
              </div>
              <div>
                <FilterSelect v-model:filterValue="statusFilter" :options="statusOption" @changeFilter="changeFilter('status')" placeholder="Pilih Status" />
              </div> -->
            </div>

            <div class="position-relative d-flex gap-3">
              <router-link to="/sekolah/akademik/kalender-akademik/import" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-cloud-arrow-down fs-1"></i>
                <span>
                  Import Data
                </span>
              </router-link>
              <a @click="formMode = 'Tambah Data'" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-plus fs-1"></i>
                <span>
                  Tambah Data
                </span>
              </a>
              <!-- <router-link to="/sekolah/akademik/kalender-akademik/tambah" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-plus fs-1"></i>
                <span>
                  Tambah Data
                </span>
              </router-link> -->
            </div>
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
        </div>
      </div>
      <div class="mb-5 mb-xxl-8 px-12">
        <ServerSideTable
          :totalRows="kalender.totalRows || 0"
          :columns="kalender.columns"
          :rows="kalender.rows"
          @loadItems="getKalender"
        >
          <template #table-row="{column, row}">
              <div v-if="column.field == 'thn_ajar_semester'">
                {{row.thn_ajar_semester[0].toUpperCase() + row.thn_ajar_semester.substring(1)}}
              </div>
              <div v-if="column.field == 'thn_ajar_status'">
                <span :class="'badge badge-light-' + (row.thn_ajar_status == 1 ? 'success' : 'danger')">{{row.thn_ajar_status == 1 ? 'Aktif' : 'Non Aktif'}}</span>
              </div>
              <div v-if="column.field == 'action'">
                <a @click="handleEdit(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </a>
                <!-- <router-link :to="`/sekolah/akademik/kalender-akademik/edit/${row.libur_id}`" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </router-link> -->
                <button @click="deleteData(row.libur_id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/general/gen027.svg"/>
                  </span>
                </button>
              </div>
            </template>
        </ServerSideTable>
      </div>
    </div>
    
		<FormModal
			:mode="formMode"
			:activeData="activeData"
      :kelas="kelas"
			@close="handleClose"
			@submit="handleSubmit" />
  </div>
</template>