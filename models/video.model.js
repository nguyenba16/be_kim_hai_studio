import mongoose from "mongoose";

const { Schema } = mongoose;

const VIDEO_CATEGORY = [
  "tvc",
  "social_content",
  "hightlight",
  "short",
  "other",
];

const VideoModel = new Schema({
  vi_title: { type: String },
  vi_desc: { type: String },
  en_title: { type: String },
  en_desc: { type: String },
  link: { type: String, required: true },
  youtube_link: { type: String, required: true },
  isShow: { type: Boolean, required: true },
  isOutstanding: { type: Boolean, required: true },
  isLivestream: { type: Boolean, default: false },
  cover_image: {
    url: String,
    public_id: String,
  },
  category: { type: String, enum: VIDEO_CATEGORY, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", VideoModel);

export default Video;
