// app/users/page.tsx
import { MainLayout } from '@/components/main-layout'
import { UserManagement } from '@/components/user-management'

export default function UsersPage() {
    return (
        <MainLayout>
            <UserManagement />
        </MainLayout>
    )
}
