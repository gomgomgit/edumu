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

  onMounted(() => {
    setCurrentPageBreadcrumbs("Rapor", ['Sekolah', "E-Document"]);
    getClass()
  })

  function getRapor (payload) {
      request.post('arsip', null, {
        params: {
          arsipType: 'rapor',
          cari: searchFilter.value,
          participant_id: classFilter.value,
          page: payload?.page ?? 1,
          sortby: payload?.sort?.type ?? 'ASC'
        }
      }).then(res => {
        console.log(res.data.data)
        rapor.rows = res.data.data.arsip.data
        rapor.totalRows = res.data.data.arsip.total

        notRapor.rows = res.data.data.notArsip
      })
    }
  function getClass (payload) {
      request.post('kelas')
      .then(res => {
        classOption.value = res.data.data
      })
    }


  const rapor = reactive({
    columns: [
      { label: 'Nama Siswa', field: 'user_nama', sortable: false },
      { label: 'Nama File', field: 'file_name', sortable: false },
      { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })
  const notRapor = reactive({
    columns: [
      { label: 'Nama Siswa', field: 'user_nama', sortable: false }
    ],
    rows: [],
    totalRows: 0,
  })

  const searchFilter = ref('')
  const classFilter = ref('')
  const classOption = ref([])

  function deleteRapor(id) {
    deleteConfirmation(function() {
      request.get('arsip/delete/' + id)
      .then(res => {
        useToast().success('Rapor Berhasil Dihapus!')
        getTableData()
      })
    })
  }
</script>

<template>
  <div class="row">
    <div class="col-7">
      <div class="card mb-5 mb-xxl-8">
        <div class="card-body py-6">
          <div class="py-6 d-flex justify-content-between align-items-center">
            <h2 class="fs-1 fw-bold">Sudah Upload</h2>
            
            <div>
              <router-link to="/sekolah/e-document/tambah-rapor"
                class="btn btn-primary d-flex gap-3 align-items-center w-auto w-lg-100">
                <i class="bi bi-plus fs-1 p-0"></i>
                <span class="d-none d-lg-inline">
                  Upload Rapor
                </span>
              </router-link>
            </div>
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
          <div>
            <div class="d-flex flex-wrap justify-content-between align-items-center">
              <div class="position-relative d-flex gap-4">
                <div>
                  <FilterSelect v-model:filterValue="classFilter"
                    @changeFilter="getRapor()"
                    placeholder="Pilih Kelas">
                    <el-option v-for="kelas in classOption" :value="kelas.kelas_id" :label="kelas.kelas_nama">
                    </el-option>
                  </FilterSelect>
                </div>
              </div>
  
              <div class="d-flex gap-4">
                <div>
                  <el-input
                    @input="getRapor"
                    v-model="searchFilter"
                    class="m-2"
                    placeholder="Cari Nama"
                    :suffix-icon="Search"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="my-5 mb-xxl-8">
            <ServerSideTable 
              :totalRows="rapor.totalRows || 0" 
              :columns="rapor.columns" 
              :rows="rapor.rows"
              @loadItems="getRapor">
              <template #table-row="{column, row}">
                <div v-if="column.field == 'arsipFile'">
                  <span v-if="!row.arsipFile[0]" class="badge badge-light-danger">
                    File Kosong
                  </span>
                  <template v-if="row.arsipFile[0]" v-for="arsip in row.arsipFile">
                    <div>
                      <span class="badge badge-light-success">
                        {{arsip.arsip_cat_name}}
                      </span>
                    </div>
                  </template>
                </div>
                <div v-if="column.field == 'action'">
                  <div class="d-flex gap-2">
                    <a :href="row.file_url" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
                      <span class="svg-icon svg-icon-3">
                        <i class="bi bi-cloud-arrow-down-fill fs-3"></i>
                      </span>
                    </a>
                    <button @click="deleteRapor(row.id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                      <span class="svg-icon svg-icon-3">
                        <inline-svg src="media/icons/duotune/general/gen027.svg" />
                      </span>
                    </button>
                  </div>
                </div>
              </template>
            </ServerSideTable>
          </div>
        </div>
      </div>
    </div>
    <div class="col-5">
      <div class="card mb-5 mb-xxl-8">
        <div class="card-body py-6">
          <div class="py-6 d-flex justify-content-between align-items-center">
            <h2 class="fs-1 fw-bold">Belum Upload</h2>
            
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
          <div class="my-5 mb-xxl-8">
            <ServerSideTable 
              :totalRows="notRapor.totalRows || 0" 
              :columns="notRapor.columns" 
              :rows="notRapor.rows"
              :pagination-options="{
                enabled: false,
              }"
              @loadItems="getRapor">
            </ServerSideTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>