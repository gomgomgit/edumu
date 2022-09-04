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
        :options="calendarOptions"
      ></FullCalendar>
      <!--end::Calendar-->
    </div>
    <!--end::Card body-->
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
      var events = []
      var academic = datas.academic.map((cal) => {
        return {
          title: cal.calendar_title,
          start: cal.calendar_time_start,
          end: cal.calendar_time_end,
          description: cal.calendar_desc,
          className: "fc-event-success",
          color: '#04C8C8'
        }
      })
      var todo = datas.todo.map((cal) => {
        return {
          title: cal.calendar_title,
          start: moment(cal.calendar_time_date,).format("YYYY-MM-DD"),
          description: cal.calendar_desc,
          className: "fc-event-danger fc-event-solid-warning",
          color: '#F1416C'
        }
      })
      calendarOptions.events = [...events, ...academic, ...todo]
    }
  }
) 

const calendars = ref()

const newEvent = () => {
  const modal = new Modal(document.getElementById("kt_modal_add_event"));
  modal.show();
};

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  headerToolbar: {
    left: "",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  initialDate: TODAY,
  navLinks: true, // can click day/week names to navigate views
  selectable: true,
  selectMirror: true,

  views: {
    dayGridMonth: { buttonText: "month" },
    timeGridWeek: { buttonText: "week" },
    timeGridDay: { buttonText: "day" },
  },

  editable: true,
  dayMaxEvents: true, // allow "more" link when too many events
  events: [],
  dateClick: newEvent,
  eventClick: newEvent,
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
