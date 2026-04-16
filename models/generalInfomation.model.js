import mongoose from "mongoose";

const { Schema } = mongoose;

const GeneralInfomationSchema = new Schema({
  logo_image: {
    url: String,
    public_id: String,
  },
  vi_address: { type: String },
  vi_address_other: { type: String },
  en_address: { type: String },
  en_address_other: { type: String },
  vi_team_name: { type: String },
  vi_personal_name: { type: String },
  vi_description: { type: String },
  vi_skill: { type: String },
  vi_about_title: { type: String },
  en_about_title: { type: String },
  vi_hero_title: { type: String },
  en_hero_title: { type: String },
  en_hero_sub: { type: String },
  vi_hero_sub: { type: String },
  en_team_name: { type: String },
  en_personal_name: { type: String },
  en_description: { type: String },
  en_skill: { type: String },
  email: { type: String },
  phone: { type: String },
  zalo: { type: String },
  facebook_link: { type: String },
  facebook_name: { type: String },
  zalo_name: { type: String },
  intagram_link: { type: String },
  intagram_name: { type: String },
  tiktok_link: { type: String },
  tiktok_name: { type: String },
  youtube_link: { type: String },
  youtube_name: { type: String },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  personal_image: [
    {
      url: String,
      public_id: String,
    },
  ],

  // Stats section
  stats: [
    {
      value: { type: String },
      vi_label: { type: String },
      en_label: { type: String },
      vi_desc: { type: String },
      en_desc: { type: String },
    },
  ],

  // CTA Banner section
  vi_cta_badge: { type: String },
  en_cta_badge: { type: String },
  vi_cta_title: { type: String },
  en_cta_title: { type: String },
  vi_cta_desc: { type: String },
  en_cta_desc: { type: String },

  // Why Choose Us section header
  vi_why_title: { type: String },
  en_why_title: { type: String },
  vi_why_subtitle: { type: String },
  en_why_subtitle: { type: String },

  // Why Choose Us items
  why_choose_items: [
    {
      icon_name: { type: String },
      vi_title: { type: String },
      en_title: { type: String },
      vi_desc: { type: String },
      en_desc: { type: String },
    },
  ],

  // Collage images for Why Choose Us section
  collage_images: [
    {
      url: { type: String },
      public_id: { type: String },
    },
  ],

  // About page fields
  about_hero_image: {
    url: { type: String },
    public_id: { type: String },
  },
  vi_about_since: { type: String },
  vi_about_subtitle: { type: String },
  vi_about_desc: { type: String },
  vi_about_philosophy_badge: { type: String },
  vi_about_philosophy_title: { type: String },
  vi_about_philosophy_italic: { type: String },
  vi_about_philosophy_desc: { type: String },
  about_moments: [
    {
      title: { type: String },
      desc: { type: String },
      img: {
        url: { type: String },
        public_id: { type: String },
      },
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const GeneralInfomation = mongoose.model(
  "GeneralInfomation",
  GeneralInfomationSchema,
);

export default GeneralInfomation;
