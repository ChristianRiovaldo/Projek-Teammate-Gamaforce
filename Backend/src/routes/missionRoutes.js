const express = require('express');
const router = express.Router();
const MissionController = require('../controllers/missionControllers');

const validateNameParam = (req, res, next) => {
    const { name } = req.params;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid or missing "name" parameter' });
    }
    next();
};

// Endpoint untuk menerima data dari saveShape
router.post('/shapes', MissionController.saveShapeData);
router.get('/shapes', MissionController.getAllMissions);
router.delete('/shapes/:name', MissionController.deleteMission);
router.get('/shapes/:name', validateNameParam, MissionController.getMissionShapesByName);
router.get('/shapes/:name', MissionController.getMissionShapesByName);
// router.put('/shapes/:id', MissionController.updateMission);
// router.post('/', MissionController.createMission);
// router.delete('/:id', MissionController.deleteMission);

module.exports = router;
