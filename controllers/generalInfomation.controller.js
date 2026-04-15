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
    ];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body?.[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
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
