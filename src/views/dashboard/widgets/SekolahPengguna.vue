<template>
  <!--begin::Mixed Widget 1-->
  <div class="card card-xxl-stretch">
    <!--begin::Header-->
    <div class="card-header border-0 py-5 rounded-3"
      :style="`
        background: url('/media/patterns/header-bg.png');
        background-size: cover;
      `"
    >
      <div class="d-flex align-items-center py-7 gap-5 mb-20">
        <div>
          <div class="rounded-3 overflow-hidden w-60px h-60px bg-white p-2">
            <div class="w-100 h-100"
              :style="`
                background: url('${currentUser.sekolah_foto}');
                background-size: cover;
              `"
              >
            </div>
          </div>
        </div>
        <div class="">
          <h3 class="card-title my-1 fw-bolder text-white">{{currentUser.sekolah_nama}},</h3>
          <p class="fw-bolder my-1 text-white"><span class="bi bi-geo-alt-fill me-2"></span>{{currentUser.sekolah_alamat}}</p>
          <p class="fw-bolder my-1 text-white"><span class="me-2"><span class="bi bi-telephone-fill me-2"></span>{{currentUser.sekolah_telepon}}</span><span class="bi bi-envelope-fill me-2"></span>{{currentUser.sekolah_email}}</p>
          <!-- <p class="fw-bolder my-1 text-white"><span class="bi bi-telephone-fill me-2"></span>{{currentUser.sekolah_telepon}}</p>
          <p class="fw-bolder my-1 text-white"><span class="bi bi-envelope-fill me-2"></span>{{currentUser.sekolah_email}}</p> -->
        </div>
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body p-0">
      <!--begin::Chart-->
      <!--end::Chart-->
      <!--begin::Stats-->
      <div class="card-p mt-n20 position-relative">
        <!--begin::Row-->
        <div class="row m-0">
          <div class="col bg-light-warning px-6 py-8 rounded-2 me-7 mb-7 position-relative">
            <div class="position-absolute" style="top: 10px; right: 10px;">
              <span class="badge badge-square px-3 fw-normal fs-6" style="background: #dc9504">{{count?.siswaOnline ?? 0}}</span>
            </div>
            <span class="display-5 fw-normal d-block my-2" style="color: #dc9504">
              {{count?.countSiswa ?? 0}}
            </span>
            <a href="#" class="text-warning fw-bold fs-6"> Jumlah Siswa </a>
          </div>
          <div class="col bg-light-primary px-6 py-8 rounded-2 mb-7 position-relative">
            <div class="position-absolute" style="top: 10px; right: 10px;">
              <span class="badge badge-square px-3 fw-normal fs-6 bg-primary">{{count?.guruOnline ?? 0}}</span>
            </div>
            <span class="display-5 text-primary fw-normal d-block my-2">
              {{count?.countGuru ?? 0}}
            </span>
            <a href="#" class="text-primary fw-bold fs-6"> Jumlah Guru </a>
          </div>
        </div>
        <!--end::Row-->
        <!--begin::Row-->
        <div class="row m-0">
          <div class="col bg-light-danger px-6 py-8 rounded-2 me-7">
            <span class="display-5 text-danger fw-normal d-block my-2">
              {{count?.countKelas ?? 0}}
            </span>
            <a href="#" class="text-danger fw-bold fs-6 mt-2"> Jumlah Rombel </a>
          </div>
          <div class="col bg-light-success px-6 py-8 rounded-2 position-relative">
            <div class="position-absolute" style="top: 10px; right: 10px;">
              <span class="badge badge-square px-3 fw-normal fs-6 bg-success">{{count?.pegawaiOnline ?? 0}}</span>
            </div>
            <span class="display-5 text-success fw-normal d-block my-2">
              {{count?.pegawaiCount ?? 0}}
            </span>
            <a href="#" class="text-success fw-bold fs-6 mt-2"> Jumlah Pegawai </a>
          </div>
        </div>
        <!--end::Row-->
      </div>
      <!--end::Stats-->
      <!--end::Body-->
    </div>
    <!--end::Mixed Widget 1-->
  </div>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import { useStore } from "vuex";

const props = defineProps({
  widgetClasses: String,
  widgetColor: String,
  strokeColor: String,
  count: Object
})

  const store = useStore()
  const currentUser = store.getters.currentUser

  const labelColor = getCSSVariableValue("--bs-gray-500");
  const borderColor = getCSSVariableValue("--bs-gray-200");

  const color = getCSSVariableValue("--bs-" + props.widgetColor);

  const strokeColor = ref(props.strokeColor);

  const chartOptions = {
    chart: {
      fontFamily: "inherit",
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor.value,
        opacity: 0.5,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      opacity: 0,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [strokeColor.value],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 80,
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val) {
          return "$" + val + " thousands";
        },
      },
      marker: {
        show: false,
      },
    },
    markers: {
      colors: [color],
      strokeColor: [strokeColor.value],
      strokeWidth: 3,
    },
  };

  const series = [
    {
      name: "Net Profit",
      data: [30, 45, 32, 70, 40, 40, 40],
    },
  ];
</script>
