const Task = require('../models/taskSchema');
const redisClient = require('../middleware/cache');

//get all task
exports.getTasks = async (req, res) => {
    try {
        redisClient.get('tasks', async (err, tasks) => {
            if (tasks) return res.json(JSON.parse(tasks));

            const taskList = await Task.find();
            redisClient.setex('tasks', 600, JSON.stringify(taskList));
            res.json(taskList);
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

//create task
exports.createTask = async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTask = new Task({ title, description, user: req.user.id });
        await newTask.save();

     
        redisClient.del('tasks');
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

//delete task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);

       
        redisClient.del('tasks');
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
