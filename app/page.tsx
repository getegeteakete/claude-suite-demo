import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-secondary mb-4">
            CLAUDE SUITE
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            クラウド型顧客管理AIシステム
          </p>
          <p className="text-sm text-gray-500">合同会社UMA</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              システムを選択してください
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                href="/app/dashboard" 
                className="block p-6 border-2 border-primary rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    本番環境
                  </h3>
                  <p className="text-gray-600 text-sm">
                    実際に使える機能版<br />
                    ログインして利用開始
                  </p>
                </div>
              </Link>

              <a 
                href="/demo_dashboard.html" 
                className="block p-6 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">📺</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    デモ環境
                  </h3>
                  <p className="text-gray-600 text-sm">
                    IT補助金提出用デモ画面<br />
                    機能のプレビューを確認
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">📋 実装済み機能</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-primary">✅ 本番環境</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• 認証システム（準備中）</li>
                  <li>• 顧客管理（準備中）</li>
                  <li>• ダッシュボード（準備中）</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-600">📺 デモ環境</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• 全機能のプレビュー</li>
                  <li>• ワークフロー機能</li>
                  <li>• AI自動応答</li>
                  <li>• 請求書管理</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

