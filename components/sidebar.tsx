import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Ticket, MessageSquare, BookOpen, BarChart3, Settings, Users, Shield } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, current: false },
  { name: "Tickets", href: "/tickets", icon: Ticket, current: false },
  { name: "Channels", href: "/channels", icon: MessageSquare, current: false },
  { name: "Knowledge Base", href: "/knowledge", icon: BookOpen, current: true }, // Updated current state for knowledge base page
  { name: "Analytics", href: "/analytics", icon: BarChart3, current: false },
  { name: "Users", href: "/users", icon: Users, current: false },
  { name: "Security", href: "/security", icon: Shield, current: false },
  { name: "Settings", href: "/settings", icon: Settings, current: false },
]

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">F</span>
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">FollowUS</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.name}
              variant={item.current ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                item.current
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.name}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
