const db = require('../config/db');

exports.getAllArticles = (req, res) => {
  const sql = `
    SELECT articles.*, users.nama_lengkap AS nama_admin
    FROM articles
    JOIN users ON articles.id_admin = users.id_user
    ORDER BY articles.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengambil artikel',
        error: err
      });
    }

    res.json(results);
  });
};

exports.getArticleById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT articles.*, users.nama_lengkap AS nama_admin
    FROM articles
    JOIN users ON articles.id_admin = users.id_user
    WHERE id_article = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengambil detail artikel',
        error: err
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'Artikel tidak ditemukan'
      });
    }

    res.json(results[0]);
  });
};

exports.createArticle = (req, res) => {
  const { judul, isi_artikel, gambar } = req.body;

  if (!judul || !isi_artikel) {
    return res.status(400).json({
      message: 'Judul dan isi artikel wajib diisi.'
    });
  }

  const sql = `
    INSERT INTO articles (id_admin, judul, isi_artikel, gambar)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [req.user.id_user, judul, isi_artikel, gambar || null], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal menambah artikel',
        error: err
      });
    }

    res.status(201).json({
      message: 'Artikel berhasil ditambahkan'
    });
  });
};

exports.updateArticle = (req, res) => {
  const { id } = req.params;
  const { judul, isi_artikel, gambar } = req.body;

  const sql = `
    UPDATE articles
    SET judul = ?, isi_artikel = ?, gambar = ?
    WHERE id_article = ?
  `;

  db.query(sql, [judul, isi_artikel, gambar || null, id], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengedit artikel',
        error: err
      });
    }

    res.json({
      message: 'Artikel berhasil diperbarui'
    });
  });
};

exports.deleteArticle = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM articles
    WHERE id_article = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal menghapus artikel',
        error: err
      });
    }

    res.json({
      message: 'Artikel berhasil dihapus'
    });
  });
};