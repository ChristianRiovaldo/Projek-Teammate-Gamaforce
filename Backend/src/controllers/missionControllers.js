const Mission = require('../models/Mission');

class MissionController {
    static async getAllMissions(req, res) {
        try {
            const missions = await Mission.getAll();
            res.json(missions);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Gagal mengambil data misi'
            });
        }
    }

    static async getMissionById(req, res) {
        try {
            const mission = await Mission.getById(req.params.id);
            if (!mission) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Misi tidak ditemukan'
                });
            }
            res.json(mission);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Gagal mengambil data misi'
            });
        }
    }

    static async createMission(req, res) {
        try {
            const { nama, coord } = req.body;
            if (!nama || !coord || !Array.isArray(coord)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Data misi tidak valid'
                });
            }

            const newMission = await Mission.create({ nama, coord });
            res.status(201).json(newMission);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Gagal membuat misi'
            });
        }
    }

    static async updateMission(req, res) {
        try {
            const { nama, coord } = req.body;
            if (!nama || !coord || !Array.isArray(coord)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Data misi tidak valid'
                });
            }

            const updatedMission = await Mission.update(req.params.id, { nama, coord });
            if (!updatedMission) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Misi tidak ditemukan'
                });
            }

            res.json(updatedMission);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Gagal memperbarui misi'
            });
        }
    }

    static async deleteMission(req, res) {
        try {
            const deleted = await Mission.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Misi tidak ditemukan'
                });
            }
            res.json({
                status: 'success',
                message: 'Misi berhasil dihapus'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Gagal menghapus misi'
            });
        }
    }
}

module.exports = MissionController;