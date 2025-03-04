const express = require("express");
const router = express.Router();
const mariadb = require("./database/mariadb");

router.use(express.json());

// -------------------- favorite 테이블 CRUD --------------------

// POST: 즐겨찾기 추가
router
.route('/favorites')
.post((req, res) => {
  const { user_id, note_id } = req.body;

  const query = "INSERT INTO favorites (user_id, note_id) VALUES (?, ?)";
  mariadb.query(query, [user_id, note_id], (err, result) => {
    if (err) {
      res.status(400).json({ error: "Error favorite" });
    } else {
      res.status(201).json({ result });
    }
  });
})

// GET: 모든 즐겨찾기 조회
.get((req, res) => {
  const query = "SELECT * FROM favorites";
  mariadb.query(query, (err, results) => {
    if (err) {
      res.status(400).json({ error: "Error favorites" });
    } else {
      res.status(200).json(results);
    }
  });
})

// DELETE: 즐겨찾기 삭제 (ID로)
.delete((req, res) => {
  const { id } = req.body;

  const query = "DELETE FROM favorites WHERE id = ?";
  mariadb.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error favorite" });
    } else if (result.affectedRows === 0) {
      res.status(400).json({ error: "Favorite not found" });
    } else {
      res.status(200).json({ message: "Favorite deleted" });
    }
  });
});


// GET: 특정 사용자 즐겨찾기 조회
router
.route('/:user_id')
.get((req, res) => {
  const { user_id } = req.params;
  const query = "SELECT * FROM favorites WHERE user_id = ?";
  mariadb.query(query, [user_id], (err, result) => {
    if (err) {
      res.status(400).json({ error: "Error by users" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "No favorites found for this user" });
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = router