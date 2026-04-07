// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// //  Gửi mail nội bộ
// export const sendMailToCompany = async (candidate) => {
//   return transporter.sendMail({
//     from: `"KHP Company" <${process.env.EMAIL_USER}>`,
//     to: process.env.EMAIL_USER,
//     subject: `[ỨNG TUYỂN] ${candidate.position} - ${candidate.name}`,
//     attachments: candidate.CV_info.map((cv) => ({
//       filename: cv.file_name,
//       path: cv.url,
//     })),
//     html: `
//       <h3>Thông tin ứng viên</h3>
//       <p><strong>Họ tên:</strong> ${candidate.name ?? "Chưa có thông tin"}</p>
//       <p><strong>Email:</strong> ${candidate.email ?? "Chưa có thông tin"}</p>
//       <p><strong>SĐT:</strong> ${candidate.phone ?? "Chưa có thông tin"}</p>
//       <p><strong>Vị trí:</strong> ${candidate.position ?? "Chưa có thông tin"}</p>
//       <p><strong>Kinh nghiệm:</strong> ${candidate.experience ?? "Chưa có thông tin"} năm</p>
//       <p><strong>Giới thiệu:</strong> ${candidate.introduce ?? "Chưa có thông tin"}</p>
//       <p><strong>Số CV:</strong> ${candidate.CV_info.length}</p>
//     `,
//   });
// };

// //  Gửi mail xác nhận cho ứng viên
// export const sendAutoReply = async (candidate) => {
//   return transporter.sendMail({
//     from: `"KHP Company" <${process.env.EMAIL_USER}>`,
//     to: candidate.email,
//     subject: `Xác nhận đã nhận hồ sơ ứng tuyển`,
//     html: `
//       <p>Chào <strong>${candidate.name}</strong>,</p>
//       <p>Chúng tôi đã nhận được hồ sơ ứng tuyển vị trí <strong>${candidate.position}</strong>.</p>
//       <p>Bộ phận HR sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
//       <br/>
//       <p>Trân trọng,</p>
//       <p>KHP Company</p>
//     `,
//   });
// };

import sgMail from "@sendgrid/mail";
import fetch from "node-fetch";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Gửi mail nội bộ
export const sendMailToCompany = async (candidate) => {
  // Convert CV file từ URL → base64
  const attachments = await Promise.all(
    candidate.CV_info.map(async (cv) => {
      const response = await fetch(cv.url);
      const buffer = await response.arrayBuffer();

      return {
        filename: cv.file_name,
        content: Buffer.from(buffer).toString("base64"),
        type: "application/pdf",
        disposition: "attachment",
      };
    }),
  );

  const msg = {
    to: process.env.EMAIL_FROM,
    from: process.env.EMAIL_FROM,
    subject: `[ỨNG TUYỂN] ${candidate.position} - ${candidate.name}`,
    attachments,
    text: `
        Có ứng viên mới ứng tuyển.
        Họ tên: ${candidate.name ?? "Chưa có thông tin"}
        Email: ${candidate.email ?? "Chưa có thông tin"}
        SĐT: ${candidate.phone ?? "Chưa có thông tin"}
        Vị trí: ${candidate.position ?? "Chưa có thông tin"}
        Giới thiệu: ${candidate.introduce ?? "Chưa có thông tin"}
        Số CV: ${candidate.CV_info.length}
        `,
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background: #1e293b; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">Ứng viên mới</h2>
        </div>
        <div style="padding: 25px;">
            <p style="margin-top: 0; font-size: 15px; color: #555;">
            Bạn vừa nhận được một hồ sơ ứng tuyển mới với thông tin như sau:
            </p>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
                <td style="padding: 8px 0; font-weight: bold;">Họ tên:</td>
                <td style="padding: 8px 0;">${candidate.name ?? "Chưa có thông tin"}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${candidate.email ?? "Chưa có thông tin"}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold;">SĐT:</td>
                <td style="padding: 8px 0;">${candidate.phone ?? "Chưa có thông tin"}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold;">Vị trí:</td>
                <td style="padding: 8px 0;">${candidate.position ?? "Chưa có thông tin"}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold;">Giới thiệu:</td>
                <td style="padding: 8px 0;">${candidate.introduce ?? "Chưa có thông tin"}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold;">Số CV đính kèm:</td>
                <td style="padding: 8px 0;">${candidate.CV_info.length}</td>
            </tr>
            </table>
        </div>

        <!-- Footer -->
        <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            Email này được gửi tự động từ hệ thống tuyển dụng. <br/>
            © ${new Date().getFullYear()} KHP Company
        </div>

        </div>
    </div>
  `,
  };

  return sgMail.send(msg);
};

// Gửi mail xác nhận cho ứng viên
export const sendAutoReply = async (candidate) => {
  const msg = {
    to: candidate.email,
    from: process.env.EMAIL_FROM,
    subject: `Xác nhận đã nhận hồ sơ ứng tuyển`,
    text: `
        Chào ${candidate.name},

        Chúng tôi đã nhận được hồ sơ ứng tuyển vị trí ${candidate.position}.
        Bộ phận tuyển dụng sẽ xem xét và phản hồi trong thời gian sớm nhất.

        Trân trọng,
        KHP Company
    `,

    html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <div style="background: #0f172a; padding: 25px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0;">Cảm ơn bạn đã ứng tuyển</h2>
            </div>

            <!-- Body -->
            <div style="padding: 25px; font-size: 15px; color: #444;">
                <p>Chào <strong>${candidate.name}</strong>,</p>

                <p>
                Chúng tôi đã nhận được hồ sơ ứng tuyển vị trí 
                <strong>${candidate.position}</strong>.
                </p>

                <p>
                Bộ phận tuyển dụng sẽ xem xét hồ sơ của bạn và phản hồi trong thời gian sớm nhất nếu hồ sơ phù hợp.
                </p>

                <p>
                Cảm ơn bạn đã quan tâm và dành thời gian ứng tuyển vào công ty.
                </p>

                <br/>

                <p style="margin-bottom: 0;">
                Trân trọng,<br/>
                <strong>KHP Company</strong>
                </p>
            </div>

            <!-- Footer -->
            <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                Đây là email tự động, vui lòng không trả lời email này. <br/>
                © ${new Date().getFullYear()} KHP Company
            </div>

            </div>
        </div>
        `,
  };

  return sgMail.send(msg);
};
