// hooks/use-knowledge-base.ts
'use client'

import { useState, useMemo } from 'react'

export interface Article {
    id: string
    title: string
    content: string
    category: string
    tags: string[]
    author: string
    createdAt: Date
    updatedAt: Date
    views: number
    helpful: number
    notHelpful: number
    status: 'published' | 'draft' | 'archived'
}

export interface Category {
    id: string
    name: string
    description: string
    articleCount: number
    icon: string
}

const mockCategories: Category[] = [
    { id: 'getting-started', name: 'Getting Started', description: 'Basic setup and first steps', articleCount: 12, icon: 'rocket' },
    { id: 'account-settings', name: 'Account & Settings', description: 'Manage your account preferences', articleCount: 8, icon: 'settings' },
    { id: 'billing', name: 'Billing & Payments', description: 'Payment methods and billing questions', articleCount: 6, icon: 'credit-card' },
    { id: 'troubleshooting', name: 'Troubleshooting', description: 'Common issues and solutions', articleCount: 15, icon: 'tool' },
    { id: 'integrations', name: 'Integrations', description: 'Connect with third-party services', articleCount: 9, icon: 'plug' },
    { id: 'api', name: 'API Documentation', description: 'Developer resources and guides', articleCount: 11, icon: 'code' }
]

const mockArticles: Article[] = [
    {
        id: 'article-1',
        title: 'How to Get Started with FollowUS',
        content: 'Complete guide to setting up your FollowUS account...',
        category: 'getting-started',
        tags: ['setup', 'beginner', 'guide'],
        author: 'Ana García',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-06-20'),
        views: 1247,
        helpful: 89,
        notHelpful: 12,
        status: 'published'
    },
    {
        id: 'article-2',
        title: 'Managing User Permissions',
        content: 'Learn how to set up and manage user roles and permissions...',
        category: 'account-settings',
        tags: ['permissions', 'users', 'admin'],
        author: 'Carlos Rodríguez',
        createdAt: new Date('2023-02-10'),
        updatedAt: new Date('2023-07-15'),
        views: 892,
        helpful: 67,
        notHelpful: 8,
        status: 'published'
    },
    {
        id: 'article-3',
        title: 'Understanding Billing Cycles',
        content: 'Explanation of how billing works and payment schedules...',
        category: 'billing',
        tags: ['billing', 'payments', 'subscription'],
        author: 'María López',
        createdAt: new Date('2023-03-05'),
        updatedAt: new Date('2023-08-10'),
        views: 634,
        helpful: 45,
        notHelpful: 15,
        status: 'published'
    },
    {
        id: 'article-4',
        title: 'API Authentication Guide',
        content: 'How to authenticate and make your first API calls...',
        category: 'api',
        tags: ['api', 'authentication', 'developers'],
        author: 'Pedro Silva',
        createdAt: new Date('2023-04-12'),
        updatedAt: new Date('2023-09-01'),
        views: 456,
        helpful: 38,
        notHelpful: 5,
        status: 'published'
    },
    {
        id: 'article-5',
        title: 'Common Login Issues',
        content: 'Troubleshooting steps for login problems...',
        category: 'troubleshooting',
        tags: ['login', 'troubleshooting', 'password'],
        author: 'Ana García',
        createdAt: new Date('2023-05-20'),
        updatedAt: new Date('2023-09-15'),
        views: 789,
        helpful: 72,
        notHelpful: 18,
        status: 'published'
    }
]

export function useKnowledgeBase() {
    const [articles] = useState<Article[]>(mockArticles)
    const [categories] = useState<Category[]>(mockCategories)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesCategory = !selectedCategory || article.category === selectedCategory

            return matchesSearch && matchesCategory && article.status === 'published'
        })
    }, [articles, searchQuery, selectedCategory])

    const popularArticles = useMemo(() => {
        return [...articles]
            .filter(article => article.status === 'published')
            .sort((a, b) => b.views - a.views)
            .slice(0, 5)
    }, [articles])

    const recentArticles = useMemo(() => {
        return [...articles]
            .filter(article => article.status === 'published')
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
            .slice(0, 5)
    }, [articles])

    const kbStats = useMemo(() => {
        const totalArticles = articles.filter(a => a.status === 'published').length
        const totalViews = articles.reduce((sum, a) => sum + a.views, 0)
        const totalHelpful = articles.reduce((sum, a) => sum + a.helpful, 0)
        const totalNotHelpful = articles.reduce((sum, a) => sum + a.notHelpful, 0)
        const helpfulPercentage = totalHelpful + totalNotHelpful > 0
            ? Math.round((totalHelpful / (totalHelpful + totalNotHelpful)) * 100)
            : 0

        return {
            totalArticles,
            totalViews,
            helpfulPercentage,
            categoriesCount: categories.length
        }
    }, [articles, categories])

    const getCategoryIcon = (icon: string) => {
        const iconMap: Record<string, string> = {
            rocket: 'rocket',
            settings: 'settings',
            'credit-card': 'credit-card',
            tool: 'wrench',
            plug: 'plug',
            code: 'code'
        }
        return iconMap[icon] || 'help-circle'
    }

    const getHelpfulnessScore = (article: Article) => {
        const total = article.helpful + article.notHelpful
        return total > 0 ? Math.round((article.helpful / total) * 100) : 0
    }

    const markAsHelpful = (articleId: string, helpful: boolean) => {
        // This would typically update the backend
        console.log(`Article ${articleId} marked as ${helpful ? 'helpful' : 'not helpful'}`)
    }

    return {
        articles: filteredArticles,
        categories,
        popularArticles,
        recentArticles,
        kbStats,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedArticle,
        setSelectedArticle,
        getCategoryIcon,
        getHelpfulnessScore,
        markAsHelpful
    }
}