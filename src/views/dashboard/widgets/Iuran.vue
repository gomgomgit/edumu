<template>
  <!--begin::Mixed Widget 7-->
  <div :class="widgetClasses" class="card">
    <!--begin::Body-->
    <div class="card-body d-flex flex-column p-0">
      <!--begin::Stats-->
      <div class="flex-grow-1 card-p pb-0">
        <div class="d-flex flex-stack flex-wrap">
          <div class="me-2">
            <a href="#" class="text-dark text-hover-primary fw-bolder fs-3"
              >Pembayaran Iuran</a
            >

            <div class="text-muted fs-7 fw-bold">
              Laporan Pembayaran Iuran Perbulan
            </div>
          </div>

          <div :class="`text-${chartColor}`" class="fw-bolder fs-3">
            Rp 54.000.500
          </div>
        </div>
      </div>
      <!--end::Stats-->

      <!--begin::Chart-->
      <apexchart
        class="mixed-widget-7-chart card-rounded-bottom"
        :options="chartOptions"
        :series="series"
        type="area"
        :height="chartHeight"
        ref='chartIuran'
      ></apexchart>
      <!--end::Chart-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Mixed Widget 7-->
</template>

<script setup>
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import { isEmpty } from "validate.js";
const color = ref(props.chartColor);

const props = defineProps({
  widgetClasses: String,
  chartColor: String,
  chartHeight: String,
  total: Number,
  datas: Object,
})

const labelColor = getCSSVariableValue("--bs-" + "gray-800");
const strokeColor = getCSSVariableValue("--bs-" + "gray-300");
const baseColor = getCSSVariableValue("--bs-" + color.value);
const lightColor = getCSSVariableValue("--bs-light-" + color.value);

const chartIuran = ref()

watch (
	() => props.datas,
	datas => {
    if (!isEmpty(datas)) {
      var dataArray = datas.map((data) => {
                    return data.total
                  })
      var monthArray = datas.map((data) => {
                    return data.month
                  })
      chartIuran.value.updateOptions({
        xaxis: {
          categories: monthArray
        }
      })
      chartIuran.value.updateSeries([
        {
          name: "Total Pembayaran",
          data: dataArray
        },
      ])
    } 
  },
	{ deep: true }
)

const dataMonth = ref([])
const dataTotal = ref([])
const chartOptions = reactive({
  chart: {
    fontFamily: "inherit",
    type: "area",
    height: props.chartHeight,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    sparkline: {
      enabled: true,
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
    opacity: 1,
  },
  stroke: {
    curve: "smooth",
    show: true,
    width: 3,
    colors: [baseColor],
  },
  xaxis: {
    categories: [''],
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
        color: strokeColor,
        width: 1,
        dashArray: 3,
      },
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    labels: {
      show: true,
      style: {
        colors: labelColor,
        fontSize: "12px",
      },
    },
    forceNiceScale: true,
    floating: true,
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
        return "Rp " + val;
      },
    },
  },
  colors: [lightColor],
  markers: {
    colors: [lightColor],
    strokeColor: [baseColor],
    strokeWidth: 3,
  },
  noData: {
    text: 'Loading...'
  }
});

const series = ref([]);
</script>
