'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Customer {
  id: number
  company_name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  industry: string | null
  status: string
  total_revenue: number
  created_at: string
}

export default function CustomersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    // TODO: APIから実際のデータを取得
    // 現在はダミーデータ
    setTimeout(() => {
      setCustomers([
        {
          id: 1,
          company_name: '株式会社ABC商事',
          contact_person: '田中 太郎',
          email: 'tanaka@abc.co.jp',
          phone: '03-1234-5678',
          industry: '製造業',
          status: 'active',
          total_revenue: 5000000,
          created_at: '2024-01-15',
        },
        {
          id: 2,
          company_name: 'XYZ株式会社',
          contact_person: '佐藤 花子',
          email: 'sato@xyz.co.jp',
          phone: '06-9876-5432',
          industry: 'IT・情報通信',
          status: 'active',
          total_revenue: 3200000,
          created_at: '2024-02-20',
        },
        {
          id: 3,
          company_name: '株式会社GHI製作所',
          contact_person: '鈴木 一郎',
          email: 'suzuki@ghi.co.jp',
          phone: '03-5555-6666',
          industry: '製造業',
          status: 'inactive',
          total_revenue: 1800000,
          created_at: '2023-11-05',
        },
      ])
      setLoading(false)
    }, 500)
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: number) => {
    if (!confirm('この顧客を削除してもよろしいですか？')) return
    
    // TODO: APIで削除処理
    setCustomers(customers.filter(c => c.id !== id))
  }

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
          <h1 className="text-3xl font-bold text-gray-900">顧客管理</h1>
          <p className="text-gray-600 mt-2">全 {customers.length} 件の顧客</p>
        </div>
        <Link href="/app/customers/new" className="btn-primary">
          <Plus className="w-5 h-5 inline mr-2" />
          新規顧客登録
        </Link>
      </div>

      {/* 検索・フィルター */}
      <div className="card p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="顧客名、担当者名で検索..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">すべてのステータス</option>
            <option value="active">アクティブ</option>
            <option value="inactive">非アクティブ</option>
          </select>
        </div>
      </div>

      {/* 顧客一覧テーブル */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                会社名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                担当者
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                業種
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                売上実績
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{customer.company_name}</div>
                  <div className="text-sm text-gray-500">{customer.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {customer.contact_person || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {customer.industry || '-'}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ¥{customer.total_revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    customer.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.status === 'active' ? 'アクティブ' : '非アクティブ'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <Link 
                      href={`/app/customers/${customer.id}/edit`}
                      className="text-primary hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(customer.id)}
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

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            顧客が見つかりませんでした
          </div>
        )}
      </div>
    </div>
  )
}

