<template>
  <!--begin::List Widget 3-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0">
      <h3 class="card-title fw-bolder text-dark">Materi Belajar</h3>

      <div class="card-toolbar">
        <!--begin::Menu-->
        <button
          type="button"
          class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
          data-kt-menu-flip="top-end"
        >
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotune/general/gen024.svg" />
          </span>
        </button>
        <Dropdown2></Dropdown2>
        <!--end::Menu-->
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body pt-2">
      <template v-for="(item, index) in datas" :key="index">
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

<script lang="ts">
import { defineComponent, ref } from "vue";
import Dropdown2 from "@/components/dropdown/Dropdown2.vue";

export default defineComponent({
  name: "kt-widget-3",
  components: {
    Dropdown2,
  },
  props: {
    widgetClasses: String,
    datas: Array,
  },
  setup() {
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

    return {
      list,
      toMB
    };
  },
});
</script>
