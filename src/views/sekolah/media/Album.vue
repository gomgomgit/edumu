<script setup>
  import { ref, onMounted, reactive } from "vue";
  import { request } from '@/util'
  import qs from 'qs'
  import Modal from "@/components/modals/CustomModal.vue";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import ServerSideTable from '@/components/ServerSideTable.vue'
  import FilterSelect from '@/components/filter-select'
  import { useToast } from "vue-toast-notification"
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

  onMounted(() => {
    setCurrentPageBreadcrumbs("Album", ['Sekolah', "Media"]);
    getKelasMedia()
  })
  const route = useRoute()
  const kelas_id = route.params.id

  const store = useStore()
  const currentUser = store.getters.currentUser;
  const imageLink = `https://apistaging.edumu.id/${currentUser.sekolah_kode}/apischool/public`;


  function getKelasMedia () {
      request.post('kelas/media', null, {
        params: {
          kelas: kelas_id
        }
      }).then(res => {
        console.log(res.data)
        kelas.value = res.data.kelas
        album.value = res.data.data
      })
    }

    const kelas = ref('')
    const album = ref([])
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body pt-5 pb-5">
        
        <div>
          <h2 class="fs-1 fw-bold py-6">Album Media - {{kelas}}</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <!-- Page Content -->
        <div class="page-content">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
            </div>

            <div class="position-relative d-flex ">
                <a class="btn btn-primary d-flex gap-4 align-items-center w-auto">
                  <span>
                    Download
                  </span>
                  <i class="bi bi-cloud-arrow-up fs-1"></i>
                </a>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-5 mb-xxl-8 px-12">
        <div class="row gy-6">
          <template v-for="image in album" :key="image.user_id">
            <div class="col-3">
              <div>
                <img class="image-album" :src="image.user_foto_id ? `${imageLink}/images/identity/siswa/${image.user_foto_id}` : '/media/illustrations/media/frame-media.png'" alt="">
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
  .image-album {
    background: #DCDFE6;
    border-radius: 10px;
    width: 100%;
    max-height: 300px;
  }
</style>