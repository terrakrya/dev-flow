<template>
  <div>
    <div class="d-flex justify-content-center">
      <div class="min-h-screen d-flex overflow-x-scroll py-3 kanban">
        <div
          v-for="(week, index) in dataStructure"
          :key="index"
          class="bg-dark rounded-lg p-3 mr-1 column"
        >
          <p
            class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
          >
            <strong> {{ week.label }}</strong>
          </p>
          <kanban-card
            v-for="card in week.cards"
            :key="card.id"
            :card="card"
            class="mb-3 cursor-move"
            :multiple="multiple"
            @change="cardChanged"
          ></kanban-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cards: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dataStructure: [],
    }
  },
  created() {
    const dataStructure = []
    const currentDate = new Date()

    for (let i = -3; i <= 3; i++) {
      const weekStart = new Date(currentDate)
      const weekEnd = new Date(currentDate)

      // Defina o início da semana (segunda-feira)
      weekStart.setDate(
        currentDate.getDate() - currentDate.getDay() + 1 + i * 7
      )

      // Defina o final da semana (sexta-feira)
      weekEnd.setDate(currentDate.getDate() - currentDate.getDay() + 5 + i * 7)

      const start = {
        d: weekStart.getDate(),
        m: weekStart.getMonth() + 1,
        y: weekStart.getFullYear().toString().slice(-2),
      }

      const end = {
        d: weekEnd.getDate(),
        m: weekEnd.getMonth() + 1,
        y: weekEnd.getFullYear().toString().slice(-2),
      }

      let weekLabel = 'Semana ' + start.d + '/' + start.m + '/' + start.y
      weekLabel += ' a ' + end.d + '/' + end.m + '/' + end.y

      const cards = this.mathWeek(start, end)
      dataStructure.push({ label: weekLabel, cards })
      this.dataStructure = dataStructure
    }
  },
  methods: {
    mathWeek(startDate, endDate) {
      const weeks = [] // Objeto para armazenar cartões por semana

      // Converta as datas de início e término da semana em objetos Date
      const startYear = 2000 + parseInt(startDate.y) // Se "y" for "23", isso dará 2023
      const endYear = 2000 + parseInt(endDate.y) // Se "y" for "23", isso dará 2023
      const weekStart = new Date(startYear, startDate.m - 1, startDate.d) // m - 1, porque os meses em JavaScript são baseados em zero (0 = janeiro)
      const weekEnd = new Date(endYear, endDate.m - 1, endDate.d)

      this.cards.forEach((item) => {
        const dueDate = new Date(item.due_date)
        // Verifica se a data do cartão está dentro do intervalo da semana
        if (dueDate >= weekStart && dueDate <= weekEnd) {
          // Adicione o cartão à semana correspondente
          weeks.push(item)
        }
      })
      return weeks
    },
    formatDate(date) {
      if (date) {
        return new Date(date).toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
    },
  },
}
</script>
<style>
/* .kanban .column > div {
  height: 240px;
} */
</style>
