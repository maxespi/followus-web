// lib/date-utils.ts
// Utilidades centralizadas para formateo de fechas - DRY principle

/**
 * Formatea una fecha para mostrar fecha y hora en formato español
 * @param dateInput - String ISO, Date object, null o undefined
 * @returns String formateado o 'Sin fecha' si es inválido
 */
export const formatDate = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) {
    return 'Sin fecha'
  }

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    if (isNaN(date.getTime())) {
      return 'Sin fecha'
    }
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    return 'Sin fecha'
  }
}

/**
 * Formatea solo la fecha (sin hora) en formato español
 * @param dateInput - String ISO, Date object, null o undefined
 * @returns String formateado o 'Sin fecha' si es inválido
 */
export const formatDateOnly = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) {
    return 'Sin fecha'
  }

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    if (isNaN(date.getTime())) {
      return 'Sin fecha'
    }
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } catch (error) {
    return 'Sin fecha'
  }
}

/**
 * Formatea tiempo relativo (hace X días, hace X horas)
 * @param dateInput - String ISO, Date object, null o undefined
 * @returns String con tiempo relativo o 'Sin fecha' si es inválido
 */
export const formatRelativeTime = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) {
    return 'Sin fecha'
  }

  try {
    const now = new Date()
    let date: Date

    if (typeof dateInput === 'string') {
      // Handle ISO format: "2023-12-26T14:47:11.000Z"
      date = new Date(dateInput)
    } else {
      date = dateInput
    }

    // Validar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return 'Sin fecha'
    }

    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Hace menos de 1h'
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays === 1) return 'Ayer'
    if (diffDays > 0) return `Hace ${diffDays} días`

    // Future dates (shouldn't happen normally, but handle gracefully)
    if (diffHours < 0) return 'En el futuro'

    return 'Sin fecha'
  } catch (error) {
    return 'Sin fecha'
  }
}

/**
 * Formatea solo hora y minuto
 * @param dateInput - String ISO, Date object, null o undefined
 * @returns String con formato HH:MM
 */
export const formatTimeOnly = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) {
    return 'Sin hora'
  }

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    if (isNaN(date.getTime())) {
      return 'Sin hora'
    }
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    return 'Sin hora'
  }
}

/**
 * Calcula la diferencia en horas entre dos fechas
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin
 * @returns Diferencia en horas o null si hay error
 */
export const calculateHoursDifference = (
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined
): number | null => {
  if (!startDate || !endDate) {
    return null
  }

  try {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null
    }

    const diffMs = end.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    // Solo retornar valores positivos y razonables (menos de 8760 horas = 1 año)
    return diffHours > 0 && diffHours < 8760 ? diffHours : null
  } catch (error) {
    return null
  }
}

/**
 * Valida si una fecha es válida
 * @param dateInput - String ISO, Date object, null o undefined
 * @returns boolean indicando si la fecha es válida
 */
export const isValidDate = (dateInput: string | Date | null | undefined): boolean => {
  if (!dateInput) {
    return false
  }

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    return !isNaN(date.getTime())
  } catch (error) {
    return false
  }
}