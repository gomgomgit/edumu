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
  
  onMounted(() => {
    setCurrentPageBreadcrumbs("Data Kelas", ['Sekolah', "Akademik"]);
    getShiftData()
  })

  function getKelasData (payload) {
    request.post('kelas', null, {
      params: {
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      kelasData.rows = res.data.data.data
      kelasData.totalRows = res.data.data.total
    })
  }
  function getShiftData () {
    request.post('shift', null).then(res => {
      shiftData.value = res.data.data
    })
  }
  const shiftData = ref([])

  const tingkatKelas = ref('')
  const status = ref('')

  const modalData = ref(false)

  const options = [
    {
      value: 'ID 1',
      label: 'Option1',
    },
    {
      value: 'ID 2',
      label: 'Option2',
    },
    {
      value: 'ID 3',
      label: 'Option3',
    },
    {
      value: 'ID 4',
      label: 'Option4',
    },
    {
      value: 'ID 5',
      label: 'Option5',
    },
  ]

  const waliKelas = ref([
    {
      name: 'Guru 1'
    },
    {
      name: 'Guru 1'
    },
    {
      name: 'Guru 1'
    },
    {
      name: 'Guru 1'
    },
    {
      name: 'Guru 1'
    },
  ])

  const tahunAjar = ref([
    {
      name: '2020/2021'
    },
    {
      name: '2021/2022'
    },
    {
      name: '2022/2023'
    },
  ])

  const dataTingkatKelas = ref([
    {
      value: 1,
      name: '1'
    },
    {
      value: 2,
      name: '2'
    },
    {
      value: 3,
      name: '3'
    },
    {
      value: 4,
      name: '4'
    },
    {
      value: 5,
      name: '5'
    },
    {
      value: 6,
      name: '6'
    },
    {
      value: 7,
      name: '7'
    },
    {
      value: 8,
      name: '8'
    },
    {
      value: 9,
      name: '9'
    },
    {
      value: 10,
      name: '10'
    },
    {
      value: 11,
      name: '11'
    },
    {
      value: 12,
      name: '12'
    },
  ])

  const kelasData = reactive({
    columns: [
      { label: 'Kelas', field: 'kelas_nama', sortable: false },
      { label: 'Jam Masuk', field: 'shift', sortable: false },
      { label: 'Tingkat Kelas', field: 'kelas_level', sortable: false },
      { label: 'Status', field: 'kelas_status', sortable: false },
      { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })

  const initialFormData = {kelas_nama: '', wali: '', kelas_level: '', shift_id: '', kelas_status: ''}

  const formData = reactive({...initialFormData})

  function closeModalData() {
    modalData.value = '',
    Object.assign(formData, initialFormData)
  }

  function submitData(event) {
    request.post('/kelas/'  + (modalData.value == 'Tambah Data' ? 'add' : 'edit'), QueryString.stringify(formData))
      .then(res => {
        useToast().success(modalData.value == 'Tambah Data' ? 'Data Berhasil Ditambahkan!' : 'Data Berhasil Diperbaharui!')
        Object.assign(formData, initialFormData)
        getKelasData()
        modalData.value = null
      })
  }

  function editData(data) {
    formData.kelas_id = data.kelas_id,
    formData.kelas_nama = data.kelas_nama,
    formData.shift_id = data.shift_id,
    formData.kelas_level = data.kelas_level,
    formData.kelas_status = data.kelas_status,
    modalData.value = 'Edit Data'
  }

  function deleteData(id) {
    deleteConfirmation(function() {
      request.get('/kelas/delete/' + id)
        .then(res => {
          useToast().success('Data Berhasil Dihapus!')
          getKelasData()
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
            <h2 class="fs-1 fw-bold py-6">Data Kelas</h2>

            <!-- <div>
              <FilterSelect v-model:filterValue="tingkatKelas" placeholder="Pilih Kelas">
                <el-option
                  v-for="item, index in options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </FilterSelect>
            </div>
            <div>
              <FilterSelect v-model:filterValue="status" placeholder="Pilih Status" @changeFilter="changeStatus">
                <el-option
                  v-for="item, index in options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </FilterSelect>
            </div> -->
          </div>

          <div class="position-relative d-flex ">
            <a @click.prevent="modalData = 'Tambah Data'" href="#" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
              <i class="bi bi-plus fs-1"></i>
              <span>
                Tambah Kelas
              </span>
            </a>
          </div>
        </div>
        <div class="mb-5 mb-xxl-8">
          <ServerSideTable
            :totalRows="kelasData.totalRows || 0"
            :columns="kelasData.columns"
            :rows="kelasData.rows"
            @loadItems="getKelasData"
          >
            <template #table-row="{column, row}">
              <div v-if="column.field == 'shift'">
                {{row.shift.name}} <span class="badge badge-primary ms-4">{{row.shift.start}} - {{row.shift.end}}</span>
              </div>
              <div v-if="column.field == 'kelas_status'">
                <span :class="'badge badge-light-' + (row.kelas_status == 1 ? 'success' : 'danger')">{{row.kelas_status == 1 ? 'Aktif' : 'Non Aktif'}}</span>
              </div>
              <div v-if="column.field == 'action'">
                <router-link :to="'/sekolah/akademik/data-kelas/detail/' + row.kelas_id" class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/files/fil001.svg" />
                  </span>
                </router-link>
                <button @click="editData(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </button>
                <!-- <button @click="deleteData(row.kelas_id)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/general/gen027.svg"/>
                  </span>
                </button> -->
              </div>
            </template>
          </ServerSideTable>
        </div>

        
        <Modal 
          :title="modalData" 
          :breadcrumb="Array('Sekolah', 'Akademik', 'Data Kelas', modalData)" 
          :show="modalData" 
          @closeModal="closeModalData"
          @confirm="submitData"
          @dismiss="closeModalData"
        >
            <div class="">
              <div class="row gy-6">
                <div class="col-4 d-flex align-items-center fw-bold fs-4">Nama Kelas</div>
                <div class="col-8">
                  <input type="text" v-model="formData.kelas_nama" class="form-control" placeholder="X IPA , IX IPS , DST"/>
                </div>
                <!-- <div class="col-4 d-flex align-items-center fw-bold fs-4">Wali Kelas</div>
                <div class="col-8">
                  <select  v-model="formData.guru" class="form-select form-select-solid" aria-label="Select example">
                    <option>Pilih Guru</option>
                    <template v-for="(guru, guruIndex) in waliKelas" :key="guruIndex">
                      <option value="1">{{guru.name}}</option>
                    </template>
                  </select>
                </div> -->
                <div class="col-4 d-flex align-items-center fw-bold fs-4">Tingkat Kelas</div>
                <div class="col-8">
                  <select  v-model="formData.kelas_level" class="form-select form-select-solid" aria-label="Select example">
                    <option>Pilih Tingkat Kelas</option>
                    <template v-for="(kelas, kelasIndex) in dataTingkatKelas" :key="kelasIndex">
                      <option :value="kelas.value">{{kelas.name}}</option>
                    </template>
                  </select>
                </div>
                <div class="col-4 d-flex align-items-center fw-bold fs-4">Jam Masuk</div>
                <div class="col-8">
                  <select  v-model="formData.shift_id" class="form-select form-select-solid" aria-label="Pilih Jam Masuk">
                    <option>Pilih Jam Masuk</option>
                    <template v-for="(shift, shiftIndex) in shiftData" :key="shift.id">
                      <option :value="shift.id">{{shift.name}} ({{shift.start}}-{{shift.end}})</option>
                    </template>
                  </select>
                </div>
                <div class="col-4 d-flex align-items-center fw-bold fs-4">Status Aktif</div>
                <div class="col-8">
                  <select  v-model="formData.kelas_status" class="form-select form-select-solid" aria-label="Status Aktif">
                    <option>Pilih Status</option>
                    <option value="1">Aktif</option>
                    <option value="0">Non Aktif</option>
                  </select>
                </div>
              </div>
            </div>
        </Modal>
      </div>
    </div>
  </div>
</template>