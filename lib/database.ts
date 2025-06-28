import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const dbPath = path.join(process.cwd(), "data", "contacts.db")

// Створюємо папку data, якщо вона не існує
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Ініціалізуємо базу даних SQLite
const db = new Database(dbPath)

// Включаємо WAL режим для кращої продуктивності
db.pragma("journal_mode = WAL")

// Створюємо таблиці при першому запуску
const initSQL = `
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
`

db.exec(initSQL)

export interface Contact {
  id?: number
  name: string
  email: string
  message: string
  created_at?: string
  status?: "new" | "read" | "replied"
}

export class ContactsDB {
  // Додати новий контакт
  static addContact(contact: Omit<Contact, "id" | "created_at">): Contact {
    const stmt = db.prepare(`
      INSERT INTO contacts (name, email, message, status)
      VALUES (?, ?, ?, ?)
    `)

    const result = stmt.run(contact.name, contact.email, contact.message, contact.status || "new")

    return {
      id: result.lastInsertRowid as number,
      ...contact,
      created_at: new Date().toISOString(),
    }
  }

  // Отримати всі контакти
  static getAllContacts(): Contact[] {
    const stmt = db.prepare(`
      SELECT * FROM contacts 
      ORDER BY created_at DESC
    `)

    return stmt.all() as Contact[]
  }

  // Отримати контакт за ID
  static getContactById(id: number): Contact | null {
    const stmt = db.prepare(`
      SELECT * FROM contacts WHERE id = ?
    `)

    return stmt.get(id) as Contact | null
  }

  // Оновити статус контакту
  static updateContactStatus(id: number, status: "new" | "read" | "replied"): boolean {
    const stmt = db.prepare(`
      UPDATE contacts SET status = ? WHERE id = ?
    `)

    const result = stmt.run(status, id)
    return result.changes > 0
  }

  // Видалити контакт
  static deleteContact(id: number): boolean {
    const stmt = db.prepare(`
      DELETE FROM contacts WHERE id = ?
    `)

    const result = stmt.run(id)
    return result.changes > 0
  }

  // Пошук контактів
  static searchContacts(query: string): Contact[] {
    const stmt = db.prepare(`
      SELECT * FROM contacts 
      WHERE name LIKE ? OR email LIKE ? OR message LIKE ?
      ORDER BY created_at DESC
    `)

    const searchTerm = `%${query}%`
    return stmt.all(searchTerm, searchTerm, searchTerm) as Contact[]
  }

  // Отримати статистику контактів
  static getStats() {
    const totalStmt = db.prepare("SELECT COUNT(*) as total FROM contacts")
    const newStmt = db.prepare("SELECT COUNT(*) as new FROM contacts WHERE status = 'new'")
    const readStmt = db.prepare("SELECT COUNT(*) as read FROM contacts WHERE status = 'read'")
    const repliedStmt = db.prepare("SELECT COUNT(*) as replied FROM contacts WHERE status = 'replied'")

    return {
      total: (totalStmt.get() as any).total,
      new: (newStmt.get() as any).new,
      read: (readStmt.get() as any).read,
      replied: (repliedStmt.get() as any).replied,
    }
  }
}

export default db
