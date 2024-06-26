const mongoose=require("mongoose");
const reviewSchema = new mongoose.Schema({
  breweryId: { type: String, required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
});

const reviewModel = mongoose.model("Review", reviewSchema);
module.exports = reviewModel;