<template>
  <!--begin::List Widget 5-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header align-items-center border-0 mt-4">
      <h3 class="card-title align-items-start flex-column">
        <span class="fw-bolder mb-2 text-dark">Aktifitas Kelas</span>
        <span class="text-muted fw-bold fs-7">{{aktifitas.length}} Jadwal Pelajaran Hari ini</span>
      </h3>

    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body pt-5">
      <!--begin::Timeline-->
      <div style="height: 220px; overflow: scroll">
        <div class="timeline-label">
          <!--begin::Item-->
          <template v-for="data in aktifitas" :key="data.jadwal_id" >
            <div class="timeline-item">
              <!--begin::Label-->
              <div class="timeline-label fw-bolder text-gray-800 fs-6">
                <div>
                  {{timeFormat(data.jadwal_mulai)}}
                </div>
                <div class="fw-normal fs-7">
                  {{timeFormat(data.jadwal_selesai)}}
                </div>
              </div>
              <!--end::Label-->

              <!--begin::Badge-->
              <div class="timeline-badge">
                <i class="fa fa-genderless text-warning fs-1"></i>
              </div>
              <!--end::Badge-->

              <!--begin::Text-->
              <div class="fw-normal timeline-content ps-3">
                <div class="fw-bold">
                  {{data.user_nama}} - {{data.mapel_nama}}
                </div>
                <div class="text-muted">
                  {{data.countTugas ?? 0}} Tugas - {{data.countMateri ?? 0}} Materi - {{data.countUjian ?? 0}} Ujian
                </div>
              </div>
              <!--end::Text-->
            </div>
          </template>
          <!--end::Item-->
        </div>
      </div>
      <!--end::Timeline-->
    </div>
    <!--end: Card Body-->
  </div>
  <!--end: List Widget 5-->
</template>

<script setup>
import { defineComponent, ref, watch } from "vue";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import { isEmpty } from "validate.js";
import moment from "moment";

watch(() => props.datas,
  (datas) => {
    if (!isEmpty(datas)) {
      aktifitas.value = datas
    }
  }
)

const props = defineProps({
  widgetClasses: String,
  datas: Array
})

const aktifitas = ref([])

function timeFormat(time) {
  return moment(time, 'HH:mm:ss').format('HH:mm');
}
</script>
