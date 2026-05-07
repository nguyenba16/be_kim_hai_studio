import Image from "../models/image.model.js";
import {
  uploadToStorage as uploadToCloudinary,
  deleteFromStorage as deleteFromCloudinary,
} from "../config/storage.js";

export const createImages = async (req, res) => {
  try {
    const {
      vi_title,
      vi_desc,
      en_title,
      en_desc,
      about,
      albumId,
      isShow = true,
      isOutstanding = false,
    } = req.body || {};

    const imageFiles = req.files?.images;

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image file is required",
      });
    }

    const createdImages = [];

    for (const file of imageFiles) {
      const result = await uploadToCloudinary(file.buffer, "images/gallery", file.originalname);

      const image = await Image.create({
        vi_title,
        vi_desc,
        en_title,
        en_desc,
        about,
        albumId: albumId || null,
        isShow: isShow,
        isOutstanding: isOutstanding,
        url: result.secure_url,
        public_id: result.public_id,
      });

      createdImages.push(image);
    }

    return res.status(200).json({
      success: true,
      message: `${createdImages.length} images created successfully`,
      data: createdImages,
    });
  } catch (error) {
    console.error("createImages error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getListImage = async (req, res) => {
  try {
    const { about, albumId, isShow, isOutstanding, page, limit } = req.query;

    const filter = {};
    if (about) filter.about = about;
    if (albumId) filter.albumId = albumId;
    if (isShow !== undefined) filter.isShow = isShow === "true";
    if (isOutstanding !== undefined)
      filter.isOutstanding = isOutstanding === "true";

    let query = Image.find(filter)
      .sort({ createdAt: -1 })
      .populate("albumId", "vi_title en_title");

    let pagination = null;

    if (page && limit) {
      const pageNumber = Math.max(Number(page), 1);
      const limitNumber = Math.max(Number(limit), 1);

      const skip = (pageNumber - 1) * limitNumber;

      query = query.skip(skip).limit(limitNumber);

      const total = await Image.countDocuments(filter);

      pagination = {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      };
    }

    const images = await query;

    return res.status(200).json({
      success: true,
      data: images,
      pagination,
    });
  } catch (error) {
    console.error("getListImage error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDetailImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await Image.findById(imageId).populate(
      "albumId",
      "vi_title en_title",
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("getDetailImage error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const {
      vi_title,
      vi_desc,
      en_title,
      en_desc,
      about,
      albumId,
      isShow,
      isOutstanding,
    } = req.body || {};

    if (vi_title !== undefined) image.vi_title = vi_title;
    if (vi_desc !== undefined) image.vi_desc = vi_desc;
    if (en_title !== undefined) image.en_title = en_title;
    if (en_desc !== undefined) image.en_desc = en_desc;
    if (about !== undefined) image.about = about;
    if (albumId !== undefined) image.albumId = albumId;

    if (isShow !== undefined)
      image.isShow = isShow === "true" || isShow === true;

    if (isOutstanding !== undefined)
      image.isOutstanding = isOutstanding === "true" || isOutstanding === true;

    if (req.files?.image?.[0]) {
      const result = await uploadToCloudinary(
        req.files.image[0].buffer,
        "images/gallery",
        req.files.image[0].originalname,
      );

      if (image.public_id) {
        await deleteFromCloudinary(image.public_id);
      }

      image.url = result.secure_url;
      image.public_id = result.public_id;
    }

    image.updatedAt = Date.now();

    await image.save();

    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: image,
    });
  } catch (error) {
    console.error("updateImage error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete list
export const deleteImage = async (req, res) => {
  try {
    const { imageIds } = req.body;

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "imageIds must be a non-empty array",
      });
    }

    const images = await Image.find({ _id: { $in: imageIds } });

    await Promise.allSettled(
      images.map((img) =>
        img?.public_id
          ? deleteFromCloudinary(img.public_id)
          : Promise.resolve(),
      ),
    );

    const result = await Image.deleteMany({
      _id: { $in: imageIds },
    });

    return res.status(200).json({
      success: true,
      message: "Images deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("deleteImage error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateIsShowImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { isShow } = req.body;

    const image = await Image.findByIdAndUpdate(
      imageId,
      { isShow },
      { new: true },
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("updateIsShowJob error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
