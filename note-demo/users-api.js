const express = require('express');
const mariadb = require('./database/mariadb');
const router = express.Router();

router.use(express.json());


// POST: 새 사용자 추가
router
.route('/users')
.post((req, res) => {
    const { username, email } = req.body;
    const query = 'INSERT INTO users (username, email) VALUES (?, ?)';
    mariadb.query(query, [username, email], (err, result) => {
      if (err) {
        res.status(400).json({ error: 'Error user' });
      } else {
        res.status(201).json({result});
      }
    });
  })
  
  // GET: 모든 사용자 조회
    
  .get((req, res) => {
    const query = 'SELECT * FROM users';
    mariadb.query(query, (err, results) => {
      if (err) {
        res.status(400).json({ error: 'Error users' });
      } else {
        res.status(200).json(results);
      }
    });
  })
  
  // PUT: 사용자 수정 (ID로)
  .put((req, res) => {
    const { id, username, email } = req.body;
  
    const query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
    mariadb.query(query, [username, email, id], (err, result) => {
      if (err) {
        res.status(500).json({ message : 'Error user' });
      } else {
        res.status(200).json({ message: 'User updated ' });
      }
    });
  });

  // GET: 특정 사용자 조회 (ID로)

  router
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM users WHERE id = ?';
    mariadb.query(query, [id], (err, result) => {
      if (err) {
        res.status(400).json({ error: 'Error users ID' });
      } else if (result.length === 0) {
        res.status(404).json({ error: 'Users not found' });
      } else {
        res.status(200).json(result[0]);
      }
    });
  })
  
  // DELETE: 사용자 삭제 (ID로)
  .delete((req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    mariadb.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error users' });
      } else if (result.affectedRows === 0) {
        res.status(400).json({ error: 'Users not found' });
      } else {
        res.status(200).json({ message: 'Users deleted ' });
      }
    });
  });

  module.exports = router;