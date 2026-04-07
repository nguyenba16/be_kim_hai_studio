import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/admin/auth.router.js";
import generalInfomationRouterCustomer from "./routes/customer/generalInfomation.router.js";
import authRouterCustomer from "./routes/customer/auth.router.js";
import videoRouterCustomer from "./routes/customer/video.router.js";
import albumRouterAdmin from "./routes/admin/album.router.js";
import videoRouterAdmin from "./routes/admin/video.router.js";
import imageRouterCustomer from "./routes/customer/image.router.js";
import albumRouterCustomer from "./routes/customer/album.router.js";
import imageRouterAdmin from "./routes/admin/image.router.js";
import generalInfomationRouterAdmin from "./routes/admin/generalInfomation.router.js";
import connectDB from "./config/db.js";
const app = express();
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).send("Database connection error");
  }
});
app.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());

app.use(express.json());
app.get("/", (req, res) => res.send("Hello fen!"));

// CUSTOMER API HERE
app.use("/customer/general-information", generalInfomationRouterCustomer);
app.use("/customer/auth", authRouterCustomer);
app.use("/customer/album", albumRouterCustomer);
app.use("/customer/image", imageRouterCustomer);
app.use("/customer/video", videoRouterCustomer);

// Admin API Here
app.use("/admin/auth", authRouter);
app.use("/admin/general-information", generalInfomationRouterAdmin);
app.use("/admin/album", albumRouterAdmin);
app.use("/admin/image", imageRouterAdmin);
app.use("/admin/video", videoRouterAdmin);

// app.post("/customer/upload", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }
//     const result = await uploadToCloudinary(file.buffer, "uploads");

//     res.json({ url: result.secure_url, public_id: result.public_id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });
export default app;
