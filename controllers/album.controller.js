import Album from "../models/album.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import Image from "../models/image.model.js";
export const createAlbum = async (req, res) => {
  try {
    const {
      vi_title,
      vi_desc,
      en_title,
      en_desc,
      isShow = true,
      isOutstanding = false,
      category,
    } = req.body;

    if (!vi_title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }
    let cover_image = null;

    const coverFile = req.files?.cover_image?.[0];

    if (coverFile) {
      const result = await uploadToCloudinary(
        coverFile.buffer,
        "images/album-cover",
      );
      cover_image = { url: result.secure_url, public_id: result.public_id };
    } else if (req.body.cover_image?.url) {
      cover_image = req.body.cover_image;
    }

    const album = await Album.create({
      vi_title,
      vi_desc,
      en_title,
      en_desc,
      cover_image,
      category,
      isShow: Boolean(isShow),
      isOutstanding: Boolean(isOutstanding),
    });

    const files = req.files?.images || [];
    const imageUrls = Array.isArray(req.body.images) ? req.body.images : [];

    if (files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer, "images/gallery");
          await Image.create({
            albumId: album._id,
            url: result.secure_url,
            public_id: result.public_id,
            about: "album",
            category: category || "other",
            isShow: true,
            isOutstanding: false,
          });
        }),
      );
    } else if (imageUrls.length > 0) {
      await Promise.all(
        imageUrls.map(async (imgData) =>
          Image.create({
            albumId: album._id,
            url: imgData.url,
            public_id: imgData.public_id,
            about: "album",
            category: category || "other",
            isShow: true,
            isOutstanding: false,
          }),
        ),
      );
    }

    return res.status(200).json({
      success: true,
      data: album,
    });
  } catch (error) {
    console.error("createAlbum error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getListAlbum = async (req, res) => {
  try {
    const { isShow, isOutstanding, page, limit, lang, category } = req.query;

    const filter = {};

    if (isShow !== undefined) filter.isShow = isShow === "true";
    if (isOutstanding !== undefined)
      filter.isOutstanding = isOutstanding === "true";
    if (category) filter.category = category;
    const isPagination = page !== undefined && limit !== undefined;

    const query = Album.find(filter).sort({ createdAt: -1 });

    let albums, total;

    if (isPagination) {
      const pageNumber = Math.max(Number(page), 1);
      const limitNumber = Math.max(Number(limit), 1);
      const skip = (pageNumber - 1) * limitNumber;

      [albums, total] = await Promise.all([
        query.clone().skip(skip).limit(limitNumber),
        Album.countDocuments(filter),
      ]);
    } else {
      albums = await query;
    }

    // 🚀 transform theo lang
    let finalData = albums;

    if (lang === "vi" || lang === "en") {
      finalData = albums.map((item) => {
        const obj = item.toObject();

        return {
          ...obj,
          title: obj[`${lang}_title`],
          desc: obj[`${lang}_desc`],
          // ❌ remove field cũ nếu muốn clean
          vi_title: undefined,
          vi_desc: undefined,
          en_title: undefined,
          en_desc: undefined,
        };
      });
    }

    // 👉 response
    return res.status(200).json({
      success: true,
      data: finalData,
      ...(isPagination && {
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      }),
    });
  } catch (error) {
    console.error("getListAlbum error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getListAlbumAll = async (req, res) => {
  try {
    const { isShow, isOutstanding } = req.query;

    const filter = {};

    if (isShow !== undefined) filter.isShow = isShow === "true";
    if (isOutstanding !== undefined)
      filter.isOutstanding = isOutstanding === "true";

    const albums = await Album.find(filter)
      .populate("imageListId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: albums,
      total: albums.length,
    });
  } catch (error) {
    console.error("getListAlbumAll error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDetailAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang;
    const album = await Album.findById(id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }
    const images = await Image.find({ albumId: id, about: "album" }).sort({
      createdAt: 1,
    });
    const mapLang = (vi, en) => {
      if (!lang) return { vi, en };
      return lang === "en" ? en : vi;
    };
    const albumData = lang
      ? {
          title: mapLang(album.vi_title, album.en_title),
          desc: mapLang(album.vi_desc, album.en_desc),
          cover_image: album.cover_image,
          category: album.category,

          isOutstanding: album.isOutstanding,
          isShow: album.isShow,

          _id: album._id,
        }
      : {
          vi_title: album.vi_title,
          en_title: album.en_title,
          vi_desc: album.vi_desc,
          en_desc: album.en_desc,
          cover_image: album.cover_image,
          category: album.category,

          isOutstanding: album.isOutstanding,
          isShow: album.isShow,
          _id: album._id,
        };

    return res.status(200).json({
      success: true,
      data: {
        ...albumData,
        images,
      },
    });
  } catch (error) {
    console.error("getDetailAlbum error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const {
      vi_title,
      vi_desc,
      en_title,
      en_desc,
      isShow,
      isOutstanding,
      category,
      keepImageIds,
    } = req.body;

    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    // update album fields
    if (vi_title !== undefined) album.vi_title = vi_title;
    if (vi_desc !== undefined) album.vi_desc = vi_desc;
    if (en_title !== undefined) album.en_title = en_title;
    if (en_desc !== undefined) album.en_desc = en_desc;
    if (category !== undefined) album.category = category;
    if (isShow !== undefined)
      album.isShow = isShow === "true" || isShow === true;

    if (isOutstanding !== undefined)
      album.isOutstanding = isOutstanding === "true" || isOutstanding === true;

    album.updatedAt = Date.now();
    const coverFile = req.files?.cover_image?.[0];

    if (coverFile) {
      if (album.cover_image?.public_id) {
        await deleteFromCloudinary(album.cover_image.public_id);
      }
      const result = await uploadToCloudinary(coverFile.buffer, "images/album-cover");
      album.cover_image = { url: result.secure_url, public_id: result.public_id };
    } else if (req.body.cover_image?.url) {
      if (album.cover_image?.public_id) {
        await deleteFromCloudinary(album.cover_image.public_id);
      }
      album.cover_image = req.body.cover_image;
    }
    await album.save();

    // 1. xử lý keep + delete trước
    let keepIds = [];
    if (keepImageIds) {
      keepIds = Array.isArray(keepImageIds) ? keepImageIds : JSON.parse(keepImageIds);
    }

    const oldImages = await Image.find({ albumId: album._id });
    const imagesToDelete = oldImages.filter(
      (img) => !keepIds.includes(img._id.toString()),
    );

    await Promise.all(
      imagesToDelete.map(async (img) => {
        await deleteFromCloudinary(img.public_id);
      }),
    );
    await Image.deleteMany({
      _id: { $in: imagesToDelete.map((img) => img._id) },
    });

    // 2. thêm ảnh mới
    const files = req.files?.images || [];
    const imageUrls = Array.isArray(req.body.images) ? req.body.images : [];

    if (files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer, "images/gallery");
          await Image.create({
            albumId: album._id,
            url: result.secure_url,
            public_id: result.public_id,
            about: "album",
            category: category || "other",
            isShow: true,
            isOutstanding: false,
          });
        }),
      );
    } else if (imageUrls.length > 0) {
      await Promise.all(
        imageUrls.map(async (imgData) =>
          Image.create({
            albumId: album._id,
            url: imgData.url,
            public_id: imgData.public_id,
            about: "album",
            category: category || "other",
            isShow: true,
            isOutstanding: false,
          }),
        ),
      );
    }

    return res.status(200).json({
      success: true,
      message: "Album updated successfully",
      data: album,
    });
  } catch (error) {
    console.error("updateAlbum error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { albumIds } = req.body;

    if (!Array.isArray(albumIds) || albumIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "albumIds must be a non-empty array",
      });
    }
    const images = await Image.find({
      albumId: { $in: albumIds },
    });
    await Promise.allSettled(
      images.map((img) =>
        img?.public_id
          ? deleteFromCloudinary(img.public_id)
          : Promise.resolve(),
      ),
    );
    await Image.deleteMany({
      albumId: { $in: albumIds },
    });
    const result = await Album.deleteMany({
      _id: { $in: albumIds },
    });

    return res.status(200).json({
      success: true,
      message: "Albums deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("deleteAlbum error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateIsOutstanding = async (req, res) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId);
    if (!album) {
      return res
        .status(404)
        .json({ success: false, message: "album not found" });
    }
    album.isOutstanding = !album.isOutstanding;

    await album.save();
    return res.status(200).json({
      success: true,
      message: "album updated successfully",
      data: album,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateIsShow = async (req, res) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId);
    if (!album) {
      return res
        .status(404)
        .json({ success: false, message: "album not found" });
    }
    album.isShow = !album.isShow;

    await album.save();
    return res.status(200).json({
      success: true,
      message: "album updated successfully",
      data: album,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
