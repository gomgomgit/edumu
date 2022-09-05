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
import moment from "moment";

  onMounted(() => {
    setCurrentPageBreadcrumbs("Tahun Ajar", ['Sekolah', "Akademik"]);
  })

  function getTahunAjar (payload) {
      request.post('thn_ajar', null, {
        params: {
          page: payload?.page ?? 1,
          sortby: payload?.sort?.type ?? 'ASC'
        }
      }).then(res => {
        tahunAjar.rows = res.data.data.data
        tahunAjar.totalRows = res.data.data.total
      })
    }

  const tahunAjar = reactive({
    columns: [
      { label: 'Tahun Ajar', field: 'thn_ajar_value', sortable: false },
      { label: 'Semester', field: 'thn_ajar_semester', sortable: false },
      { label: 'Status', field: 'thn_ajar_status', sortable: false },
      { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })

  const semesterFilter = ref('')
  const statusFilter = ref('')

  const modalData = ref(null)
  const monthRange = ref([])

  function changeMonth() {
    console.log(monthRange.value)
    formData.thn_ajar_start = moment(monthRange.value[0]).format('YYYY-MM')
    formData.thn_ajar_end = moment(monthRange.value[1]).format('YYYY-MM')
  }

  const semesterOption = [
    {
      value: 'ganjil',
      label: 'Ganjil',
    },
    {
      value: 'genap',
      label: 'Genap',
    },
  ]
  const statusOption = [
    {
      value: 1,
      label: 'Aktif',
    },
    {
      value: 0,
      label: 'Non Aktif',
    },
  ]

  const initialFormData = {thn_ajar_value: null, thn_ajar_status: null, thn_ajar_semester: null, thn_ajar_start: null, thn_ajar_end: null}

  const formData = reactive({...initialFormData})

  function changeFilter(changed){
    console.log(changed)
  }

  function closeModalData() {
    modalData.value = null
    monthRange.value = []
    Object.assign(formData, initialFormData)
  }

  function submitData() {
    // return console.log(modalData.value)
    request.post('thn_ajar/' + (modalData.value == 'Tambah Data' ? 'add' : 'edit') , qs.stringify(formData))
    .then(res => {
      useToast().success(modalData.value == 'Tambah Data' ? 'Data Berhasil Ditambahkan!' : 'Data Berhasil Diperbaharui!')
      Object.assign(formData, initialFormData)
      monthRange.value = []
      modalData.value = null
      getTahunAjar()
    })
  }

  function editData(data) {
    // console.log(data)
    formData.thn_ajar_id = data.thn_ajar_id
    formData.thn_ajar_value = data.thn_ajar_value
    formData.thn_ajar_status = data.thn_ajar_status
    formData.thn_ajar_semester = data.thn_ajar_semester
    formData.thn_ajar_start = data.thn_ajar_start
    formData.thn_ajar_end = data.thn_ajar_end

    
    monthRange.value.push(data.thn_ajar_start)
    monthRange.value.push(data.thn_ajar_end)
    modalData.value = 'Edit Data'
  }

  function deleteData(id) {
    deleteConfirmation(function() {
      request.get('thn_ajar/delete/' + id)
      .then(res => {
        useToast().success('Data Berhasil Dihapus!')
        getTahunAjar()
      })
    })
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
              <h2 class="fs-1 fw-bold py-6 m-0">Data Tahun Ajar</h2>

              <!-- <div>
                <FilterSelect v-model:filterValue="semesterFilter" :options="semesterOption" @changeFilter="changeFilter('semester')" placeholder="Pilih Semester" />
              </div>
              <div>
                <FilterSelect v-model:filterValue="statusFilter" :options="statusOption" @changeFilter="changeFilter('status')" placeholder="Pilih Status" />
              </div> -->
            </div>

            <div class="position-relative d-flex ">
              <a @click="modalData = 'Tambah Data'" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-plus fs-1"></i>
                <span>
                  Tambah Tahun Ajar
                </span>
              </a>
            </div>
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
        </div>
      </div>
      <div class="mb-5 mb-xxl-8 px-12">
        <ServerSideTable
          :totalRows="tahunAjar.totalRows || 0"
          :columns="tahunAjar.columns"
          :rows="tahunAjar.rows"
          @loadItems="getTahunAjar"
        >
          <template #table-row="{column, row}">
              <div v-if="column.field == 'thn_ajar_semester'">
                {{row.thn_ajar_semester[0].toUpperCase() + row.thn_ajar_semester.substring(1)}}
              </div>
              <div v-if="column.field == 'thn_ajar_status'">
                <span :class="'badge badge-light-' + (row.thn_ajar_status == 1 ? 'success' : 'danger')">{{row.thn_ajar_status == 1 ? 'Aktif' : 'Non Aktif'}}</span>
              </div>
              <div v-if="column.field == 'action'">
                <button @click="editData(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </button>
                <button @click="deleteData(row.thn_ajar_id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/general/gen027.svg"/>
                  </span>
                </button>
              </div>
            </template>
        </ServerSideTable>
      </div>
    </div>

    <!-- Modal -->

    <Modal
      :title="modalData"
      :breadcrumb="Array('Sekolah', 'Akademik', 'Tahun Ajar', modalData)"
      :show="modalData"
      @closeModal="closeModalData"
      @confirm="submitData()"
      @dismiss="closeModalData"
    >
        <div class="">
          <div class="row gy-6">
            <div class="col-4 d-flex align-items-center fw-bold fs-4">Tahun Ajar</div>
            <div class="col-8">
              <input type="text" v-model="formData.thn_ajar_value" class="form-control" placeholder="Masukkan Tahun Ajar Cth : 2021/2022"/>
            </div>

            <div class="col-4 d-flex align-items-center fw-bold fs-4">Status</div>
            <div class="col-8">
              <select  v-model="formData.thn_ajar_status" class="form-select form-select-solid" aria-label="Select example">
                <option>Pilih Status</option>
                <option value="1">Aktif</option>
                <option value="0">Non Aktif</option>
              </select>
            </div>

            <div class="col-4 d-flex align-items-center fw-bold fs-4">Semester</div>
            <div class="col-8">
              <select v-model="formData.thn_ajar_semester" class="form-select form-select-solid" aria-label="Select example">
                <option>Pilih Semester</option>
                <option value="ganjil">Ganjil</option>
                <option value="genap">Genap</option>
              </select>
            </div>

            <!-- <div class="col-4 d-flex align-items-center fw-bold fs-4">Mulai & Selesai</div>
            <div class="col-8">
              <el-date-picker class="w-100" 
                v-model="formData.thn_ajar_start"
                start-placeholder="Bulan Mulai"
                type="month"
              />
            </div>
            <div class="col-4 d-flex align-items-center fw-bold fs-4"> Selesai</div>
            <div class="col-8">
              <el-date-picker class="w-100" 
                v-model="formData.thn_ajar_end"
                placeholder="Bulan selesai" 
                type="month"
              />
            </div> -->
            <div class="col-4 d-flex align-items-center fw-bold fs-4">Mulai & Selesai</div>
            <div class="col-8">
              <el-date-picker class="w-100" 
                v-model="monthRange"
                range-separator="Sampai"
                start-placeholder="Bulan Mulai"
                end-placeholder="Bulan selesai" 
                type="monthrange"
                @change="changeMonth()"
                unlink-panels
              />
            </div>
          </div>
        </div>
    </Modal>

  </div>
</template>