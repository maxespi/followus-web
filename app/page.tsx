import { MainLayout } from '@/components/layout'
import { DashboardOverview } from '@/components/features/dashboard'

export default function HomePage() {
    return (
        <MainLayout>
            <DashboardOverview />
        </MainLayout>
    )
}
