//모듈셋팅
const express = require('express');
const mysql = require('mysql');
const app = express();
const mariadb = require('./database/mariadb');

// DB 연결
mariadb.connect((err) => {
  if (err) {
    console.log('DB 연결 실패');
  } else {
    console.log('DB 연결 성공');
  }
});

app.use(express.json());

// -------------------- note 테이블 CRUD --------------------
app.post('/notes', (req, res) => {
  const { users_id, title, description, tag } = req.body;
  const query = `insert into note (users_id, title, description, tag) values (?, '?', '?', '?')`;
  mariadb.query(query, (err, results) => {
    if (err) {
      res.send('노트 에러');
    }
    if (!results.length) {
      res.json({
        message: '노트가 생성되지 않았습니다.'
      });
    } else {
      res.json({
        message: '노트가 생성되었습니다!'
      });
    }
  });
});

app.get('/notes', (req, res) => {
  const query = 'select * from note';
  mariadb.query(query, (err, results) => {
    if (err) {
      res.send('DB SELECT 쿼리 에러');
    }
    if (!results.length) {
      res.json({
        message: '노트가 하나도 없습니다!'
      })
    } else {
      res.json(results);
    }
  });
});

// GET: 특정 노트 조회 (ID로)
app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  id = parseInt(id);
  const query = 'SELECT * FROM note WHERE id = ?';
  mariadb.query(query, [id], (err, result) => {
    if (err) {
      res.json({ message : 'Error note ID' });
    } else if (result.length === 0) {
      res.json({ message: 'Note not found' });
    } else {
      res.json(result[0]);
    }
  });
});

// PUT: 노트 수정 (ID로)
app.put("/notes", (req, res) => {
  const { id, notes_id, title, description, tag } = req.body;

  const query = 'UPDATE note SET notes_id = ?, title = ?, description = ?, tag = ? where id = ?';
  mariadb.query(query, [notes_id, title, description, tag, id], (err, result) => {
    if (err) {
      res.json({ message: 'Error note' });
    } else {
      res.json({ message: 'Note updated' });
    }
  });
});

// DELETE: 노트 삭제 (ID로)
app.delete("/notes", (req, res) => {
  const { id } = req.body;

  const query = 'DELETE FROM note WHERE id = ?';
  mariadb.query(query, [id], (err, result) => {
    if (err) {
      res.json({ error: 'Error note' });
    } else if (result.affectedRows === 0) {
      res.json({ error: 'Note not found' });
    } else {
      res.json({ message: 'Note deleted' });
    }
  });
});

// -------------------- user 테이블 CRUD --------------------

// POST: 새 사용자 추가
app.post("/users", (req, res) => {
  const { username, email } = req.body;

  const query = 'INSERT INTO user (username, email) VALUES (?, ?)';
  mariadb.query(query, [username, email], (err, result) => {
    if (err) {
      res.json({ error: 'Error user' });
    } else {
      res.json({});
    }
  });
});

// GET: 모든 사용자 조회
app.get("/users", (req, res) => {
  const query = 'SELECT * FROM user';
  mariadb.query(query, (err, results) => {
    if (err) {
      res.json({ error: 'Error users' });
    } else {
      res.json(results);
    }
  });
});

// GET: 특정 사용자 조회 (ID로)
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM user WHERE id = ?';
  mariadb.query(query, [id], (err, result) => {
    if (err) {
      res.json({ error: 'Error user ID' });
    } else if (result.length === 0) {
      res.json({ error: 'User not found' });
    } else {
      res.json(result[0]);
    }
  });
});

// PUT: 사용자 수정 (ID로)
app.put("/users", (req, res) => {
  const { id, username, email } = req.body;

  const query = 'UPDATE user SET username = ?, email = ? WHERE id = ?';
  mariadb.query(query, [username, email, id], (err, result) => {
    if (err) {
      res.json({ message : 'Error user' });
    } else {
      res.json({ message: 'User updated ' });
    }
  });
});

// DELETE: 사용자 삭제 (ID로)
app.delete("/users", (req, res) => {
  const { id } = req.body;

  const query = 'DELETE FROM user WHERE id = ?';
  mariadb.query(query, [id], (err, result) => {
    if (err) {
      res.json({ error: 'Error user' });
    } else if (result.affectedRows === 0) {
      res.json({ error: 'User not found' });
    } else {
      res.json({ message: 'User deleted ' });
    }
  });
});

// -------------------- favorite 테이블 CRUD --------------------

// POST: 즐겨찾기 추가
app.post("/favorites", (req, res) => {
  const { user_id, note_id } = req.body;

  const query = 'INSERT INTO favorite (user_id, note_id) VALUES (?, ?)';
  mariadb.query(query, [user_id, note_id], (err, result) => {
    if (err) {
      res.json({ error: 'Error favorite' });
    } else {
      res.json({});
    }
  });
});

// GET: 모든 즐겨찾기 조회
app.get("/favorites", (req, res) => {
  const query = 'SELECT * FROM favorite';
  mariadb.query(query, (err, results) => {
    if (err) {
      res.json({ error: 'Error favorites' });
    } else {
      res.json(results);
    }
  });
});

// GET: 특정 사용자 즐겨찾기 조회
app.get("/favorites/user/:user_id", (req, res) => {
  const { user_id } = req.params;
  const query = 'SELECT * FROM favorite WHERE user_id = ?';
  mariadb.query(query, [user_id], (err, result) => {
    if (err) {
      res.json({ error: 'Error by user' });
    } else if (result.length === 0) {
      res.json({ error: 'No favorites found for this user' });
    } else {
      res.json(result);
    }
  });
});

// DELETE: 즐겨찾기 삭제 (ID로)
app.delete("/favorites", (req, res) => {
  const { id } = req.body;

  const query = 'DELETE FROM favorite WHERE id = ?';
  mariadb.query(query, [id], (err, result) => {
    if (err) {
      res.json({ error: 'Error favorite' });
    } else if (result.affectedRows === 0) {
      res.json({ error: 'Favorite not found' });
    } else {
      res.json({ message: 'Favorite deleted' });
    }
  });
});

// 서버 시작
app.listen(1234)