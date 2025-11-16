const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please provide item name'],
      trim: true,
      maxlength: [100, 'Item name cannot exceed 100 characters']
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('GroceryItem', groceryItemSchema);
