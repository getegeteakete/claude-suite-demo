'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Customer {
  id: number
  company_name: string
}

export default function NewDealPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    amount: '',
    stage: 'prospecting',
    probability: '30',
    expected_close_date: '',
    description: '',
  })

  useEffect(() => {
    // TODO: APIから顧客リストを取得
    setCustomers([
      { id: 1, company_name: '株式会社ABC商事' },
      { id: 2, company_name: 'XYZ株式会社' },
      { id: 3, company_name: '株式会社GHI製作所' },
    ])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: APIで商談を作成
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/app/deals')
    } catch (error) {
      alert('商談の作成に失敗しました')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // ステージに応じて確度を自動調整
    if (name === 'stage') {
      const probabilityMap: Record<string, string> = {
        prospecting: '30',
        qualification: '40',
        proposal: '60',
        negotiation: '75',
        closing: '90',
        won: '100',
        lost: '0',
      }
      setFormData(prev => ({
        ...prev,
        probability: probabilityMap[value] || prev.probability,
      }))
    }
  }

  return (
    <div>
      <Link href="/app/deals" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        商談一覧に戻る
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">新規商談作成</h1>
      </div>

      <div className="card p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <label className="label">商談名 *</label>
            <input
              type="text"
              name="title"
              className="input-field"
              value={formData.title}
              onChange={handleChange}
              placeholder="例: 新規システム導入案件"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">商談金額（円）</label>
              <input
                type="number"
                name="amount"
                className="input-field"
                value={formData.amount}
                onChange={handleChange}
                placeholder="5000000"
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">予定クローズ日</label>
              <input
                type="date"
                name="expected_close_date"
                className="input-field"
                value={formData.expected_close_date}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">商談ステージ *</label>
              <select
                name="stage"
                className="input-field"
                value={formData.stage}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="prospecting">見込み (30%)</option>
                <option value="qualification">資格確認 (40%)</option>
                <option value="proposal">提案 (60%)</option>
                <option value="negotiation">交渉 (75%)</option>
                <option value="closing">クロージング (90%)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                ステージに応じて成約確度が自動設定されます
              </p>
            </div>

            <div>
              <label className="label">成約確度（%）</label>
              <input
                type="number"
                name="probability"
                className="input-field"
                value={formData.probability}
                onChange={handleChange}
                min="0"
                max="100"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                0-100の範囲で設定
              </p>
            </div>
          </div>

          <div>
            <label className="label">商談内容・備考</label>
            <textarea
              name="description"
              className="input-field"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="商談の詳細、重要ポイント、次のアクションなどを記載"
              disabled={loading}
            />
          </div>

          {/* プレビュー */}
          {formData.amount && formData.probability && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-blue-900 mb-2">📊 予測情報</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">商談額:</span>
                  <span className="font-semibold ml-2 text-blue-900">
                    ¥{parseInt(formData.amount).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">加重額:</span>
                  <span className="font-semibold ml-2 text-blue-900">
                    ¥{Math.round(parseInt(formData.amount) * parseInt(formData.probability) / 100).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? '作成中...' : '商談を作成'}
            </button>
            <Link href="/app/deals" className="btn-secondary flex-1 text-center">
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

