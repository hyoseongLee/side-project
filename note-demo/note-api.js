const express = require('express');
const app = express();
app.listen(1234);

app.use(express.json());

app.post('/notes', (req, res) => {
  const { users_id, date, title, description, tag } = req.body;
  const query = 
  'INSERT INTO notes (users_id, date, title, description, tag) VALUES (2, 2025-02-18, "메모", "TypeScript 학습, 프로젝트 이어하기", "할 일")';
  
  db.execute(query, [users_id, date, title, description, tag], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Note created successfully', id: result.insertId });
  });
});

app.get('/notes', (req, res) => {
  const query = 'SELECT * FROM notes';
  
  db.execute(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/favorites', (req, res) => {
  const { notes_id, users_id } = req.body;
  const query = 'INSERT INTO favorites (notes_id, users_id) VALUES (?, ?)';
  
  db.execute(query, [notes_id, users_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Favorite added successfully', id: result.insertId });
  });
});

app.get('/favorites', (req, res) => {
  const query = 'SELECT * FROM favorites';
  
  db.execute(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
