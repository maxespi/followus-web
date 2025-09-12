"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Save, X, Tag, User, Calendar } from "lucide-react"

interface Article {
  id?: string
  title: string
  category: string
  status: string
  author: string
  excerpt: string
}

interface ArticleEditorProps {
  onClose: () => void
  article?: Article | null
}

export function ArticleEditor({ onClose, article }: ArticleEditorProps) {
  const [formData, setFormData] = useState({
    title: article?.title || "",
    category: article?.category || "",
    status: article?.status || "draft",
    excerpt: article?.excerpt || "",
    content: "",
    tags: "",
  })

  const [activeTab, setActiveTab] = useState("edit")

  const handleSave = () => {
    // Here you would save the article
    console.log("Saving article:", formData)
    onClose()
  }

  const categories = [
    { id: "billing", name: "Billing & Payments" },
    { id: "shipping", name: "Shipping & Delivery" },
    { id: "warranty", name: "Warranty & Returns" },
    { id: "technical", name: "Technical Support" },
    { id: "account", name: "Account Management" },
    { id: "general", name: "General Information" },
  ]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{article ? "Edit Article" : "New Article"}</DialogTitle>
              <DialogDescription>
                {article ? "Update article content and settings" : "Create a new knowledge base article"}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={formData.status === "published" ? "default" : "secondary"}>{formData.status}</Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter a clear, descriptive title"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief summary of the article content"
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Article Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your article content here. You can use Markdown formatting."
                    className="min-h-80 font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports Markdown formatting: **bold**, *italic*, `code`, [links](url), etc.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Article Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="review">Under Review</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="tag1, tag2, tag3"
                      />
                      <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Article Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Author: Support Team</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Created: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>Version: 1.0</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-balance">{formData.title || "Article Title"}</CardTitle>
                    <CardDescription className="mt-2 text-pretty">
                      {formData.excerpt || "Article excerpt will appear here"}
                    </CardDescription>
                  </div>
                  <Badge variant={formData.status === "published" ? "default" : "secondary"}>{formData.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-pretty">
                    {formData.content || "Article content will appear here as you type in the editor."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Additional configuration options for this article</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input placeholder="Optional SEO-optimized title" />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea placeholder="SEO meta description" className="min-h-20" />
                </div>
                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <Input placeholder="article-url-slug" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {article ? "Update" : "Create"} Article
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
