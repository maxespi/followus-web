// app/analytics/page.tsx
import { MainLayout } from '@/components/layout'
import { AnalyticsOverview } from '@/components/features/analytics'

export default function AnalyticsPage() {
    return (
        <MainLayout>
            <AnalyticsOverview />
        </MainLayout>
    )
}
