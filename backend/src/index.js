import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Module from './models/module.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json()); // replaces body-parser

// Connect to MongoDB
await mongoose.connect('mongodb://localhost:27017/dynamic-modulesDb');

// REST API Endpoints

// Get all modules
app.get('/modules', async (req, res) => {
  const modules = await Module.find();
  res.json(modules);
});

// Create a module
app.post('/modules', async (req, res) => {
  const module = await Module.create(req.body);
  await emitModules();
  res.json(module);
});

// Update a module
app.put('/modules/:id', async (req, res) => {
  const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await emitModules();
  res.json(module);
});

// Delete a module
app.delete('/modules/:id', async (req, res) => {
  const module = await Module.findByIdAndDelete(req.params.id);
  await emitModules();
  res.json(module);
});

// Real-time updates
async function emitModules() {
  const modules = await Module.find();
  io.emit('modules', modules);
}

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);
  // Send current modules on new connection
  const modules = await Module.find();
  socket.emit('modules', modules);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
