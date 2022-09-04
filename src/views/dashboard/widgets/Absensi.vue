<template>
  <!--begin::Mixed Widget 10-->
  <div :class="widgetClasses" class="card">
    <!--begin::Body-->
    <div
      class="card-body p-0 d-flex justify-content-between flex-column overflow-hidden"
    >
      <!--begin::Hidden-->
      <div class="d-flex flex-stack flex-wrap flex-grow-1 px-9 pt-9 pb-3">
        <div class="d-flex justify-content-between align-items-center w-100">
          <div>
            <span class="fw-bolder text-gray-800 d-block fs-3">Rekap Absensi Siswa</span>

            <span class="text-gray-400 fw-bold">Feb 2022 - Juli 2022</span>
          </div>
          <div
            class="badge badge-primary px-5 py-3 d-flex gap-3"
          >
            <div class="fs-1">
              {{total}}
            </div>
            <div class="text-start" style="font-size: 0.75 rem">
              <div>Total</div>
              <div>Siswa</div>
            </div>
          </div>
        </div>

        <div class="fw-bolder fs-3" :class="`text-${chartColor}`"></div>
      </div>
      <!--end::Hidden-->

      <!--begin::Chart-->
      <apexchart
        class="mixed-widget-10-chart"
        :options="chartOptions"
        :series="series"
        type="bar"
        :height="chartHeight"
        ref='chartAbsensi'
      ></apexchart>
      <!--end::Chart-->
    </div>
  </div>
  <!--end::Mixed Widget 10-->
</template>

<script setup>
import { defineComponent, ref, watch } from "vue";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import { isEmpty } from "validate.js";


const props = defineProps({
  widgetClasses: String,
  chartColor: String,
  chartHeight: String,
  total: Number,
  datas: Object,
})


watch (
	() => props.datas,
	datas => {
    if (!isEmpty(datas)) {
      var monthArray = Object.keys(datas)

      var hadir = []
      var alpha = []
      monthArray.forEach((key) => {
        hadir.push(datas[key].hadir)
        alpha.push(datas[key].alpha)
      })

      chartAbsensi.value.updateOptions({
        xaxis: {
          categories: monthArray
        }
      })
      chartAbsensi.value.updateSeries([
        {
          name: "Siswa Masuk",
          data: hadir,
        },
        {
          name: "Siswa Izin/Alpha",
          data: alpha,
        },
      ])
    } 
  },
	{ deep: true }
)

const chartAbsensi = ref()
const color = ref(props.chartColor);

const labelColor = getCSSVariableValue("--bs-gray-500");
const borderColor = getCSSVariableValue("--bs-gray-200");
const secondaryColor = getCSSVariableValue("--bs-gray-300");
const baseColor = getCSSVariableValue("--bs-" + color.value);

const chartOptions = {
  chart: {
    fontFamily: "inherit",
    type: "bar",
    height: props.chartHeight,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: ["50%"],
      endingShape: "rounded",
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: labelColor,
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    y: 0,
    offsetX: 0,
    offsetY: 0,
    labels: {
      style: {
        colors: labelColor,
        fontSize: "12px",
      },
    },
  },
  fill: {
    type: "solid",
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
        return val + " siswa";
      },
    },
  },
  colors: [baseColor, secondaryColor],
  grid: {
    padding: {
      top: 10,
    },
    borderColor: borderColor,
    strokeDashArray: 4,
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
};

const series = [
  {
    name: "Siswa Masuk",
    data: [],
  },
  {
    name: "Siswa Izin/Alpha",
    data: [],
  },
];
</script>
