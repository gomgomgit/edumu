<template>
  <!--begin::Dashboard-->
  <div class="row gy-5 g-xl-8">
    <div class="col-xxl-4">
      <Widget1
        widget-classes="card-xl-stretch mb-xl-8"
        widget-color="danger"
        chart-height="200"
        stroke-color="#cb1e46"
        :siswa="datas?.countSiswa"
        :siswaOnline="datas?.siswaOnline"
        :guru="datas?.countGuru"
        :guruOnline="datas?.guruOnline"
      ></Widget1>
    </div>
    <div class="col-xxl-4">
      <Widget2
        widget-classes="card-xxl-stretch mb-5 mb-xl-10"
      ></Widget2>
    </div>
    <div class="col-xxl-4">
      <Widget3
        widget-classes="card-xxl-stretch-50 mb-5 mb-xl-8"
        chart-color="primary"
        chart-height="150"
      ></Widget3>
      <Widget4
        widget-classes="card-xxl-stretch-50 mb-5 mb-xl-8"
        chart-color="primary"
        chart-height="168"
      ></Widget4>
    </div>
  </div>

  <div class="row gy-5 gx-xl-8">
    <div class="col-xxl-4">
      <Widget5 :datas="datas?.dataMateri" widget-classes="card-xxl-stretch mb-xl-3"></Widget5>
    </div>
    <div class="col-xxl-8">
      <Widget6
        :datas="datas?.dataTugas"
        widget-classes="card-xxl-stretch mb-5 mb-xl-8"
      ></Widget6>
    </div>
  </div>

  <div class="row gy-5 g-xl-8">
    <div class="col-xxl-4">
      <ListWidget2 widget-classes="card-xl-stretch mb-xl-8"></ListWidget2>
    </div>
    <div class="col-xxl-4">
      <ListWidget6 widget-classes="card-xl-stretch mb-xl-8"></ListWidget6>
    </div>
    <div class="col-xxl-4">
      <ListWidget1 widget-classes="card-xxl-stretch mb-xl-3"></ListWidget1>
    </div>
  </div>

  <div class="row g-5 gx-xxl-8">
    <div class="col-xxl-4">
      <MixedWidget5
        widget-classes="card-xl-stretch mb-xl-8"
        chart-color="success"
        chart-height="150"
      ></MixedWidget5>
    </div>
    <div class="col-xxl-8">
      <TableWidget5
        widget-classes="card-xxl-stretch mb-5 mb-xxl-8"
      ></TableWidget5>
    </div>
  </div>
  <!--end::Dashboard-->
</template>

<script setup>
import { defineComponent, onMounted, ref } from "vue";
import Widget1 from "./widgets/Widget1.vue";
import Widget2 from "./widgets/Widget2.vue";
import Widget3 from "./widgets/Widget3.vue";
import Widget4 from "./widgets/Widget4.vue";
import Widget5 from "./widgets/Widget5.vue";
import Widget6 from "./widgets/Widget6.vue";
import TableWidget5 from "@/components/widgets/tables/Widget5.vue";
import ListWidget1 from "@/components/widgets/lists/Widget1.vue";
import ListWidget2 from "@/components/widgets/lists/Widget2.vue";
import ListWidget6 from "@/components/widgets/lists/Widget6.vue";
import MixedWidget5 from "@/components/widgets/mixed/Widget5.vue";
import { setCurrentPageTitle, setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { useStore } from "vuex";
import { request } from "@/util";

onMounted(() => {
  setCurrentPageBreadcrumbs("Dashboard", ['dsaf', 'dfdsfa']);
  getData()
});

const datas = ref()

function getData() {
  request.post('dashboard')
  .then(res => {
    datas.value = res.data.data
  })
}
</script>
