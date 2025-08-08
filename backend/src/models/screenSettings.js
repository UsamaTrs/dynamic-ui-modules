import mongoose from 'mongoose';

const ScreenSettingsSchema = new mongoose.Schema({
  bgColor: String,
  fontColor: String,
  fontFamily: String,
  headings: {
    line1: String,
    line2: String
  },
  text: String
}, { timestamps: true });

const ScreenSettings =  mongoose.model('ScreenSettings', ScreenSettingsSchema);
export default ScreenSettings
