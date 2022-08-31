<script setup>
import { reactive, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router';

import { request } from '@/util'
import ServerSideTable from '@/components/ServerSideTable.vue'
import FilterSelect from '@/components/filter-select/index.vue'
import Swal from 'sweetalert2';
import qs from 'qs';
import Spinner from '@/components/Spinner.vue';
import { useToast } from 'vue-toast-notification';
// import FormModal from './FormModal.vue'

const router = useRouter()

const tableRef = ref()
const summaryData = ref({})
const formMode = ref('')
const activeData = ref({})
const isSaving = ref(false)
const isLoading = ref(false)

const filterData = reactive({
	options: {
		mapel: [], user: []
	},
	selected: {
		mapel: null, user: null, date: null
	}
})

const tableData = reactive({
	columns: [
		{ label: 'TUGAS/UJIAN', field: 'type' },
		{ label: 'GURU', field: 'user_nama' },
		{ label: 'NAMA UJIAN/TUGAS', field: 'exam_title' },
		{ label: 'MATA PELAJARAN', field: 'mapel_nama' },
		{ label: 'MAX TIME', field: 'max_time', width: '200px' },
		{ label: 'STATUS UJIAN', field: 'exam_status' },
		{ label: 'ACTION', field: 'action', width: '200px' },
	],
	rows: [],
	totalRows: 0,
})


function getTableData(payload) {
	request.post('ujian', null, {
		params: {
			page: payload?.page ?? 1,
			mapel: filterData.selected.mapel ?? '',
			user: filterData.selected.user ?? '',
			tglMulai: filterData.selected.date ? filterData.selected.date[0] : '',
			tglEnd: filterData.selected.date ? filterData.selected.date[1] : '',
		}
	}).then(res => {
		tableData.rows = res.data.data.data
		tableData.totalRows = res.data.data.total
	})
}

async function getSummaryData() {
	const res = await request.post('v2dev/summary')
	summaryData.value = res.data.data
}

async function getFilterOptions() {
	const responses = await Promise.all([
		request.post('mapel'),
		request.post('user?level=guru'),
	])

	filterData.options = {
		mapel: responses[0].data.data,
		user: responses[1].data.data
	}
}

async function handleEditExam(row) {
	if (row.exam_status == 1) return Swal.fire(
		'Ujian telah aktif!',
		'Ujian yang telah aktif tidak boleh diedit. Silahkan nonaktifkan ujian terlebih dahulu!',
		'warning')

	// const invalidExamDate = Date.now() > new Date(row.exam_start_date).getTime()
	// if (invalidExamDate) return Swal.fire(
	// 	'Tanggal ujian telah lewat!',
	// 	'Ujian yang telah berlalu tidak boleh diedit. Anda dapat melakukan remedial jika ingin menduplikasi ujian.',
	// 	'warning')

	const confirmEditing = await Swal.fire({
		title: 'Tetap Edit?',
		text: 'Soal mungkin perlu diurutkan kembali jika anda mengedit ujian.',
		icon: 'question',
		showCancelButton: true,
		cancelButtonText: 'Batal',
		confirmButtonText: 'Edit Ujian'
	})

	if (confirmEditing.isConfirmed) router.push('utama/form/pengaturan/' + row.exam_id)
}

async function handleRemedExam(row) {
	// const invalidExamDate = Date.now() < new Date(row.exam_start_date).getTime()
	// if (invalidExamDate) return Swal.fire(
	// 	'Ujian belum dilaksanakan!',
	// 	'Ujian yang belum dikerjakan tidak bisa diremedial.',
	// 	'warning')

	const confirmEditing = await Swal.fire({
		title: 'Tetap Remedial?',
		icon: 'question',
		showCancelButton: true,
		cancelButtonText: 'Batal',
		confirmButtonText: 'Buat Remedial'
	})

	if (confirmEditing.isConfirmed) router.push('utama/form/pengaturan/remed/' + row.exam_id)
}

async function changeExamStatus (row, status) {
	const invalidExamDate = Date.now() > new Date(row.exam_start_date).getTime()
	if (invalidExamDate) return Swal.fire(
		'Tanggal ujian telah lewat!',
		'Status ujian yang telah berlalu tidak boleh diubah',
		'warning')

	const confirmTitle = status ? 'Tetap Aktifkan?' : 'Tetap Nonaktifkan?'
	const confirmButton = status ? 'Aktifkan' : 'Nonaktifkan'
	const confirmText = status
		? 'Ujian yang aktif dapat dilihat oleh siswa, dan tidak dapat diedit lagi hingga dinonaktifkan'
		: 'Ujian yang nonaktif tidak dapat dilihat oleh siswa'
	const confirmPopup = await Swal.fire({
		title: confirmTitle,
		text: confirmText,
		icon: 'question',
		showCancelButton: true,
		cancelButtonText: 'Batal',
		confirmButtonText: confirmButton
	})

	if (!confirmPopup.isConfirmed) return

	try {
		isSaving.value = row.originalIndex

		await request.post('exam/update-status', qs.stringify({
			exam_id: row.exam_id,
			user_id: row.user_id,
			exam_status_new: status,
		}))

		tableData.rows[row.originalIndex].exam_status = status
		useToast().info('Status ujian berhasil diperbarui!')
	} finally {
		isSaving.value = false
	}
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

onMounted(async () => {
	try {
		isLoading.value = true
		await Promise.all([
			getSummaryData(),
			getFilterOptions()
		])
	} finally {
		isLoading.value = false
	}
})
</script>

<template>
	<div>
		<div class="card mb-4">
			<div class="card-body">
				<div v-if="isLoading" class="d-flex justify-content-center">
					<Spinner />
				</div>

				<div v-else class="row">
					<div class="col-md-3">
						<section class="summary-item bg-success bg-opacity-10 p-4 rounded-2">
							<p class="display-6 text-success">{{ summaryData.exam_count }}</p>
							<div class="h5">Ujian</div>
							<div class="text-dark small">Online</div>
							<i class="summary-icon text-success uil uil-clipboard-notes opacity-25"></i>
						</section>
					</div>
					<div class="col-md-3">
						<section class="summary-item bg-primary bg-opacity-10 p-4 rounded-2">
							<p class="display-6 text-primary">{{ summaryData.tugas_count }}</p>
							<div class="h5">Tugas</div>
							<div class="text-dark small">Online</div>
							<i class="summary-icon text-primary uil uil-file-alt opacity-25"></i>
						</section>
					</div>
					<div class="col-md-3">
						<section class="summary-item bg-warning bg-opacity-10 p-4 rounded-2">
							<p class="display-6 text-warning">{{ summaryData.question_count }}</p>
							<div class="h5">Soal Ujian</div>
							<div class="text-dark small">Online</div>
							<i class="summary-icon text-warning uil uil-comment-alt-notes opacity-25"></i>
						</section>
					</div>
					<div class="col-md-3">
						<section class="summary-item bg-danger bg-opacity-10 p-4 rounded-2">
							<p class="display-6 text-danger">{{ summaryData.guru_count }}</p>
							<div class="h5">Guru Pembuat Ujian</div>
							<div class="text-dark small">Online</div>
							<i class="summary-icon text-danger uil uil-user-md opacity-25"></i>
						</section>
					</div>
				</div>
			</div>
		</div>

		<div class="card mb-5 mb-xxl-8">
			<div class="card-body">
				<div v-if="isLoading" class="d-flex justify-content-center">
					<Spinner />
				</div>

				<section v-else class="d-flex flex-wrap justify-content-between align-items-center mb-5">
					<section class="d-flex flex-wrap gap-4 align-items-center">
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
						<el-date-picker
							v-model="filterData.selected.date"
							type="daterange"
							range-separator="-"
							start-placeholder="Tanggal Mulai"
							end-placeholder="Tanggal Selesai"
							size="large" />
					</section>
					<router-link
						to="utama/form"
						class="btn btn-primary d-flex gap-1 align-items-center">
						<i class="bi bi-plus fs-1"></i>
						Tambah Ujian
					</router-link>
				</section>

				<ServerSideTable
					ref="tableRef"
					:totalRows="tableData.totalRows || 0"
					:columns="tableData.columns"
					:rows="tableData.rows"
					:sort-options="{ enabled: false }"
					@loadItems="getTableData">
					<template #table-row="{ column, row }">
						<div v-if="column.field == 'type'">
							{{ row.exam_cat_type?.toUpperCase() }}<br />
							<!-- {{ row.exam_id }}<br /> -->
							<span v-if="row.exam_parent" class="badge badge-light-success">
								Remedial
							</span>
						</div>
						<div v-if="column.field == 'max_time'">
							{{ row.exam_start_date }}<br />
							{{ row.exam_end_date }}
						</div>
						<div v-if="column.field == 'exam_status'">
							<div v-if="isSaving === row.originalIndex" class="h-30px d-flex align-items-center">
								<Spinner />
							</div>
							<div v-else>
								<button
									v-if="row.exam_status == 1"
									class="btn btn-light btn-color-success btn-active-color-success btn-sm me-2"
									@click="changeExamStatus(row, 0)">
									Aktif
								</button>
								<button
									v-if="row.exam_status == 0"
									class="btn btn-light btn-color-danger btn-active-color-danger btn-sm me-2"
									@click="changeExamStatus(row, 1)">
									Nonaktif
								</button>
							</div>
						</div>
						<div v-if="column.field == 'action'" class="d-flex justify-content-end">
							<el-tooltip
								v-if="parseInt(row.exam_parent)"
								class="box-item"
								effect="light"
								content="Assign Siswa"
								placement="top-end">
								<button
									class="btn btn-icon btn-bg-light btn-active-color-info btn-sm me-2">
									<span class="svg-icon svg-icon-3">
										<inline-svg src="media/icons/duotune/communication/com013.svg" />
									</span>
								</button>
							</el-tooltip>

							<el-tooltip
								v-else
								class="box-item"
								effect="light"
								content="Remedial"
								placement="top-end">
								<button
									class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-2"
									@click="handleRemedExam(row)">
									<span class="svg-icon svg-icon-3">
										<inline-svg src="media/icons/duotune/arrows/arr029.svg" />
									</span>
								</button>
							</el-tooltip>

							<el-tooltip
								class="box-item"
								effect="light"
								content="Edit Ujian"
								placement="top-end">
								<button
									class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
									@click="handleEditExam(row)">
									<span class="svg-icon svg-icon-3">
										<inline-svg src="media/icons/duotune/art/art005.svg" />
									</span>
								</button>
							</el-tooltip>

							<el-dropdown size="large">
								<button class="btn btn-icon btn-bg-light btn-active-color-success btn-sm">
									<span class="svg-icon svg-icon-3">
										<inline-svg src="media/icons/duotune/general/gen053.svg" />
									</span>
								</button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item>
											<i class="uil uil-clock me-4 fs-3"></i>
											Atur Ulang Waktu
										</el-dropdown-item>
										<el-dropdown-item>
											<i class="uil uil-trash-alt me-4 fs-3"></i>
											Hapus
										</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</template>
				</ServerSideTable>
			</div>
		</div>
	</div>
</template>

<style scoped>
.border-dashed {
	border: 2px dashed #000;
}
.summary-item {
	position: relative;
}
.summary-icon {
	position: absolute;
	right: 16px;
	top: 50%;
	transform: translateY(-50%);
	font-size: 84px;
}
</style>