// app/tickets/page.tsx
import { MainLayout } from '@/components/main-layout'
import { TicketManagement } from '@/components/ticket-management'

export default function TicketsPage() {
  return (
      <MainLayout>
        <TicketManagement />
      </MainLayout>
  )
}
