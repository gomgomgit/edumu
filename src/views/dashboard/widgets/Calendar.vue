<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header">
      <h2 class="card-title fw-bolder">Kalender</h2>

      <div class="card-toolbar">
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body">
      <!--begin::Calendar-->
      <FullCalendar
        class="calendar"
        ref="calendar"
        :options="calendarOptions"
      ></FullCalendar>
      <!--end::Calendar-->
    </div>
    <!--end::Card body-->
    
    <ModalCalendar 
      :show="modalDetail"
      @close="handleCloseDetail"
      :datas="dataDetail"
    ></ModalCalendar>
  </div>
  <!--end::Card-->
</template>

<script setup>
import { defineComponent, reactive, ref, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import events from "@/core/data/events";
import { TODAY } from "@/core/data/events";
import NewEventModal from "@/components/modals/forms/NewEventModal.vue";
import ModalCalendar from "./compenents/ModalCalendar.vue";
import { Modal } from "bootstrap";
import { isEmpty } from "validate.js";
import moment from "moment";

const props = defineProps({
  widgetClasses: String,
  datas: Array
})

watch(() => props.datas,
  (datas) => {
    if (!isEmpty(datas)) {
      var events = datas.event.map((cal) => {
        return {
          title: cal.calendar_title,
          start: cal.calendar_time_start,
          end: cal.calendar_time_end,
          description: cal.calendar_desc,
          className:  [cal.calendar_type, cal.calendar_desc],
          color: '#04C8C8'
        }
      })
      var academic = datas.academic.map((cal) => {
        return {
          title: cal.calendar_title,
          start: cal.calendar_time_start,
          end: cal.calendar_time_end,
          description: cal.calendar_desc,
          className:  [cal.calendar_type, cal.calendar_desc],
          color: '#04C8C8'
        }
      })
      var todo = datas.todo.map((cal) => {
        return {
          title: cal.calendar_title,
          start: cal.calendar_date,
          description: cal.calendar_desc,
          className:  [cal.calendar_type, cal.calendar_desc],
          color: '#F1416C'
        }
      })
      calendarOptions.events = [...events, ...academic, ...todo]
    }
  }
) 

const calendar = ref()

const modalDetail = ref(false)
const initDetail = {title: '', desc: '', type: '', start: '', end: ''}
const dataDetail = reactive({...initDetail})

function showEvent(e) {
  modalDetail.value = true
  dataDetail.title = e.event.title
  dataDetail.desc = e.event.classNames[1] ?? ''
  dataDetail.type = e.event.classNames[0]
  dataDetail.start = e.event.start
  dataDetail.end = e.event.end

  document.getElementsByClassName('fc-popover-close')[0] && document.getElementsByClassName('fc-popover-close')[0].click()
}

function handleCloseDetail() {
  modalDetail.value = false
  Object.assign(dataDetail, {...initDetail})
}

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  headerToolbar: {
    right: '',
    center: "title",
    left: ''
  },
  initialDate: TODAY,
  navLinks: false, // can click day/week names to navigate views
  selectable: false,
  selectMirror: false,

  editable: true,
  dayMaxEvents: true, // allow "more" link when too many events
  events: [],
  eventClick: showEvent,
})
</script>

<style lang="scss">
.fc .fc-button {
  padding: 0.75rem 1.25rem;
  box-shadow: none !important;
  border: 0 !important;
  border-radius: 0.475rem;
  vertical-align: middle;
  font-weight: 500;
  text-transform: capitalize;
}
</style>
