<script setup>
import { onMounted, watch, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { useRouter } from 'vue-router';
import { request } from '@/util'  
import { useToast } from "vue-toast-notification"
import { useStore } from "vuex"
import moment from "moment";
import QueryString from "qs"
import GroupModal from './GroupModal'
import TypeModal from './TypeModal'

onMounted(() => {
	setCurrentPageBreadcrumbs("Tambah Master Iuran", ['Iuran', 'Master Iuran']);
	getGrupIuran()
})

const router = useRouter()
const store = useStore()

const userId = store.getters.currentUser.user_id 

const groupMode = ref()
const typeMode = ref()
const activeData = ref()

const grupIuran = ref()

const form = reactive({
  created_by: userId,
  master_id: '',
  group_id: '',
  master_tgl_jatuh_tempo: '',
  tipe_id: '',
  master_nominal: '',
  jenisIuran: [],
})

function getGrupIuran () {
	request.get('iuran/group')
  .then(res => {
		grupIuran.value = res.data.data
	})
}

function getJenisIuran () {
	request.get('iuran/tipe', {
    params: {
      group_id: form.group_id
    }
  }, {
	}).then(res => {
    const result = res.data.data
		form.jenisIuran.value = []
    result.forEach(tipe => {
      form.jenisIuran.push({
        key: tipe.tipe_id,
        groupId: form.group_id,
        value: tipe.tipe_nama,
        nominal: tipe.nominal,
        due: moment().format('YYYY-MM-DD')
      })
    });
	})
}

function post() {
  const formData = new FormData()
  formData.append('created_by', form.created_by)
  formData.append('master_id', form.master_id)
  formData.append('group_id', form.group_id)
  formData.append('master_tgl_jatuh_tempo', form.master_tgl_jatuh_tempo)
  formData.append('tipe_id', form.tipe_id)
  formData.append('master_nominal', form.master_nominal)
  formData.append(`jenisIuran`, JSON.stringify(form.jenisIuran))
  
  request.post('iuran/master/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  })
  .then(res => {
    useToast().success('Data Berhasil Ditambahkan!')
    router.push('/iuran/master-iuran')
  })
}

watch(
  () => form.group_id,
  () => {
    if (form.group_id) {
      getJenisIuran()
    } else {
      form.jenisIuran.value = []
    }
  }
)
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">Tambah Data Siswa</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-4">
          <div class="row align-items-center">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Grup Iuran</p>
            </div>
            <div class="col-9">
              <div class="row g-4 align-items-center">
                <div class="col-9">
                  <el-select clearable class="w-100" v-model="form.group_id" filterable placeholder="Pilih Grup">
                    <el-option v-for="grup in grupIuran" :key="grup.group_id" :label="grup.group_nama"
                      :value="grup.group_id" />
                  </el-select>
                </div>
                <div class="col-3">
                  <button @click="groupMode = 'Tambah'"
                    class="btn btn-primary d-flex gap-3 align-items-center w-auto w-lg-100">
                    <i class="bi bi-plus fs-1 p-0"></i>
                    <span class="d-none d-lg-inline">
                      Tambah Grup
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="form.jenisIuran.length <= 0" class="row align-items-center">
            <div class="alert alert-primary d-flex align-items-center p-5 gap-4">
                <span class="svg-icon svg-icon-2hx svg-icon-primary me-3">
                  <i class="bi bi-exclamation-triangle-fill fs-2x text-primary"></i>
                </span>
                <div class="">
                    <p v-if="!form.group_id" class="m-0 fs-4 text-dark">Mohon Pilih Grup Iuran!</p>
                    <p v-if="form.group_id && form.jenisIuran.length <= 0" class="m-0 fs-4 text-dark">Tipe Iuran Belum Ditambahkan, Mohon tambah tipe iuran!</p>
                </div>
            </div>
          </div>

          <template v-if="form.jenisIuran.length > 0" v-for="tipe in form.jenisIuran">
            <div class="row align-items-center">
              <div class="col-3 align-items-center d-flex">
                <p class="m-0 fs-4 fw-bold">{{tipe.value}}</p>
              </div>
              <div class="col-9">
                <div class="row  align-items-center">
                  <div class="col-7">
                    <el-input v-model="tipe.nominal" placeholder="Nominal" />
                  </div>
                  <div class="col-5">
                    <el-date-picker
                      v-model="tipe.due"
                      type="date"
                      format-value="YYYY-MM-DD"
                      placeholder="Pick a day"
                      size="large"
                      class="w-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div v-if="form.group_id">
            <button @click="typeMode = 'Tambah'"
              class="btn btn-primary d-flex gap-3 align-items-center">
              <i class="bi bi-plus fs-1 p-0"></i>
              <span>
                Tambah Jenis Iuran
              </span>
            </button>
          </div>
          <div class="d-flex justify-content-end gap-4">
            <a href="#" @click.prevent="router.push('/iuran/master-iuran')" class="btn btn-light">Batal</a>
            <a href="#" @click.prevent="post" class="btn btn-primary">Simpan</a>
          </div>
        </div>
      </div>
    </div>
    
		<GroupModal
			:mode="groupMode"
			:activeData="activeData"
			@close="groupMode = ''"
			@submit="getGrupIuran" />
      
		<TypeModal
			:mode="typeMode"
			:activeData="activeData"
      :groupId="form.group_id"
			@close="typeMode = ''"
			@submit="getJenisIuran" />
  </div>
</template>