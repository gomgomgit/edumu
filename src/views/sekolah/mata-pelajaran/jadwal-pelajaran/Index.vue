<script setup>
import { reactive, onMounted, watch, ref } from 'vue'
import { request } from '@/util'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import { dayList } from '@/constant'

import ServerSideTable from '@/components/ServerSideTable.vue'
import FilterSelect from '@/components/filter-select/index.vue'
import FormModal from './FormModal.vue'

const tableRef = ref()
const formMode = ref('')
const activeData = ref({})

const filterData = reactive({
	options: {
		kelas: [], mapel: [], user: []
	},
	selected: {
		kelas: null, mapel: null, user: null, hari: null
	}
})

function getFilterOptions() {
	Promise.all([
		request.post('kelas'),
		request.post('mapel'),
		request.post('user?level=guru'),
	]).then(responses => {
		filterData.options = {
			kelas: responses[0].data.data,
			mapel: responses[1].data.data,
			user: responses[2].data.data
		}
	})
}

const tableData = reactive({
	columns: [
		{ label: 'KELAS', field: 'kelas_nama' },
		{ label: 'NAMA MAPEL', field: 'mapel_nama' },
		{ label: 'GURU', field: 'user_nama' },
		{ label: 'HARI', field: 'jadwal_hari', formatFn: val => dayList[val] },
		{ label: 'ACTION', field: 'action', sortable: false, width: '200px' },
	],
	rows: [],
	totalRows: 0,
})

function getTableData(payload) {
	request.post('jadwal', null, {
		params: {
			page: payload.page ?? 1,
			...filterData.selected
		}
	}).then(res => {
		tableData.rows = res.data.data.data
		tableData.totalRows = res.data.data.total
	})
}

function handleEdit(row) {
	activeData.value = row
	formMode.value = 'Edit Data'
}

function handleFormClose(row) {
	activeData.value = {}
	formMode.value = ''
}

watch(
	filterData.selected,
	() => tableRef.value.loadItems(),
	{ deep: true }
)

onMounted(() => {
	setCurrentPageBreadcrumbs("Jadwal Pelajaran", ['Sekolah', "Mata Pelajaran"]);
	getFilterOptions()
})
</script>

<template>
	<div>
		<div class="card mb-5 mb-xxl-8">
			<div class="card-body">
				<section>
					<div class="d-flex flex-wrap justify-content-between align-items-center mb-5">
						<h2 class="fs-1 fw-bold py-6">Data Jadwal Pelajaran</h2>

						<section class="d-flex flex-wrap gap-4">
							<router-link :to="'/sekolah/mata-pelajaran/jadwal-pelajaran/import'" class="btn btn-primary d-flex gap-1 align-items-center">
								<i class="bi bi-cloud-arrow-up fs-1"></i>
								Import
							</router-link>
							<button
								class="btn btn-primary d-flex gap-1 align-items-center"
								@click="formMode = 'Tambah Data'">
								<i class="bi bi-plus fs-1"></i>
								Tambah Jadwal
							</button>
						</section>
					</div>
					<div class="separator border-black-50 border-2 my-6"></div>
					<section class="d-flex flex-wrap gap-4 justify-content-end">
						<FilterSelect v-model:filterValue="filterData.selected.kelas" placeholder="Pilih Kelas" class="w-150px">
							<el-option
								v-for="kelas in filterData.options.kelas"
								:key="kelas.kelas_id"
								:value="kelas.kelas_id"
								:label="kelas.kelas_nama" />
						</FilterSelect>
						<FilterSelect v-model:filterValue="filterData.selected.mapel" placeholder="Pilih Mapel" class="w-150px">
							<el-option
								v-for="mapel in filterData.options.mapel"
								:key="mapel.mapel_id"
								:value="mapel.mapel_id"
								:label="mapel.mapel_nama" />
						</FilterSelect>
						<FilterSelect v-model:filterValue="filterData.selected.user" placeholder="Pilih Guru" class="w-150px">
							<el-option
								v-for="user in filterData.options.user"
								:key="user.user_id"
								:value="user.user_id"
								:label="user.user_nama" />
						</FilterSelect>
						<FilterSelect v-model:filterValue="filterData.selected.hari" placeholder="Pilih Hari" class="w-150px">
							<el-option
								v-for="(day, dayId) in dayList"
								:key="dayId"
								:value="dayId"
								:label="day" />
						</FilterSelect>
					</section>
				</section>
				<div class="my-5">
					<ServerSideTable
						ref="tableRef"
						:totalRows="tableData.totalRows || 0"
						:columns="tableData.columns"
						:rows="tableData.rows"
						@loadItems="getTableData">
						<template #table-row="{column, row}">
							<div v-if="column.field == 'action'">
								<button
									class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
									@click="handleEdit(row)">
									<span class="svg-icon svg-icon-3">
										<inline-svg src="media/icons/duotune/art/art005.svg" />
									</span>
								</button>
								<!-- <button class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
									<span class="svg-icon svg-icon-3">
										<inline-svg src="media/icons/duotune/general/gen027.svg" />
									</span>
								</button> -->
							</div>
						</template>
					</ServerSideTable>
				</div>
			</div>
		</div>

		<FormModal
			:mode="formMode"
			:activeData="activeData"
			@close="handleFormClose"
			@submit="tableRef.loadItems()" />
	</div>
</template>