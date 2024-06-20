const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Category schema
const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 1000 }
});

// Virtual for Category's URL
CategorySchema.virtual('url').get(function () {
  return `/categories/${this._id}`;
});

// Export model
module.exports = mongoose.model('Category', CategorySchema);
