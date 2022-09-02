<script setup>
  import { ref, reactive, onMounted } from "vue";
  import Datatable from "@/components/kt-datatable/KTDatatable.vue";
  import Modal from "@/components/modals/CustomModal.vue";
  import ServerSideTable from "@/components/ServerSideTable.vue";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import FilterSelect from '@/components/filter-select'
  import { request } from "@/util";
import QueryString from "qs";
import { useToast } from "vue-toast-notification";
import { deleteConfirmation } from "@/core/helpers/deleteconfirmation";
  
  onMounted(() => {
    setCurrentPageBreadcrumbs("Wali Kelas", ['Sekolah', "Akademik"]);
    getListAddData()
  })

  function getWaliKelas (payload) {
    request.post('listwalikelas', null, {
      params: {
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      waliKelas.rows = res.data.data.data
      waliKelas.totalRows = res.data.data.total
    })
  }
  function getListAddData (payload) {
    request.post('listwali_kelas', null, {
      params: {
        locale: 'id',
        platfrom: 'web',
      }
    }).then(res => {
      listWK.value = res.data.data
    })
    request.post('list_kelas', null, {
      params: {
        locale: 'id',
        platfrom: 'web',
      }
    }).then(res => {
      listKls.value = res.data.data
    })
    request.post('thn_ajar')
    .then(res => {
      var listtahunajar = res.data.data.map(item => {
          return item.thn_ajar_value
        }
      )
      var filtered = listtahunajar.filter((v, i, a) => a.indexOf(v) === i);
      listTahun.value = filtered
    })
  }

  const waliKelas = reactive({
    columns: [
      {label: 'Guru', field: 'user_nama', sortable: false},
      {label: 'Kelas', field: 'kelas_nama', sortable: false},
      {label: 'Tahun Ajar', field: 'thn_ajar', sortable: false},
      { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })

  const semester = ref('')
  const status = ref('')

  const listWK = ref([])
  const listKls = ref([])
  const listTahun = ref([])

  const modalData = ref(false)

  const semesterOption = ref([
    {
      label: 'Ganjil',
      value: 'ganjil'
    },
    {
      label: 'Genap',
      value: 'genap'
    },
  ])
  const statusOption = ref([
    {
      label: 'Aktif',
      value: 1
    },
    {
      label: 'Non Aktif',
      value: 0
    },
  ])

  const initialFormData = {wk_status: '', wk_id: '', thn_ajar: '', user_id: '', kelas_id: ''}

  const formData = reactive({...initialFormData})

  function addData() {
    request.post(modalData.value == 'Tambah Data' ? '/add_walikelas' : 'edit_walikelas', QueryString.stringify(formData))
      .then(res => {
        useToast().success(modalData.value == 'Tambah Data' ? 'Data Berhasil Ditambahkan!' : 'Data Berhasil Diperbaharui!')
        Object.assign(formData, initialFormData)
        getWaliKelas()
        modalData.value = null
      })
  }

  function closeModalData() {
    modalData.value = '',
    Object.assign(formData, initialFormData)
  }

  function editData(data) {
    formData.wk_status = data.wk_status
    formData.wk_id = data.wk_id
    formData.thn_ajar = data.thn_ajar
    formData.user_id = data.user_id
    formData.kelas_id = data.kelas_id
    modalData.value = 'Edit Data'
  }
  function deleteData(id) {
    deleteConfirmation(() => {
      request.get('walikelas/delete/' + id)
      .then(res => {
        useToast().success('Berhasil Hapus Data')
        getWaliKelas()
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
          <h2 class="fs-1 fw-bold py-6">Data Wali Kelas</h2>
          <!-- <div>
            <FilterSelect v-model:filterValue="semester" :options="semesterOption" placeholder="Pilih Semester"></FilterSelect>
          </div>
          <div>
            <FilterSelect v-model:filterValue="status" :options="statusOption" placeholder="Pilih Status"></FilterSelect>
          </div> -->
        </div>

        <div class="position-relative d-flex ">
          <a @click.prevent="modalData = 'Tambah Data'" href="#" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
            <i class="bi bi-plus fs-1"></i>
            <span>
              Wali Kelas
            </span>
          </a>
        </div>
      </div>
      <div class="mb-5 mb-xxl-8">
        <ServerSideTable
          :totalRows="waliKelas.totalRows || 0"
          :columns="waliKelas.columns"
          :rows="waliKelas.rows"
          @loadItems="getWaliKelas"
        >
          <template #table-row="{column, row}">
              <div v-if="column.field == 'action'">
                <button @click="editData(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </button>
                <button @click="deleteData(row.wk_id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/general/gen027.svg"/>
                  </span>
                </button>
              </div>
            </template>
        </ServerSideTable>
      </div>

      
      <Modal 
        :title="modalData" 
        :breadcrumb="Array('Sekolah', 'Akademik', 'Data Kelas', modalData)" 
        :show="modalData" 
        @closeModal="closeModalData"
        @confirm="addData"
        @dismiss="closeModalData"
      >
          <div class="">
            <div class="row gy-6">
              <div class="col-4 d-flex align-items-center fw-bold fs-4">Guru</div>
              <div class="col-8">
                <!-- <select  v-model="formData.guru" class="form-select form-select-solid" aria-label="Select example">
                  <option>Pilih Guru</option>
                  <template v-for="(guru, guruIndex) in listWK" :key="guru.guru_id">
                    <option :value="guru.guru_id">{{guru.user_nama}}</option>
                  </template>
                </select> -->
                <el-select class="w-100" v-model="formData.user_id" filterable placeholder="Pilih Guru">
                  <el-option
                    v-for="guru in listWK"
                    :key="guru.guru_id"
                    :label="guru.user_nama"
                    :value="guru.user_id"
                  />
                </el-select>
              </div>
              <div class="col-4 d-flex align-items-center fw-bold fs-4">Tahun Ajar</div>
              <div class="col-8">
                <el-select class="w-100" v-model="formData.thn_ajar" filterable placeholder="Pilih Tahun Ajar">
                  <el-option
                    v-for="tahun in listTahun"
                    :key="tahun"
                    :label="tahun"
                    :value="tahun"
                  />
                </el-select>
              </div>
              <div class="col-4 d-flex align-items-center fw-bold fs-4">Kelas</div>
              <div class="col-8">
                <!-- <select  v-model="formData.kelas" class="form-select form-select-solid" aria-label="Select example">
                  <option>Pilih Kelas</option>
                  <template v-for="(kelas, kelasIndex) in kelas" :key="kelasIndex">
                    <option value="1">{{kelas.name}}</option>
                  </template>
                </select> -->
                <el-select class="w-100" v-model="formData.kelas_id" filterable placeholder="Pilih Kelas">
                  <el-option
                    v-for="kelas in listKls"
                    :key="kelas.kelas_id"
                    :label="kelas.kelas_nama"
                    :value="kelas.kelas_id"
                  />
                </el-select>
              </div>
            </div>
          </div>
      </Modal>
    </div>
  </div>
</div>
</template>