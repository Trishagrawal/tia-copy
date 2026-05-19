"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  UserCog,
  LogOut,
  Zap,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useAuth, User } from "@/context/AuthContext";
import { Button } from "./Button";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function NavLink({ href, icon, label, isActive, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

interface SidebarProps {
  user: User;
  onLogout: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ user, onLogout, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { href: "/projects", icon: <FolderKanban className="h-5 w-5" />, label: "Projects" },
    { href: "/conversations", icon: <MessageSquare className="h-5 w-5" />, label: "Conversations" },
    { href: "/profiles", icon: <UserCog className="h-5 w-5" />, label: "TIA Profiles" },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">TIA</h1>
          <p className="text-xs text-muted-foreground">Research Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
            onClick={onMobileClose}
          />
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full text-sm font-semibold text-secondary-foreground">
            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
        <Button
          onClick={onLogout}
          variant="ghost"
          size="sm"
          fullWidth
          className="justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 lg:hidden animate-slide-in-right">
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
  actions,
  onMenuClick,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-card/80 glass border-b border-border">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-secondary"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            
            {backHref && (
              <Link
                href={backHref}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{backLabel || "Back"}</span>
              </Link>
            )}
            
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate text-balance">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground mt-0.5 hidden sm:block">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      
      <div className="lg:pl-64">
        {children}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="card p-8 sm:p-12 text-center animate-fade-in">
      {icon && (
        <div className="flex items-center justify-center w-14 h-14 bg-secondary rounded-2xl mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? "text-success" : "text-destructive"}`}>
              {trend.positive ? "+" : ""}{trend.value}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "secondary";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    secondary: "bg-secondary text-secondary-foreground",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
      {children}
    </main>
  );
}
