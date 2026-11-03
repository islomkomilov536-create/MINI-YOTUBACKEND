CREATE DATABASE minitube;

CREATE TABLE  users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(50)  NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE  videos (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(100) NOT NULL,
  description TEXT,
  video_url   TEXT NOT NULL,
  views       INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE  comments (
  id         SERIAL PRIMARY KEY,
  video_id   INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text       VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (name, email, password)
VALUES ('Demo kanal', 'demo@minitube.uz', '$2b$10$DOo1MIGnO32WejsxXs/EvuU4V6x37.ozIY1eZpmDfdSVk9JndzX42')
ON CONFLICT (email) DO NOTHING;


INSERT INTO videos (user_id, title, description, video_url, views)
SELECT u.id, v.title, v.description, v.video_url, v.views
FROM users u,
(VALUES
  ('Express.js 10 daqiqada', 'Birinchi server', 'https://www.youtube.com/watch?v=SccSCuHhOw0', 12),
  ('PostgreSQL asoslari', 'Jadvallar va so''rovlar', 'https://www.youtube.com/watch?v=qw--VYLpxG4', 8),
  ('JWT nima?', 'Token bilan autentifikatsiya', 'https://www.youtube.com/watch?v=7Q17ubqLfaM', 5),
  ('React bilan tanishuv', 'Komponentlar va state', 'https://www.youtube.com/watch?v=Tn6-PIqc4UM', 20),
  ('Big Buck Bunny (demo)', 'Namuna mp4 video', 'https://www.w3schools.com/html/mov_bbb.mp4', 3)
) AS v(title, description, video_url, views)
WHERE u.email = 'demo@minitube.uz'
  AND NOT EXISTS (SELECT 1 FROM videos);
  