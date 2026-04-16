import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, default: "" },
    content: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    avatar: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    proof_image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    isShow: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
