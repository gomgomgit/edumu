<script setup>
import { onMounted, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from '@/util';
import { useToast } from 'vue-toast-notification';
import { useRouter } from 'vue-router';
import FileDrop from '@/components/file-dropzone/Index.vue';
import * as XLSX from 'xlsx';

onMounted(() => {
  setCurrentPageBreadcrumbs("Import Soal", ['LMS', 'Bank Soal']);
  getData()
})

const router = useRouter()

const guruOption = ref(null)
const mapelOption = ref(null)

const form = reactive({
  user_id: '',
  mapel_id: '',
  question_type: '',
  option_count: '',
  file: '',
})

function getData() {
  request.post("user", null, {
    params: {
      level: 'guru'
    }
  }).then(res => {
    guruOption.value = res.data.data
  })
  request.post('mapel')
    .then(res => {
      mapelOption.value = res.data.data
    })
}

function postData() {
  const formData = new FormData()
  formData.append('user_id', form.user_id)
  formData.append('mapel_id', form.mapel_id)
  formData.append('question_type', form.question_type)
  formData.append('option_count', form.option_count)
  formData.append('file', form.file)

  request.post('soal/import', formData, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
    useToast().success('Data Berhasil dikirim')
  })
}

function generate() {
  if (form.question_type === '') {
			useToast().warning("Type soal wajib dipilih!");return false;
		}

		if (form.mapel_id === '') {
			useToast().warning("Mapel wajib dipilih!");return false;
		}

		if (form.question_type !== 'essay' && form.option_count === '') {
			useToast().warning("Jumlah opsi harus diisi!");return false;
		}

		if (form.question_type == 'single') {
			let row = ["mapel", "soal", "jmlOpsi"];
			for (var i = 1; i <= form.option_count; i++) {
				row.push(i);
			}

			row.push('jwbBenar');
			row.push('keteranganSoal');

	        let single = [row]

	        single.push([form.mapel_id,"", form.option_count])
	        const wb = XLSX.utils.book_new()
	        const wsAll = XLSX.utils.aoa_to_sheet(single)
	            XLSX.utils.book_append_sheet(wb, wsAll, form.question_type)
	            XLSX.writeFile(wb, "Format Import Soal "+ form.question_type +".xlsx");
		}

		if (form.question_type == 'essay') {
			let row = ["mapel", "soal","keteranganSoal"];
	        let essay = [row]

	        essay.push([form.mapel_id,""])
	        const wb = XLSX.utils.book_new()
	        const wsAll = XLSX.utils.aoa_to_sheet(essay)
	            XLSX.utils.book_append_sheet(wb, wsAll, form.question_type)
	            XLSX.writeFile(wb, "Format Import Soal "+ form.question_type +".xlsx");
		}
}
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6 m-0">Import Soal</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-4">
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Nama Guru</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="form.user_id" placeholder="Pilih Guru">
                <el-option v-for="guru in guruOption" :label="guru.user_nama" :value="guru.user_id" />
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Nama Mapel</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="form.mapel_id" placeholder="Pilih Mapel">
                <el-option v-for="mapel in mapelOption" :label="mapel.mapel_nama" :value="mapel.mapel_id" />
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Tipe Soal</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="form.question_type" placeholder="Tipe Soal">
                <el-option label="Single Option" value="single" />
                <el-option label="Essay" value="essay" />
              </el-select>
            </div>
          </div>
          <div class="row" v-if="form.question_type == 'single'">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Opsi Soal</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="form.option_count" placeholder="Opsi Soal">
                <el-option label="3" value="3" />
                <el-option label="4" value="4" />
                <el-option label="5" value="5" />
                <el-option label="6" value="6" />
              </el-select>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end mt-4">
          <div>
            <a @click="generate" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
              <span>
                Generate Excel Format
              </span>
            </a>
          </div>
        </div>

        <div class="mt-4">

          <div class="mt-4">
            <p class="mb-2 fs-4 fw-bold">File Import</p>
            <p class="mb-2">*Tentukan soal mapel apa yg anda ingin import, Lalu generate excel format</p>
            <p class="mb-2">*Pastikan file sesuai formatnya seperti yg anda generate</p>
            <FileDrop v-model:fileInputData="form.file"></FileDrop>
          </div>
          <div class="d-flex justify-content-end gap-4">
            <a @click.prevent="router.push('/sekolah/profil-pengguna/guru')" href="#" class="btn btn-light">Batal</a>
            <a @click.prevent="postData" class="btn btn-primary">Simpan</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>