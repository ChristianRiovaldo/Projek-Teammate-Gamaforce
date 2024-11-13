const express = require('express');
const cors = require('cors');
const missionRoutes = require('./routes/missionRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); // Untuk parsing JSON body
app.use('/api', missionRoutes); // Menambahkan prefix '/api'

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

// DIBAWAH INI ADALAH CONTOH

// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const missionRoutes = require('./routes/missionRoutes');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/api/missions', missionRoutes);

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//     console.log(`Run at http://localhost:${PORT}`);
// });


