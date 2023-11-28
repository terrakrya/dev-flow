<template>
  <div>
    <div class="timeline">
      <div
        v-for="(card, index) in timelineTasks"
        :key="card.id"
        :class="{
          'timeline-container': true,
          left: index % 2 === 0,
          right: index % 2 !== 0,
        }"
      >
        <div class="timeline-content">
          <h2>{{ formatDate(card.end_date) }}</h2>
          <h3>{{ card.title }}</h3>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="replaceLinks(card.note)"></p>
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
      required: true,
    },
  },
  computed: {
    timelineTasks() {
      return this.cards.filter((task) => task.timeline === true)
    },
  },
  methods: {
    formatDate(date) {
      if (date) {
        return new Date(date).toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
    },
    replaceLinks(note) {
      if (!note) {
        return note
      }

      // Expressão regular para encontrar links
      const linkRegex = /(https:\/\/[^\s]+)/g

      // Substituir os links por tags <a>
      const noteWithLinks = note.replace(linkRegex, (match) => {
        return `<br><a href="${match}" style="color:#fff;text-decoration:underline" target="_blank">Documento</a>`
      })

      return noteWithLinks
    },
  },
}
</script>

<style scoped>
.timeline {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 100px;
}

/* The actual timeline (the vertical ruler) */
.timeline::after {
  content: '';
  position: absolute;
  width: 6px;
  background-color: white;
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -3px;
}

/* Container around content */
.timeline-container {
  padding: 10px 40px;
  position: relative;
  background-color: inherit;
  width: 50%;
}

/* The circles on the timeline */
.timeline-container::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 25px;
  right: -12px;
  background-color: #161b22;
  border: 4px solid #ff9f55;
  top: 15px;
  border-radius: 50%;
  z-index: 1;
}

/* Place the container to the left */
.left {
  left: 0;
}

/* Place the container to the right */
.right {
  left: 50%;
}

/* Add arrows to the left container (pointing right) */
.left::before {
  content: ' ';
  height: 0;
  position: absolute;
  top: 22px;
  width: 0;
  z-index: 1;
  right: 30px;
  border: medium solid #161b22;
  border-width: 10px 0 10px 10px;
  border-color: transparent transparent transparent #161b22;
}

/* Add arrows to the right container (pointing left) */
.right::before {
  content: ' ';
  height: 0;
  position: absolute;
  top: 22px;
  width: 0;
  z-index: 1;
  left: 30px;
  border: medium solid #161b22;
  border-width: 10px 10px 10px 0;
  border-color: transparent #161b22 transparent transparent;
}

/* Fix the circle for containers on the right side */
.right::after {
  left: -12px;
}

/* The actual content */
.timeline-content {
  padding: 20px 30px;
  background-color: #161b22;
  position: relative;
  border-radius: 6px;
}
</style>
