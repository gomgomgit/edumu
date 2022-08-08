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
    setCurrentPageBreadcrumbs("Berita", ['Sekolah', "Informasi"]);
  })

  function getBerita (payload) {
      request.post('konten', null, {
        params: {
          cari: seacrhFilter.value,
          page: payload?.page ?? 1,
          sortby: payload?.sort?.type ?? 'ASC'
        }
      }).then(res => {
        berita.rows = res.data.data.data
        berita.totalRows = res.data.data.total
      })
    }

  const berita = reactive({
    columns: [
      { label: 'Gambar', field: 'content_image', sortable: false },
      { label: 'Judul', field: 'content_name', sortable: false },
      { label: 'Deskripsi', field: 'content_shortdesc', sortable: false },
      { label: 'Status', field: 'content_status', sortable: false },
      { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })

  const seacrhFilter = ref('')
  const statusFilter = ref('')

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
  
  function deleteBerita(id) {
    deleteConfirmation(function() {
      request.get('konten/delete/' + id)
      .then(res => {
        useToast().success('Data Berhasil Dihapus!')
        getBerita()
      })
    })
  }

</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div class="py-6 d-flex justify-content-between align-items-center">
          <h2 class="fs-1 fw-bold">Data Berita</h2>
          
          <div class="d-flex align-items-center">
            <router-link to="/sekolah/informasi/berita/tambah" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
              <i class="bi bi-plus fs-1"></i>
              <span>
                Tambah Berita
              </span>
            </router-link>
          </div>
        </div>
        <div class="separator border-black-50 border-2 my-3"></div>
        <!-- <div>
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <div>
                <el-input
                  v-model="seacrhFilter"
                  class="m-2"
                  placeholder="Please Input"
                  :suffix-icon="Search"
                />
              </div>
            </div>

            <div class="position-relative d-flex gap-4">
              <div>
                <FilterSelect v-model:filterValue="statusFilter" :options="statusOption"
                  @changeFilter="changeFilter('status')" placeholder="Pilih Status" />
              </div>
              <div class="d-flex align-items-center">
                <router-link to="/sekolah/informasi/berita/tambah" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <i class="bi bi-plus fs-1"></i>
                  <span>
                    Tambah Berita
                  </span>
                </router-link>
              </div>
            </div>
          </div>
        </div> -->
        <div class="my-5 mb-xxl-8">
          <ServerSideTable 
            :totalRows="berita.totalRows || 0" 
            :columns="berita.columns" 
            :rows="berita.rows"
            @loadItems="getBerita">
            <template #table-row="{column, row}">
              <div v-if="column.field == 'content_image'">
                <div class="p-2 bg-secondary d-inline-block">
                  <template v-if="row.content_image">
                    <img class="image-thumbnail"  :src="publicApi + '/images/konten/' + row.content_image" alt="">
                  </template>
                  <template v-if="!row.content_image">
                    <span class="fw-bold fs-6 mx-2">NO IMAGE</span>
                  </template>
                </div>
              </div>
              <div v-if="column.field == 'content_status'">
                <span :class="'badge badge-light-' + (row.content_status == '1' ? 'success' : 'danger')">{{row.content_status == '1' ?
                  'Aktif' : 'Non Aktif'}}</span>
              </div>
              <div v-if="column.field == 'action'">
                <router-link :to="'/sekolah/informasi/berita/edit/' + row.content_id" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </router-link>
                <button @click="deleteBerita(row.content_id)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/general/gen027.svg" />
                  </span>
                </button>
              </div>
            </template>
          </ServerSideTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.image-thumbnail{
  max-width: 80px;
  max-height: 60px;
}
</style>