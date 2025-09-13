// app/analytics/page.tsx
import { MainLayout } from '@/components/main-layout'
import { AnalyticsOverview } from '@/components/analytics-overview'

export default function AnalyticsPage() {
    return (
        <MainLayout>
            <AnalyticsOverview />
        </MainLayout>
    )
}
