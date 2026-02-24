-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prix DECIMAL(10, 2) NOT NULL,
  url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  createur VARCHAR(255) NOT NULL,
  produits TEXT NOT NULL,
  closed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  session_id INT NOT NULL,
  utilisateur VARCHAR(255) NOT NULL,
  reponses TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (email, password, admin) VALUES
('a@a.com', 'root', true),
('b@b.com', 'azerty', false),
('c@c.com', 'qwerty', false);

INSERT INTO products (nom, prix, url) VALUES
('kallax', 69.99, 'https://www.ikea.com/fr/fr/images/products/kallax-etagere-blanc-0644757__pe702939_s5.jpg'),
('eket', 15.00, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQBgUdyicj25xdK8F7A_paSm9HSjXhOQ5PyPLRHydjMSzcwJ9WyIQKQMWXsZVlDOuIlxs7sCdQ2BfVPgAX5Dgk8V8cJ_-N4Z0rxWrxeng6LLNoz_BLkeG-F'),
('lack', 16.99, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQCb0jwugKcGBRAHtOvM9kq9jfv7RKhYzADK9BGMWm-9GfwLogwDu2tdTY_uAL0yHbOGgqnLfpPeK_2stIFbiSEGbajA1sf5i_k09jiH4xEFqkCQG5qrWs8CQ'),
('stockholm', 49.99, 'https://example.com/stockholm.jpg'),
('ektorp', 199.00, 'https://example.com/ektorp.jpg'),
('malm', 99.00, 'https://example.com/malm.jpg'),
('ivar', 34.99, 'https://example.com/ivar.jpg'),
('billy', 45.00, 'https://example.com/billy.jpg');

