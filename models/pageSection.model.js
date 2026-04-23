import mongoose from "mongoose";

const { Schema } = mongoose;

const ActionButtonSchema = new Schema({
  label: { type: String },
  link: { type: String },
  type: { type: String },
  target: { type: String, default: "_self" },
});

const ImageSchema = new Schema({
  url: { type: String },
  public_id: { type: String },
});

const PageSectionSchema = new Schema({
  section_key: { type: String, required: true },
  vi_title: { type: String },
  en_title: { type: String },
  vi_subtitle: { type: String },
  en_subtitle: { type: String },
  vi_description: { type: String },
  en_description: { type: String },
  images: [ImageSchema],
  video_url: { type: String },
  video_public_id: { type: String },
  actions: [ActionButtonSchema],
  order: { type: Number, default: 0 },
  page: { type: String, required: true },
  isShow: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PageSection = mongoose.model("PageSection", PageSectionSchema);

export default PageSection;
