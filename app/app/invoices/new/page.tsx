'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Customer {
  id: number
  company_name: string
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unit_price: 0, amount: 0 }
  ])
  
  const [formData, setFormData] = useState({
    customer_id: '',
    invoice_number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    payment_terms: '30',
    notes: '',
  })

  useEffect(() => {
    // TODO: APIから顧客リストを取得
    setCustomers([
      { id: 1, company_name: '株式会社ABC商事' },
      { id: 2, company_name: 'XYZ株式会社' },
      { id: 3, company_name: '株式会社GHI製作所' },
    ])

    // 支払期限を自動計算
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)
    setFormData(prev => ({
      ...prev,
      due_date: dueDate.toISOString().split('T')[0]
    }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // 支払期限の自動計算
    if (name === 'issue_date' || name === 'payment_terms') {
      const issueDate = name === 'issue_date' ? new Date(value) : new Date(formData.issue_date)
      const terms = name === 'payment_terms' ? parseInt(value) : parseInt(formData.payment_terms)
      const dueDate = new Date(issueDate)
      dueDate.setDate(dueDate.getDate() + terms)
      setFormData(prev => ({
        ...prev,
        due_date: dueDate.toISOString().split('T')[0]
      }))
    }
  }

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id !== id) return item
      
      const updated = { ...item, [field]: value }
      
      // 金額の自動計算
      if (field === 'quantity' || field === 'unit_price') {
        updated.amount = updated.quantity * updated.unit_price
      }
      
      return updated
    }))
  }

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: '', quantity: 1, unit_price: 0, amount: 0 }
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const tax = Math.floor(subtotal * 0.1)
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

  const { subtotal, tax, total } = calculateTotals()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: APIで請求書を作成
      const invoiceData = {
        ...formData,
        items,
        subtotal,
        tax,
        total,
      }
      console.log('Creating invoice:', invoiceData)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/app/invoices')
    } catch (error) {
      alert('請求書の作成に失敗しました')
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/app/invoices" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        請求書一覧に戻る
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">新規請求書作成</h1>
        <p className="text-gray-600 mt-2">適格請求書（インボイス制度対応）</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本情報 */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">基本情報</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">請求書番号 *</label>
              <input
                type="text"
                name="invoice_number"
                className="input-field"
                value={formData.invoice_number}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">顧客 *</label>
              <select
                name="customer_id"
                className="input-field"
                value={formData.customer_id}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">顧客を選択してください</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">請求日 *</label>
              <input
                type="date"
                name="issue_date"
                className="input-field"
                value={formData.issue_date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">支払期限</label>
              <div className="flex gap-2">
                <select
                  name="payment_terms"
                  className="input-field"
                  value={formData.payment_terms}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="0">即日</option>
                  <option value="7">7日後</option>
                  <option value="15">15日後</option>
                  <option value="30">30日後</option>
                  <option value="60">60日後</option>
                </select>
                <input
                  type="date"
                  name="due_date"
                  className="input-field"
                  value={formData.due_date}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 明細 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">請求明細</h3>
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-primary hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              明細を追加
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  {index === 0 && <label className="label text-xs">品目・サービス内容</label>}
                  <input
                    type="text"
                    className="input-field"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    placeholder="例: システム開発費用"
                    disabled={loading}
                  />
                </div>
                <div className="col-span-2">
                  {index === 0 && <label className="label text-xs">数量</label>}
                  <input
                    type="number"
                    className="input-field"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
                <div className="col-span-2">
                  {index === 0 && <label className="label text-xs">単価（円）</label>}
                  <input
                    type="number"
                    className="input-field"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                    min="0"
                    disabled={loading}
                  />
                </div>
                <div className="col-span-2">
                  {index === 0 && <label className="label text-xs">金額（円）</label>}
                  <input
                    type="text"
                    className="input-field bg-gray-50"
                    value={item.amount.toLocaleString()}
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  {index === 0 && <div className="h-6"></div>}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                    disabled={items.length === 1 || loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 合計 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">小計:</span>
                  <span className="font-medium">¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">消費税（10%）:</span>
                  <span className="font-medium">¥{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>合計金額:</span>
                  <span className="text-primary">¥{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 備考 */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">備考・特記事項</h3>
          <textarea
            name="notes"
            className="input-field"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            placeholder="振込先情報、支払条件、その他特記事項など"
            disabled={loading}
          />
        </div>

        {/* 送信ボタン */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={loading || !formData.customer_id || items.length === 0}
          >
            {loading ? '作成中...' : '請求書を作成'}
          </button>
          <Link href="/app/invoices" className="btn-secondary flex-1 text-center">
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  )
}

