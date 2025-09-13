// app/channels/page.tsx
import { MainLayout } from '@/components/main-layout'
import { ChannelManagement } from '@/components/channel-management'

export default function ChannelsPage() {
  return (
      <MainLayout>
        <ChannelManagement />
      </MainLayout>
  )
}
