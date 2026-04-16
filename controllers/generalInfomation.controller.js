import GeneralInfomation from "../models/generalInfomation.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
export const getGeneralInformation = async (req, res) => {
  try {
    const { lang } = req.query;
    const generalInfoId = process.env.GENERAL_INFO_ID;

    const info = await GeneralInfomation.findById(generalInfoId).lean();

    if (!info) {
      return res.status(404).json({
        success: false,
        message: "General information not found",
      });
    }

    let data = {};
    if (lang) {
      data = {
        logoImage: info.logo_image,
        team_name: lang === "vi" ? info.vi_team_name : info.en_team_name,
        personal_name:
          lang === "vi" ? info.vi_personal_name : info.en_personal_name,
        description: lang === "vi" ? info.vi_description : info.en_description,
        skill: lang === "vi" ? info.vi_skill : info.en_skill,
        about_title: lang === "vi" ? info.vi_about_title : info.en_about_title,
        email: info.email,
        phone: info.phone,
        zalo: info.zalo,
        facebook_link: info.facebook_link,
        facebook_name: info.facebook_name,
        zalo_name: info.zalo_name,
        intagram_link: info.intagram_link,
        intagram_name: info.intagram_name,
        tiktok_link: info.tiktok_link,
        tiktok_name: info.tiktok_name,
        youtube_link: info.youtube_link,
        youtube_name: info.youtube_name,
        hero_title: lang === "vi" ? info.vi_hero_title : info.en_hero_title,
        hero_sub: lang === "vi" ? info.vi_hero_sub : info.en_hero_sub,
        personal_image: info.personal_image,
        vi_address: lang === "vi" ? info.vi_address : info.en_address,
        vi_address_other:
          lang === "vi" ? info.vi_address_other : info.en_address_other,
        stats: (info.stats || []).map((s) => ({
          value: s.value,
          label: lang === "vi" ? s.vi_label : s.en_label,
          desc: lang === "vi" ? s.vi_desc : s.en_desc,
        })),
        cta_badge: lang === "vi" ? info.vi_cta_badge : info.en_cta_badge,
        cta_title: lang === "vi" ? info.vi_cta_title : info.en_cta_title,
        cta_desc: lang === "vi" ? info.vi_cta_desc : info.en_cta_desc,
        why_title: lang === "vi" ? info.vi_why_title : info.en_why_title,
        why_subtitle: lang === "vi" ? info.vi_why_subtitle : info.en_why_subtitle,
        why_choose_items: (info.why_choose_items || []).map((item) => ({
          icon_name: item.icon_name,
          title: lang === "vi" ? item.vi_title : item.en_title,
          desc: lang === "vi" ? item.vi_desc : item.en_desc,
        })),
        collage_images: info.collage_images || [],
        about_hero_image: info.about_hero_image,
        about_hero_image: info.about_hero_image,
        vi_about_since: info.vi_about_since,
        vi_about_subtitle: info.vi_about_subtitle,
        vi_about_desc: info.vi_about_desc,
        vi_about_philosophy_badge: info.vi_about_philosophy_badge,
        vi_about_philosophy_title: info.vi_about_philosophy_title,
        vi_about_philosophy_italic: info.vi_about_philosophy_italic,
        vi_about_philosophy_desc: info.vi_about_philosophy_desc,
        about_moments: info.about_moments || [],
      };
    } else {
      data = {
        logoImage: info.logo_image,
        vi_team_name: info.vi_team_name,
        vi_personal_name: info.vi_personal_name,
        vi_description: info.vi_description,
        vi_skill: info.vi_skill,
        en_team_name: info.en_team_name,
        en_personal_name: info.en_personal_name,
        en_description: info.en_description,
        vi_about_title: info.vi_about_title,
        en_about_title: info.en_about_title,
        en_skill: info.en_skill,
        email: info.email,
        phone: info.phone,
        zalo: info.zalo,
        facebook_link: info.facebook_link,
        facebook_name: info.facebook_name,
        zalo_name: info.zalo_name,
        intagram_link: info.intagram_link,
        intagram_name: info.intagram_name,
        tiktok_link: info.tiktok_link,
        tiktok_name: info.tiktok_name,
        youtube_link: info.youtube_link,
        youtube_name: info.youtube_name,
        vi_hero_title: info.vi_hero_title,
        en_hero_title: info.en_hero_title,
        en_hero_sub: info.en_hero_sub,
        vi_hero_sub: info.vi_hero_sub,
        personal_image: info.personal_image,
        vi_address_other: info.vi_address_other,
        vi_address: info.vi_address,
        en_address: info.en_address,
        en_address_other: info.en_address_other,
        stats: info.stats || [],
        vi_cta_badge: info.vi_cta_badge,
        en_cta_badge: info.en_cta_badge,
        vi_cta_title: info.vi_cta_title,
        en_cta_title: info.en_cta_title,
        vi_cta_desc: info.vi_cta_desc,
        en_cta_desc: info.en_cta_desc,
        vi_why_title: info.vi_why_title,
        en_why_title: info.en_why_title,
        vi_why_subtitle: info.vi_why_subtitle,
        en_why_subtitle: info.en_why_subtitle,
        why_choose_items: info.why_choose_items || [],
        collage_images: info.collage_images || [],
        about_hero_image: info.about_hero_image,
        vi_about_since: info.vi_about_since,
        vi_about_subtitle: info.vi_about_subtitle,
        vi_about_desc: info.vi_about_desc,
        vi_about_philosophy_badge: info.vi_about_philosophy_badge,
        vi_about_philosophy_title: info.vi_about_philosophy_title,
        vi_about_philosophy_italic: info.vi_about_philosophy_italic,
        vi_about_philosophy_desc: info.vi_about_philosophy_desc,
        about_moments: info.about_moments || [],
      };
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const createGeneralInformation = async (req, res) => {
  try {
    const {
      vi_team_name,
      vi_personal_name,
      vi_description,
      vi_skill,
      en_team_name,
      en_personal_name,
      en_description,
      en_skill,
      vi_hero_title,
      en_hero_title,
      en_hero_sub,
      vi_hero_sub,
      email,
      phone,
      zalo,
      facebook_link,
      facebook_name,
      zalo_name,
      intagram_link,
      intagram_name,
      tiktok_link,
      tiktok_name,
      youtube_link,
      youtube_name,
      adminId,
      vi_about_title,
      en_about_title,
    } = req.body || {};

    const logoImageFile = req.files?.logo_image?.[0];
    const personalImageFiles = req.files?.personal_image || [];

    let logoImage = null;

    if (logoImageFile) {
      const result = await uploadToCloudinary(
        logoImageFile.buffer,
        "general_information/logo",
      );

      logoImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
    const personalImages = [];
    for (const file of personalImageFiles) {
      const result = await uploadToCloudinary(
        file.buffer,
        "general_information/personal",
      );
      personalImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const info = await GeneralInfomation.create({
      vi_team_name,
      vi_personal_name,
      vi_description,
      vi_skill,
      en_team_name,
      en_personal_name,
      en_description,
      en_skill,
      email,
      phone,
      zalo,
      facebook_link,
      facebook_name,
      zalo_name,
      intagram_link,
      intagram_name,
      tiktok_link,
      tiktok_name,
      youtube_link,
      youtube_name,
      adminId,
      logo_image: logoImage,
      vi_about_title,
      en_about_title,
      vi_hero_title,
      en_hero_title,
      en_hero_sub,
      vi_hero_sub,
    });

    return res.status(200).json({
      success: true,
      message: "Create general information successfully",
      data: info,
    });
  } catch (error) {
    console.error("Error in createGeneralInformation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateGeneralInformation = async (req, res) => {
  try {
    const generalInfoId = process.env.GENERAL_INFO_ID;

    const currentInfo = await GeneralInfomation.findById(generalInfoId);

    if (!currentInfo) {
      return res.status(404).json({
        success: false,
        message: "General information not found",
      });
    }

    const allowedFields = [
      "vi_team_name",
      "vi_personal_name",
      "vi_description",
      "vi_skill",
      "en_team_name",
      "en_personal_name",
      "en_description",
      "en_skill",
      "email",
      "phone",
      "zalo",
      "facebook_link",
      "facebook_name",
      "zalo_name",
      "intagram_link",
      "intagram_name",
      "tiktok_link",
      "tiktok_name",
      "youtube_link",
      "youtube_name",
      "adminId",
      "vi_about_title",
      "en_about_title",
      "vi_hero_title",
      "en_hero_title",
      "en_hero_sub",
      "vi_hero_sub",
      "vi_address",
      "vi_address_other",
      "en_address",
      "en_address_other",
      "vi_cta_badge",
      "en_cta_badge",
      "vi_cta_title",
      "en_cta_title",
      "vi_cta_desc",
      "en_cta_desc",
      "vi_why_title",
      "en_why_title",
      "vi_why_subtitle",
      "en_why_subtitle",
      "vi_about_since",
      "vi_about_subtitle",
      "vi_about_desc",
      "vi_about_philosophy_badge",
      "vi_about_philosophy_title",
      "vi_about_philosophy_italic",
      "vi_about_philosophy_desc",
    ];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body?.[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Handle JSON array fields
    if (req.body?.stats !== undefined) {
      try {
        updateData.stats = JSON.parse(req.body.stats);
      } catch (e) {
        updateData.stats = req.body.stats;
      }
    }
    if (req.body?.why_choose_items !== undefined) {
      try {
        updateData.why_choose_items = JSON.parse(req.body.why_choose_items);
      } catch (e) {
        updateData.why_choose_items = req.body.why_choose_items;
      }
    }
    if (req.body?.about_moments !== undefined) {
      try {
        updateData.about_moments = JSON.parse(req.body.about_moments);
      } catch (e) {
        updateData.about_moments = req.body.about_moments;
      }
    }
    // Handle per-moment image uploads (fields: about_moment_image_0, _1, _2)
    const momentImages = updateData.about_moments
      ? [...updateData.about_moments]
      : currentInfo.about_moments
        ? currentInfo.about_moments.map((m) => ({ ...m.toObject?.() ?? m }))
        : [];
    for (let i = 0; i < 3; i++) {
      const file = req.files?.[`about_moment_image_${i}`]?.[0];
      if (file) {
        // Delete old image if exists
        const oldPublicId = momentImages[i]?.img?.public_id;
        if (oldPublicId) {
          await deleteFromCloudinary(oldPublicId);
        }
        const result = await uploadToCloudinary(
          file.buffer,
          "general_information/moments",
        );
        if (!momentImages[i]) momentImages[i] = {};
        momentImages[i].img = { url: result.secure_url, public_id: result.public_id };
      }
    }
    if (updateData.about_moments || req.files?.about_moment_image_0 || req.files?.about_moment_image_1 || req.files?.about_moment_image_2) {
      updateData.about_moments = momentImages;
    }

    const deletedImages = req.body?.deleted_personal_images || [];
    if (deletedImages.length > 0) {
      for (const public_id of deletedImages) {
        await deleteFromCloudinary(public_id);
      }
      const remainImages = (currentInfo.personal_image || []).filter(
        (img) => !deletedImages.includes(img.public_id),
      );

      updateData.personal_image = remainImages;
    }
    const logoImageFile = req.files?.logo_image?.[0];
    const personalImageFiles = req.files?.personal_image || [];
    if (logoImageFile) {
      if (currentInfo.logo_image?.public_id) {
        await deleteFromCloudinary(currentInfo.logo_image.public_id);
      }

      const result = await uploadToCloudinary(
        logoImageFile.buffer,
        "general_information/logo",
      );

      updateData.logo_image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
    if (personalImageFiles.length > 0) {
      const personalImages = currentInfo.personal_image || [];
      for (const file of personalImageFiles) {
        const result = await uploadToCloudinary(
          file.buffer,
          "general_information/personal",
        );
        personalImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
      updateData.personal_image = personalImages;
    }

    // Handle collage images
    const deletedCollageImages = req.body?.deleted_collage_images || [];
    if (deletedCollageImages.length > 0) {
      for (const public_id of deletedCollageImages) {
        await deleteFromCloudinary(public_id);
      }
      const remainCollage = (currentInfo.collage_images || []).filter(
        (img) => !deletedCollageImages.includes(img.public_id),
      );
      updateData.collage_images = remainCollage;
    }
    const collageImageFiles = req.files?.collage_images || [];
    if (collageImageFiles.length > 0) {
      const collageImages = updateData.collage_images || (currentInfo.collage_images || []);
      for (const file of collageImageFiles) {
        const result = await uploadToCloudinary(
          file.buffer,
          "general_information/collage",
        );
        collageImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
      updateData.collage_images = collageImages;
    }

    // Handle about hero image
    const aboutHeroImageFile = req.files?.about_hero_image?.[0];
    if (aboutHeroImageFile) {
      if (currentInfo.about_hero_image?.public_id) {
        await deleteFromCloudinary(currentInfo.about_hero_image.public_id);
      }
      const result = await uploadToCloudinary(
        aboutHeroImageFile.buffer,
        "general_information/about_hero",
      );
      updateData.about_hero_image = { url: result.secure_url, public_id: result.public_id };
    }

    updateData.updatedAt = new Date();

    const updatedInfo = await GeneralInfomation.findByIdAndUpdate(
      generalInfoId,
      updateData,
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Update general information successfully",
      data: updatedInfo,
    });
  } catch (error) {
    console.error("Error in updateGeneralInformation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
