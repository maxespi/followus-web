// app/security/page.tsx
import { MainLayout } from '@/components/layout'
import { SecurityOverview } from '@/components/features/security'

export default function SecurityPage() {
    return (
        <MainLayout>
            <SecurityOverview />
        </MainLayout>
    )
}
