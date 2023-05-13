import mongoose from "mongoose";

const Schema = mongoose.Schema;

const dishSchema = new Schema({
  dish: {
    type: String,
    unique: true,
  },
  recipe: String,
  imgLink: String,
}, { timestamps: true });

const dishrecipe = mongoose.model('dishrecipe',dishSchema);

export default dishrecipe;
