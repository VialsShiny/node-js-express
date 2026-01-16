-- =============================
-- INIT : Création des tables
-- =============================
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "role";
DROP TABLE IF EXISTS "payment";

CREATE TABLE IF NOT EXISTS "role" (
  id          INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
  id          INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  email       TEXT NOT NULL,
  password    BLOB NOT NULL,
  role_id     TEXT NOT NULL,
  created_at  TEXT,
  FOREIGN KEY (role_id) REFERENCES "role"(id)
);

CREATE TABLE IF NOT EXISTS "payment" (
  id        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL,
  price     REAL NOT NULL,
  date      TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE INDEX IF NOT EXISTS user_email_index
ON "user" (email);

-- =============================
-- INSERT : Rôles et utilisateurs
-- =============================

INSERT INTO "role" (id, name, created_at) VALUES
('1', 'admin', DATETIME('now')),
('2', 'accountant', DATETIME('now')),
('3', 'support', DATETIME('now')),
('4', 'customer', DATETIME('now'));

INSERT INTO "user" (id, email, password, role_id, created_at) VALUES
('1', 'admin@email.fr', 'adminPW', '1', DATETIME('now')),
('2', 'accountant@email.fr', 'accountantPW', '2', DATETIME('now')),
('3', 'support@email.fr', 'supportPW', '3', DATETIME('now')),
('4', 'customer@email.fr', 'customerPW', '4', DATETIME('now'));

INSERT INTO "payment" (id, user_id, price, date) VALUES
(1, '1', 250.0, '2026-01-10T14:30:00Z'),
(2, '2', 120.5, '2026-01-11T09:15:00Z'),
(3, '3', 75.2, '2026-01-12T18:45:00Z'),
(4, '4', 300.0, '2026-01-13T12:00:00Z'),
(5, '2', 500.0, '2026-01-14T15:30:00Z'),
(6, '1', 150.0, '2026-01-15T10:00:00Z'),
(7, '3', 200.0, '2026-01-15T11:30:00Z'),
(8, '4', 50.0, '2026-01-15T12:15:00Z'),
(9, '5', 400.0, '2026-01-15T13:00:00Z'),
(10, '5', 100.0, '2026-01-15T14:45:00Z'),
(11, '2', 250.0, '2026-01-15T15:30:00Z'),
(12, '1', 75.5, '2026-01-15T16:20:00Z');
