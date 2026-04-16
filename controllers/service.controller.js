import Service from "../models/service.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import slugify from "slugify";

export const createService = async (req, res) => {
  try {
    const { title, subtitle, desc, isShow } = req.body;

    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    const coverFile = req.files?.cover_image?.[0];

    let cover_image = null;

    if (coverFile) {
      const result = await uploadToCloudinary(
        coverFile.buffer,
        "images/service-cover",
      );

      cover_image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const galleryFiles = req.files?.images || [];

    const images =
      galleryFiles.length > 0
        ? await Promise.all(
            galleryFiles.map(async (file) => {
              const result = await uploadToCloudinary(
                file.buffer,
                "images/service",
              );

              return {
                url: result.secure_url,
                public_id: result.public_id,
              };
            }),
          )
        : [];

    const service = await Service.create({
      title,
      subtitle,
      desc,
      slug,
      isShow,
      cover_image,
      images,
    });

    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getListService = async (req, res) => {
  try {
    const { isShow, page, limit } = req.query;

    const filter = {};
    if (isShow !== undefined) filter.isShow = isShow === "true";

    const isPagination = page && limit;

    const query = Service.find(filter).sort({ createdAt: -1 });

    let services, total;

    if (isPagination) {
      const pageNumber = Math.max(Number(page), 1);
      const limitNumber = Math.max(Number(limit), 1);
      const skip = (pageNumber - 1) * limitNumber;

      [services, total] = await Promise.all([
        query.clone().skip(skip).limit(limitNumber),
        Service.countDocuments(filter),
      ]);
    } else {
      services = await query;
    }

    return res.status(200).json({
      success: true,
      data: services,
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
    console.error("getListService error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDetailService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("getDetailService error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDetailServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const service = await Service.findOne({ slug });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("getDetailServiceBySlug error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const { title, subtitle, desc, isShow, deletedImages } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    if (title) {
      service.title = title;
      service.slug = slugify(title, { lower: true, strict: true });
    }
    if (subtitle !== undefined) service.subtitle = subtitle;
    if (desc !== undefined) service.desc = desc;
    if (isShow !== undefined)
      service.isShow = isShow === "true" || isShow === true;
    const coverFile = req.files?.cover_image?.[0];

    if (coverFile) {
      if (service.cover_image?.public_id) {
        await deleteFromCloudinary(service.cover_image.public_id);
      }

      const result = await uploadToCloudinary(
        coverFile.buffer,
        "images/service-cover",
      );

      service.cover_image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
    let deletedList = [];
    if (deletedImages) {
      deletedList = JSON.parse(deletedImages);
    }

    const imagesToDelete = service.images.filter((img) =>
      deletedList.includes(img._id?.toString()),
    );

    await Promise.all(
      imagesToDelete.map((img) =>
        img.public_id ? deleteFromCloudinary(img.public_id) : Promise.resolve(),
      ),
    );
    service.images = service.images.filter(
      (img) => !deletedList.includes(img._id?.toString()),
    );
    const files = req.files?.images || [];

    if (files.length > 0) {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const result = await uploadToCloudinary(
            file.buffer,
            "images/service",
          );

          return {
            url: result.secure_url,
            public_id: result.public_id,
          };
        }),
      );

      service.images.push(...newImages);
    }

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("updateService error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { serviceIds } = req.body;

    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "serviceIds must be array",
      });
    }

    const services = await Service.find({
      _id: { $in: serviceIds },
    });

    await Promise.allSettled(
      services.map(async (service) => {
        if (service.cover_image?.public_id) {
          await deleteFromCloudinary(service.cover_image.public_id);
        }

        await Promise.all(
          service.images.map((img) =>
            img.public_id
              ? deleteFromCloudinary(img.public_id)
              : Promise.resolve(),
          ),
        );
      }),
    );

    await Service.deleteMany({
      _id: { $in: serviceIds },
    });

    return res.status(200).json({
      success: true,
      message: "Services deleted successfully",
    });
  } catch (error) {
    console.error("deleteService error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const updateIsShowService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.isShow = !service.isShow;

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
