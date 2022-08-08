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
    setCurrentPageBreadcrumbs("Kategori", ['LMS', 'Ujian Online']);
  })

  const formMode = ref()
  const activeData = ref()

  const kategori = reactive({
    columns: [
      { label: 'Nama Kategori', field: 'exam_cat_name', sortable: false },
      { label: 'Ujian/Tugas', field: 'exam_cat_type', sortable: false },
      { label: 'Status', field: 'status', sortable: false, width: '150px' },
      { label: 'ACTION', field: 'action', sortable: false, width: '100px' },
    ],
    rows: [],
    totalRows: 0,
  })
  
  function getKategori (payload) {
    request.post('examkat', null, {
      params: {
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      kategori.rows = res.data.data.data
      kategori.totalRows = res.data.data.total
    })
  }

  function handleEditData(data) {
    formMode.value = "Edit Data"
    activeData.value = data
    console.log(data)
  }
  function handleFormClose() {
    formMode.value = ""
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
              <h2 class="fs-1 fw-bold py-6 m-0">Data Kategori Ujian</h2>
            </div>

            <div class="position-relative d-flex ">
              <a @click="formMode = 'Tambah Data'" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-plus fs-1"></i>
                <span>
                  Tambah Kategori Ujian
                </span>
              </a>
            </div>
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
        </div>
      </div>
      <div class="mb-5 mb-xxl-8 px-12">
        <ServerSideTable
          :totalRows="kategori.totalRows || 0"
          :columns="kategori.columns"
          :rows="kategori.rows"
          @loadItems="getKategori"
        >
          <template #table-row="{column, row}">
              <div v-if="column.field == 'thn_ajar_semester'">
                {{row.thn_ajar_semester[0].toUpperCase() + row.thn_ajar_semester.substring(1)}}
              </div>
              <div v-if="column.field == 'status'">
                <span :class="'badge badge-light-' + (row.exam_cat_status == 1 ? 'success' : 'danger')">{{row.thn_ajar_status == 1 ? 'Aktif' : 'Non Aktif'}}</span>
              </div>
              <div v-if="column.field == 'action'">
                <button @click="handleEditData(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
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
			@close="handleFormClose"
			@submit="getKategori()" />
  </div>
</template>