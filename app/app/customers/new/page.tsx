'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    status: 'active',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: APIで顧客を作成
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/app/customers')
    } catch (error) {
      alert('顧客の作成に失敗しました')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div>
      <Link href="/app/customers" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        顧客一覧に戻る
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">新規顧客登録</h1>
      </div>

      <div className="card p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">会社名 *</label>
            <input
              type="text"
              name="company_name"
              className="input-field"
              value={formData.company_name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">担当者名</label>
              <input
                type="text"
                name="contact_person"
                className="input-field"
                value={formData.contact_person}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">業種</label>
              <select
                name="industry"
                className="input-field"
                value={formData.industry}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">選択してください</option>
                <option value="製造業">製造業</option>
                <option value="IT・情報通信">IT・情報通信</option>
                <option value="小売業">小売業</option>
                <option value="サービス業">サービス業</option>
                <option value="建設業">建設業</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">メールアドレス</label>
              <input
                type="email"
                name="email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">電話番号</label>
              <input
                type="tel"
                name="phone"
                className="input-field"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="label">住所</label>
            <textarea
              name="address"
              className="input-field"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className="label">ステータス</label>
            <select
              name="status"
              className="input-field"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="active">アクティブ</option>
              <option value="inactive">非アクティブ</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? '作成中...' : '顧客を作成'}
            </button>
            <Link href="/app/customers" className="btn-secondary flex-1 text-center">
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

