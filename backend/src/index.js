import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Module from './models/module.js';
import ScreenSettings from './models/screenSettings.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json()); // replaces body-parser

// Connect to MongoDB
await mongoose.connect('mongodb://localhost:27017/dynamic-modulesDb');

// REST API Endpoints

app.get('/screen-settings', async (req, res) => {
  let settings = await ScreenSettings.findOne();
  if (!settings) {
    // Create default settings if none exist
    settings = await ScreenSettings.create({
      bgColor: '#e0e0e0',
      fontColor: '#333333',
      fontFamily: 'Poppins',
      headings: {
        line1: 'What Brings Yo',
        line2: 'to Silent Moon?'
      },
      text: 'choose a topic to focus on:'
    });
  }
  res.json(settings);
});
app.put('/screen-settings/:id', async (req, res) => {
  const settings = await ScreenSettings.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await emitScreenSettings();
  res.json(settings);
});


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

async function emitScreenSettings() {
  const settings = await ScreenSettings.findOne();
  io.emit('screenSettings', settings);
}

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);

  try {
    // Send current modules and screen settings on new connection
    const modules = await Module.find();
    const settings = await ScreenSettings.findOne();

    socket.emit('modules', modules);
    socket.emit('screenSettings', settings);
  } catch (error) {
    console.error('Error sending data to client:', error);
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Add error handling to the server
server.on('error', (error) => {
  console.error('Server error:', error);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
