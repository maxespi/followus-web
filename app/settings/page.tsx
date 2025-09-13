// app/settings/page.tsx
import { MainLayout } from '@/components/main-layout'
import { SettingsOverview } from '@/components/settings-overview'

export default function SettingsPage() {
    return (
        <MainLayout>
            <SettingsOverview />
        </MainLayout>
    )
}
