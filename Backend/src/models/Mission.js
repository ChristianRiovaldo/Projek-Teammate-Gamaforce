const db = require('../config/missionDatabase');

const Mission = {
    save: (shapeData, callback) => {
        const { missionName, type, coordinates, center, radius } = shapeData;

        // Konversi koordinat dan pusat ke format JSON string untuk disimpan di database
        const coordString = coordinates ? JSON.stringify(coordinates) : null;
        const centerString = center ? JSON.stringify(center) : null;

        // SQL query untuk menyimpan data shape ke dalam tabel shapes
        db.run(
            `INSERT INTO shapes (name, type, coordinates, center, radius) VALUES (?, ?, ?, ?, ?)`,
            [missionName, type, coordString, centerString, radius],
            function (err) {
                callback(err, this.lastID); // Callback untuk mengembalikan hasil penyimpanan
            }
        );
    },

    getAllMissions: (callback) => {
        const sql = 'SELECT name FROM shapes'; // Query untuk mengambil semua nama misi
        db.all(sql, [], (err, rows) => {
            callback(err, rows); // Mengirimkan hasil query ke callback
        });
    }
}

module.exports = Mission;


// DIBAWAH INI ADALAH CONTOH

// const db = require('../config/missionDatabase');

// class Mission {
//     static createGeoJSON(coord) {
//         return {
//             type: "Feature",
//             geometry: {
//                 type: "LineString",
//                 coordinates: coord.map(([lat, lng]) => [lng, lat])
//             }
//         };
//     }

//     static async getAll() {
//         return new Promise((resolve, reject) => {
//             db.all(
//                 'SELECT * FROM missions',
//                 [],
//                 (err, rows) => {
//                     if (err) reject(err);
//                     const missions = rows.map(row => ({
//                         ...row,
//                         coord: JSON.parse(row.coord),
//                         home: JSON.parse(row.home),
//                         geoJSON: JSON.parse(row.geoJSON)
//                     }));
//                     resolve({ missions });
//                 }
//             );
//         });
//     }

//     static async getById(id) {
//         return new Promise((resolve, reject) => {
//             db.get(
//                 'SELECT * FROM missions WHERE mission_id = ?',
//                 [id],
//                 (err, row) => {
//                     if (err) reject(err);
//                     if (!row) resolve(null);
//                     const mission = {
//                         ...row,
//                         coord: JSON.parse(row.coord),
//                         home: JSON.parse(row.home),
//                         geoJSON: JSON.parse(row.geoJSON)
//                     };
//                     resolve(mission);
//                 }
//             );
//         });
//     }

//     static async create(missionData) {
//         const { nama, coord } = missionData;
//         const home = coord[0];
//         const geoJSON = this.createGeoJSON(coord);

//         return new Promise((resolve, reject) => {
//             db.run(
//                 `INSERT INTO missions (nama, coord, home, geoJSON)
//                 VALUES (?, ?, ?, ?)`,
//                 [
//                     nama,
//                     JSON.stringify(coord),
//                     JSON.stringify(home),
//                     JSON.stringify(geoJSON)
//                 ],
//                 function (err) {
//                     if (err) reject(err);
//                     resolve({
//                         mission_id: this.lastID,
//                         nama,
//                         coord,
//                         home,
//                         geoJSON
//                     });
//                 }
//             );
//         });
//     }

//     static async update(id, missionData) {
//         const { nama, coord } = missionData;
//         const home = coord[0];
//         const geoJSON = this.createGeoJSON(coord);

//         return new Promise((resolve, reject) => {
//             db.run(
//                 `UPDATE missions
//                 SET nama = ?, coord = ?, home = ?, geoJSON = ?
//                 WHERE mission_id = ?`,
//                 [
//                     nama,
//                     JSON.stringify(coord),
//                     JSON.stringify(home),
//                     JSON.stringify(geoJSON),
//                     id
//                 ],
//                 function (err) {
//                     if (err) reject(err);
//                     if (this.changes === 0) resolve(null);
//                     resolve({
//                         mission_id: id,
//                         nama,
//                         coord,
//                         home,
//                         geoJSON
//                     });
//                 }
//             );
//         });
//     }

//     static async delete(id) {
//         return new Promise((resolve, reject) => {
//             db.run(
//                 'DELETE FROM missions WHERE mission_id = ?',
//                 [id],
//                 function (err) {
//                     if (err) reject(err);
//                     resolve(this.changes > 0);
//                 }
//             );
//         });
//     }
// }

// module.exports = Mission;