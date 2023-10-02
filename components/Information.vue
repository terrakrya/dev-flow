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
        </div>
      </b-col>
      <b-col sm="4">
        <div class="mb-3 bg-dark rounded-lg p-3 mr-1">
          <h4>Links Rápidos:</h4>
          <hr />
          <p>
            <a
              class="btn btn-secondary btn-sm"
              :href="project.documentationLink"
              target="_blanck"
            >
              Documentação do projeto
            </a>
          </p>
          <p>
            <a
              class="btn btn-secondary btn-sm"
              :href="project.gitRepositoryLink"
              target="_blanck"
            >
              Repositorio do Git
            </a>
          </p>
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
