import mongoose from "mongoose";

const { Schema } = mongoose;
const IMAGE_ABOUT = ["album", "bts", "outstanding", "banner"];

const ImageModel = new Schema({
  vi_title: { type: String },
  vi_desc: { type: String },
  en_title: { type: String },
  en_desc: { type: String },
  about: { type: String, enum: IMAGE_ABOUT, required: true },
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  isShow: { type: Boolean, required: true },
  albumId: {
    type: Schema.Types.ObjectId,
    ref: "Album",
  },
  isOutstanding: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Image = mongoose.model("Image", ImageModel);

export default Image;
