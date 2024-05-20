import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1; // 1MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];

const fileSchema = z.instanceof(File, { message: "file is required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

export const EditFormSchema = z.object({
  name: z.string().min(1, "name is required"),
  price: z.coerce.number().int().min(1, "price is required"),
  description: z.string().min(1, "description is required"),
  file: z.instanceof(File).optional(),
  image: z.array(z.instanceof(File)).optional(),
});

export const ProductFormSchema = z.object({
  name: z.string().min(1, "name is required"),
  price: z.coerce.number().int().min(1, "price is required"),
  description: z.string().min(1, "description is required"),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_UPLOAD_SIZE, "must be less than 1MB."),
  image: z
    .array(z.instanceof(File))
    .min(1, "You must upload at least 1 image.")
    .max(3, "You can upload a maximum of 3 images.")
    .refine(
      (files) =>
        files.every(
          (file) =>
            file.size <= MAX_UPLOAD_SIZE &&
            ACCEPTED_FILE_TYPES.includes(file.type)
        ),
      "All images must be less than 1MB and of type JPEG or PNG."
    ),
});
