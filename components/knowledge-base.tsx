"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArticleEditor } from "@/components/article-editor"
import { CategoryManager } from "@/components/category-manager"
import { Search, BookOpen, Plus, Filter, TrendingUp, Eye, ThumbsUp, Clock, Tag, Users, FileText } from "lucide-react"

const mockCategories = [
  {
    id: "billing",
    name: "Billing & Payments",
    description: "Payment issues, invoicing, and billing questions",
    articleCount: 24,
    icon: "💳",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "shipping",
    name: "Shipping & Delivery",
    description: "Tracking orders, delivery times, and shipping policies",
    articleCount: 18,
    icon: "📦",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "warranty",
    name: "Warranty & Returns",
    description: "Product warranties, return policies, and exchanges",
    articleCount: 15,
    icon: "🔧",
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "technical",
    name: "Technical Support",
    description: "Product setup, troubleshooting, and technical issues",
    articleCount: 32,
    icon: "⚙️",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "account",
    name: "Account Management",
    description: "Profile settings, password reset, and account issues",
    articleCount: 12,
    icon: "👤",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    id: "general",
    name: "General Information",
    description: "Company policies, contact information, and FAQs",
    articleCount: 21,
    icon: "ℹ️",
    color: "bg-gray-100 text-gray-800",
  },
]

const mockArticles = [
  {
    id: "1",
    title: "How to track your order status",
    category: "shipping",
    views: 1247,
    likes: 89,
    lastUpdated: "2024-01-15",
    status: "published",
    author: "Support Team",
    excerpt: "Learn how to check your order status and tracking information through our customer portal.",
  },
  {
    id: "2",
    title: "Understanding your invoice and payment methods",
    category: "billing",
    views: 892,
    likes: 67,
    lastUpdated: "2024-01-14",
    status: "published",
    author: "Billing Team",
    excerpt: "Complete guide to reading your invoice and managing payment methods in your account.",
  },
  {
    id: "3",
    title: "Product warranty coverage and claims",
    category: "warranty",
    views: 634,
    likes: 45,
    lastUpdated: "2024-01-13",
    status: "published",
    author: "Technical Team",
    excerpt: "Everything you need to know about our warranty policies and how to file a claim.",
  },
  {
    id: "4",
    title: "Troubleshooting common connection issues",
    category: "technical",
    views: 1156,
    likes: 78,
    lastUpdated: "2024-01-12",
    status: "draft",
    author: "Tech Support",
    excerpt: "Step-by-step guide to resolve the most common connectivity problems.",
  },
  {
    id: "5",
    title: "How to reset your account password",
    category: "account",
    views: 2341,
    likes: 156,
    lastUpdated: "2024-01-11",
    status: "published",
    author: "Security Team",
    excerpt: "Quick and secure way to reset your password and regain access to your account.",
  },
]

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showEditor, setShowEditor] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalArticles = mockArticles.length
  const publishedArticles = mockArticles.filter((a) => a.status === "published").length
  const totalViews = mockArticles.reduce((sum, article) => sum + article.views, 0)
  const totalLikes = mockArticles.reduce((sum, article) => sum + article.likes, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Knowledge Base</h1>
          <p className="text-muted-foreground text-pretty">
            Manage articles and help customers find answers to common questions
          </p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      {/* Knowledge Base Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
            <p className="text-xs text-muted-foreground">{publishedArticles} published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Helpful Votes</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
            <p className="text-xs text-muted-foreground">94% positive feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCategories.length}</div>
            <p className="text-xs text-muted-foreground">Well organized content</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Browse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search articles, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All Categories
              </Button>
              {mockCategories.slice(0, 4).map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Articles</TabsTrigger>
          <TabsTrigger value="categories">Manage Categories</TabsTrigger>
          <TabsTrigger value="analytics">Content Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                  <CardDescription>Browse by topic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedCategory === category.id ? "bg-muted border-primary border" : "border border-border"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <div>
                            <p className="font-medium text-sm">{category.name}</p>
                            <p className="text-xs text-muted-foreground">{category.articleCount} articles</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Articles List */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        Articles ({filteredArticles.length})
                        {selectedCategory !== "all" && (
                          <Badge variant="secondary" className="ml-2">
                            {mockCategories.find((c) => c.id === selectedCategory)?.name}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {searchQuery && `Search results for "${searchQuery}"`}
                        {!searchQuery && selectedCategory === "all" && "All knowledge base articles"}
                        {!searchQuery &&
                          selectedCategory !== "all" &&
                          `Articles in ${mockCategories.find((c) => c.id === selectedCategory)?.name}`}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Sort
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-balance">{article.title}</h3>
                          <Badge variant={article.status === "published" ? "default" : "secondary"} className="ml-2">
                            {article.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground text-pretty">{article.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {article.likes} likes
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {new Date(article.lastUpdated).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {article.author}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredArticles.length === 0 && (
                    <div className="text-center py-8">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-sm font-medium">No articles found</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Try adjusting your search or browse different categories.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager categories={mockCategories} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Articles</CardTitle>
                <CardDescription>Top performing content by views</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockArticles
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((article, index) => (
                    <div key={article.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-balance">{article.title}</p>
                          <p className="text-xs text-muted-foreground">{article.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{article.views}</p>
                        <p className="text-xs text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Article distribution and engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockCategories
                  .sort((a, b) => b.articleCount - a.articleCount)
                  .slice(0, 5)
                  .map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{category.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{category.articleCount}</p>
                        <p className="text-xs text-muted-foreground">articles</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {showEditor && <ArticleEditor onClose={() => setShowEditor(false)} article={selectedArticle} />}
    </div>
  )
}
