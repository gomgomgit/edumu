<script setup>
  import { ref, reactive, onMounted } from "vue";
  import { request } from '@/util'
  import Modal from "@/components/modals/CustomModal.vue";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import FilterSelect from '@/components/filter-select'
  import ServerSideTable from '@/components/ServerSideTable.vue'
  import QueryString from "qs";
  import { useToast } from "vue-toast-notification"
  import { deleteConfirmation } from "@/core/helpers/deleteconfirmation";
import { useRoute } from "vue-router";
  
  onMounted(() => {
    setCurrentPageBreadcrumbs("Data Kelas", ['Sekolah', "Akademik"]);
  })

  const route = useRoute()

  function getSiswaKelasData (payload) {
    request.post('kelas/datakelas', null, {
      params: {
        kelas: route.params.id,
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      siswaKelasData.rows = res.data.data.data
      siswaKelasData.totalRows = res.data.data.total
    })
  }

  const siswaKelasData = reactive({
    columns: [
      { label: 'Nama', field: 'user_nama', sortable: false },
      { label: 'NISN', field: 'siswa_nisn', sortable: false },
    ],
    rows: [],
    totalRows: 0,
  })

  function deleteData(id) {
    deleteConfirmation(function() {
      request.get('/kelas/delete/' + id)
        .then(res => {
          useToast().success('Data Berhasil Dihapus!')
          getSiswaKelasData()
        })
    })
  }
</script>

<template>
  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div class="d-flex gap-4">
            <h2 class="fs-1 fw-bold py-6">Data Siswa Kelas</h2>
          </div>

          <!-- <div class="position-relative d-flex ">
            <a @click.prevent="modalData = 'Tambah Data'" href="#" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
              <i class="bi bi-plus fs-1"></i>
              <span>
                Tambah Kelas
              </span>
            </a>
          </div> -->
        </div>
        <div class="mb-5 mb-xxl-8">
          <ServerSideTable
            :totalRows="siswaKelasData.totalRows || 0"
            :columns="siswaKelasData.columns"
            :rows="siswaKelasData.rows"
            @loadItems="getSiswaKelasData"
          >
            <template #table-row="{column, row}">
              <div v-if="column.field == 'shift'">
                {{row.shift.name}} <span class="badge badge-primary ms-4">{{row.shift.start}} - {{row.shift.end}}</span>
              </div>
              <div v-if="column.field == 'kelas_status'">
                <span :class="'badge badge-light-' + (row.kelas_status == 1 ? 'success' : 'danger')">{{row.kelas_status == 1 ? 'Aktif' : 'Non Aktif'}}</span>
              </div>
            </template>
          </ServerSideTable>
        </div>
      </div>
    </div>
  </div>
</template>