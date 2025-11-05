'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Deal {
  id: number
  customer_id: number
  customer_name: string
  title: string
  amount: number | null
  stage: string
  probability: number
  expected_close_date: string | null
  status: string
  created_at: string
}

const stageLabels: Record<string, string> = {
  prospecting: '見込み',
  qualification: '資格確認',
  proposal: '提案',
  negotiation: '交渉',
  closing: 'クロージング',
  won: '成約',
  lost: '失注',
}

const stageColors: Record<string, string> = {
  prospecting: 'bg-gray-100 text-gray-800',
  qualification: 'bg-blue-100 text-blue-800',
  proposal: 'bg-purple-100 text-purple-800',
  negotiation: 'bg-orange-100 text-orange-800',
  closing: 'bg-yellow-100 text-yellow-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
}

export default function DealsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    // TODO: APIから実際のデータを取得
    // 現在はダミーデータ
    setTimeout(() => {
      setDeals([
        {
          id: 1,
          customer_id: 1,
          customer_name: '株式会社ABC商事',
          title: '新規システム導入案件',
          amount: 5000000,
          stage: 'proposal',
          probability: 60,
          expected_close_date: '2025-12-31',
          status: 'active',
          created_at: '2024-11-01',
        },
        {
          id: 2,
          customer_id: 2,
          customer_name: 'XYZ株式会社',
          title: 'クラウド移行プロジェクト',
          amount: 8000000,
          stage: 'negotiation',
          probability: 75,
          expected_close_date: '2025-11-30',
          status: 'active',
          created_at: '2024-10-15',
        },
        {
          id: 3,
          customer_id: 1,
          customer_name: '株式会社ABC商事',
          title: '保守契約更新',
          amount: 1200000,
          stage: 'closing',
          probability: 90,
          expected_close_date: '2025-11-15',
          status: 'active',
          created_at: '2024-10-01',
        },
        {
          id: 4,
          customer_id: 3,
          customer_name: '株式会社GHI製作所',
          title: 'AI導入コンサルティング',
          amount: 3500000,
          stage: 'prospecting',
          probability: 30,
          expected_close_date: '2026-01-31',
          status: 'active',
          created_at: '2024-11-05',
        },
        {
          id: 5,
          customer_id: 2,
          customer_name: 'XYZ株式会社',
          title: 'セキュリティ強化プロジェクト',
          amount: 2800000,
          stage: 'won',
          probability: 100,
          expected_close_date: '2024-10-31',
          status: 'closed',
          created_at: '2024-09-01',
        },
      ])
      setLoading(false)
    }, 500)
  }

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = filterStage === 'all' || deal.stage === filterStage
    return matchesSearch && matchesStage
  })

  const handleDelete = async (id: number) => {
    if (!confirm('この商談を削除してもよろしいですか？')) return
    
    // TODO: APIで削除処理
    setDeals(deals.filter(d => d.id !== id))
  }

  // 統計計算
  const totalAmount = deals
    .filter(d => d.status === 'active')
    .reduce((sum, d) => sum + (d.amount || 0), 0)
  
  const weightedAmount = deals
    .filter(d => d.status === 'active')
    .reduce((sum, d) => sum + (d.amount || 0) * d.probability / 100, 0)

  if (loading) {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">商談・案件管理</h1>
          <p className="text-gray-600 mt-2">進行中 {deals.filter(d => d.status === 'active').length} 件</p>
        </div>
        <Link href="/app/deals/new" className="btn-primary">
          <Plus className="w-5 h-5 inline mr-2" />
          新規商談作成
        </Link>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">総商談額</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ¥{(totalAmount / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-gray-500 mt-2">進行中の案件</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">加重商談額</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ¥{(weightedAmount / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-gray-500 mt-2">確度を加味した予測</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">平均成約確度</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(
              deals.filter(d => d.status === 'active')
                .reduce((sum, d) => sum + d.probability, 0) / 
              deals.filter(d => d.status === 'active').length
            )}%
          </p>
          <p className="text-xs text-gray-500 mt-2">進行中案件の平均</p>
        </div>
      </div>

      {/* 検索・フィルター */}
      <div className="card p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="商談名、顧客名で検索..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field w-48"
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
          >
            <option value="all">すべてのステージ</option>
            <option value="prospecting">見込み</option>
            <option value="qualification">資格確認</option>
            <option value="proposal">提案</option>
            <option value="negotiation">交渉</option>
            <option value="closing">クロージング</option>
            <option value="won">成約</option>
            <option value="lost">失注</option>
          </select>
        </div>
      </div>

      {/* 商談一覧テーブル */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                商談名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                顧客
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                金額
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステージ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                成約確度
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                予定日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDeals.map((deal) => (
              <tr key={deal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{deal.title}</div>
                  <div className="text-sm text-gray-500">ID: {deal.id}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {deal.customer_name}
                </td>
                <td className="px-6 py-4">
                  {deal.amount ? (
                    <div className="font-semibold text-gray-900">
                      ¥{deal.amount.toLocaleString()}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    stageColors[deal.stage]
                  }`}>
                    {stageLabels[deal.stage]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${deal.probability}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {deal.probability}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {deal.expected_close_date || '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <Link 
                      href={`/app/deals/${deal.id}/edit`}
                      className="text-primary hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(deal.id)}
                      className="text-danger hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDeals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            商談が見つかりませんでした
          </div>
        )}
      </div>
    </div>
  )
}

