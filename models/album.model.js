import mongoose from "mongoose";

const { Schema } = mongoose;
export const CATEGORY = [
  "wedding_ceremony",
  "engagement",
  "traditional_ceremony",
  "reception",
  "film",
  "other",
];
const AlbumModel = new Schema({
  vi_title: { type: String, required: true },
  vi_desc: { type: String, required: true },
  en_title: { type: String, required: true },
  en_desc: { type: String, required: true },
  isOutstanding: { type: Boolean, required: true },
  isShow: { type: Boolean, required: true },
  category: { type: String, enum: CATEGORY, required: true },
  cover_image: {
    url: String,
    public_id: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Album = mongoose.model("Album", AlbumModel);

export default Album;
