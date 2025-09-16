// app/settings/page.tsx
import { MainLayout } from '@/components/layout'
import { SettingsOverview } from '@/components/features/settings'

export default function SettingsPage() {
    return (
        <MainLayout>
            <SettingsOverview />
        </MainLayout>
    )
}
