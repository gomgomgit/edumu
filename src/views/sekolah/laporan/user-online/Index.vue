<script setup>
  import { ref, onMounted, reactive } from "vue";
  import { request } from '@/util'
  import Modal from "@/components/modals/CustomModal.vue";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import ServerSideTable from '@/components/ServerSideTable.vue'
  import FilterSelect from '@/components/filter-select'
  import { Search } from '@element-plus/icons-vue'
import { useToast } from "vue-toast-notification";
import { deleteConfirmation } from "@/core/helpers/deleteconfirmation";

  onMounted(() => {
    setCurrentPageBreadcrumbs("User Online", ['Sekolah', "Laporan"]);
  })

  function getOnline (payload) {
      request.post('reportonline', null, {
        params: {
          user_level: levelFilter.value,
          page: payload?.page ?? 1,
          sortby: payload?.sort?.type ?? 'ASC'
        }
      }).then(res => {
        listOnline.rows = res.data.data.listOnline.data
        listOnline.totalRows = res.data.data.listOnline.total

        userOnline.guruAktif = res.data.data.guruAktif
        userOnline.guruOn = res.data.data.guruOn
        userOnline.siswaOn = res.data.data.sisOn
        userOnline.siswaAktif = res.data.data.siswaAktif
        userOnline.userAktif = res.data.data.userAktif
        userOnline.waliAktif = res.data.data.waliAktif
      })
    }

  const userOnline = reactive({
    guruAktif: 0,
    guruOn: 0,
    siswaOn: 0,
    siswaAktif: 0,
    userAktif: 0,
    waliAktif: 0,
  })

  const listOnline = reactive({
    columns: [
      { label: 'Nama Lengkap', field: 'user_nama', sortable: false },
      { label: 'Device', field: 'user_device_name', sortable: false },
      { label: 'Level', field: 'user_level', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })

  const searchFilter = ref('')
  const levelFilter = ref('')
  const levelOption = ref([
    {
      value: 'siswa',
      label: 'Siswa',
    },
    {
      value: 'guru',
      label: 'Guru',
    },
    {
      value: 'wali',
      label: 'Wali',
    },
  ])
</script>

<template>
  <div>
    <div class="mb-6 d-flex gap-5 justify-content-between">
      <div class="w-100">
        <section class="summary-item bg-success bg-opacity-10 p-4 rounded-2 h-100">
          <p class="display-5 text-success">{{userOnline.userAktif}}</p>
          <div class="h5">Total User</div>
          <div class="text-dark small">Aktif</div>
          <i class="summary-icon text-success uil uil-users-alt opacity-25"></i>
        </section>
      </div>
      <div class="w-100">
        <section class="summary-item bg-primary bg-opacity-10 p-4 rounded-2 h-100">
          <p class="display-5 text-primary">{{userOnline.siswaAktif}}</p>
          <div class="h5">Siswa Aktif</div>
          <div class="text-dark small">Online: {{userOnline.siswaOn}}</div>
          <i class="summary-icon text-primary uil uil-graduation-cap opacity-25"></i>
        </section>
      </div>
      <div class="w-100">
        <section class="summary-item bg-info bg-opacity-10 p-4 rounded-2 h-100">
          <p class="display-5 text-info">{{userOnline.guruAktif}}</p>
          <div class="h5">Guru Aktif</div>
          <div class="text-dark small">Online: {{userOnline.guruOn}}</div>
          <i class="summary-icon text-info uil uil-presentation-lines-alt opacity-25"></i>
        </section>
      </div>
      <div class="w-100">
        <section class="summary-item bg-warning bg-opacity-10 p-4 rounded-2 h-100">
          <p class="display-5 text-warning">{{userOnline.waliAktif}}</p>
          <div class="h5">Wali Aktif</div>
          <div class="text-dark small">Aktif</div>
          <i class="summary-icon text-warning uil uil-house-user opacity-25"></i>
        </section>
      </div>
      <div class="w-100">
        <section class="summary-item bg-danger bg-opacity-10 p-4 rounded-2 h-100">
          <p class="display-5 text-danger">{{listOnline.totalRows}}</p>
          <div class="h5">Total Hasil Filter</div>
          <div class="text-dark small"></div>
          <i class="summary-icon text-danger uil uil-file-search-alt opacity-25"></i>
        </section>
      </div>
    </div>
    <!-- <div class="mb-6 d-flex gap-5 justify-content-between">
      <div class="w-100">
        <div class="card h-100 w-100">
          <div class="card-body d-flex flex-column px-9 pt-6 pb-8">
            <div class="fs-3tx fw-bolder mb-3">
              {{userOnline.userAktif}}
            </div>
            <div class="d-flex align-items-center flex-wrap mb-2 mt-auto fs-6">
              <div class="fw-bolder me-2 fs-3">
                Total User
              </div>
            </div>
            <div class="d-flex align-items-center fw-bold">
              <span class="text-black-50 fs-5">Aktif</span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-100">
        <div class="card h-100 w-100">
          <div class="card-body d-flex flex-column px-9 pt-6 pb-8">
            <div class="fs-3tx fw-bolder mb-3">
              {{userOnline.siswaAktif}}
            </div>
            <div class="d-flex align-items-center flex-wrap mb-2 mt-auto fs-6">
              <div class="fw-bolder me-2 fs-3">
                Siswa Aktif
              </div>
            </div>
            <div class="d-flex align-items-center fw-bold">
              <span class="text-black-50 fs-5">Online: {{userOnline.siswaOn}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-100">
        <div class="card h-100 w-100">
          <div class="card-body d-flex flex-column px-9 pt-6 pb-8">
            <div class="fs-3tx fw-bolder mb-3">
              {{userOnline.guruAktif}}
            </div>
            <div class="d-flex align-items-center flex-wrap mb-2 mt-auto fs-6">
              <div class="fw-bolder me-2 fs-3">
                Guru Aktif
              </div>
            </div>
            <div class="d-flex align-items-center fw-bold">
              <span class="text-black-50 fs-5">Online: {{userOnline.guruOn}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-100">
        <div class="card h-100 w-100">
          <div class="card-body d-flex flex-column px-9 pt-6 pb-8">
            <div class="fs-3tx fw-bolder mb-3">
              {{userOnline.waliAktif}}
            </div>
            <div class="d-flex align-items-center flex-wrap mb-2 mt-auto fs-6">
              <div class="fw-bolder me-2 fs-3">
                Wali Aktif
              </div>
            </div>
            <div class="d-flex align-items-center fw-bold">
              <span class="text-black-50 fs-5">Aktif</span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-100">
        <div class="card h-100 w-100">
          <div class="card-body d-flex flex-column px-9 pt-6 pb-8">
            <div class="fs-3tx fw-bolder mb-3">
              {{listOnline.totalRows}}
            </div>
            <div class="d-flex align-items-center flex-wrap mb-2 mt-auto fs-6">
              <div class="fw-bolder me-2 fs-3">
                Total Hasil filter
              </div>
            </div>
            <div class="d-flex align-items-center fw-bold">
              <span class="text-black-50 fs-5"></span>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div class="py-6 d-flex justify-content-between align-items-center">
          <h2 class="fs-1 fw-bold">Data User Online</h2>
          
        </div>
        <div class="separator border-black-50 border-2 my-3"></div>
        <div>
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="position-relative d-flex gap-4">
              <div>
                <FilterSelect 
                  v-model:filterValue="levelFilter"
                  :options="levelOption"
                  @changeFilter="getOnline()"
                  placeholder="Pilih Level">
                </FilterSelect>
              </div>
            </div>

            <div class="d-flex gap-4">
              <!-- <div>
                <el-input
                  v-model="searchFilter"
                  class="m-2"
                  placeholder="Cari Nama"
                  :suffix-icon="Search"
                />
              </div> -->
            </div>
          </div>
        </div>
        <div class="my-5 mb-xxl-8">
          <ServerSideTable 
            :key="searchFilter"
            :totalRows="listOnline.totalRows || 0" 
            :columns="listOnline.columns" 
            :rows="listOnline.rows"
            @loadItems="getOnline">
            <template #table-row="{column, row}">
              <div v-if="column.field == 'arsipFile'">
                <span v-if="!row.arsipFile[0]" class="badge badge-light-danger">
                  File Kosong
                </span>
                <template v-if="row.arsipFile[0]" v-for="arsip in row.arsipFile">
                  <div>
                    <span class="badge badge-light-success">
                      {{arsip.arsip_cat_name}}
                    </span>
                  </div>
                </template>
              </div>
              <div v-if="column.field == 'action'">
                <router-link :to="'/sekolah/e-document/detail/' + row.user_id + '/' + row.user_nama" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <i class="bi bi-eye-fill fs-3"></i>
                  </span>
                </router-link>
              </div>
            </template>
          </ServerSideTable>
        </div>
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