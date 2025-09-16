// app/users/page.tsx
import { MainLayout } from '@/components/layout'
import { UserManagement } from '@/components/features/users'

export default function UsersPage() {
    return (
        <MainLayout>
            <UserManagement />
        </MainLayout>
    )
}
