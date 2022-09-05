<template>
  <!--begin::List Widget 3-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title fw-bolder text-dark">Materi Belajar</h3>

      <div class="card-toolbar">
        <!--begin::Menu-->
          <div
            class="badge badge-primary px-5 py-3 d-flex gap-3"
          >
            <div class="fs-1">
              {{total}}
            </div>
            <div class="text-start" style="font-size: 0.75 rem">
              <div>Total</div>
              <div>Materi</div>
            </div>
          </div>
        <!--end::Menu-->
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body pt-5">
      <template v-for="(item, index) in materi" :key="index">
        <!--begin::Item-->
        <div
          :class="{ 'mb-8': list.length - 1 !== index }"
          class="d-flex align-items-center gap-5"
        >
          <!--begin::Bullet-->
          <span
            class="bullet bullet-vertical h-40px"
            :class="`bg-primary`"
          ></span>
          <!--end::Bullet-->

          <!--begin::Description-->
          <div class="flex-grow-1">
            <a
              href="#"
              class="text-gray-800 text-hover-primary fw-bolder fs-6"
              >{{ item.materi_judul }}</a
            >

            <span class="text-muted fw-bold d-block">{{item.materi_file}}</span>
          </div>
          <!--end::Description-->

          <span
            class="badge fs-8 fw-bolder"
            :class="`badge-light-primary`"
            >{{toMB(item.materi_filesize)}}</span
          >
        </div>
        <!--end:Item-->
      </template>
    </div>
    <!--end::Body-->
  </div>
  <!--end:List Widget 3-->
</template>

<script setup>
import { defineComponent, ref, watch } from "vue";
import Dropdown2 from "@/components/dropdown/Dropdown2.vue";
import { isEmpty } from "validate.js";

watch(() => props.datas,
  (datas) => {
    if (!isEmpty(datas)) {
      materi.value = datas
    }
  }
)

const props = defineProps({
  widgetClasses: String,
  total: Number,
  datas: Array,
})

const materi = ref([])
const list = ref([
  {
    color: "success",
    title: "Create FireStone Logo",
    text: "Due in 2 Days",
  },
  {
    color: "primary",
    title: "Stakeholder Meeting",
    text: "Due in 3 Days",
  },
  {
    color: "warning",
    title: "Scoping & Estimations",
    text: "Due in 5 Days",
  },
  {
    color: "primary",
    title: "KPI App Showcase",
    text: "Due in 2 Days",
  },
  {
    color: "danger",
    title: "Project Meeting",
    text: "Due in 12 Days",
  },
  {
    color: "success",
    title: "Customers Update",
    text: "Due in 1 week",
  },
]);

function toMB(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

</script>
