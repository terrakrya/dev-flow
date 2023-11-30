<template>
  <div>
    <h1>Calendário</h1>
    <FullCalendar :options="calendarOptions" :selectable="true" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'

export default {
  components: {
    FullCalendar,
  },
  props: {
    cards: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        weekends: false,
        events: this.eventFormat(),
        eventClick(info) {
          info.jsEvent.preventDefault()
          if (info.event.url) {
            window.open(info.event.url)
          }
        },
      },
    }
  },
  methods: {
    eventFormat() {
      return this.cards.map((card) => ({
        title: card.title,
        start: card.start_date || card.due_date,
        end: card.end_date || card.due_date,
        url: `/projects/${card.project.id}?card=${card._id}`,
        // color: this.color(),
      }))
    },
    color() {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16)
      return '#' + randomColor
    },
  },
}
</script>
