<script setup>
import { request } from "@/util"
import { onMounted, reactive, ref } from "@vue/runtime-core"
import { useRoute } from "vue-router"
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import ServerSideTable from '@/components/ServerSideTable.vue'
import { useToast } from "vue-toast-notification";
import PembayaranIuran from './PembayaranIuran.vue';


const route = useRoute()
const siswaId = route.params.id
const siswaNama = atob(route.params.nama)
const kelasNama = atob(route.params.kelas)

const dataPembayaran = ref()

const summary = reactive({
  totalTagihan: 0,
  totalBayar: 0,
  jumlahKurang: 0,
})
const tagihanData = reactive({
	columns: [
		{ label: 'Total Tagihan', field: 'master_nominal', sortable: false },
		{ label: 'Nama Tagihan', field: 'tipe_nama', sortable: false },
		{ label: 'Opsi', field: 'option', sortable: false, width: '200px' },
	],
	rows: [],
	totalRows: 0,
})
const transaksiData = reactive({
	columns: [
		{ label: 'Kode Transaksi', field: 'payment_code', sortable: false },
		{ label: 'Detail', field: 'detail', sortable: false },
		{ label: 'Total Tagihan', field: 'totBayar', sortable: false },
		{ label: 'Total Bayar', field: 'totDibayar', sortable: false },
		{ label: 'Total Kurang', field: 'totSisa', sortable: false },
		{ label: 'Status', field: 'status', sortable: false },
		{ label: 'Opsi', field: 'option', sortable: false, width: '200px' },
	],
	rows: [],
	totalRows: 0,
})

function getKeuangan (payload) {
	request.get('siswa/finance/' + siswaId, {
		params: {
			page: payload?.page ?? 1,
		}
	}).then(res => {
    summary.totalTagihan = res.data.data.totalTagihan
    summary.totalBayar = res.data.data.totalDibayar
    summary.jumlahKurang = res.data.data.totalSisa
		tagihanData.rows = res.data.data.siswa.data
		tagihanData.totalRows = res.data.data.siswa.total
		transaksiData.rows = res.data.data.trans.data
		transaksiData.totalRows = res.data.data.trans.total
	})
}
function getInvoice(id) {
  request.get('iuran/transaksi/invoice/' + id)
  .then(res => {
    if (res.data.success) {
      window.open(res.data.data.link, '_blank')
    }
  })
}
function submitPembayaran() {
  dataPembayaran.value = null
  getKeuangan()
}

function moneyFormat(money) {
	return Intl.NumberFormat('id-ID').format(money)
}
onMounted(() => {
	setCurrentPageBreadcrumbs("Keuangan", ['Iuran', 'Iuran Siswa']);
  // getKeuangan()
})
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
			<div class="card-body">
        <div class="page-content">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6 m-0">Data Keuangan</h2>
            </div>
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
          <div class="mt-4">
            <div class="row mb-3">
              <div class="col-2 fw-bold fs-4">
                Nama Siswa
              </div>
              <div class="col-10 fw-bold fs-4">
                : {{siswaNama}}
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-2 fw-bold fs-4">
                Kelas
              </div>
              <div class="col-10 fw-bold fs-4">
                : {{kelasNama}}
              </div>
            </div>
          </div>
          <div> 
            <div class="row mt-5">
              <div class="col-md-4">
                <section class="summary-item bg-success bg-opacity-10 p-6 rounded-2">
                  <div class="h5 text-black-50">Total Tagihan</div>
                  <p class="display-6 text-success">Rp {{moneyFormat(summary.totalTagihan)}}</p>
                  <i class="summary-icon text-success uil uil-bill opacity-25"></i>
                </section>
              </div>
              <div class="col-md-4">
                <section class="summary-item bg-primary bg-opacity-10 p-6 rounded-2">
                  <div class="h5 text-black-50">Total Bayar</div>
                  <p class="display-6 text-primary">Rp {{moneyFormat(summary.totalBayar)}}</p>
                  <i class="summary-icon text-primary uil uil-dollar-alt opacity-25"></i>
                </section>
              </div>
              <div class="col-md-4">
                <section class="summary-item bg-warning bg-opacity-10 p-6 rounded-2">
                  <div class="h5 text-black-50">Jumlah Kurang</div>
                  <p class="display-6 text-warning">Rp {{moneyFormat(summary.jumlahKurang)}}</p>
                  <i class="summary-icon text-warning uil uil-money-bill-slash opacity-25"></i>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
		<div class="card mb-5 mb-xxl-8">
			<div class="card-body">
        <div class="page-content">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6 m-0">Tagihan Siswa</h2>
            </div>
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
        </div>
				<ServerSideTable
					ref="tableRef"
					:totalRows="tagihanData.totalRows || 0"
					:columns="tagihanData.columns"
					:rows="tagihanData.rows"
					@loadItems="getKeuangan">
					<template #table-row="{column, row}">
						<div v-if="column.field == 'master_nominal'">
							Rp {{moneyFormat(row.master_nominal)}}
						</div>
						<div v-if="column.field == 'option'">
							<button
								class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
								@click="dataPembayaran = row">
								<span class="svg-icon svg-icon-3">
									<i class="bi bi-cash-coin fs-2"></i> 
								</span>
							</button>
						</div>
					</template>
				</ServerSideTable>
			</div>
		</div>
    
		<div class="card mb-5 mb-xxl-8">
			<div class="card-body">
        <div class="page-content">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6 m-0">Transaksi Siswa</h2>
            </div>
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
        </div>
				<ServerSideTable
					ref="tableRef"
					:totalRows="transaksiData.totalRows || 0"
					:columns="transaksiData.columns"
					:rows="transaksiData.rows"
					@loadItems="getKeuangan">
					<template #table-row="{column, row}">
						<div v-if="column.field == 'payment_code'">
							#{{row.payment_code}}
						</div>
						<div v-if="column.field == 'detail'">
              <div>{{row.payment_remark}}</div>
              <div class="mt-4">
                <template v-for="det in row.detail" :key="det.data_id">
                  <div>{{det.item_nama}} Rp {{moneyFormat(det.nominal)}}</div>
                </template>
              </div>
						</div>
						<div v-if="column.field == 'totBayar'">
							Rp {{moneyFormat(row.totBayar)}}
						</div>
						<div v-if="column.field == 'totDibayar'">
              <div>
                Rp {{moneyFormat(row.totDibayar)}}
              </div>
              <div class="mt-4">
                <template v-for="bayar, indexBayar in row.detailBayar" :key="bayar.data_id">
                  <div>{{indexBayar + 1}}. Rp {{moneyFormat(bayar.nominal)}}</div>
                </template>
              </div>
						</div>
						<div v-if="column.field == 'totSisa'">
							Rp {{moneyFormat(row.totSisa)}}
						</div>
						<div v-if="column.field == 'status'">
							<span :class="'badge badge-light-' + (row.status == 'Lunas' ? 'success' : 'danger')">
								{{row.status}}
							</span>
						</div>
						<div v-if="column.field == 'option'">
							<button
								class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
								@click="getInvoice(row.payment_id)">
								<span class="svg-icon svg-icon-3">
  								<i class="bi bi-printer-fill fs-2"></i>
								</span>
							</button>
							<button v-if="row.totSisa > 0"
								class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
								@click="dataPembayaran = row">
								<span class="svg-icon svg-icon-3">
									<i class="bi bi-cash-coin fs-2"></i> 
								</span>
							</button>
							<!-- <button
								class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
								@click="dataPembayaran = row">
								<span class="svg-icon svg-icon-3">
									<i class="bi bi-receipt"></i>
								</span>
							</button> -->
						</div>
					</template>
				</ServerSideTable>
			</div>
		</div>

		<PembayaranIuran 
      :activeData="dataPembayaran"
      @close="dataPembayaran = null"
      @submit="submitPembayaran()"
		/>
  </div>
</template>

<style scoped>
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