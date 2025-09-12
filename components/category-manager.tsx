"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Tag } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  articleCount: number
  icon: string
  color: string
}

interface CategoryManagerProps {
  categories: Category[]
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "bg-gray-100 text-gray-800",
  })

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
    })
    setShowDialog(true)
  }

  const handleNew = () => {
    setEditingCategory(null)
    setFormData({
      name: "",
      description: "",
      icon: "",
      color: "bg-gray-100 text-gray-800",
    })
    setShowDialog(true)
  }

  const handleSave = () => {
    // Here you would save the category
    console.log("Saving category:", formData)
    setShowDialog(false)
  }

  const colorOptions = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-orange-100 text-orange-800",
    "bg-purple-100 text-purple-800",
    "bg-indigo-100 text-indigo-800",
    "bg-red-100 text-red-800",
    "bg-yellow-100 text-yellow-800",
    "bg-gray-100 text-gray-800",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Category Management</h2>
          <p className="text-muted-foreground">Organize your knowledge base content</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {category.articleCount} articles
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-pretty">{category.description}</CardDescription>
              <div className="mt-4 flex items-center justify-between">
                <Badge className={category.color}>
                  <Tag className="mr-1 h-3 w-3" />
                  Category
                </Badge>
                <Button variant="outline" size="sm">
                  View Articles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update category information" : "Create a new category for organizing articles"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Billing & Payments"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of what this category covers"
                className="min-h-20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="💳"
                className="text-center text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Color Theme</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`p-2 rounded border-2 ${
                      formData.color === color ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setFormData({ ...formData, color })}
                  >
                    <div className={`w-full h-6 rounded ${color} flex items-center justify-center text-xs font-medium`}>
                      Sample
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{editingCategory ? "Update" : "Create"} Category</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
