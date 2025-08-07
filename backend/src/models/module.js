import mongoose from 'mongoose';

const ModuleSchema = new mongoose.Schema({
  title: String,
  avatar: String,
  bgColor: String,
  fontColor: String,
}, { timestamps: true });

 const Module = mongoose.model('Module', ModuleSchema);

export default Module;
