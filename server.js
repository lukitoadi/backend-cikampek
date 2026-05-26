require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const articleRoutes = require('./routes/articleRoutes');
const faqRoutes = require('./routes/faqRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Website Beasiswa Berjalan');
});

app.use('/api', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/faqs', faqRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});