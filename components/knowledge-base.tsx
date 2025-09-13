// components/knowledge-base.tsx
'use client'

import { useState } from 'react'
import { useTranslation } from '@/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown,
  User,
  Calendar,
  BookOpen,
  Edit,
  Trash2
} from 'lucide-react'
import { mockKnowledgeArticles } from '@/lib/mock-data'

export function KnowledgeBase() {
  const { t } = useTranslation()
  const [articles] = useState(mockKnowledgeArticles)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colorMap = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline'
    }
    return colorMap[status as keyof typeof colorMap] || 'default'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('knowledge.title')}</h1>
            <p className="text-muted-foreground">
              {t('knowledge.subtitle')}
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('knowledge.newArticle')}
          </Button>
        </div>

        {/* Búsqueda */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                  placeholder={t('knowledge.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artículos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publicados</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.filter(a => a.status === 'published').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vistas</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.reduce((sum, article) => sum + article.views, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                    (articles.reduce((sum, article) => sum + article.helpful, 0) /
                        articles.reduce((sum, article) => sum + article.helpful + article.notHelpful, 0)) * 100
                )}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Artículos */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="published">{t('knowledge.published')}</TabsTrigger>
            <TabsTrigger value="draft">{t('knowledge.draft')}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredArticles.map((article) => (
                  <Card key={article.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusColor(article.status) as any}>
                              {t(`knowledge.${article.status}`)}
                            </Badge>
                            <Badge variant="outline">{article.category}</Badge>
                          </div>
                          <CardTitle className="text-xl">{article.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {article.content.substring(0, 200)}...
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{article.author.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(article.updatedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.views} vistas</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1 text-green-600">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{article.helpful}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-red-600">
                            <ThumbsDown className="h-4 w-4" />
                            <span>{article.notHelpful}</span>
                          </div>
                        </div>
                      </div>

                      {article.tags && article.tags.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex flex-wrap gap-1">
                              {article.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                              ))}
                            </div>
                          </div>
                      )}
                    </CardContent>
                  </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="published">
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Artículos publicados aparecerán aquí</p>
            </div>
          </TabsContent>

          <TabsContent value="draft">
            <div className="text-center py-8 text-muted-foreground">
              <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Borradores aparecerán aquí</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
