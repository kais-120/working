const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: String,
  type: String,
  size: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  deadline: Date,
  status: {
    type: String,
    enum: ['planifie', 'en_cours', 'termine'],
    default: 'planifie'
  },
  documents: [DocumentSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
