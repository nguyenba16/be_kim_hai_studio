import Feedback from "../models/feedback.model.js";
import {
  uploadToStorage as uploadToCloudinary,
  deleteFromStorage as deleteFromCloudinary,
} from "../config/storage.js";

export const createFeedback = async (req, res) => {
  try {
    const { name, title, content, rating = 5, isShow = true } = req.body;

    if (!name || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Name and content are required" });
    }

    let avatar = null;
    let proof_image = null;

    const avatarFile = req.files?.avatar?.[0];
    if (avatarFile) {
      const result = await uploadToCloudinary(avatarFile.buffer, "feedbacks/avatars", avatarFile.originalname);
      avatar = { url: result.secure_url, public_id: result.public_id };
    }

    const proofFile = req.files?.proof_image?.[0];
    if (proofFile) {
      const result = await uploadToCloudinary(proofFile.buffer, "feedbacks/proofs", proofFile.originalname);
      proof_image = { url: result.secure_url, public_id: result.public_id };
    }

    const feedback = await Feedback.create({
      name,
      title,
      content,
      rating: Number(rating),
      isShow: isShow === "true" || isShow === true,
      avatar,
      proof_image,
    });

    return res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    console.error("createFeedback error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { name, title, content, rating, isShow } = req.body;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }

    if (name !== undefined) feedback.name = name;
    if (title !== undefined) feedback.title = title;
    if (content !== undefined) feedback.content = content;
    if (rating !== undefined) feedback.rating = Number(rating);
    if (isShow !== undefined)
      feedback.isShow = isShow === "true" || isShow === true;

    const avatarFile = req.files?.avatar?.[0];
    if (avatarFile) {
      if (feedback.avatar?.public_id)
        await deleteFromCloudinary(feedback.avatar.public_id);
      const result = await uploadToCloudinary(avatarFile.buffer, "feedbacks/avatars", avatarFile.originalname);
      feedback.avatar = { url: result.secure_url, public_id: result.public_id };
    }

    const proofFile = req.files?.proof_image?.[0];
    if (proofFile) {
      if (feedback.proof_image?.public_id)
        await deleteFromCloudinary(feedback.proof_image.public_id);
      const result = await uploadToCloudinary(proofFile.buffer, "feedbacks/proofs", proofFile.originalname);
      feedback.proof_image = { url: result.secure_url, public_id: result.public_id };
    }

    await feedback.save();

    return res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error("updateFeedback error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteFeedbacks = async (req, res) => {
  try {
    const { feedbackIds } = req.body;

    if (!Array.isArray(feedbackIds) || feedbackIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "feedbackIds must be a non-empty array" });
    }

    const feedbacks = await Feedback.find({ _id: { $in: feedbackIds } });

    await Promise.allSettled(
      feedbacks.flatMap((fb) => [
        fb?.avatar?.public_id
          ? deleteFromCloudinary(fb.avatar.public_id)
          : Promise.resolve(),
        fb?.proof_image?.public_id
          ? deleteFromCloudinary(fb.proof_image.public_id)
          : Promise.resolve(),
      ]),
    );

    const result = await Feedback.deleteMany({ _id: { $in: feedbackIds } });

    return res.status(200).json({
      success: true,
      message: "Feedbacks deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("deleteFeedbacks error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateIsShowFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { isShow } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { isShow },
      { new: true },
    );

    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }

    return res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error("updateIsShowFeedback error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getListFeedbackAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, isShow } = req.query;

    const filter = {};
    if (isShow !== undefined) filter.isShow = isShow === "true";

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const [feedbacks, total] = await Promise.all([
      Feedback.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNumber),
      Feedback.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("getListFeedbackAdmin error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getListFeedbackCustomer = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isShow: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    console.error("getListFeedbackCustomer error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
