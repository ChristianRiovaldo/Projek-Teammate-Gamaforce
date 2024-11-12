const express = require('express');
const router = express.Router();
const MissionController = require('../controllers/missionControllers');

// Endpoint untuk menerima data dari saveShape
router.post('/shapes', MissionController.saveShapeData);;
// router.delete('/shapes/:id', saveShapeData);

// router.get('/', MissionController.getAllMissions);
// router.get('/:id', MissionController.getMissionById);
// router.post('/', MissionController.createMission);
// router.put('/:id', MissionController.updateMission);
// router.delete('/:id', MissionController.deleteMission);

module.exports = router;
