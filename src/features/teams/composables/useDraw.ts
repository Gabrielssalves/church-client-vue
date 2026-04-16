import { ref } from 'vue'

export type DrawStatus = 'idle' | 'loading' | 'presenting' | 'done'

export interface Group {
  name: string
  color: string
}

export interface Team {
  groupName: string
  color: string
  members: string[]
}

export function useDraw() {
  const status = ref<DrawStatus>('idle')
  const endpoint = ref('')
  const namesInput = ref('')
  const groupsList = ref<Group[]>([
    { name: 'Time Alpha', color: '#14A74A' },
    { name: 'Time Bravo', color: '#1473A7' }
  ])
  const teams = ref<Team[]>([])
  const currentPresentingIndex = ref(-1)
  const animationDuration = ref(4000)
  const errorMessage = ref('')

  const basePalette = ['#14A74A', '#1473A7', '#3FB414', '#149A7A', '#7ACF2A']

  function setEndpoint(value: string) {
    endpoint.value = value
  }

  function setNamesInput(value: string) {
    namesInput.value = value
  }

  function clearErrorMessage() {
    errorMessage.value = ''
  }

  function adicionarGrupo() {
    const nextColor = basePalette[groupsList.value.length % basePalette.length] ?? '#14A74A'
    groupsList.value.push({
      name: `Time ${String.fromCharCode(65 + groupsList.value.length)}`,
      color: nextColor
    })
  }

  function removerGrupo(index: number) {
    groupsList.value.splice(index, 1)
  }

  function updateGroup(index: number, field: 'name' | 'color', value: string) {
    const group = groupsList.value[index]
    if (!group) return

    group[field] = value
  }

  async function realizarSorteio() {
    errorMessage.value = ''
    const namesList = namesInput.value
      .split(/[\n,]+/)
      .map((name) => name.trim())
      .filter(Boolean)
    const validGroups = groupsList.value.filter((group) => group.name.trim() !== '')

    if (namesList.length === 0 || validGroups.length === 0) {
      errorMessage.value = 'Adicione pelo menos um participante e um grupo válido.'
      return
    }

    status.value = 'loading'

    try {
      if (endpoint.value.trim() !== '') {
        const response = await fetch(endpoint.value, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ names: namesList, groups: validGroups })
        })

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status} ${response.statusText}`)
        }

        const contentType = response.headers.get('content-type') ?? ''
        if (!contentType.includes('application/json')) {
          throw new Error('A API não retornou JSON válido.')
        }

        teams.value = (await response.json()) as Team[]
        await new Promise<void>((resolve) => setTimeout(resolve, 1500))
      } else {
        await new Promise<void>((resolve) => setTimeout(resolve, 1200))
        teams.value = simularSorteio(namesList, validGroups)
      }

      iniciarApresentacao()
    } catch (err) {
      status.value = 'idle'
      errorMessage.value =
        err instanceof Error
          ? err.message
          : 'Erro ao processar sorteio. Verifique os dados.'
    }
  }

  function simularSorteio(names: string[], groups: Group[]) {
    const shuffledNames = [...names].sort(() => Math.random() - 0.5)
    const result = groups.map((group) => ({
      groupName: group.name.trim(),
      color: group.color,
      members: [] as string[]
    }))

    let currentGroupIndex = 0
    while (shuffledNames.length > 0) {
      const nextName = shuffledNames.pop()
      const currentGroup = result[currentGroupIndex]
      if (currentGroup && nextName !== undefined) {
        currentGroup.members.push(nextName)
      }
      currentGroupIndex = (currentGroupIndex + 1) % result.length
    }

    return result
  }

  function iniciarApresentacao() {
    status.value = 'presenting'
    currentPresentingIndex.value = 0
    apresentarProximoGrupo()
  }

  function apresentarProximoGrupo() {
    if (currentPresentingIndex.value >= teams.value.length) {
      status.value = 'done'
      currentPresentingIndex.value = -1
      return
    }

    const currentTeam = teams.value[currentPresentingIndex.value]
    if (!currentTeam) {
      status.value = 'done'
      currentPresentingIndex.value = -1
      return
    }

    animationDuration.value = Math.max(3000, currentTeam.members.length * 1000)

    setTimeout(() => {
      currentPresentingIndex.value += 1
      apresentarProximoGrupo()
    }, animationDuration.value + 1000)
  }

  function resetar() {
    status.value = 'idle'
    teams.value = []
    currentPresentingIndex.value = -1
    errorMessage.value = ''
  }

  return {
    status,
    endpoint,
    namesInput,
    groupsList,
    teams,
    currentPresentingIndex,
    animationDuration,
    errorMessage,
    setEndpoint,
    setNamesInput,
    clearErrorMessage,
    adicionarGrupo,
    removerGrupo,
    updateGroup,
    realizarSorteio,
    resetar
  }
}
