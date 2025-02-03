const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database('./hospital_assets.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the hospital_assets database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    model TEXT,
    location TEXT
  )`);
});

app.get('/api/assets', (req, res) => {
  db.all('SELECT * FROM assets', [], (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/assets', (req, res) => {
  const { name, model, location } = req.body;
  db.run('INSERT INTO assets (name, model, location) VALUES (?, ?, ?)', [name, model, location], function(err) {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.delete('/api/assets/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM assets WHERE id = ?', id, function(err) {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.json({ message: 'Asset deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
