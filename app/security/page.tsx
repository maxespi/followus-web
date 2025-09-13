// app/security/page.tsx
import { MainLayout } from '@/components/main-layout'
import { SecurityOverview } from '@/components/security-overview'

export default function SecurityPage() {
    return (
        <MainLayout>
            <SecurityOverview />
        </MainLayout>
    )
}
