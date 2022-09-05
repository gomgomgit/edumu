<script setup>
import { request } from '@/util';
import { includes } from 'lodash';
import QueryString from 'qs';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
  onMounted(() => {
    getKelas()
    if (liburId) {
      getLibur()
    }
  })

  const router = useRouter()
  const route = useRoute()

  const liburId = route.params.id

  const modalData = ref(null)
  const dateRange = ref(['', ''])
  const liburTanggal = ref()

  const initialFormData = {libur_id: '',  kelas_id: '', libur_desc: ''}

  const form = reactive({...initialFormData})

  const kelas = ref([])
  
  function getKelas() {
      request.post('kelas', null, {
        params: {
        }
      }).then(res => {
        kelas.value = res.data.data
      })
  }
  function getLibur() {
      request.get(`libur/${liburId}`)
      .then(res => {
        const result = res.data.data
        form.libur_desc = result.libur_desc
        form.libur_id = result.libur_id
        liburTanggal.value = result.libur_tanggal
      })
  }

  function changeDate() {
    form.libur_mulai = dateRange.value[0]
    form.libur_selesai = dateRange.value[1]
  }

  function kelasChange() {
    let selectedClass = ''
    if (form.kelas_id.includes('all')) {
      selectedClass = kelas.value.map(function (obj) {
        return obj.kelas_id
      })
      form.kelas_id = selectedClass
    }
  }
  function postKalender() {  
    // let selectedClass = ''
    // if (form.kelas_id.includes('all')) {
    //   selectedClass = kelas.value.map(function (obj) {
    //     return obj.kelas_id
    //   })
    // } else {
    //   selectedClass = form.kelas_id
    // }
    
    const formData = new FormData()
    formData.append('libur_id', form.libur_id)
    formData.append('kelas_id', form.kelas_id)
    formData.append('libur_desc', form.libur_desc)
    if (liburId) {
      formData.append('libur_tanggal', liburTanggal.value)
    } else {
      formData.append('libur_mulai', dateRange.value[0])
      formData.append('libur_selesai', dateRange.value[1])
    }

    const endPoint = liburId ? 'libur/edit' : 'libur/add'
    const message = liburId ? 'Data Berhasil Diperbaharui!' : 'Data Berhasil Ditambahkan!'
    request.post(endPoint, formData)
    .then(res => {
      useToast().success(message)
      Object.assign(form, initialFormData)
      dateRange.value = []
      router.push('/sekolah/akademik/kalender-akademik')
    })
  }
</script>

<template>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body pt-5 pb-5">
        
        <!-- Page Content -->
        <div class="page-content">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6 m-0">Tambah Kalender Akademik</h2>
            </div>
          </div>
          <div class="separator border-black-50 border-2 my-3"></div>
        </div>
      </div>
      <div class="mb-5 mb-xxl-8 px-12">
        <div class="row gy-6">
          <div v-if="!liburId" class="col-4 d-flex align-items-center fw-bold fs-4">Tahun Ajar</div>
          <div v-if="!liburId" class="col-8">
            <el-select
              v-model="form.kelas_id"
              multiple
              placeholder="Pilih Kelas"
              style="width: 100%"
              filterable
            >
              <el-option label="Pilih Semua" value="all"/>
              <el-option
                v-for="clas in kelas"
                :key="clas.kelas_id"
                :label="clas.kelas_nama"
                :value="clas.kelas_id"
              />
            </el-select>
          </div>

          <div v-if="!liburId" class="col-4 d-flex align-items-center fw-bold fs-4">Tanggal</div>
          <div v-if="!liburId" class="col-8">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="Sampai"
              start-placeholder="Mulai libur"
              end-placeholder="Selesai libur"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              size="large"
            />
          </div>
          <div v-if="liburId" class="col-4 d-flex align-items-center fw-bold fs-4">Tanggal</div>
          <div v-if="liburId" class="col-8">
            <el-date-picker
              v-model="liburTanggal"
              type="date"
              placeholder="Tanggal libur"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              size="large"
            />
          </div>

          <div class="col-4 d-flex align-items-center fw-bold fs-4">Deskripsi</div>
          <div class="col-8">
            <input type="text" v-model="form.libur_desc" class="form-control" placeholder=""/>
          </div>
          
          <div class="d-flex justify-content-end gap-4">
            <a @click.prevent="router.go(-1)" href="#" class="btn btn-light">Batal</a>
            <a @click.prevent="postKalender" class="btn btn-primary">Simpan</a>
          </div>
        </div>
      </div>
    </div>
</template>