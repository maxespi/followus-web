// components/new-ticket-dialog.tsx
'use client'

import { useState } from 'react'
import { useTranslation } from '@/context/AppContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { CreateTicketForm } from '@/lib/types'

interface NewTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTicketDialog({ open, onOpenChange }: NewTicketDialogProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<CreateTicketForm>({
    title: '',
    description: '',
    priority: 'medium',
    channel: 'email',
    category: '',
    tags: []
  })
  const [newTag, setNewTag] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!formData.title.trim() || !formData.description.trim()) {
      return
    }

    // Aquí iría la lógica para crear el ticket
    // TODO: Implementar creación real de ticket

    // Cerrar dialog y limpiar form
    onOpenChange(false)
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      channel: 'email',
      category: '',
      tags: []
    })
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('tickets.newTicket')}</DialogTitle>
            <DialogDescription>
              Crea un nuevo ticket de soporte para gestionar la consulta del cliente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prioridad */}
              <div className="space-y-2">
                <Label htmlFor="priority">{t('tickets.priority')}</Label>
                <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('tickets.low')}</SelectItem>
                    <SelectItem value="medium">{t('tickets.medium')}</SelectItem>
                    <SelectItem value="high">{t('tickets.high')}</SelectItem>
                    <SelectItem value="urgent">{t('tickets.urgent')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Canal */}
              <div className="space-y-2">
                <Label htmlFor="channel">{t('tickets.channel')}</Label>
                <Select
                    value={formData.channel}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, channel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">{t('tickets.email')}</SelectItem>
                    <SelectItem value="chat">{t('tickets.chat')}</SelectItem>
                    <SelectItem value="phone">{t('tickets.phone')}</SelectItem>
                    <SelectItem value="social">{t('tickets.social')}</SelectItem>
                    <SelectItem value="web">{t('tickets.web')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Describe brevemente el problema o consulta"
                  required
              />
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="ej: Técnico, Facturación, General"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Proporciona una descripción detallada del problema"
                  className="min-h-[120px]"
                  required
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Agregar tag"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Agregar
                </Button>
              </div>
              {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                    ))}
                  </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}
