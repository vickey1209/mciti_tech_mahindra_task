const express = require('express');
const { getTasks, createTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', getTasks);
router.post('/', auth, createTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;
