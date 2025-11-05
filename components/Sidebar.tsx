'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Workflow, 
  BarChart3,
  Bot,
  Settings
} from 'lucide-react'

const menuItems = [
  { href: '/app/dashboard', icon: LayoutDashboard, label: 'ダッシュボード' },
  { href: '/app/customers', icon: Users, label: '顧客管理' },
  { href: '/app/deals', icon: Briefcase, label: '商談管理' },
  { href: '/app/invoices', icon: FileText, label: '請求書管理' },
  { href: '/app/workflow', icon: Workflow, label: 'ワークフロー' },
  { href: '/app/reports', icon: BarChart3, label: '分析レポート' },
  { href: '/app/ai', icon: Bot, label: 'AI自動応答', badge: 'AI' },
  { href: '/app/settings', icon: Settings, label: '設定' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-secondary text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">CLAUDE SUITE</h1>
        <p className="text-xs text-gray-400 mt-1">合同会社UMA</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <a 
          href="/demo_dashboard.html"
          className="block text-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          📺 デモ画面を見る
        </a>
      </div>
    </div>
  )
}

