<script setup>
import { reactive, onMounted, ref } from 'vue'
import { request } from '@/util'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';

import ServerSideTable from '@/components/ServerSideTable.vue'
import FilterSelect from '@/components/filter-select/index.vue'
import { deleteConfirmation } from '@/core/helpers/deleteconfirmation';
import { useToast } from 'vue-toast-notification';
import { Search } from '@element-plus/icons-vue'
import PembayaranIuran from './PembayaranIuran.vue';

import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, Plugin } from 'chart.js'
import { computed } from '@vue/reactivity';
import { useRouter } from 'vue-router';
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const router = useRouter()

const tableRef = ref()
const formMode = ref('')

const tableTab = ref('transaksi')

const kelasData = ref([])
const tahunAjarData = ref([])
const tipeData = ref([])

const kelasFilter = ref('')
const tipeFilter = ref('')
const tahunAjarFilter = ref('')
const searchFilter = ref('')
const periodeFilter = ref('')

const dataPembayaran = ref()

const transaksiData = reactive({
	columns: [
		{ label: 'Kode Transaksi', field: 'payment_code', sortable: false },
		{ label: 'Siswa', field: 'user_nama', sortable: false },
		{ label: 'Nominal', field: 'payment_nominal', sortable: false },
		{ label: 'Status', field: 'status', sortable: false, width: '200px' },
		{ label: 'ACTION', field: 'action', sortable: false, width: '200px' },
	],
	rows: [],
	totalRows: 0,
})
const iuranData = reactive({
	columns: [
		{ label: 'Kelas', field: 'kelas_nama', sortable: false },
		{ label: 'Siswa', field: 'user_nama', sortable: false },
		{ label: 'Nominal', field: 'payment_nominal', sortable: false },
		{ label: 'Jenis Iuran', field: 'tipe_nama', sortable: false },
		{ label: 'Status', field: 'status', sortable: false, width: '200px' },
		{ label: 'Opsi', field: 'option', sortable: false, width: '200px' },
	],
	rows: [],
	totalRows: 0,
})


const chartData = computed(() => {
	return {
		labels: [
			'Lunas',
			'Belum Lunas',
		],
		datasets: [{
				backgroundColor: ['#6464FF', '#FF5C5C'],
				data: chartDataData.value
		}],
	}
})
const chartDataData = ref([12,12])
const totalChart = ref(0)

const isMobile = () => {
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return true
	} else {
		return false
	}
}

const chartOptions = {
	responsive: true,
	borderRadius: 6,
	borderWidth: 2,       
	cutout: isMobile() ? 110 : 200,
	plugins: {
		legend: {
			display: false,
		},
    centerText: {
        display: true,
        text: "280"
    }
	},
}
const plugins = [{
     beforeDraw: function(chart) {
			var width = chart.width,
        height = chart.height,
        ctx = chart.ctx;

      ctx.restore();
      var fontSize = (height / 134).toFixed(2);
      ctx.font = fontSize + "em sans-serif";
      ctx.textBaseline = "middle";

			let text = ['Total', totalChart.value]
			let	text0X = Math.round((width - ctx.measureText(text[0]).width) / 2)
			let	text0Y = (height / 2) - 45
			let	text1X = Math.round((width - ctx.measureText(text[1]).width) / 2)
			let	text1Y = (height / 2) + 25

      ctx.fillText(text[0], text0X, text0Y);
      ctx.fillText(text[1], text1X, text1Y);
      ctx.save();
     } 
   }]

function getData() {
	request.post('kelas')
	.then(res => {
		kelasData.value = res.data.data
	})
	request.post('thn_ajar')
	.then(res => {
		tahunAjarData.value = res.data.data
	})
	request.get('iuran/tipe')
	.then(res => {
		tipeData.value = res.data.data
	})
}

function getTransaksi (payload) {
	request.get('iuran/transaksi', {
		params: {
			user_nama: searchFilter.value,
			kelas_id: kelasFilter.value,
			jenis: tipeFilter.value,
			tahun: tahunAjarFilter.value,
			page: payload?.page ?? 1,
			sortby: payload?.sort?.type
		}
	}).then(res => {
		transaksiData.rows = res.data.data.data
		transaksiData.totalRows = res.data.data.total
	})
}
function getIuran (payload) {
	request.get('siswa/finance', {
		params: {
			user_nama: searchFilter.value,
			kelas_id: kelasFilter.value,
			jenis: tipeFilter.value,
			tahun: tahunAjarFilter.value,
			page: payload?.page ?? 1,
			sortby: payload?.sort?.type
		}
	}).then(res => {
		iuranData.rows = res.data.data.siswa.data
		iuranData.totalRows = res.data.data.siswa.total

		updateChart([res.data.data.totSukses, res.data.data.totKurang], res.data.data.totBayar)
	})
}
function updateChart(val, tot) {
	chartDataData.value = val
	totalChart.value = tot
}


function getLaporan () {
	request.get('siswa/financereport', {
		params: {
			user_nama: searchFilter.value,
			kelas_id: kelasFilter.value,
			jenis: tipeFilter.value,
			tahun: tahunAjarFilter.value,
		}
	}).then(res => {
		console.log(res.data.data)
		window.location.assign(res.data.data)
	})
}

function changeTableTab(val) {
	tableTab.value = val
}
function changeFilter() {
	getIuran()
	getTransaksi()
}

function printInvoice(id) {
	request.get(`iuran/transaksi/invoice/${id}`)
}

onMounted(() => {
	setCurrentPageBreadcrumbs("Iuran Siswa", ['Iuran']);
	getData()
	getIuran()
})
</script>

<template>
	<div>
		<div class="card mb-5 mb-xxl-8">
			<div class="card-body">
        <div class="page-content">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6 m-0">Data Iuran Siswa</h2>

              <!-- <div>
                <FilterSelect v-model:filterValue="semesterFilter" :options="semesterOption" @changeFilter="changeFilter('semester')" placeholder="Pilih Semester" />
              </div>
              <div>
                <FilterSelect v-model:filterValue="statusFilter" :options="statusOption" @changeFilter="changeFilter('status')" placeholder="Pilih Status" />
              </div> -->
            </div>
					</div>
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <div>
                <FilterSelect v-model:filterValue="kelasFilter" @changeFilter="changeFilter('kelas')" placeholder="Pilih Kelas">
									<el-option v-for="kelas in kelasData" :value="kelas.kelas_id" :label="kelas.kelas_nama"></el-option>
								</FilterSelect>
              </div>
              <div>
                <FilterSelect v-model:filterValue="tahunAjarFilter" @changeFilter="changeFilter('tahun_ajar')" placeholder="Pilih Tahun Ajar">
									<el-option v-for="tahun in tahunAjarData" :value="tahun.thn_ajar_id" :label="tahun.thn_ajar_value"></el-option>
								</FilterSelect>
              </div>
              <div>
                <FilterSelect v-model:filterValue="tipeFilter" @changeFilter="changeFilter('tipe')" placeholder="Pilih Jenis">
									<el-option v-for="tipe in tipeData" :value="tipe.tipe_id" :label="tipe.tipe_nama"></el-option>
								</FilterSelect>
              </div>
            </div>
						
            <div class="d-flex w-100 w-lg-50 w-xl-25 gap-4">
                <el-input
                  v-model="searchFilter"
									@input="changeFilter('search')"
                  clearable
                  class="m-2"
                  placeholder="Cari Siswa"
                >
                  <template #append>
                    <el-button aria-disabled="true" class="pe-none" :icon="Search" />
                  </template>
                </el-input>
            </div>
					</div>
          <div class="d-flex flex-wrap justify-content-between align-items-center my-7 ">
            <div class="d-flex gap-4">
              <div>
                <div class="block">
									<el-date-picker
										v-model="periodeFilter"
										type="daterange"
										start-placeholder="Start date"
										end-placeholder="End date"
										:default-time="defaultTime"
									/>
								</div>
              </div>
            </div>
						
            <div class="d-flex align-items-center">
							<a @click="getLaporan()" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
								<span>
									Laporan
								</span>
								<i class="bi bi-printer-fill fs-2"></i>
							</a>
						</div>
					</div>
					<div class="pt-7 my-7">
						<div class="row align-items-center">
							<div class="col-12 col-lg-7">
								<div class="mw-500px m-auto">
									<Doughnut
										:chart-options="chartOptions"
										:chart-data="chartData"
										:plugins="plugins"
									/>
								</div>
							</div>
							<div class="col-12 col-lg-5">
								<h2 class="fs-2">Keterangan</h2>
								<div class="d-flex align-items-center mt-3 gap-3">
									<span class="keterangan-block blue"></span> <span class="fs-4 fw-bold">Lunas</span>
								</div>
								<div class="d-flex align-items-center mt-3 gap-3">
									<span class="keterangan-block red"></span> <span class="fs-4 fw-bold">Belum Lunas</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="d-flex w-100 justify-content-between pb-8 pt-4 px-10">
			<div class="d-flex w-100 gap-4 w-sm-auto">
				<ul class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap">
						<li class="nav-item">
							<a
								@click="changeTableTab('transaksi')"
								:class="`cursor-ponter nav-link me-6 ${tableTab == 'transaksi' ? 'active router-link-exact-active text-active-primary' : 'text-black-50'}`" style="cursor: pointer;"
							> 
								<span>Transaksi</span>
							</a>
						</li>
						<li class="nav-item">
							<a
								@click.prevent="changeTableTab('iuran')"
								:class="`cursor-ponter nav-link me-6 ${tableTab == 'iuran' ? 'active router-link-exact-active text-active-primary' : 'text-black-50'}`" style="cursor: pointer;"
							> 
								<span>Iuran	</span>
							</a>
						</li>
				</ul>
			</div>
		</div>

		<div class="card mb-5 mb-xxl-8" v-if="tableTab == 'transaksi'">
			<div class="card-body">
        <div class="page-content">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6 m-0">Transaksi</h2>
            </div>
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
        </div>
				<ServerSideTable
					ref="tableRef"
					:totalRows="transaksiData.totalRows || 0"
					:columns="transaksiData.columns"
					:rows="transaksiData.rows"
					@loadItems="getTransaksi">
					<template #table-row="{column, row}">
						<div v-if="column.field == 'payment_code'">
								#{{row.payment_code}}
						</div>
						<div v-if="column.field == 'status'">
							<span :class="'badge badge-light-' + (row.payment_status == 'Berhasil' ? 'success' : 'danger')">
								{{row.payment_status}}
							</span>
						</div>
						<div v-if="column.field == 'action'">
							<button
								class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
								@click="printInvoice(row.payment_id)">
								<i class="bi bi-printer-fill fs-3"></i>
							</button>
							<router-link :to="`/iuran/iuran-siswa/konfirmasi/${row.payment_id}`" class="btn btn-icon btn-bg-light btn-active-color-info btn-sm">
								<span class="svg-icon svg-icon-3">
									<inline-svg src="media/icons/duotune/files/fil001.svg"/>
								</span>
							</router-link>
						</div>
					</template>
				</ServerSideTable>
			</div>
		</div>
		<div class="card mb-5 mb-xxl-8" v-if="tableTab == 'iuran'">
			<div class="card-body">
        <div class="page-content">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6 m-0">Iuran</h2>
            </div>
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
        </div>
				<ServerSideTable
					ref="tableRef"
					:totalRows="iuranData.totalRows || 0"
					:columns="iuranData.columns"
					:rows="iuranData.rows"
					@loadItems="getIuran">
					<template #table-row="{column, row}">
						<div v-if="column.field == 'status'">
							<span :class="'badge badge-light-' + (row.status == 'Berhasil' ? 'success' : 'danger')">
								{{row.status}}
							</span>
						</div>
						<div v-if="column.field == 'option'">
							<button
								class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
								@click="dataPembayaran = row">
								<span class="svg-icon svg-icon-3">
									<i class="bi bi-receipt"></i>
								</span>
							</button>
						</div>
					</template>
				</ServerSideTable>
			</div>
		</div>

		<PembayaranIuran 
		 :activeData="dataPembayaran"
		 @close="dataPembayaran = null"
		/>
	</div>
</template>

<style scoped lang="scss">
.keterangan-block {
	width: 75px;
	height: 28px;

	/* belum lunas */
	display: inline-block;
	border-radius: 20px;

	/* Inside auto layout */
	flex: none;
	order: 0;
	flex-grow: 0;
	&.red{
		background: #FF5C5C;
	}
	&.blue{
		background: #6464FF;
	}
}
</style>