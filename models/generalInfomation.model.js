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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const GeneralInfomation = mongoose.model(
  "GeneralInfomation",
  GeneralInfomationSchema,
);

export default GeneralInfomation;
