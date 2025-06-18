const express = require("express");
const router = express.Router();
const mariadb = require("./database/mariadb");
const { StatusCodes } = require("http-status-codes");

router.use(express.json())

// DB 연결
mariadb.connect((err) => {
  if (err) {
    console.log("DB 연결 실패");
  } else {
    console.log("DB 연결 성공");
  }
});


// -------------------- note 테이블 CRUD --------------------
router
  .route("/")
  .post((req, res) => {
    const { users_id, title, description, tag } = req.body;
    const query = "INSERT INTO notes (users_id, title, description, tag) VALUES (?, ?, ?, ?)";
    mariadb.query(query,
      [users_id, title, description, tag],
       (err, results) => {
      if (err) {
        res.status(400).send("노트 에러");
      }
      if (!results.length) {
        res.status(404).json({
          message: "노트가 생성되지 않았습니다.",
        });
      } else {
        res.status(201).json({
          message: "노트가 생성되었습니다!",
        });
      }
    });
  })

  .get((req, res) => {
    const query = "select * from notes";
    mariadb.query(query, (err, results) => {
      if (err) {
        res.status(400).send("DB err");
      }
      if (results.length == 0 ) {
        res.status(404).json({
          message: "노트가 하나도 없습니다!",
        });
      } else {
        res.status(200).json(results);
      }
    });
  })

  // PUT: 노트 수정 (ID로)
  .put((req, res) => {
    const { id, users_id, date, title, description, tag } = req.body;

    const query =
      "update notes set users_id = ? users_id = ?,date = ?, title = ?, description = ?, tag = ? ";
    mariadb.query(
      query,
      [id, users_id, date, title, description, tag],
      (err, result) => {
        if (err) {
          res.status(400).json({ message: "Error note" });
        } else {
          res.status(201).json({ message: "Note updated" });
        }
      }
    )
  })

  // DELETE: 노트 삭제 (ID로)
  .delete((req, res) => {
    const { id } = req.body;

    const query = "DELETE FROM notes WHERE id = ?";
    mariadb.query(query, id, (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error note" });
      } else if (result.affectedRows === 0) {
        res.status(400).json({ error: "Note not found" });
      } else {
        res.status(200).json({ message: "Note deleted" });
      }
    });
  });

// GET: 특정 노트 조회 (ID로)
router
  .route("/:id").get((req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  const query = 'SELECT * FROM notes WHERE id = "?"';
  mariadb.query(query, [id], (err, result) => {
    if (err) {
      res.status(404).json({ message: "Error note ID" });
    } else if (result.length === 0) {
      res.status(400).json({ message: "Note not found" });
    } else {
      res.status(200).json(result[0]);
    }
  })
})


module.exports = router