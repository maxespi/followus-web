// app/channels/page.tsx
import { MainLayout } from '@/components/layout'
import { ChannelManagement } from '@/components/features/channels'

export default function ChannelsPage() {
  return (
      <MainLayout>
        <ChannelManagement />
      </MainLayout>
  )
}
