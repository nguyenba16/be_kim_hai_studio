import PageSection from "../models/pageSection.model.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";

// ========== CUSTOMER ==========

export const getPageSectionByKey = async (req, res) => {
  try {
    const { section_key, lang } = req.query;

    if (!section_key) {
      return res.status(400).json({ success: false, message: "section_key is required" });
    }

    const section = await PageSection.findOne({ section_key, isShow: true }).lean();

    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    let data;
    if (lang) {
      data = {
        _id: section._id,
        section_key: section.section_key,
        page: section.page,
        title: lang === "vi" ? section.vi_title : section.en_title,
        subtitle: lang === "vi" ? section.vi_subtitle : section.en_subtitle,
        description: lang === "vi" ? section.vi_description : section.en_description,
        images: section.images,
        actions: section.actions,
        order: section.order,
      };
    } else {
      data = section;
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getPageSectionByKey error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPageSectionsByPage = async (req, res) => {
  try {
    const { page, lang } = req.query;

    const filter = { isShow: true };
    if (page) filter.page = page;

    const sections = await PageSection.find(filter).sort({ order: 1 }).lean();

    let data;
    if (lang) {
      data = sections.map((s) => ({
        _id: s._id,
        section_key: s.section_key,
        page: s.page,
        title: lang === "vi" ? s.vi_title : s.en_title,
        subtitle: lang === "vi" ? s.vi_subtitle : s.en_subtitle,
        description: lang === "vi" ? s.vi_description : s.en_description,
        images: s.images,
        actions: s.actions,
        order: s.order,
      }));
    } else {
      data = sections;
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getPageSectionsByPage error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ========== ADMIN ==========

export const getAllPageSectionsAdmin = async (req, res) => {
  try {
    const sections = await PageSection.find({}).sort({ page: 1, order: 1 }).lean();
    return res.status(200).json({ success: true, data: sections });
  } catch (error) {
    console.error("getAllPageSectionsAdmin error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const upsertPageSection = async (req, res) => {
  try {
    const {
      section_key,
      page,
      vi_title,
      en_title,
      vi_subtitle,
      en_subtitle,
      vi_description,
      en_description,
      order,
      isShow,
    } = req.body || {};

    if (!section_key || !page) {
      return res.status(400).json({ success: false, message: "section_key and page are required" });
    }

    const bannerImageData = req.body?.banner_image;

    const existing = await PageSection.findOne({ section_key });

    const updateData = {
      page,
      vi_title: vi_title ?? "",
      en_title: en_title ?? "",
      vi_subtitle: vi_subtitle ?? "",
      en_subtitle: en_subtitle ?? "",
      vi_description: vi_description ?? "",
      en_description: en_description ?? "",
      order: order !== undefined ? Number(order) : 0,
      isShow: isShow === "true" || isShow === true || isShow === undefined ? true : false,
      updatedAt: new Date(),
    };

    // Accept pre-uploaded banner {url, public_id}
    if (bannerImageData?.url && bannerImageData?.public_id) {
      if (existing?.images?.length > 0 && existing.images[0].public_id) {
        await deleteFromCloudinary(existing.images[0].public_id);
      }
      updateData.images = [{ url: bannerImageData.url, public_id: bannerImageData.public_id }];
    }

    let section;
    if (existing) {
      section = await PageSection.findByIdAndUpdate(existing._id, updateData, { new: true });
    } else {
      section = await PageSection.create({ section_key, ...updateData });
    }

    return res.status(200).json({
      success: true,
      message: existing ? "Updated successfully" : "Created successfully",
      data: section,
    });
  } catch (error) {
    console.error("upsertPageSection error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deletePageSection = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await PageSection.findById(id);

    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    for (const img of section.images || []) {
      if (img.public_id) await deleteFromCloudinary(img.public_id);
    }

    await PageSection.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("deletePageSection error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
