import { type NextRequest, NextResponse } from "next/server"
import { ContactsDB } from "@/lib/database"

// GET - отримати контакт за ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Невірний ID контакту" }, { status: 400 })
    }

    const contact = ContactsDB.getContactById(id)

    if (!contact) {
      return NextResponse.json({ success: false, error: "Контакт не знайдено" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ success: false, error: "Помилка при отриманні контакту" }, { status: 500 })
  }
}

// PUT - оновити статус контакту
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { status } = body

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Невірний ID контакту" }, { status: 400 })
    }

    if (!["new", "read", "replied"].includes(status)) {
      return NextResponse.json({ success: false, error: "Невірний статус" }, { status: 400 })
    }

    const updated = ContactsDB.updateContactStatus(id, status)

    if (!updated) {
      return NextResponse.json({ success: false, error: "Контакт не знайдено" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Статус контакту оновлено",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ success: false, error: "Помилка при оновленні контакту" }, { status: 500 })
  }
}

// DELETE - видалити контакт
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Невірний ID контакту" }, { status: 400 })
    }

    const deleted = ContactsDB.deleteContact(id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Контакт не знайдено" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Контакт видалено",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ success: false, error: "Помилка при видаленні контакту" }, { status: 500 })
  }
}
