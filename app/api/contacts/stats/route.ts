import { NextResponse } from "next/server"
import { ContactsDB } from "@/lib/database"

export async function GET() {
  try {
    const stats = ContactsDB.getStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ success: false, error: "Помилка при отриманні статистики" }, { status: 500 })
  }
}
