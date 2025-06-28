-- Створення таблиці контактів для сайту Solo Leveling
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'new'
);

-- Створення індексу для швидкого пошуку по email
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Створення індексу для сортування по даті
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- Вставка тестових даних
INSERT OR IGNORE INTO contacts (name, email, message, status) VALUES 
('Фан Solo Leveling', 'fan@sololeveling.com', 'Дуже подобається ваш сайт! Коли буде новий сезон аніме?', 'read');
