<script setup>
import { ref, onMounted, computed } from "vue"
import { VueGoodTable } from 'vue-good-table-next'

import 'vue-good-table-next/dist/vue-good-table-next.css'

const optionsDefault = {
	paginationOptions: { enabled: true, perPage: 20 },
	sortOptions: { enabled: true },
	searchOptions: { enabled: false }
}

const props = defineProps({
	columns: { type: Array, required: true },
	rows: { type: Array, required: true },
	totalRows: { type: Number, required: true },
	paginationOptions: { type: Object, default: () => ({}) },
	sortOptions: { type: Object, default: () => ({}) },
	searchOptions: { type: Object, default: () => ({}) },
	isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['loadItems', 'update:isLoading'])

defineExpose({ loadItems })

const isLoadingComputed = computed({
	get: () => props.isLoading,
	set: val => emit('update:isLoading', val)
})

const serverParams = ref({
	columnFilters: {},
	sort: {
		field: '',
		type: '',
	},
	page: 1,
	perPage: props.paginationOptions.perPage ?? optionsDefault.paginationOptions.perPage
})

onMounted(loadItems)

function updateParams(newProps) {
	serverParams.value = Object.assign({}, serverParams.value, newProps)
}
function loadItems(additionalParams) {
	emit('loadItems', { ...serverParams.value, ...additionalParams })
}
function onPageChange(params) {
	updateParams({ page: params.currentPage })
	loadItems()
}
function onPerPageChange(params) {
	updateParams({ perPage: params.currentPerPage })
	loadItems()
}
function onSortChange(params) {
	updateParams({
		sort: params[0],
	})
	loadItems()
}
function onColumnFilter(params) {
	updateParams(params)
	loadItems()
}
</script>

<template>
	<vue-good-table
		id="ss-table"
		styleClass="vgt-table"
		mode="remote"
		:totalRows="props.totalRows"
		:pagination-options="{ ...optionsDefault.paginationOptions,  ...props.paginationOptions}"
		:sort-options="{ ...optionsDefault.sortOptions,  ...props.sortOptions}"
		:search-options="{ ...optionsDefault.searchOptions,  ...props.searchOptions}"
		:rows="props.rows"
		:columns="props.columns"
		:isLoading.sync="isLoadingComputed"
		@page-change="onPageChange"
		@sort-change="onSortChange"
		@column-filter="onColumnFilter"
		@per-page-change="onPerPageChange"
	>
		<template #table-row="tableRowProps">
			<slot name="table-row" v-bind="tableRowProps"></slot>
		</template>
	</vue-good-table>
</template>

<style>
.vgt-wrap__footer {
	background: none;
	border: none;
}
.vgt-inner-wrap {
	border-radius: 0;
	box-shadow: none;
}
table.vgt-table {
	border: none;
}
table.vgt-table thead th {
	background: #F5F8FA;
	border-bottom: none;
	color: #A1ABC0;
	font-weight: 600;
	font-size: 1rem;
	padding: 1.75rem;
}
.vgt-table thead th:first-child {
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}
.vgt-table thead th:last-child {
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}
table.vgt-table td, table.vgt-table th {
	border-bottom: 1px dashed #A1ABC055;
	font-size: 1.15rem;
	padding: 1.25rem 1.75rem;
	vertical-align: middle;
}
.vgt-table tbody th.vgt-checkbox-col {
	background: none;
	padding: 1.25rem 1.75rem;
	border-right: none;
}
.vgt-table th.sortable button:before {
	border-top: 5px solid #A1ABC0;
	right: 1rem;
}
.vgt-table th.sortable button:after {
	border-bottom: 5px solid #A1ABC0;
	right: 1rem;
}
</style>