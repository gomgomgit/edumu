<script setup>
  import { ref, reactive, onMounted } from "vue";
  import { request } from '@/util'
  import Modal from "@/components/modals/CustomModal.vue";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import FilterSelect from '@/components/filter-select'
  import ServerSideTable from '@/components/ServerSideTable.vue'
import moment from "moment";
  
  onMounted(() => {
		setCurrentPageBreadcrumbs("Pantau Ujian", ['LMS', "Ujian Online"])
    getData()
  })

  function getUjianData (payload) {
    request.post('ujian', null, {
      params: {
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC',
        mapel: mapelFilter.value,
        user: guruFilter.value,
        tglMulai: startFilter.value ?? '',
        tglEnd: endFilter.value ?? '',
      }
    }).then(res => {
      ujianData.rows = res.data.data.data 
      ujianData.totalRows = res.data.data.total
    }).catch(err => {
      ujianData.rows = []
    })
  }
  function getData () {
    request.post('user', null, {
      params: {
        level: 'guru'
      }
    }).then(res => {
      guruOption.value = res.data.data
    })
    request.post('mapel', null)
    .then(res => {
      mapelOption.value = res.data.data
    })
  }

  const guruFilter = ref()
  const mapelFilter = ref()
  const startFilter = ref('')
  const endFilter = ref('')

  const guruOption = ref([])
  const mapelOption = ref([])

  const ujianData = reactive({
    columns: [
      { label: 'Tugas/Ujian', field: 'exam_cat_type', sortable: false },
      { label: 'Guru', field: 'user_nama', sortable: false },
      { label: 'Nama Ujian/Tugas', field: 'exam_title', sortable: false, width: '250px' },
      { label: 'Mata Pelajaran', field: 'mapel_nama', sortable: false },
      { label: 'Max.Time', field: 'time', sortable: false },
      { label: 'Status Ujian', field: 'exam_status', sortable: false },
      { label: 'Action', field: 'action', sortable: false, width: '100px' },
    ],
    rows: [],
    totalRows: 0,
  })

  const initialFormData = {kelas_nama: '', wali: '', kelas_level: '', shift_id: '', kelas_status: ''}

  const formData = reactive({...initialFormData})

	function timeFormating(time) {
		return moment().format('DD/MM/YYYY - h:mm A')
	}
</script>

<template>
  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="mb-4">
          <h2 class="fs-1 fw-bold py-6">Ujian Online</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
					<div class="d-flex gap-4">
						<div>
							<FilterSelect searchable v-model:filterValue="guruFilter" placeholder="Pilih Guru" @changeFilter="getUjianData()">
								<el-option
									v-for="guru in guruOption"
									:key="guru.user_id"
									:label="guru.user_nama"
									:value="guru.user_id"
								/>
							</FilterSelect>
						</div>
						<div>
							<FilterSelect v-model:filterValue="mapelFilter" placeholder="Pilih Mapel" @changeFilter="getUjianData()">
								<el-option
									v-for="mapel, index in mapelOption"
									:key="mapel.mapel_id"
									:label="mapel.mapel_nama"
									:value="mapel.mapel_id"
								/>
							</FilterSelect>
						</div>
					</div>
					<div class="d-flex gap-4">
						<div class="d-flex align-items-center">
							<el-date-picker
								v-model="startFilter"
								type="date"
								placeholder="Mulai"
								size="large"
								value-format="YYYY-MM-DD"
								@change="getUjianData()"
							/>
						</div>
						<div class="d-flex align-items-center">
							<el-date-picker
								v-model="endFilter"
								type="date"
								placeholder="Selesai"
								size="large"
								value-format="YYYY-MM-DD"
								@change="getUjianData()"
							/>
						</div>
					</div>
        </div>
        <div class="mb-5 mb-xxl-8">
          <ServerSideTable
            :totalRows="ujianData.totalRows || 0"
            :columns="ujianData.columns"
            :rows="ujianData.rows"
            @loadItems="getUjianData"
          >
            <template #table-row="{column, row}">
              <div v-if="column.field == 'time'">
                <p>{{timeFormating(row.exam_start_date)}}</p>
                <p>{{timeFormating(row.exam_end_date)}}</p>
              </div>
              <div v-if="column.field == 'exam_cat_type'">
                <span>{{row.exam_cat_type.toUpperCase()}}</span>
              </div>
              <div v-if="column.field == 'exam_status'">
                <span :class="'badge badge-light-' + (row.exam_status == 1 ? 'success' : 'danger')">{{row.exam_status == 1 ? 'Aktif' : 'Non Aktif'}}</span>
              </div>
              <div v-if="column.field == 'action'">
                <router-link :to="`/lms/ujian-online/pantau-ujian/detail/${row.exam_id}`" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm px-2">
                  <i class="bi bi-eye-fill fs-3"></i>
                </router-link>
              </div>
            </template>
          </ServerSideTable>
        </div>
      </div>
    </div>
  </div>
</template>