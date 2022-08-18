<script setup>
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import { request } from '@/util';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import ServerSideTable from '@/components/ServerSideTable.vue';
import FormModalAnswer from './FormModalAnswer'
import { deleteConfirmation } from '@/core/helpers/deleteconfirmation';
import { useToast } from 'vue-toast-notification';

onMounted(() => {
  getData()
  setCurrentPageBreadcrumbs('Detail Soal', ['LMS', 'Bank Soal'])
})

const route = useRoute()
const questionId = route.params.id
const detailData = ref([])

const mode = ref(null)
const activeData = ref(null)


const dataJawaban = reactive({
  columns: [
    { label: 'Jawaban', field: 'option_text', sortable: false },
    { label: 'Gambar', field: 'image', sortable: false },
    { label: 'Jawaban Benar', field: 'score', sortable: false },
    { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
  ],
  rows: [],
  totalRows: 0,
})

function getData() {
  request.post(`soal/detail`, null, {
    params: {
      question_id: questionId,
    }
  }).then(res => {
    detailData.value = res.data.data

    dataJawaban.rows = res.data.data.option
  })
}

function handleCloseForm() {
  mode.value = null
  activeData.value = null
}
function handleSubmitForm() {
  mode.value = null
  activeData.value = null
  getData()
}

function editData(data) {
  activeData.value = data
  mode.value = 'Edit'
}
function deleteData(id) {
  deleteConfirmation(() => {
    request.post('hapus_jawaban_soal', null, {
      params: {
        option_id: id
      }
    })
		.then(res => {
			useToast().success('Data Berhasil Dihapus!')
			getData()
		})
    
  })
}
</script>
<template>
<div>

  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="mb-4">
          <h2 class="fs-1 fw-bold py-6">Data Pertanyaan</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-8 py-4">
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Tipe Soal</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{detailData.question_type}}</h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Pertanyaan</h4></div>
            <div class="col-10 d-flex gap-1">
              <h4 class="fw-bold">: </h4>
              <div v-html="detailData.question_text">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Gambar</h4></div>
            <div class="col-10">
              <div class="bg-secondary p-2 d-inline-block" v-if="detailData.question_pict">
                <img :src="'data:image/jpeg;base64,' + detailData.question_pict" alt="" style="max-height: 300px;">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="mb-4">
          <div class="d-flex justify-content-between">
            <h2 class="fs-1 fw-bold py-6">Data Jawaban</h2>

            <div>
              <button @click="mode = 'Tambah'" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-plus fs-1"></i>
                <span>
                  Tambah Jawaban
                </span>
              </button>
            </div>
          </div>

        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div v-if="detailData.question_type != 'essay' ">
          <ServerSideTable
            :totalRows="dataJawaban.totalRows || 0"
            :columns="dataJawaban.columns"
            :rows="dataJawaban.rows"
            @loadItems="getData"
          >
            <template #table-row="{column, row}">
              <div v-if="column.field == 'image'">
                <div class="bg-secondary p-2 d-inline-block" v-if="row.option_pict">
                  <img :src="'data:image/jpeg;base64,' + row.option_pict" alt="" style="max-height: 120px;">
                </div>
              </div>
              <div v-if="column.field == 'score'">
                  <span v-if="row.score" class="badge badge-success">Jawaban Benar</span>
              </div>
              <div v-if="column.field == 'action'">
                <button @click="editData(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </button>
                <button @click="deleteData(row.option_id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/general/gen027.svg"/>
                  </span>
                </button>
              </div>
            </template>
          </ServerSideTable>
        </div>
      </div>
    </div>
  </div>
  <FormModalAnswer 
    :mode="mode"
    :activeData="activeData"
    :questionId="questionId"
    @close="handleCloseForm"
    @submit="handleSubmitForm"
  />
</div>
</template>