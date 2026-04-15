import Video from "../models/video.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
export const createVideo = async (req, res) => {
  try {
    const {
      vi_title,
      vi_desc,
      en_title,
      en_desc,
      link,
      youtube_link,
      category,
      isShow = true,
      isLivestream = false,
    } = req.body;
    if (!vi_title || !en_title || !youtube_link) {
      return res.status(400).json({
        success: false,
        message: "Titles and YouTube link are required",
      });
    }

    let cover_image = null;
    const coverFile = req.files?.cover_image?.[0];

    if (coverFile) {
      const result = await uploadToCloudinary(
        coverFile.buffer,
        "videos/video-cover",
      );
      cover_image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const video = await Video.create({
      vi_title,
      vi_desc,
      en_title,
      en_desc,
      link,
      youtube_link,
      category,
      isShow: isShow === "true" || isShow === true,
      isLivestream: isLivestream === "true" || isLivestream === true,
      cover_image,
    });

    return res.status(201).json({
      success: true,
      message: "Video created successfully",
      data: video,
    });
  } catch (error) {
    console.error("createVideo error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const {
      vi_title,
      vi_desc,
      en_title,
      en_desc,
      link,
      youtube_link,
      category,
      isShow,
      isLivestream,
    } = req.body;

    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    // Cập nhật các trường text
    if (vi_title !== undefined) video.vi_title = vi_title;
    if (vi_desc !== undefined) video.vi_desc = vi_desc;
    if (en_title !== undefined) video.en_title = en_title;
    if (en_desc !== undefined) video.en_desc = en_desc;
    if (link !== undefined) video.link = link;
    if (youtube_link !== undefined) video.youtube_link = youtube_link;
    if (category !== undefined) video.category = category;

    // Cập nhật các trường boolean (ép kiểu từ string của form-data)
    if (isShow !== undefined)
      video.isShow = isShow === "true" || isShow === true;
    if (isLivestream !== undefined)
      video.isLivestream = isLivestream === "true" || isLivestream === true;

    // Xử lý upload ảnh bìa mới (giống logic của updateAlbum)
    const coverFile = req.files?.cover_image?.[0];
    if (coverFile) {
      // Xóa ảnh cũ trên Cloudinary nếu có
      if (video.cover_image?.public_id) {
        await deleteFromCloudinary(video.cover_image.public_id);
      }

      // Upload ảnh mới
      const result = await uploadToCloudinary(
        coverFile.buffer,
        "videos/video-cover",
      );
      video.cover_image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    video.updatedAt = Date.now();
    await video.save();

    return res.status(200).json({
      success: true,
      message: "Video updated successfully",
      data: video,
    });
  } catch (error) {
    console.error("updateVideo error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getListVideo = async (req, res) => {
  try {
    const {
      category,
      isShow,
      isLivestream,
      page = 1,
      limit = 12,
      lang,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;

    if (isShow !== undefined) filter.isShow = isShow === "true";

    if (isLivestream !== undefined)
      filter.isLivestream = isLivestream === "true";

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);

    const skip = (pageNumber - 1) * limitNumber;

    const [videos, total] = await Promise.all([
      Video.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNumber),

      Video.countDocuments(filter),
    ]);
    const mappedVideos = videos.map((video) => {
      if (!lang) return video;

      return {
        ...video.toObject(),
        title: lang === "en" ? video.en_title : video.vi_title,
        desc: lang === "en" ? video.en_desc : video.vi_desc,
      };
    });

    return res.status(200).json({
      success: true,
      data: mappedVideos,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("getListVideo error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getListVideoAll = async (req, res) => {
  try {
    const { category, isShow, isLivestream } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (isShow !== undefined) filter.isShow = isShow === "true";

    if (isLivestream !== undefined)
      filter.isLivestream = isLivestream === "true";

    const videos = await Video.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: videos,
      total: videos.length,
    });
  } catch (error) {
    console.error("getListVideoAll error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDetailVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { lang } = req.query;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    let data;
    if (lang === "vi" || lang === "en") {
      data = {
        _id: video._id,
        title: lang === "en" ? video.en_title : video.vi_title,
        desc: lang === "en" ? video.en_desc : video.vi_desc,
        youtube_link: video.youtube_link,
        category: video.category,
        isShow: video.isShow,
        isLivestream: video.isLivestream,
        cover_image: video.cover_image,
      };
    } else {
      data = video;
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("getDetailVideo error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { videoIds } = req.body;

    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "videoIds must be a non-empty array",
      });
    }

    const videos = await Video.find({ _id: { $in: videoIds } });

    await Promise.allSettled(
      videos.map((video) =>
        video?.cover_image?.public_id
          ? deleteFromCloudinary(video.cover_image.public_id)
          : Promise.resolve(),
      ),
    );

    const result = await Video.deleteMany({
      _id: { $in: videoIds },
    });

    return res.status(200).json({
      success: true,
      message: "Videos deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("deleteVideo error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateIsShowVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { isShow } = req.body;

    const video = await Video.findByIdAndUpdate(
      videoId,
      { isShow },
      { new: true },
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error("updateIsShowVideo error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
