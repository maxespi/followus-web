// components/ticket-blocks/actions-block.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/context/AppContext'
import { Ticket } from '@/lib/tasks.service'

interface ActionsBlockProps {
  ticket: Ticket
  expanded?: boolean
}

export function ActionsBlock({ ticket, expanded = false }: ActionsBlockProps) {
  const { t } = useTranslation()

  if (!expanded) {
    return (
      <Card className="w-full">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              Asignar
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Resolver
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Acciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            {t('tickets.assign')}
          </Button>
          <Button variant="outline">
            {t('tickets.escalate')}
          </Button>
          <Button variant="outline">
            {t('tickets.resolve')}
          </Button>
          <Button variant="outline">
            {t('tickets.close')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}