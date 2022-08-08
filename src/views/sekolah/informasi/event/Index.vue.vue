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
import moment from "moment";

  onMounted(() => {
    setCurrentPageBreadcrumbs("Event", ['Sekolah', "Informasi"]);
  })

  function getBerita (payload) {
      request.post('event', null, {
        params: {
          page: payload?.page ?? 1,
          sortby: payload?.sort?.type ?? 'ASC'
        }
      }).then(res => {
        event.rows = res.data.data.data
        event.totalRows = res.data.data.total
      })
    }

  const event = reactive({
    columns: [
      { label: 'Gambar', field: 'event_foto', sortable: false },
      { label: 'Tipe', field: 'event_type', sortable: false },
      { label: 'Judul', field: 'event_judul', sortable: false },
      { label: 'Tanggal', field: 'event_tanggal', sortable: false },
      { label: 'Status', field: 'event_status', sortable: false },
      { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })
  
  function deleteBerita(id) {
    deleteConfirmation(function() {
      request.get('konten/delete/' + id)
      .then(res => {
        useToast().success('Data Berhasil Dihapus!')
        getBerita()
      })
    })
  }
  
  function dateFormating(date) {
    return moment(date).format('YYYY-MM-DD h:mm:ss')
  }

</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div class="py-6 d-flex justify-content-between align-items-center">
          <h2 class="fs-1 fw-bold">Data Event</h2>
          
          <div class="d-flex align-items-center">
            <router-link to="/sekolah/informasi/event/tambah" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
              <i class="bi bi-plus fs-1"></i>
              <span>
                Tambah Event
              </span>
            </router-link>
          </div>
        </div>
        <div class="separator border-black-50 border-2 my-3"></div>
        <div class="my-5 mb-xxl-8">
          <ServerSideTable 
            :totalRows="event.totalRows || 0" 
            :columns="event.columns" 
            :rows="event.rows"
            @loadItems="getBerita">
            <template #table-row="{column, row}">
              <div v-if="column.field == 'event_foto'">
                <div class="p-2 bg-secondary d-inline-block">
                  <template v-if="row.event_foto">
                    <img class="image-thumbnail"  :src="storagePublic + '/images/event/' + row.event_foto" alt="">
                  </template>
                  <template v-if="!row.event_foto">
                    <span class="fw-bold fs-6 mx-2">NO IMAGE</span>
                  </template>
                </div>
              </div>
              <div v-if="column.field == 'event_tanggal'">
                {{dateFormating(row.event_mulai)}} --- {{dateFormating(row.event_selesai)}}
              </div>
              <div v-if="column.field == 'event_status'">
                <span :class="'badge badge-light-' + (row.event_status == '1' ? 'success' : 'danger')">{{row.event_status == '1' ?
                  'Aktif' : 'Non Aktif'}}</span>
              </div>
              <div v-if="column.field == 'action'">
                <router-link :to="'/sekolah/informasi/event/edit/' + row.event_id" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </router-link>
                <button @click="deleteBerita(row.event_id)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
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