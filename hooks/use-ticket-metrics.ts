// hooks/use-ticket-metrics.ts
// Hook centralizado para métricas de tickets - Single Source of Truth

import { useMemo } from 'react'
import { Ticket } from '@/lib/tasks.service'
import { calculateHoursDifference } from '@/lib/date-utils'

export interface TicketMetrics {
  // Conteos básicos
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  pendingTickets: number
  resolvedTickets: number
  closedTickets: number

  // Métricas de tiempo
  resolvedToday: number
  resolvedThisWeek: number
  avgResponseTime: number // en horas

  // Prioridades (datos reales)
  urgentTickets: number
  highPriorityTickets: number
  mediumPriorityTickets: number
  lowPriorityTickets: number

  // Participantes y asignaciones
  totalParticipants: number
  activeAgents: number // activos en últimas 24h
  unassignedTickets: number

  // Categorías
  ticketsByCategory: Record<string, number>
  ticketsByStatus: Record<string, number>
  ticketsByPriority: Record<string, number>

  // Porcentajes calculados
  percentages: {
    resolved: number
    inProgress: number
    urgent: number
    responseTimeVariation: number // variación respecto al promedio histórico
  }
}

export function useTicketMetrics(tickets: Ticket[]): TicketMetrics {
  return useMemo(() => {
    if (!tickets.length) {
      return {
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        pendingTickets: 0,
        resolvedTickets: 0,
        closedTickets: 0,
        resolvedToday: 0,
        resolvedThisWeek: 0,
        avgResponseTime: 0,
        urgentTickets: 0,
        highPriorityTickets: 0,
        mediumPriorityTickets: 0,
        lowPriorityTickets: 0,
        totalParticipants: 0,
        activeAgents: 0,
        unassignedTickets: 0,
        ticketsByCategory: {},
        ticketsByStatus: {},
        ticketsByPriority: {},
        percentages: {
          resolved: 0,
          inProgress: 0,
          urgent: 0,
          responseTimeVariation: 0
        }
      }
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // Conteos básicos por estado
    const openTickets = tickets.filter(t => t.status === 'open').length
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length
    const pendingTickets = tickets.filter(t => t.status === 'pending').length
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length
    const closedTickets = tickets.filter(t => t.status === 'closed').length

    // Métricas de tiempo
    const resolvedToday = tickets.filter(t => {
      if (t.status !== 'resolved' || !t.fecha_finalizacion) return false
      const finalizationDate = new Date(t.fecha_finalizacion)
      return finalizationDate >= today
    }).length

    const resolvedThisWeek = tickets.filter(t => {
      if (t.status !== 'resolved' || !t.fecha_finalizacion) return false
      const finalizationDate = new Date(t.fecha_finalizacion)
      return finalizationDate >= weekAgo
    }).length

    // Cálculo real de tiempo de respuesta promedio
    const archivedTickets = tickets.filter(t =>
      t.status === 'resolved' && t.fecha_finalizacion
    )

    const validResponseTimes = archivedTickets
      .map(ticket => {
        const endDate = ticket.fecha_finalizacion || ticket.updatedAt
        return calculateHoursDifference(ticket.createdAt, endDate)
      })
      .filter(time => time !== null && time > 0 && time < 720) // menos de 30 días

    const avgResponseTime = validResponseTimes.length > 0 ?
      validResponseTimes.reduce((sum, time) => sum + time, 0) / validResponseTimes.length : 0

    // Conteos por prioridad (datos reales del backend)
    const urgentTickets = tickets.filter(t => t.priority === 'urgent').length
    const highPriorityTickets = tickets.filter(t => t.priority === 'high').length
    const mediumPriorityTickets = tickets.filter(t => t.priority === 'medium').length
    const lowPriorityTickets = tickets.filter(t => t.priority === 'low').length

    // Participantes únicos y agentes activos
    const allParticipants = new Set<number>()
    const activeAgents = new Set<number>()

    tickets.forEach(ticket => {
      // Agregar todos los participantes
      ticket.participants.forEach(p => allParticipants.add(p.id))
      allParticipants.add(ticket.creator.id)
      if (ticket.assignedTo) allParticipants.add(ticket.assignedTo.id)

      // Considerar activos si el ticket fue actualizado recientemente
      if (new Date(ticket.updatedAt) > dayAgo) {
        ticket.participants.forEach(p => activeAgents.add(p.id))
        activeAgents.add(ticket.creator.id)
        if (ticket.assignedTo) activeAgents.add(ticket.assignedTo.id)
      }
    })

    const unassignedTickets = tickets.filter(t => !t.assignedTo).length

    // Agrupaciones por categoría, estado y prioridad
    const ticketsByCategory = tickets.reduce((acc, ticket) => {
      const category = ticket.category || 'Sin categoría'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const ticketsByStatus = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const ticketsByPriority = tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Cálculo de porcentajes reales
    const total = tickets.length
    const resolvedPercentage = total > 0 ? (resolvedTickets / total) * 100 : 0
    const inProgressPercentage = total > 0 ? (inProgressTickets / total) * 100 : 0
    const urgentPercentage = total > 0 ? (urgentTickets / total) * 100 : 0

    // Calcular variación del tiempo de respuesta comparando últimas 2 semanas vs 2 semanas anteriores
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)

    const recentResponseTimes = tickets
      .filter(t =>
        t.status === 'resolved' &&
        t.fecha_finalizacion &&
        new Date(t.fecha_finalizacion) >= twoWeeksAgo
      )
      .map(t => calculateHoursDifference(t.createdAt, t.fecha_finalizacion || t.updatedAt))
      .filter(time => time !== null && time > 0)

    const olderResponseTimes = tickets
      .filter(t =>
        t.status === 'resolved' &&
        t.fecha_finalizacion &&
        new Date(t.fecha_finalizacion) >= fourWeeksAgo &&
        new Date(t.fecha_finalizacion) < twoWeeksAgo
      )
      .map(t => calculateHoursDifference(t.createdAt, t.fecha_finalizacion || t.updatedAt))
      .filter(time => time !== null && time > 0)

    const recentAvg = recentResponseTimes.length > 0 ?
      recentResponseTimes.reduce((sum, time) => sum + time, 0) / recentResponseTimes.length : 0

    const olderAvg = olderResponseTimes.length > 0 ?
      olderResponseTimes.reduce((sum, time) => sum + time, 0) / olderResponseTimes.length : 0

    const responseTimeVariation = (olderAvg > 0 && recentAvg > 0) ?
      ((recentAvg - olderAvg) / olderAvg) * 100 : 0

    return {
      // Conteos básicos
      totalTickets: total,
      openTickets,
      inProgressTickets,
      pendingTickets,
      resolvedTickets,
      closedTickets,

      // Métricas de tiempo
      resolvedToday,
      resolvedThisWeek,
      avgResponseTime,

      // Prioridades
      urgentTickets,
      highPriorityTickets,
      mediumPriorityTickets,
      lowPriorityTickets,

      // Participantes
      totalParticipants: allParticipants.size,
      activeAgents: activeAgents.size,
      unassignedTickets,

      // Agrupaciones
      ticketsByCategory,
      ticketsByStatus,
      ticketsByPriority,

      // Porcentajes calculados
      percentages: {
        resolved: Math.round(resolvedPercentage * 10) / 10, // 1 decimal
        inProgress: Math.round(inProgressPercentage * 10) / 10,
        urgent: Math.round(urgentPercentage * 10) / 10,
        responseTimeVariation: Math.round(responseTimeVariation * 10) / 10
      }
    }
  }, [tickets])
}