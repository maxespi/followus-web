// lib/ticket-blocks.ts
export interface TicketBlock {
  id: string
  title: string
  priority: number // 1 = más importante, 5 = menos importante
  visible: boolean
  component: string
  description: string
}

export const defaultBlocks: TicketBlock[] = [
  {
    id: 'header',
    title: 'Información Principal',
    priority: 1,
    visible: true,
    component: 'HeaderBlock',
    description: 'Título, estado, prioridad y descripción del ticket'
  },
  {
    id: 'conversation',
    title: 'Conversación',
    priority: 2,
    visible: true,
    component: 'ConversationBlock',
    description: 'Mensajes e historial de comunicación'
  },
  {
    id: 'client-info',
    title: 'Información del Cliente',
    priority: 3,
    visible: true,
    component: 'ClientInfoBlock',
    description: 'Datos del cliente y creador del ticket'
  },
  {
    id: 'assignment',
    title: 'Asignación y Responsables',
    priority: 4,
    visible: true,
    component: 'AssignmentBlock',
    description: 'Usuario asignado y participantes'
  },
  {
    id: 'metadata',
    title: 'Metadatos y Fechas',
    priority: 5,
    visible: true,
    component: 'MetadataBlock',
    description: 'Fechas de creación, actualización y clasificación'
  },
  {
    id: 'actions',
    title: 'Acciones',
    priority: 6,
    visible: true,
    component: 'ActionsBlock',
    description: 'Botones de acción y herramientas'
  },
  {
    id: 'tags',
    title: 'Etiquetas',
    priority: 7,
    visible: true,
    component: 'TagsBlock',
    description: 'Tags y categorización del ticket'
  }
]

// Función para obtener el orden de bloques guardado
export function getSavedBlockOrder(): string[] {
  if (typeof window === 'undefined') return defaultBlocks.map(b => b.id)

  try {
    const saved = localStorage.getItem('followus-ticket-blocks-order')
    if (saved) {
      const order = JSON.parse(saved)
      // Validar que todos los IDs existen
      const validIds = defaultBlocks.map(b => b.id)
      const filteredOrder = order.filter((id: string) => validIds.includes(id))

      // Asegurar que todos los bloques están presentes
      const missingIds = validIds.filter(id => !filteredOrder.includes(id))
      return [...filteredOrder, ...missingIds]
    }
  } catch (error) {
    console.error('Error loading block order:', error)
  }

  return defaultBlocks.map(b => b.id)
}

// Función para guardar el orden de bloques
export function saveBlockOrder(order: string[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('followus-ticket-blocks-order', JSON.stringify(order))
  } catch (error) {
    console.error('Error saving block order:', error)
  }
}

// Función para obtener configuración de visibilidad de bloques
export function getSavedBlockVisibility(): Record<string, boolean> {
  if (typeof window === 'undefined') {
    return defaultBlocks.reduce((acc, block) => {
      acc[block.id] = block.visible
      return acc
    }, {} as Record<string, boolean>)
  }

  try {
    const saved = localStorage.getItem('followus-ticket-blocks-visibility')
    if (saved) {
      const visibility = JSON.parse(saved)
      // Combinar con valores por defecto
      return defaultBlocks.reduce((acc, block) => {
        acc[block.id] = visibility[block.id] ?? block.visible
        return acc
      }, {} as Record<string, boolean>)
    }
  } catch (error) {
    console.error('Error loading block visibility:', error)
  }

  return defaultBlocks.reduce((acc, block) => {
    acc[block.id] = block.visible
    return acc
  }, {} as Record<string, boolean>)
}

// Función para guardar configuración de visibilidad
export function saveBlockVisibility(visibility: Record<string, boolean>): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('followus-ticket-blocks-visibility', JSON.stringify(visibility))
  } catch (error) {
    console.error('Error saving block visibility:', error)
  }
}

// Función para obtener bloques ordenados y configurados
export function getConfiguredBlocks(): TicketBlock[] {
  const order = getSavedBlockOrder()
  const visibility = getSavedBlockVisibility()

  return order.map(id => {
    const block = defaultBlocks.find(b => b.id === id)
    if (!block) return null

    return {
      ...block,
      visible: visibility[id] ?? block.visible
    }
  }).filter(Boolean) as TicketBlock[]
}