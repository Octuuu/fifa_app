import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatDate = (date) => {
  return format(new Date(date), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-ES').format(number)
}

export const getWinPercentage = (wins, total) => {
  if (!total) return 0
  return Math.round((wins / total) * 100)
}