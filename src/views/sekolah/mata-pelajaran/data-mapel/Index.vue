<script setup>
import { reactive, onMounted, ref } from 'vue'
import { request } from '@/util'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';

import ServerSideTable from '@/components/ServerSideTable.vue'
// import FilterSelect from '@/components/filter-select/index.vue'
import FormModal from './FormModal.vue'

const tableRef = ref()
const formMode = ref('')
const activeData = ref({})

const tableData = reactive({
	columns: [
		{ label: 'NAMA MATA PELAJARAN', field: 'mapel_nama' },
		{ label: 'STATUS', field: 'mapel_status', sortable: false },
		{ label: 'ACTION', field: 'action', sortable: false, width: '200px' },
	],
	rows: [],
	totalRows: 0,
})

function getTableData (payload) {
	request.post('mapel', null, {
		params: {
			page: payload?.page ?? 1,
			sortby: payload?.sort?.type
		}
	}).then(res => {
		tableData.rows = res.data.data.data
		tableData.totalRows = res.data.data.total
	})
}

function handleEdit (row) {
	activeData.value = row
	formMode.value = 'Edit Data'
}

function handleFormClose (row) {
	activeData.value = {}
	formMode.value = ''
}

onMounted(() => {
	setCurrentPageBreadcrumbs("Data Mapel", ['Sekolah', "Mata Pelajaran"]);
})
</script>

<template>
	<div>
		<div class="card mb-5 mb-xxl-8">
			<div class="card-body">
				<section class="d-flex flex-wrap justify-content-between align-items-center">
					<!-- <FilterSelect placeholder="Pilih Status">
						<el-option label="Aktif" value="1" />
						<el-option label="Nonaktif" value="0" />
					</FilterSelect> -->
					
					<div>
						<h2 class="fs-1 fw-bold py-6">Data Mapel</h2>
					</div>
					<button
						class="btn btn-primary d-flex gap-1 align-items-center"
						@click="formMode = 'Tambah Data'">
						<i class="bi bi-plus fs-1"></i>
						Tambah Mapel
					</button>
				</section>
				<div class="separator border-black-50 border-2 my-6"></div>
				<ServerSideTable
					ref="tableRef"
					:totalRows="tableData.totalRows || 0"
					:columns="tableData.columns"
					:rows="tableData.rows"
					@loadItems="getTableData">
					<template #table-row="{column, row}">
						<div v-if="column.field == 'mapel_status'">
							<span :class="'badge badge-light-' + (row.mapel_status == 1 ? 'success' : 'danger')">
								{{row.mapel_status == 1 ? 'Aktif' : 'Non Aktif'}}
							</span>
						</div>
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

		<FormModal
			:mode="formMode"
			:activeData="activeData"
			@close="handleFormClose"
			@submit="tableRef.loadItems()" />
	</div>
</template>