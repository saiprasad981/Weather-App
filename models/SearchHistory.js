import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    lowercase: true
  },
  temperature: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Only define model if mongoose is connected
let SearchHistory;

if (mongoose.connection.readyState !== 0) {
  SearchHistory = mongoose.models.SearchHistory || mongoose.model('SearchHistory', searchHistorySchema);
} else {
  // Mock model when MongoDB is not available
  SearchHistory = class MockSearchHistory {
    static find() { return Promise.resolve([]); }
    static findOne() { return Promise.resolve(null); }
    static deleteMany() { return Promise.resolve({}); }
    save() { return Promise.resolve(this); }
  };
}

export default SearchHistory;