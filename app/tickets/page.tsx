// app/tickets/page.tsx
import { MainLayout } from '@/components/layout'
import { TicketManagement } from '@/components/features/tickets'

export default function TicketsPage() {
  return (
      <MainLayout>
        <TicketManagement />
      </MainLayout>
  )
}
