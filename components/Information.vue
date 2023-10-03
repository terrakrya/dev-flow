<template>
  <div>
    <b-row>
      <b-col sm="4">
        <div class="mb-3 bg-dark rounded-lg p-3 mr-1">
          <h4>Processo de ciclo de desenvolvimento do projeto:</h4>
          <hr />
          <p>
            O projeto {{ project.name }} opera em um ciclo mensal de
            <strong>{{ project.numberCycleDays }}</strong> dias, com o início de
            cada ciclo programado para o dia
            <strong>{{ project.startDayEachCycle }}</strong> de cada mês.
          </p>
          <p>
            Na última semana de cada ciclo, realizamos uma cerimônia que
            chamamos de 'Retrospectiva e Planejamento'. Durante a retrospectiva,
            revisamos todas as tarefas concluídas no ciclo atual e planejamos as
            tarefas que serão incorporadas no próximo ciclo.
          </p>
          <p>
            Como resultado dessa cerimônia, geramos e salvamos um relatório na
            plataforma DevFlow.
          </p>
          <img class="w-100" src="~/assets/img/process.png" />
        </div>
      </b-col>
      <b-col sm="3">
        <div class="mb-3 bg-dark rounded-lg p-3 mr-1">
          <h4>Links Rápidos:</h4>
          <hr />
          <a
            v-if="project.matrixRoomLink"
            class="btn btn-secondary btn-sm btns"
            :href="project.matrixRoomLink"
            target="_blanck"
          >
            <b-icon-messenger />
            <p>Sala de Chat na Matrix</p>
          </a>
          <a
            v-if="project.linkDocNextclound"
            class="btn btn-secondary btn-sm btns"
            :href="project.linkDocNextclound"
            target="_blanck"
          >
            <b-icon-cloud-download />
            <p>Arquivos na Nuvem</p>
          </a>
          <a
            v-if="project.documentationLink"
            class="btn btn-secondary btn-sm btns"
            :href="project.documentationLink"
            target="_blanck"
          >
            <b-icon-file-earmark-font />
            <p>Documentação</p>
          </a>
          <a
            v-if="project.gitRepositoryLink"
            class="btn btn-secondary btn-sm btns"
            :href="project.gitRepositoryLink"
            target="_blanck"
          >
            <b-icon-github />
            <p>Repositorio Git</p>
          </a>
        </div>
        <div class="mb-3 bg-dark rounded-lg p-3 mr-1">
          <h4>Tags:</h4>
          <hr />
          <b-badge
            v-for="(tag, index) in project.tags"
            :key="index"
            variant="secondary"
            class="mr-2"
          >
            {{ tag }}
          </b-badge>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.btns {
  width: 180px;
  height: 150px;
  padding: 45px;
  margin-bottom: 10px;
}
.btns .b-icon {
  font-size: 30px;
}
</style>
