<template>
  <!--begin::List Widget 6-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0">
      <h3 class="card-title fw-bolder text-dark">Notifikasi</h3>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body pt-0">
      <div style="height: 650px; overflow: scroll">
        <template v-for="(item, index) in list" :key="index">
          <!--begin::Item-->
          <div
            :class="[
              'mb-7' && list.length - 1 !== index,
              `bg-light-${getColor(index)}`,
            ]"
            class="d-flex align-items-center rounded p-5 mb-7"
          >
            <!--begin::Icon-->
            <span :class="`svg-icon svg-icon-${getColor(index)} svg-icon-1`" class="me-5">
              <inline-svg src="media/icons/duotune/general/gen007.svg" />
            </span>
            <!--end::Icon-->

            <!--begin::Title-->
            <div class="flex-grow-1 me-2">
              <a
                href="#"
                class="fw-bolder text-gray-800 text-hover-primary fs-6"
                >{{ item.notification_title }}</a
              >

              <span class="text-muted fw-bold d-block">{{ item.notification_desc }}</span>
            </div>
            <!--end::Title-->

            <!--begin::Lable-->
            <span :class="`text-${getColor(index)}`" class="fw-bolder py-1">{{
              item.notification_type
            }}</span>
            <!--end::Lable-->
          </div>
          <!--end::Item-->
        </template>
      </div>
    </div>
    <!--end::Body-->
  </div>
  <!--end::List Widget 6-->
</template>

<script setup>
import { defineComponent, ref, watch } from "vue";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import { isEmpty } from "validate.js";

const props = defineProps({
  widgetClasses: String,
  datas: Array
})

const list = ref([]);

function getColor(index) {
  switch (index % 4) {
    case 0:
      return "success";
      break;
    case 1:
      return "warning";
      break;
    case 2:
      return "info";
      break;
    case 3:
      return "danger";
      break;
  }
}

watch(() => props.datas,
  (datas) => {
    if (!isEmpty(datas)) {
      list.value = datas
    }
  }
)   
</script>
