const db = require('../config/db');

exports.getBookmarks = (req, res) => {
  const sql = `
    SELECT bookmarks.id_bookmark, scholarships.*
    FROM bookmarks
    JOIN scholarships ON bookmarks.id_scholarship = scholarships.id_scholarship
    WHERE bookmarks.id_user = ?
  `;

  db.query(sql, [req.user.id_user], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengambil bookmark',
        error: err
      });
    }

    res.json(results);
  });
};

exports.addBookmark = (req, res) => {
  const { id_scholarship } = req.body;

  if (!id_scholarship) {
    return res.status(400).json({
      message: 'id_scholarship wajib diisi.'
    });
  }

  const sql = `
    INSERT INTO bookmarks (id_user, id_scholarship)
    VALUES (?, ?)
  `;

  db.query(sql, [req.user.id_user, id_scholarship], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal menambahkan bookmark',
        error: err
      });
    }

    res.status(201).json({
      message: 'Beasiswa berhasil disimpan'
    });
  });
};

exports.deleteBookmark = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM bookmarks
    WHERE id_bookmark = ? AND id_user = ?
  `;

  db.query(sql, [id, req.user.id_user], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal menghapus bookmark',
        error: err
      });
    }

    res.json({
      message: 'Bookmark berhasil dihapus'
    });
  });
};