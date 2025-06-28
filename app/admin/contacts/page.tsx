"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Mail, User, Calendar, Trash2, Eye, MessageSquare } from "lucide-react"

interface Contact {
  id: number
  name: string
  email: string
  message: string
  created_at: string
  status: "new" | "read" | "replied"
}

interface Stats {
  total: number
  new: number
  read: number
  replied: number
}

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, read: 0, replied: 0 })
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  useEffect(() => {
    fetchContacts()
    fetchStats()
  }, [])

  const fetchContacts = async (search?: string) => {
    try {
      const url = search ? `/api/contacts?search=${encodeURIComponent(search)}` : "/api/contacts"
      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setContacts(result.data)
      }
    } catch (error) {
      console.error("Помилка завантаження контактів:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/contacts/stats")
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error("Помилка завантаження статистики:", error)
    }
  }

  const updateContactStatus = async (id: number, status: "new" | "read" | "replied") => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setContacts(contacts.map((contact) => (contact.id === id ? { ...contact, status } : contact)))
        fetchStats()
      }
    } catch (error) {
      console.error("Помилка оновлення статусу:", error)
    }
  }

  const deleteContact = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цей контакт?")) {
      return
    }

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setContacts(contacts.filter((contact) => contact.id !== id))
        fetchStats()
        if (selectedContact?.id === id) {
          setSelectedContact(null)
        }
      }
    } catch (error) {
      console.error("Помилка видалення контакту:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchContacts(searchQuery)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "read":
        return "bg-yellow-500"
      case "replied":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "Новий"
      case "read":
        return "Прочитано"
      case "replied":
        return "Відповіли"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Завантаження контактів...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Управління контактами Solo Leveling</h1>
          <p className="text-muted-foreground">Переглядайте та керуйте повідомленнями від фанатів аніме</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всього</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Нові</CardTitle>
              <Mail className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Прочитані</CardTitle>
              <Eye className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.read}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Відповіли</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.replied}</div>
            </CardContent>
          </Card>
        </div>

        {/* Пошук */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Пошук по імені, email або повідомленню..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Пошук</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  fetchContacts()
                }}
              >
                Очистити
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Список контактів */}
          <Card>
            <CardHeader>
              <CardTitle>Контакти ({contacts.length})</CardTitle>
              <CardDescription>Клікніть на контакт для перегляду деталей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedContact?.id === contact.id ? "bg-muted border-primary" : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium truncate">{contact.name}</span>
                          <Badge className={`${getStatusColor(contact.status)} text-white text-xs`}>
                            {getStatusText(contact.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(contact.created_at).toLocaleString("uk-UA")}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{contact.message}</p>
                  </div>
                ))}
                {contacts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Контактів не знайдено</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Деталі контакту */}
          <Card>
            <CardHeader>
              <CardTitle>Деталі контакту</CardTitle>
              <CardDescription>
                {selectedContact ? "Інформація про вибраний контакт" : "Виберіть контакт для перегляду деталей"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedContact ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Ім'я:</label>
                    <p className="text-sm text-muted-foreground">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email:</label>
                    <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Дата створення:</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedContact.created_at).toLocaleString("uk-UA")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Статус:</label>
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="sm"
                        variant={selectedContact.status === "new" ? "default" : "outline"}
                        onClick={() => updateContactStatus(selectedContact.id, "new")}
                      >
                        Новий
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedContact.status === "read" ? "default" : "outline"}
                        onClick={() => updateContactStatus(selectedContact.id, "read")}
                      >
                        Прочитано
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedContact.status === "replied" ? "default" : "outline"}
                        onClick={() => updateContactStatus(selectedContact.id, "replied")}
                      >
                        Відповіли
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Повідомлення:</label>
                    <div className="mt-1 p-3 bg-muted rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="destructive" size="sm" onClick={() => deleteContact(selectedContact.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Видалити
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Виберіть контакт зі списку</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
