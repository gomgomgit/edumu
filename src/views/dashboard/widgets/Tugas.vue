<template>
  <!--begin::Tables Widget 9-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bolder fs-3 mb-1">Tugas Belajar</span>

        <span class="text-muted mt-1 fw-bold fs-7">{{created}} tugas telah dibuat</span>
      </h3>

      <div
        class="card-toolbar"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-trigger="hover"
      >
        <div
          class="badge badge-primary px-5 py-3 d-flex gap-3"
        >
          <div class="fs-1">
            {{total}}
          </div>
          <div class="text-start" style="font-size: 0.75 rem">
            <div>Total</div>
            <div>Tugas</div>
          </div>
        </div>
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-3">
      <!--begin::Table container-->
      <div class="table-responsive">
        <!--begin::Table-->
        <table
          class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4"
        >
          <!--begin::Table head-->
          <thead>
            <tr class="fw-bolder text-muted">
              <th class="min-w-150px">Guru</th>
              <th class="min-w-140px">Judul Tugas</th>
              <th class="min-w-120px">Batas Waktu</th>
              <th class="min-w-100px text-end">Pengerjaan Tugas</th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody>
            <template v-for="(item, index) in tugas" :key="index">
              <tr>

                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-45px me-5">
                      <img :src="item.user.user_foto ? (storageUrl + '/images/guru/' + item.user.user_foto) : '/media/avatars/blank.png'" alt="" />
                    </div>
                    <div class="d-flex justify-content-start flex-column">
                      <a
                        href="#"
                        class="text-dark fw-bolder text-hover-primary fs-6"
                        >{{ item.user.user_nama }}</a
                      >

                      <span
                        class="text-muted fw-bold text-muted d-block fs-7"
                        >{{ item.mapel.mapel_nama }}</span
                      >
                    </div>
                  </div>
                </td>

                <td style="max-width: 300px">
                  <a
                    href="#"
                    class="text-dark fw-bolder text-hover-primary d-block fs-6"
                    >{{ item.tugas_judul }}</a
                  >
                </td>

                <td>
                  <span class="text-dark fw-bold d-block fs-7">{{item.tugas_due_date}}</span>
                </td>

                <td class="text-end">
                  <div class="d-flex flex-column w-100 me-2">
                    <div class="d-flex flex-stack mb-2">
                      <span class="text-muted me-2 fs-7 fw-bold">
                        {{getProgress(item.siswaCount, item.siswaAnswerCount)}}%
                      </span>
                    </div>

                    <div class="progress h-6px w-100">
                      <div
                        class="progress-bar"
                        :class="`bg-${item.color}`"
                        role="progressbar"
                        :style="{ width: getProgress(item.siswaCount, item.siswaAnswerCount) + '%' }"
                        :aria-valuenow="getProgress(item.siswaCount, item.siswaAnswerCount)"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
          <!--end::Table body-->
        </table>
        <!--end::Table-->
      </div>
      <!--end::Table container-->
    </div>
    <!--begin::Body-->
  </div>
  <!--end::Tables Widget 9-->
</template>

<script setup>
import { isEmpty } from "validate.js";
import { defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";

watch(() => props.datas,
  (datas) => {
    if (!isEmpty(datas)) {
      tugas.value = datas
    }
  }
)

const store = useStore()
const currentUser = store.getters.currentUser
const storageUrl = `${process.env.VUE_APP_STORAGE_URL}/${currentUser.sekolah_kode}/apischool/public`;

const props = defineProps ({
  widgetClasses: String,
  total: Number,
  created: Number,
  datas: Array,
})

const checkedRows = ref([]);
    
const tugas = ref([])

function getProgress(siswa, answered) {
  var percent = Math.round(answered / siswa * 100)
  return percent ? percent : 0
}
</script>
