import GeneralInfomation from "../models/generalInfomation.model.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";
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

    const logoImageData = req.body?.logo_image;
    const personalImagesData = req.body?.personal_image;

    const logoImage = logoImageData?.url && logoImageData?.public_id
      ? { url: logoImageData.url, public_id: logoImageData.public_id }
      : null;

    const personalImages = Array.isArray(personalImagesData) ? personalImagesData : [];

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

    // JSON array fields (body is already parsed JSON, no JSON.parse needed)
    if (req.body?.stats !== undefined) updateData.stats = req.body.stats;
    if (req.body?.why_choose_items !== undefined) updateData.why_choose_items = req.body.why_choose_items;

    // about_moments: images already embedded as {url, public_id}; delete replaced ones
    if (req.body?.about_moments !== undefined) {
      const newMoments = req.body.about_moments;
      const oldMoments = currentInfo.about_moments || [];
      for (let i = 0; i < newMoments.length; i++) {
        const newImg = newMoments[i]?.img;
        const oldImg = oldMoments[i]?.img;
        if (newImg?.public_id && oldImg?.public_id && newImg.public_id !== oldImg.public_id) {
          await deleteFromCloudinary(oldImg.public_id);
        }
      }
      updateData.about_moments = newMoments;
    }

    // Delete removed personal images
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

    // logo_image: accept pre-uploaded {url, public_id}
    const logoImageData = req.body?.logo_image;
    if (logoImageData?.url && logoImageData?.public_id) {
      if (currentInfo.logo_image?.public_id) {
        await deleteFromCloudinary(currentInfo.logo_image.public_id);
      }
      updateData.logo_image = { url: logoImageData.url, public_id: logoImageData.public_id };
    }

    // personal_image: new pre-uploaded images to append
    const newPersonalImages = req.body?.personal_image;
    if (Array.isArray(newPersonalImages) && newPersonalImages.length > 0) {
      const existing = updateData.personal_image ?? (currentInfo.personal_image || []);
      updateData.personal_image = [...existing, ...newPersonalImages];
    }

    // Delete removed collage images
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

    // collage_images: new pre-uploaded images to append
    const newCollageImages = req.body?.collage_images;
    if (Array.isArray(newCollageImages) && newCollageImages.length > 0) {
      const existing = updateData.collage_images ?? (currentInfo.collage_images || []);
      updateData.collage_images = [...existing, ...newCollageImages];
    }

    // about_hero_image: accept pre-uploaded {url, public_id}
    const aboutHeroImageData = req.body?.about_hero_image;
    if (aboutHeroImageData?.url && aboutHeroImageData?.public_id) {
      if (currentInfo.about_hero_image?.public_id) {
        await deleteFromCloudinary(currentInfo.about_hero_image.public_id);
      }
      updateData.about_hero_image = { url: aboutHeroImageData.url, public_id: aboutHeroImageData.public_id };
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
