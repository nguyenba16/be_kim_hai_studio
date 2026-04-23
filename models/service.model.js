import mongoose from "mongoose";

const { Schema } = mongoose;

const ServiceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
      },
    ],

    cover_image: {
      url: { type: String, required: true },
      public_id: { type: String },
    },

    isShow: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Service =
  mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service;
