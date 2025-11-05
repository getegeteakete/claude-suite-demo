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

