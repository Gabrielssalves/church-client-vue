<template>
  <div class="sorteio-container">
    <!-- Cabeçalho -->
    <header class="header">
      <h1 class="title">Sorteio de Times</h1>
      <div class="divider"></div>
    </header>

    <!-- Mensagem de Erro -->
    <div v-if="errorMessage" class="error-banner">
      <span class="error-text">{{ errorMessage }}</span>
      <button @click="errorMessage = ''" class="close-error">×</button>
    </div>

    <!-- FASE 1: FORMULÁRIO -->
    <main v-if="status === 'idle'" class="setup-card">
      <div class="form-group">
        <label class="label">Endpoint da API (Opcional)</label>
        <input 
          v-model="endpoint" 
          type="text" 
          placeholder="https://sua-api.com/sorteio" 
          class="input-field"
        >
      </div>

      <div class="form-group">
        <label class="label">Participantes</label>
        <textarea 
          v-model="namesInput" 
          rows="4" 
          placeholder="Separe os nomes por vírgula ou nova linha..." 
          class="textarea-field"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="label">Configuração de Grupos</label>
        
        <div v-for="(group, index) in groupsList" :key="index" class="group-row">
          <div class="color-picker-wrapper" :style="{ borderColor: group.color }">
            <input type="color" v-model="group.color" class="color-input">
          </div>
          
          <input 
            type="text" 
            v-model="group.name" 
            placeholder="Nome do Grupo" 
            class="input-field flex-1"
          >
          
          <button @click="removerGrupo(index)" v-if="groupsList.length > 1" class="btn-remove">
            Excluir
          </button>
        </div>

        <button @click="adicionarGrupo" class="btn-add-group">
          + Adicionar novo grupo
        </button>
      </div>

      <div class="actions">
        <button @click="realizarSorteio" class="btn-primary">
          SORTEAR TIMES
        </button>
      </div>
    </main>

    <!-- FASE 2: CARREGANDO -->
    <main v-else-if="status === 'loading'" class="loading-state">
      <div class="spinner-container">
        <div class="spinner"></div>
        <div class="spinner-inner">🎲</div>
      </div>
      <h2 class="loading-title">Definindo destinos...</h2>
      <p class="loading-subtitle">A sorte está sendo lançada.</p>
    </main>

    <!-- FASE 3 e 4: APRESENTAÇÃO -->
    <main v-else class="results-state">
      <button v-if="status === 'done'" @click="resetar" class="btn-back">
        ← Reiniciar Sorteio
      </button>

      <div class="teams-grid">
        <div 
          v-for="(team, index) in teams" 
          :key="index"
          class="team-card"
          :class="{ 
            'is-presenting': currentPresentingIndex === index && status === 'presenting',
            'is-dimmed': currentPresentingIndex !== index && status === 'presenting'
          }"
          :style="getCardStyle(team, index)"
        >
          <div class="team-header" :style="getHeaderStyle(team, index)">
            <h3 class="team-name" :style="{ color: getTeamTextColor(team, index) }">
              {{ team.groupName }}
            </h3>
          </div>

          <div class="team-body">
            <!-- Animação de Créditos -->
            <div v-if="currentPresentingIndex === index && status === 'presenting'" class="credits-wrapper">
              <div class="credits-animation" :style="{ '--duration': animationDuration + 'ms' }">
                <div 
                  v-for="(member, mIndex) in team.members" 
                  :key="'anim-'+mIndex" 
                  class="credit-item"
                  :style="{ color: team.color }"
                >
                  {{ member }}
                </div>
              </div>
            </div>

            <!-- Lista Final -->
            <div v-else-if="currentPresentingIndex > index || status === 'done'" class="final-list">
              <div class="member-badges">
                <span 
                  v-for="(member, mIndex) in team.members" 
                  :key="'final-'+mIndex" 
                  class="member-badge"
                  :style="{ backgroundColor: team.color + '15', borderColor: team.color + '30', color: team.color }"
                >
                  {{ member }}
                </span>
              </div>
              <div v-if="team.members.length === 0" class="empty-state">Vazio</div>
            </div>

            <!-- Aguardando -->
            <div v-else class="pending-state">🔒</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'SorteioTimes',
  data() {
    return {
      status: 'idle', // 'idle', 'loading', 'presenting', 'done'
      endpoint: '',
      namesInput: '',
      groupsList: [
        { name: 'Time Alpha', color: '#14A74A' },
        { name: 'Time Bravo', color: '#1473A7' }
      ],
      teams: [],
      currentPresentingIndex: -1,
      animationDuration: 4000,
      errorMessage: '',
      basePalette: ['#14A74A', '#1473A7', '#3FB414', '#149A7A', '#7ACF2A']
    }
  },
  methods: {
    adicionarGrupo() {
      const nextColor = this.basePalette[this.groupsList.length % this.basePalette.length];
      this.groupsList.push({ 
        name: `Time ${String.fromCharCode(65 + this.groupsList.length)}`, 
        color: nextColor 
      });
    },
    removerGrupo(index) {
      this.groupsList.splice(index, 1);
    },
    async realizarSorteio() {
      this.errorMessage = '';
      const namesList = this.namesInput.split(/[\n,]+/).map(n => n.trim()).filter(n => n);
      const validGroups = this.groupsList.filter(g => g.name.trim() !== '');

      if (namesList.length === 0 || validGroups.length === 0) {
        this.errorMessage = "Adicione pelo menos um participante e um grupo válido.";
        return;
      }

      this.status = 'loading';

      try {
        if (this.endpoint.trim() !== '') {
          const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ names: namesList, groups: validGroups })
          });
          if (!response.ok) throw new Error('Erro na API.');
          this.teams = await response.json();
          await new Promise(r => setTimeout(r, 1500)); 
        } else {
          await new Promise(r => setTimeout(r, 2000));
          this.teams = this.simularSorteio(namesList, validGroups);
        }
        this.iniciarApresentacao();
      } catch (error) {
        this.status = 'idle';
        this.errorMessage = "Erro ao processar sorteio. Verifique os dados.";
      }
    },
    simularSorteio(names, groups) {
      let shuffledNames = [...names].sort(() => Math.random() - 0.5);
      let result = groups.map(g => ({ groupName: g.name.trim(), color: g.color, members: [] }));
      let currentGroupIndex = 0;
      while (shuffledNames.length > 0) {
        result[currentGroupIndex].members.push(shuffledNames.pop());
        currentGroupIndex = (currentGroupIndex + 1) % result.length;
      }
      return result;
    },
    iniciarApresentacao() {
      this.status = 'presenting';
      this.currentPresentingIndex = 0;
      this.apresentarProximoGrupo();
    },
    apresentarProximoGrupo() {
      if (this.currentPresentingIndex >= this.teams.length) {
        this.status = 'done';
        this.currentPresentingIndex = -1;
        return;
      }
      const currentTeam = this.teams[this.currentPresentingIndex];
      // Ajuste de tempo baseado na quantidade de nomes
      this.animationDuration = Math.max(3000, currentTeam.members.length * 1000);
      
      setTimeout(() => {
        this.currentPresentingIndex++;
        this.apresentarProximoGrupo();
      }, this.animationDuration + 1000);
    },
    resetar() {
      this.status = 'idle';
      this.teams = [];
      this.currentPresentingIndex = -1;
      this.errorMessage = '';
    },
    // Métodos auxiliares de estilo dinâmico
    getCardStyle(team, index) {
      if (this.currentPresentingIndex === index && this.status === 'presenting') {
        return {
          borderColor: team.color,
          boxShadow: `0 20px 50px -12px ${team.color}40`,
          transform: 'scale(1.1)',
          zIndex: 20
        };
      }
      return {};
    },
    getHeaderStyle(team, index) {
      const active = (this.currentPresentingIndex === index && this.status === 'presenting') || this.status === 'done';
      return {
        backgroundColor: active ? team.color + '08' : '#F9FAFB'
      };
    },
    getTeamTextColor(team, index) {
      const active = (this.currentPresentingIndex === index && this.status === 'presenting') || this.status === 'done';
      return active ? team.color : '#2D3748';
    }
  }
}
</script>

<style scoped>
/* Variáveis de Cores (Baseadas na sua paleta) */
:offset {
  --color-primary: #14A74A;
  --color-bg: #F2F6F3;
  --color-text: #2D3748;
  --color-text-light: #6B7280;
  --color-border: #E2E8F0;
}

/* Layout Geral */
.sorteio-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
  color: var(--color-text);
}

/* Cabeçalho */
.header {
  text-align: center;
  margin-bottom: 60px;
}

.title {
  font-family: 'Sora', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #2D3748 0%, #14A74A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.divider {
  height: 4px;
  width: 80px;
  background-color: var(--color-primary);
  margin: 0 auto;
  border-radius: 10px;
  opacity: 0.5;
}

/* Formulário */
.setup-card {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 32px;
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}

.form-group {
  margin-bottom: 30px;
}

.label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-light);
  margin-bottom: 12px;
  padding-left: 4px;
}

.input-field, .textarea-field {
  width: 100%;
  padding: 16px 20px;
  border-radius: 16px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  font-size: 1rem;
  transition: all 0.2s;
  outline: none;
}

.input-field:focus, .textarea-field:focus {
  background: white;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(20, 167, 74, 0.1);
}

.textarea-field {
  resize: none;
}

/* Grupos */
.group-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.flex-1 { flex: 1; }

.color-picker-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid var(--color-border);
  position: relative;
  transition: transform 0.2s;
}

.color-picker-wrapper:hover {
  transform: scale(1.05);
}

.color-input {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 100px;
  height: 100px;
  cursor: pointer;
  border: none;
}

.btn-remove {
  background: #FEF2F2;
  color: #EF4444;
  border: none;
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #EF4444;
  color: white;
}

.btn-add-group {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 2px dashed var(--color-border);
  border-radius: 16px;
  color: var(--color-text-light);
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s;
}

.btn-add-group:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(20, 167, 74, 0.05);
}

.btn-primary {
  width: 100%;
  padding: 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 16px;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 1.125rem;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(20, 167, 74, 0.2);
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #0E7A36;
  transform: translateY(-2px);
  box-shadow: 0 15px 25px rgba(20, 167, 74, 0.3);
}

/* Estados */
.loading-state {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner-container {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.spinner {
  position: absolute;
  inset: 0;
  border: 8px solid var(--color-bg);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-inner {
  font-size: 3rem;
  animation: bounce 1s infinite;
}

.loading-title {
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  font-weight: 700;
}

/* Resultados */
.results-state {
  position: relative;
}

.btn-back {
  position: absolute;
  top: -80px;
  left: 0;
  background: transparent;
  border: none;
  color: var(--color-text-light);
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-back:hover {
  color: var(--color-primary);
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

.team-card {
  background: white;
  border-radius: 40px;
  border: 1px solid var(--color-border);
  height: 350px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.is-dimmed {
  opacity: 0.3;
  transform: scale(0.9);
  filter: grayscale(50%);
}

.team-header {
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
  text-align: center;
}

.team-name {
  font-family: 'Sora', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.team-body {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

/* Créditos */
.credits-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.credits-animation {
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: scroll var(--duration) linear forwards;
}

.credit-item {
  font-family: 'Sora', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
}

@keyframes scroll {
  0% { transform: translateY(250px); }
  100% { transform: translateY(-100%); }
}

/* Lista Final */
.final-list {
  padding: 30px;
  height: 100%;
  overflow-y: auto;
}

.final-list::-webkit-scrollbar { display: none; }

.member-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.member-badge {
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  border: 1px solid transparent;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
  font-style: italic;
}

.pending-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  opacity: 0.1;
}

/* Erros */
.error-banner {
  max-width: 600px;
  margin: 0 auto 24px;
  background: #FEF2F2;
  color: #B91C1C;
  padding: 16px 24px;
  border-radius: 20px;
  border: 1px solid #FEE2E2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close-error {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #EF4444;
  cursor: pointer;
}

/* Keyframes */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Responsividade */
@media (max-width: 768px) {
  .title { font-size: 2.5rem; }
  .setup-card { padding: 24px; }
}
</style>