// app/knowledge/page.tsx
import { MainLayout } from '@/components/layout'
import { KnowledgeBase } from '@/components/features/knowledge'

export default function KnowledgePage() {
  return (
      <MainLayout>
        <KnowledgeBase />
      </MainLayout>
  )
}
