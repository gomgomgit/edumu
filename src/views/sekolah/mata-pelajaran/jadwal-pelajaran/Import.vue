<script setup>
import { onMounted, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from '@/util';
import { useToast } from 'vue-toast-notification';
import { useRouter } from 'vue-router';
import FileDrop from '@/components/file-dropzone/Index.vue';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

onMounted(() => {
  setCurrentPageBreadcrumbs("Import Soal", ['LMS', 'Bank Soal']);
  getData()
})

const router = useRouter()

const guruOption = ref(null)
const mapelOption = ref(null)
const kelasOption = ref(null)

const form = reactive({
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
  request.post('kelas')
  .then(res => {
    kelasOption.value = res.data.data
  })
}

function postData() {
  const formData = new FormData()
  formData.append('user_id', form.user_id)
  formData.append('mapel_id', form.mapel_id)
  formData.append('question_type', form.question_type)
  formData.append('option_count', form.option_count)
  formData.append('file', form.file)

  request.post('jadwal/importjadwal', formData, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
    useToast().success('Data Berhasil dikirim')
    router.push('/sekolah/mata-pelajaran/jadwal-pelajaran')
  })
}

function generate() {
    if (!kelasOption.value || !mapelOption.value || !guruOption.value ) {
      Swal.fire({
        icon: 'error',
        title: 'Data sedang diproses, tunggu sebentar, dan coba kembali'
      })
    }
    let rowKelas = [["No", "Id Kelas","Nama Kelas"]];
    kelasOption.value.forEach((kelas, index) => {
      rowKelas.push([index + 1, kelas.kelas_id, kelas.kelas_nama])
    });

    let rowMapel = [["No", "Id Mapel","Nama Mapel"]];
    mapelOption.value.forEach((mapel, index) => {
      rowMapel.push([index + 1, mapel.mapel_id, mapel.mapel_nama])
    });

    let rowGuru = [["No", "Id Guru","Nama Guru"]];
    guruOption.value.forEach((guru, index) => {
      rowGuru.push([index + 1, guru.user_id, guru.user_nama])
    });

    let rowHari = [
      ["No", "Id Hari","Nama Hari"],
      [1, 1,"Senin"],
      [2, 2,"Selasa"],
      [3, 3,"Rabu"],
      [4, 4,"Kamis"],
      [5, 5,"Jum'at"],
      [6, 6,"Sabtu"],
      [7, 7,"Minggu"],
    ];

    let rowFormat = [["No", "Kelas Id","Mapel Id", "User Id", "Hari", "Jam Mulai", "Jam Selesai"]];

    var wsKelas = XLSX.utils.aoa_to_sheet(rowKelas);
    var wsMapel = XLSX.utils.aoa_to_sheet(rowMapel);
    var wsGuru = XLSX.utils.aoa_to_sheet(rowGuru);
    var wsHari = XLSX.utils.aoa_to_sheet(rowHari);
    var wsFormat = XLSX.utils.aoa_to_sheet(rowFormat);

    var wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, wsMapel, "Data Mapel");
    XLSX.utils.book_append_sheet(wb, wsKelas, "Data Kelas");
    XLSX.utils.book_append_sheet(wb, wsGuru, "Data Guru");
    XLSX.utils.book_append_sheet(wb, wsHari, "Data Hari");
    XLSX.utils.book_append_sheet(wb, wsFormat, "Format Import Jadwal");

    XLSX.writeFile(wb, "Format Import Jadwal.xlsx");
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
        
        <div class="mt-4">
          <div class="d-flex justify-content-between">
            <div class="mt-4">
              <p class="mb-2 fs-4 fw-bold">File Import</p>
              <p class="mb-2">*Generate excel format</p>
              <p class="mb-2">*Pastikan file sesuai formatnya seperti yg anda generate</p>
            </div>
            <div>
              <a @click="generate" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <span>
                  Generate Excel Format
                </span>
              </a>
            </div>
          </div>
          <div>
            <FileDrop v-model:fileInputData="form.file"></FileDrop>
          </div>
          <div class="d-flex justify-content-end gap-4">
            <a @click.prevent="router.push('/sekolah/mata-pelajaran')" href="#" class="btn btn-light">Batal</a>
            <a @click.prevent="postData" class="btn btn-primary">Simpan</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>