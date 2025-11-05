'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, Briefcase, DollarSign, AlertCircle } from 'lucide-react'

interface DashboardStats {
  customers: number
  deals: number
  revenue: number
  pending: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    customers: 0,
    deals: 0,
    revenue: 0,
    pending: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    // TODO: APIから実際のデータを取得
    // 現在はダミーデータ
    setTimeout(() => {
      setStats({
        customers: 1248,
        deals: 47,
        revenue: 12500000,
        pending: 3500000,
      })
      setLoading(false)
    }, 500)
  }, [])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-2">システム全体の状況を一目で把握</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="顧客数"
          value={stats.customers.toLocaleString()}
          icon={Users}
          color="blue"
          description="アクティブ顧客"
        />
        <StatCard
          title="進行中商談"
          value={stats.deals.toLocaleString()}
          icon={Briefcase}
          color="green"
          description="案件"
        />
        <StatCard
          title="総売上"
          value={`¥${(stats.revenue / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          color="purple"
          description="今年度累計"
        />
        <StatCard
          title="未入金"
          value={`¥${(stats.pending / 1000000).toFixed(1)}M`}
          icon={AlertCircle}
          color="orange"
          description="要回収"
        />
      </div>

      {/* 最近のアクティビティ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4">最近の商談</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">新規システム導入案件</p>
                  <p className="text-xs text-gray-500">株式会社ABC商事</p>
                </div>
                <span className="text-sm font-semibold text-green-600">¥500万</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4">未入金請求書</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">INV-2025-{i.toString().padStart(4, '0')}</p>
                  <p className="text-xs text-gray-500">期限: 2025/11/30</p>
                </div>
                <span className="text-sm font-semibold text-orange-600">¥88,000</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ElementType
  color: 'blue' | 'green' | 'purple' | 'orange'
  description: string
}

function StatCard({ title, value, icon: Icon, color, description }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )
}

