"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return <SidebarContext.Provider value={{ isOpen, toggle }}>{children}</SidebarContext.Provider>
}

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { toggle } = useSidebar()
    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500",
          className,
        )}
        ref={ref}
        {...props}
      >
        <Menu className="h-6 w-6" />
      </button>
    )
  },
)

SidebarTrigger.displayName = "SidebarTrigger"

export const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen } = useSidebar()
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {children}
    </aside>
  )
}

export const SidebarContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-6 h-full overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
    <div className="space-y-6">{children}</div>
  </div>
)

export const SidebarFooter: React.FC<React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }> = ({
  className,
  children,
  ...props
}) => (
  <footer className={cn("p-4 border-t border-gray-200", className)} {...props}>
    {children}
  </footer>
)

export const SidebarHeader: React.FC<React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }> = ({
  className,
  children,
  ...props
}) => {
  const { toggle } = useSidebar()
  return (
    <header className={cn("p-4 border-b border-gray-200 flex justify-between items-center", className)} {...props}>
      {children}
      <button
        onClick={toggle}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <X className="h-5 w-5" />
        <span className="sr-only">Close sidebar</span>
      </button>
    </header>
  )
}

export const SidebarMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <nav className="py-4">
    <ul className="space-y-2">{children}</ul>
  </nav>
)

export const SidebarMenuItem: React.FC<{ children: React.ReactNode; isActive?: boolean }> = ({
  children,
  isActive,
}) => (
  <li>
    <div
      className={cn(
        "px-4 py-2 rounded-md transition-colors duration-200 ease-in-out",
        isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100",
      )}
    >
      {children}
    </div>
  </li>
)

