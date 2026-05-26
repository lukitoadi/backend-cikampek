const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nama_lengkap, email, password, semester, id_major } = req.body;

  if (!nama_lengkap || !email || !password) {
    return res.status(400).json({
      message: 'Nama, email, dan password wajib diisi.'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users 
      (id_role, id_major, nama_lengkap, email, password, semester)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [2, id_major || null, nama_lengkap, email, hashedPassword, semester || null],
      (err) => {
        if (err) {
          return res.status(500).json({
            message: 'Gagal register',
            error: err
          });
        }

        res.status(201).json({
          message: 'Register berhasil'
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: 'Terjadi kesalahan server'
    });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email dan password wajib diisi.'
    });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Terjadi kesalahan server'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'Email tidak ditemukan'
      });
    }

    const user = results[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: 'Password salah'
      });
    }

    const token = jwt.sign(
      {
        id_user: user.id_user,
        id_role: user.id_role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id_user: user.id_user,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        id_role: user.id_role
      }
    });
  });
};

exports.profile = (req, res) => {
  const sql = `
    SELECT 
      users.id_user, 
      users.nama_lengkap, 
      users.email, 
      users.semester, 
      majors.nama_major, 
      roles.nama_role
    FROM users
    LEFT JOIN majors ON users.id_major = majors.id_major
    JOIN roles ON users.id_role = roles.id_role
    WHERE users.id_user = ?
  `;

  db.query(sql, [req.user.id_user], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Gagal mengambil profil'
      });
    }

    res.json(results[0]);
  });
};