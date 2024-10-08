const express = require('express');
const mongoose = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Clustering Setup
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    // Routes
    app.use('/api/tasks', taskRoutes);
    app.use('/api/users', userRoutes);

    // Server Start
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} is running on port ${PORT}`);
    });
}
