const db = require('../config/db');

exports.getAllFaqs = (req, res) => {
  const sql = `
    SELECT *
    FROM faqs
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengambil FAQ',
        error: err
      });
    }

    res.json(results);
  });
};

exports.createFaq = (req, res) => {
  const { pertanyaan, jawaban } = req.body;

  if (!pertanyaan || !jawaban) {
    return res.status(400).json({
      message: 'Pertanyaan dan jawaban wajib diisi.'
    });
  }

  const sql = `
    INSERT INTO faqs (id_admin, pertanyaan, jawaban)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [req.user.id_user, pertanyaan, jawaban], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal menambah FAQ',
        error: err
      });
    }

    res.status(201).json({
      message: 'FAQ berhasil ditambahkan'
    });
  });
};

exports.updateFaq = (req, res) => {
  const { id } = req.params;
  const { pertanyaan, jawaban } = req.body;

  const sql = `
    UPDATE faqs
    SET pertanyaan = ?, jawaban = ?
    WHERE id_faq = ?
  `;

  db.query(sql, [pertanyaan, jawaban, id], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengedit FAQ',
        error: err
      });
    }

    res.json({
      message: 'FAQ berhasil diperbarui'
    });
  });
};

exports.deleteFaq = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM faqs
    WHERE id_faq = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal menghapus FAQ',
        error: err
      });
    }

    res.json({
      message: 'FAQ berhasil dihapus'
    });
  });
};