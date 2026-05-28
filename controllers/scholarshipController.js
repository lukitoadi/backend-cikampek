// update fitur beasiswa
const db = require('../config/db');

exports.getAllScholarships = (req, res) => {
  const { search, level, semester, major } = req.query;

  let sql = `
    SELECT DISTINCT scholarships.*, education_levels.nama_level
    FROM scholarships
    JOIN education_levels ON scholarships.id_level = education_levels.id_level
    LEFT JOIN scholarship_major ON scholarships.id_scholarship = scholarship_major.id_scholarship
    LEFT JOIN majors ON scholarship_major.id_major = majors.id_major
    WHERE 1=1
  `;

  let params = [];

  if (search) {
    sql += ` AND scholarships.nama_beasiswa LIKE ?`;
    params.push(`%${search}%`);
  }

  if (level) {
    sql += ` AND education_levels.nama_level = ?`;
    params.push(level);
  }

  if (semester) {
    sql += ` AND ? BETWEEN scholarships.semester_min AND scholarships.semester_max`;
    params.push(Number(semester));
  }

  if (major) {
    sql += ` AND majors.nama_major = ?`;
    params.push(major);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengambil data beasiswa',
        error: err
      });
    }

    res.json(results);
  });
};

exports.getScholarshipById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT scholarships.*, education_levels.nama_level
    FROM scholarships
    JOIN education_levels ON scholarships.id_level = education_levels.id_level
    WHERE scholarships.id_scholarship = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengambil detail beasiswa'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'Beasiswa tidak ditemukan'
      });
    }

    res.json(results[0]);
  });
};

exports.createScholarship = (req, res) => {
  const {
    id_level,
    nama_beasiswa,
    penyelenggara,
    deskripsi,
    persyaratan,
    semester_min,
    semester_max,
    deadline,
    link_pendaftaran,
    status
  } = req.body;

  if (!id_level || !nama_beasiswa || !penyelenggara || !deskripsi || !persyaratan || !deadline || !status) {
    return res.status(400).json({
      message: 'Data beasiswa belum lengkap.'
    });
  }

  const sql = `
    INSERT INTO scholarships
    (id_admin, id_level, nama_beasiswa, penyelenggara, deskripsi, persyaratan, semester_min, semester_max, deadline, link_pendaftaran, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      req.user.id_user,
      id_level,
      nama_beasiswa,
      penyelenggara,
      deskripsi,
      persyaratan,
      semester_min || null,
      semester_max || null,
      deadline,
      link_pendaftaran || null,
      status
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'Gagal menambah beasiswa',
          error: err
        });
      }

      res.status(201).json({
        message: 'Beasiswa berhasil ditambahkan',
        id_scholarship: result.insertId
      });
    }
  );
};

exports.updateScholarship = (req, res) => {
  const { id } = req.params;

  const {
    id_level,
    nama_beasiswa,
    penyelenggara,
    deskripsi,
    persyaratan,
    semester_min,
    semester_max,
    deadline,
    link_pendaftaran,
    status
  } = req.body;

  const sql = `
    UPDATE scholarships
    SET id_level = ?, nama_beasiswa = ?, penyelenggara = ?, deskripsi = ?, persyaratan = ?,
    semester_min = ?, semester_max = ?, deadline = ?, link_pendaftaran = ?, status = ?
    WHERE id_scholarship = ?
  `;

  db.query(
    sql,
    [
      id_level,
      nama_beasiswa,
      penyelenggara,
      deskripsi,
      persyaratan,
      semester_min,
      semester_max,
      deadline,
      link_pendaftaran,
      status,
      id
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: 'Gagal mengedit beasiswa',
          error: err
        });
      }

      res.json({
        message: 'Beasiswa berhasil diperbarui'
      });
    }
  );
};

exports.deleteScholarship = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM scholarships WHERE id_scholarship = ?';

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal menghapus beasiswa'
      });
    }

    res.json({
      message: 'Beasiswa berhasil dihapus'
    });
  });
};