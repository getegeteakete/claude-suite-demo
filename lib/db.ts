import { sql } from '@vercel/postgres'

export interface Customer {
  id: number
  company_name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  address: string | null
  industry: string | null
  status: string
  total_revenue: number
  user_id: number
  created_at: Date
  updated_at: Date
}

export interface Deal {
  id: number
  customer_id: number
  title: string
  amount: number | null
  stage: string
  probability: number
  expected_close_date: Date | null
  status: string
  user_id: number
  created_at: Date
  updated_at: Date
}

export interface Invoice {
  id: number
  invoice_number: string
  customer_id: number
  issue_date: Date
  due_date: Date
  total_amount: number
  paid_amount: number
  status: string
  user_id: number
  created_at: Date
  updated_at: Date
}

// 顧客管理用の関数
export async function getCustomers(userId: number) {
  try {
    const result = await sql<Customer>`
      SELECT * FROM customers 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('顧客データの取得に失敗しました')
  }
}

export async function getCustomerById(id: number, userId: number) {
  try {
    const result = await sql<Customer>`
      SELECT * FROM customers 
      WHERE id = ${id} AND user_id = ${userId}
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('顧客データの取得に失敗しました')
  }
}

export async function createCustomer(data: Partial<Customer>) {
  try {
    const result = await sql<Customer>`
      INSERT INTO customers (
        company_name, contact_person, email, phone, 
        address, industry, status, user_id
      )
      VALUES (
        ${data.company_name}, ${data.contact_person}, ${data.email},
        ${data.phone}, ${data.address}, ${data.industry},
        ${data.status || 'active'}, ${data.user_id}
      )
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('顧客の作成に失敗しました')
  }
}

export async function updateCustomer(id: number, data: Partial<Customer>) {
  try {
    const result = await sql<Customer>`
      UPDATE customers 
      SET 
        company_name = COALESCE(${data.company_name}, company_name),
        contact_person = COALESCE(${data.contact_person}, contact_person),
        email = COALESCE(${data.email}, email),
        phone = COALESCE(${data.phone}, phone),
        address = COALESCE(${data.address}, address),
        industry = COALESCE(${data.industry}, industry),
        status = COALESCE(${data.status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('顧客の更新に失敗しました')
  }
}

export async function deleteCustomer(id: number, userId: number) {
  try {
    await sql`
      DELETE FROM customers 
      WHERE id = ${id} AND user_id = ${userId}
    `
    return true
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('顧客の削除に失敗しました')
  }
}

// 商談管理用の関数
export async function getDeals(userId: number) {
  try {
    const result = await sql<Deal>`
      SELECT d.*, c.company_name as customer_name
      FROM deals d
      LEFT JOIN customers c ON d.customer_id = c.id
      WHERE d.user_id = ${userId}
      ORDER BY d.created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('商談データの取得に失敗しました')
  }
}

export async function createDeal(data: Partial<Deal>) {
  try {
    const result = await sql<Deal>`
      INSERT INTO deals (
        customer_id, title, amount, stage, probability,
        expected_close_date, status, user_id
      )
      VALUES (
        ${data.customer_id}, ${data.title}, ${data.amount},
        ${data.stage || 'prospecting'}, ${data.probability || 30},
        ${data.expected_close_date}, ${data.status || 'active'}, ${data.user_id}
      )
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('商談の作成に失敗しました')
  }
}

export async function updateDeal(id: number, data: Partial<Deal>) {
  try {
    const result = await sql<Deal>`
      UPDATE deals 
      SET 
        title = COALESCE(${data.title}, title),
        amount = COALESCE(${data.amount}, amount),
        stage = COALESCE(${data.stage}, stage),
        probability = COALESCE(${data.probability}, probability),
        expected_close_date = COALESCE(${data.expected_close_date}, expected_close_date),
        status = COALESCE(${data.status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('商談の更新に失敗しました')
  }
}

// 請求書管理用の関数
export async function getInvoices(userId: number) {
  try {
    const result = await sql<Invoice>`
      SELECT i.*, c.company_name as customer_name
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE i.user_id = ${userId}
      ORDER BY i.created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('請求書データの取得に失敗しました')
  }
}

export async function createInvoice(data: Partial<Invoice>) {
  try {
    const result = await sql<Invoice>`
      INSERT INTO invoices (
        invoice_number, customer_id, issue_date, due_date,
        total_amount, paid_amount, status, user_id
      )
      VALUES (
        ${data.invoice_number}, ${data.customer_id}, ${data.issue_date},
        ${data.due_date}, ${data.total_amount}, ${data.paid_amount || 0},
        ${data.status || 'pending'}, ${data.user_id}
      )
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('請求書の作成に失敗しました')
  }
}

export async function updateInvoice(id: number, data: Partial<Invoice>) {
  try {
    const result = await sql<Invoice>`
      UPDATE invoices 
      SET 
        paid_amount = COALESCE(${data.paid_amount}, paid_amount),
        status = COALESCE(${data.status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('請求書の更新に失敗しました')
  }
}

// ダッシュボード統計用
export async function getDashboardStats(userId: number) {
  try {
    const customersCount = await sql`
      SELECT COUNT(*) as count FROM customers 
      WHERE user_id = ${userId} AND status = 'active'
    `
    
    const dealsCount = await sql`
      SELECT COUNT(*) as count FROM deals 
      WHERE user_id = ${userId} AND status = 'active'
    `
    
    const totalRevenue = await sql`
      SELECT COALESCE(SUM(total_amount), 0) as total 
      FROM invoices 
      WHERE user_id = ${userId} AND status = 'paid'
    `
    
    const pendingInvoices = await sql`
      SELECT COALESCE(SUM(total_amount - paid_amount), 0) as total 
      FROM invoices 
      WHERE user_id = ${userId} AND status = 'pending'
    `
    
    return {
      customers: customersCount.rows[0].count,
      deals: dealsCount.rows[0].count,
      revenue: totalRevenue.rows[0].total,
      pending: pendingInvoices.rows[0].total,
    }
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('統計データの取得に失敗しました')
  }
}

