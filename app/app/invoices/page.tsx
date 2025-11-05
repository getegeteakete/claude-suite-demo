'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Plus, Search, Download, Edit, FileText } from 'lucide-react'
import Link from 'next/link'

interface Invoice {
  id: number
  invoice_number: string
  customer_id: number
  customer_name: string
  issue_date: string
  due_date: string
  total_amount: number
  paid_amount: number
  status: string
  created_at: string
}

const statusLabels: Record<string, string> = {
  pending: '未入金',
  paid: '入金済',
  partial: '一部入金',
  overdue: '支払遅延',
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  partial: 'bg-blue-100 text-blue-800',
  overdue: 'bg-red-100 text-red-800',
}

export default function InvoicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    // TODO: APIから実際のデータを取得
    setTimeout(() => {
      setInvoices([
        {
          id: 1,
          invoice_number: 'INV-2025-0187',
          customer_id: 1,
          customer_name: '株式会社ABC商事',
          issue_date: '2025-11-01',
          due_date: '2025-11-30',
          total_amount: 165000,
          paid_amount: 165000,
          status: 'paid',
          created_at: '2025-11-01',
        },
        {
          id: 2,
          invoice_number: 'INV-2025-0186',
          customer_id: 2,
          customer_name: 'XYZ株式会社',
          issue_date: '2025-11-01',
          due_date: '2025-11-25',
          total_amount: 88000,
          paid_amount: 0,
          status: 'pending',
          created_at: '2025-11-01',
        },
        {
          id: 3,
          invoice_number: 'INV-2025-0185',
          customer_id: 3,
          customer_name: '株式会社GHI製作所',
          issue_date: '2025-11-01',
          due_date: '2025-11-20',
          total_amount: 165000,
          paid_amount: 165000,
          status: 'paid',
          created_at: '2025-11-01',
        },
        {
          id: 4,
          invoice_number: 'INV-2025-0184',
          customer_id: 1,
          customer_name: '株式会社ABC商事',
          issue_date: '2025-10-01',
          due_date: '2025-10-31',
          total_amount: 88000,
          paid_amount: 0,
          status: 'overdue',
          created_at: '2025-10-01',
        },
        {
          id: 5,
          invoice_number: 'INV-2025-0183',
          customer_id: 2,
          customer_name: 'XYZ株式会社',
          issue_date: '2025-10-15',
          due_date: '2025-11-15',
          total_amount: 110000,
          paid_amount: 50000,
          status: 'partial',
          created_at: '2025-10-15',
        },
      ])
      setLoading(false)
    }, 500)
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // 統計計算
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total_amount, 0)
  
  const unpaidAmount = invoices
    .filter(i => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + (i.total_amount - i.paid_amount), 0)

  const overdueAmount = invoices
    .filter(i => i.status === 'overdue')
    .reduce((sum, i) => sum + (i.total_amount - i.paid_amount), 0)

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
          <h1 className="text-3xl font-bold text-gray-900">請求書管理</h1>
          <p className="text-gray-600 mt-2">全 {invoices.length} 件の請求書</p>
        </div>
        <div className="flex gap-3">
          <Link href="/app/invoices/new" className="btn-primary">
            <Plus className="w-5 h-5 inline mr-2" />
            新規請求書作成
          </Link>
          <Link href="/app/invoices/export" className="btn-secondary">
            <Download className="w-5 h-5 inline mr-2" />
            CSV出力
          </Link>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">今月発行</h3>
          <p className="text-3xl font-bold text-gray-900">
            ¥{(invoices.filter(i => i.issue_date.startsWith('2025-11')).reduce((sum, i) => sum + i.total_amount, 0) / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {invoices.filter(i => i.issue_date.startsWith('2025-11')).length}件の請求書
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">入金済</h3>
          <p className="text-3xl font-bold text-green-600">
            ¥{(totalRevenue / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {invoices.filter(i => i.status === 'paid').length}件
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">未入金</h3>
          <p className="text-3xl font-bold text-orange-600">
            ¥{(unpaidAmount / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {invoices.filter(i => i.status === 'pending' || i.status === 'partial').length}件
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">支払遅延</h3>
          <p className="text-3xl font-bold text-red-600">
            ¥{(overdueAmount / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {invoices.filter(i => i.status === 'overdue').length}件
          </p>
        </div>
      </div>

      {/* 検索・フィルター */}
      <div className="card p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="請求書番号、顧客名で検索..."
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
            <option value="pending">未入金</option>
            <option value="paid">入金済</option>
            <option value="partial">一部入金</option>
            <option value="overdue">支払遅延</option>
          </select>
        </div>
      </div>

      {/* 請求書一覧テーブル */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                請求書番号
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                顧客名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                請求額（税込）
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                請求日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                入金予定日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                入金額
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                売掛残高
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                入金状況
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{invoice.invoice_number}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {invoice.customer_name}
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">
                    ¥{invoice.total_amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {invoice.issue_date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {invoice.due_date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ¥{invoice.paid_amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className={`font-semibold ${
                    invoice.total_amount - invoice.paid_amount > 0 
                      ? 'text-red-600' 
                      : 'text-gray-900'
                  }`}>
                    ¥{(invoice.total_amount - invoice.paid_amount).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    statusColors[invoice.status]
                  }`}>
                    {statusLabels[invoice.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <Link 
                      href={`/app/invoices/${invoice.id}`}
                      className="text-primary hover:text-blue-700"
                      title="詳細"
                    >
                      <FileText className="w-4 h-4" />
                    </Link>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      title="PDF出力"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            請求書が見つかりませんでした
          </div>
        )}
      </div>
    </div>
  )
}

