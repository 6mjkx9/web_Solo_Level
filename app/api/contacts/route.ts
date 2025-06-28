import { type NextRequest, NextResponse } from "next/server"
import { ContactsDB } from "@/lib/database"

// GET - отримати всі контакти
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let contacts
    if (search) {
      contacts = ContactsDB.searchContacts(search)
    } else {
      contacts = ContactsDB.getAllContacts()
    }

    return NextResponse.json({
      success: true,
      data: contacts,
      count: contacts.length,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ success: false, error: "Помилка при отриманні контактів" }, { status: 500 })
  }
}

// POST - додати новий контакт
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Валідація даних
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Всі поля є обов'язковими" }, { status: 400 })
    }

    // Перевірка формату email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Невірний формат email" }, { status: 400 })
    }

    // Додаємо контакт до бази даних
    const contact = ContactsDB.addContact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Контакт успішно збережено",
        data: contact,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ success: false, error: "Помилка при збереженні контакту" }, { status: 500 })
  }
}
