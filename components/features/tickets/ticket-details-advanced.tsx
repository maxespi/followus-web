// components/ticket-details-advanced.tsx
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useTranslation } from '@/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Settings, Eye, EyeOff, GripVertical, Columns, Grid3X3 } from 'lucide-react'
import { Ticket } from '@/lib/tasks.service'
import {
  getConfiguredBlocks,
  saveBlockOrder,
  saveBlockVisibility,
  getSavedBlockOrder,
  getSavedBlockVisibility,
  TicketBlock
} from '@/lib/ticket-blocks'
import {
  HeaderBlock,
  ConversationBlock,
  ClientInfoBlock,
  AssignmentBlock,
  MetadataBlock,
  ActionsBlock,
  TagsBlock
} from './ticket-blocks'

interface TicketDetailsAdvancedProps {
  ticket: Ticket | null
  expanded?: boolean
}

type LayoutMode = '1-col' | '2-col' | '3-col'

const blockComponents = {
  'HeaderBlock': HeaderBlock,
  'ConversationBlock': ConversationBlock,
  'ClientInfoBlock': ClientInfoBlock,
  'AssignmentBlock': AssignmentBlock,
  'MetadataBlock': MetadataBlock,
  'ActionsBlock': ActionsBlock,
  'TagsBlock': TagsBlock,
}

function getLayoutConfig(): LayoutMode {
  if (typeof window === 'undefined') return '2-col'

  try {
    const saved = localStorage.getItem('followus-ticket-layout-mode')
    if (saved && ['1-col', '2-col', '3-col'].includes(saved)) {
      return saved as LayoutMode
    }
  } catch (error) {
    console.error('Error loading layout mode:', error)
  }

  return '2-col'
}

function saveLayoutConfig(mode: LayoutMode): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('followus-ticket-layout-mode', mode)
  } catch (error) {
    console.error('Error saving layout mode:', error)
  }
}

export function TicketDetailsAdvanced({ ticket, expanded = false }: TicketDetailsAdvancedProps) {
  const { t } = useTranslation()
  const [blocks, setBlocks] = useState<TicketBlock[]>([])
  const [blockVisibility, setBlockVisibility] = useState<Record<string, boolean>>({})
  const [showSettings, setShowSettings] = useState(false)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('2-col')
  const [isDragging, setIsDragging] = useState(false)

  // Inicializar configuración
  useEffect(() => {
    const configuredBlocks = getConfiguredBlocks()
    const visibility = getSavedBlockVisibility()
    const layout = getLayoutConfig()

    setBlocks(configuredBlocks)
    setBlockVisibility(visibility)
    setLayoutMode(layout)
  }, [])

  // Bloques visibles filtrados
  const visibleBlocks = useMemo(() => {
    return blocks.filter(block => blockVisibility[block.id] !== false)
  }, [blocks, blockVisibility])

  // Distribuir bloques en columnas
  const columnizedBlocks = useMemo(() => {
    if (!expanded) return [visibleBlocks]

    const cols = layoutMode === '1-col' ? 1 : layoutMode === '2-col' ? 2 : 3
    const columns: TicketBlock[][] = Array.from({ length: cols }, () => [])

    visibleBlocks.forEach((block, index) => {
      columns[index % cols].push(block)
    })

    return columns
  }, [visibleBlocks, layoutMode, expanded])

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback((result: DropResult) => {
    setIsDragging(false)

    if (!result.destination || !result.source) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) return

    const reorderedBlocks = Array.from(visibleBlocks)
    const [movedBlock] = reorderedBlocks.splice(sourceIndex, 1)
    reorderedBlocks.splice(destinationIndex, 0, movedBlock)

    // Actualizar orden completo
    const newOrder = reorderedBlocks.map(block => block.id)
    const hiddenBlockIds = blocks
      .filter(block => blockVisibility[block.id] === false)
      .map(block => block.id)

    const fullOrder = [...newOrder, ...hiddenBlockIds]

    // Reordenar blocks array
    const finalBlocks = fullOrder
      .map(id => blocks.find(block => block.id === id))
      .filter(Boolean) as TicketBlock[]

    setBlocks(finalBlocks)
    saveBlockOrder(fullOrder)
  }, [visibleBlocks, blocks, blockVisibility])

  const toggleBlockVisibility = useCallback((blockId: string) => {
    setBlockVisibility(prev => {
      const newVisibility = { ...prev, [blockId]: !prev[blockId] }
      saveBlockVisibility(newVisibility)
      return newVisibility
    })
  }, [])

  const handleLayoutChange = useCallback((mode: LayoutMode) => {
    setLayoutMode(mode)
    saveLayoutConfig(mode)
  }, [])

  const renderBlock = useCallback((block: TicketBlock, columnIndex: number, blockIndex: number) => {
    const Component = blockComponents[block.component as keyof typeof blockComponents]

    if (!Component) return null

    const globalIndex = visibleBlocks.findIndex(b => b.id === block.id)
    const uniqueKey = `${block.id}-${globalIndex}-${columnIndex}-${blockIndex}`
    const draggableId = `${block.id}-draggable-${globalIndex}`

    return (
      <Draggable
        key={uniqueKey}
        draggableId={draggableId}
        index={globalIndex}
        isDragDisabled={!expanded}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`
              ${snapshot.isDragging ? 'opacity-80 scale-105 rotate-1 z-50' : ''}
              ${isDragging && !snapshot.isDragging ? 'opacity-60' : ''}
              transition-all duration-200 ease-in-out
              mb-4
            `}
          >
            <div className="relative group">
              {/* Drag Handle */}
              {expanded && (
                <div
                  {...provided.dragHandleProps}
                  className="absolute -top-2 -right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="p-1.5 rounded-full bg-primary/80 text-primary-foreground shadow-lg cursor-grab active:cursor-grabbing hover:bg-primary">
                    <GripVertical className="h-3 w-3" />
                  </div>
                </div>
              )}

              <Component ticket={ticket!} expanded={expanded} />
            </div>
          </div>
        )}
      </Draggable>
    )
  }, [visibleBlocks, expanded, isDragging, ticket])

  if (!ticket) {
    return (
      <Card className="h-fit">
        <CardContent className="flex items-center justify-center h-32 sm:h-48">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50" />
            <p className="text-xs sm:text-sm">Selecciona un ticket para ver los detalles</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!expanded) {
    // Vista compacta - columna única
    return (
      <div className="space-y-4">
        {visibleBlocks.map((block, index) => {
          const Component = blockComponents[block.component as keyof typeof blockComponents]
          return Component ? (
            <div key={`compact-${block.id}-${index}-standalone`}>
              <Component ticket={ticket} expanded={false} />
            </div>
          ) : null
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-full mx-auto">
      {/* Header y controles */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Detalle del Ticket</h2>
          <span className="text-sm text-muted-foreground font-mono">#{ticket.id}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout toggles */}
          <div className="flex items-center border rounded-lg p-1 bg-muted/50">
            <Button
              variant={layoutMode === '1-col' ? "default" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleLayoutChange('1-col')}
            >
              <div className="w-3 h-3 bg-current rounded-sm" />
            </Button>
            <Button
              variant={layoutMode === '2-col' ? "default" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleLayoutChange('2-col')}
            >
              <Columns className="h-3 w-3" />
            </Button>
            <Button
              variant={layoutMode === '3-col' ? "default" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleLayoutChange('3-col')}
            >
              <Grid3X3 className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Panel de configuración */}
      {showSettings && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configuración de Bloques</CardTitle>
            <CardDescription>
              Personaliza qué información mostrar y organizar por columnas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {blocks.map((block) => (
                <Button
                  key={`config-${block.id}`}
                  variant={blockVisibility[block.id] !== false ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleBlockVisibility(block.id)}
                  className="justify-start h-auto p-3 text-left"
                >
                  <div className="flex items-start gap-2 w-full">
                    {blockVisibility[block.id] !== false ? (
                      <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <EyeOff className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">{block.title}</p>
                      <p className="text-xs opacity-70 leading-tight mt-1">{block.description}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout en columnas con drag and drop */}
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="ticket-blocks-container" direction="vertical">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`
                ${snapshot.isDraggingOver ? 'bg-primary/5 rounded-lg' : ''}
                transition-colors duration-200
              `}
            >
              {layoutMode === '1-col' ? (
                // Columna única
                <div className="space-y-4">
                  {visibleBlocks.map((block, index) => renderBlock(block, 0, index))}
                </div>
              ) : (
                // Layout en columnas múltiples
                <div className={`
                  grid gap-6
                  ${layoutMode === '2-col' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}
                `}>
                  {columnizedBlocks.map((column, columnIndex) => (
                    <div key={`column-${columnIndex}-layout`} className="space-y-4">
                      {column.map((block, blockIndex) => renderBlock(block, columnIndex, blockIndex))}
                    </div>
                  ))}
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Feedback durante drag */}
      {isDragging && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg text-sm font-medium z-50 pointer-events-none">
          Arrastra los bloques para reordenar
        </div>
      )}
    </div>
  )
}