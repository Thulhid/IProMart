// validationSchema.js
import * as yup from "yup";

export const customerDataSchema = yup.object().shape({
  // fullName: yup.string(),
  firstName: yup.string().required("Fist name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Please provide a valid email")
    .required("Email is required"),
  mobileNumber: yup
    .string()
    .matches(/^07[0,1,2,5-8][0-9]{7}$/, "Invalid Sri Lankan mobile number")
    .required("Mobile number is required"),
  street: yup.string().required("Street is required"),
  city: yup.string().required("City is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});
export const customerUpdateSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
});
export const loginSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export const updatePasswordSchema = yup.object({
  passwordCurrent: yup.string().required("Current password is required"),

  password: yup
    .string()
    .min(8, "New password must be at least 8 characters")
    .required("New password is required"),

  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your new password"),
});

export const addressSchema = yup.object({
  street: yup.string().required("Street is required"),
  city: yup.string().required("City is required"),
  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(
      /^07[0,1,2,5-8][0-9]{7}$/,
      "Mobile number must be a valid Sri Lankan number",
    ),
});

export const createProductSchema = yup.object().shape({
  name: yup
    .string()
    .required("Product name is required")
    .min(10, "Name must be at least 10 characters")
    .max(40, "Name must be at most 40 characters"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required"),
  priceDiscount: yup
    .number()
    .typeError("Discount must be a number")
    .max(yup.ref("price"), "Discount must be less than price"),
  category: yup.string().required("Category is required"),
  availability: yup
    .number()
    .typeError("Availability must be a number")
    .required("Availability is required")
    .min(0, "Cannot be negative")
    .integer("Must be an integer"),
  warranty: yup
    .number()
    .typeError("Warranty must be a number")
    .min(0, "Minimum 0 months")
    .max(60, "Maximum 60 months")
    .integer("Must be an integer"),
  description: yup.string().required("Description is required"),
  features: yup.string().required("At least one feature is required"),
  isUsed: yup.boolean(),

  imageCover: yup
    .mixed()
    .test("required", "Cover image is required", (value) => {
      return value && value.length > 0;
    }),

  images: yup
    .mixed()
    .test("min-count", "At least 2 images are required", (value) => {
      return value && value.length >= 2;
    }),
});

export const updateProductSchema = yup.object().shape({
  name: yup
    .string()
    .required("Product name is required")
    .min(10, "Name must be at least 10 characters")
    .max(40, "Name must be at most 40 characters"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required"),
  priceDiscount: yup
    .number()
    .typeError("Discount must be a number")
    .max(yup.ref("price"), "Discount must be less than price"),
  category: yup.string().required("Category is required"),
  availability: yup
    .number()
    .typeError("Availability must be a number")
    .required("Availability is required")
    .min(0, "Cannot be negative")
    .integer("Must be an integer"),
  warranty: yup
    .number()
    .typeError("Warranty must be a number")
    .min(0, "Minimum 0 months")
    .max(60, "Maximum 60 months")
    .integer("Must be an integer"),
  description: yup.string().required("Description is required"),
  features: yup.string().required("At least one feature is required"),
  isUsed: yup.boolean(),
});

export const createEmployeeSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("first name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  firstName: yup
    .string()
    .required("last name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(/^07[0,1,2,5-8][0-9]{7}$/, "Invalid Sri Lankan mobile number"),
  role: yup.string().oneOf(["employee", "admin"]).required("Role is required"),
});

export const updateEmployeeSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  lastName: yup
    .string()
    .required("First name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(/^07[0,1,2,5-8][0-9]{7}$/, "Invalid Sri Lankan mobile number"),

  role: yup.string().oneOf(["employee", "admin"]).required("Role is required"),
});

export const updateCustomerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("first name is required")
    .min(2, "first name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("last name is required")
    .min(2, "last name must be at least 2 characters"),

  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),

  shippingAddresses: yup
    .array()
    .of(
      yup.object().shape({
        _id: yup.string().required(), // required for backend update
        street: yup
          .string()
          .required("Street is required")
          .min(2, "Street must be at least 2 characters"),

        city: yup
          .string()
          .required("City is required")
          .min(2, "City must be at least 2 characters"),

        mobileNumber: yup
          .string()
          .required("Mobile number is required")
          .matches(
            /^07[0,1,2,5-8][0-9]{7}$/,
            "Invalid Sri Lankan mobile number",
          ),

        isDefault: yup.boolean().notRequired(),
      }),
    )
    .max(3, "You can only have up to 3 shipping addresses")
    .test(
      "single-default",
      "Only one address can be set as default",
      (addresses = []) => {
        const defaultCount = addresses.filter((addr) => addr.isDefault).length;
        return defaultCount <= 1;
      },
    ),
});

export const heroSlideSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  order: yup
    .number()
    .typeError("Order must be a number")
    .required("Order is required")
    .min(1, "Order must be at least 1")
    .max(10, "Order must be 10 or less"),
  image: yup
    .mixed()
    .test("fileRequired", "Hero slide must have an image", function (value) {
      const isEditing = !!this.options.context?.editingId;
      if (isEditing) return true;
      return value?.[0] instanceof File;
    }),
});

export const settingSchema = yup.object().shape({
  shippingFee: yup
    .number()
    .typeError("Shipping fee must be a number")
    .required("Shipping fee is required")
    .min(0, "Shipping fee must be at least 0"),
});

export const employeeUpdateSchema = yup.object().shape({
  firstName: yup.string().required("first name is required"),
  lastName: yup.string().required("last name is required"),
});

const MAX_FILES = 5;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const CustomerRepairingSchema = yup.object().shape({
  model: yup.string().required("Model is required"),
  brand: yup.string().required("Brand is required"),
  device: yup.string().required("Device is Required"),
  problemDescription: yup.string().required("Problem Description is Required"),
  serialNumber: yup.string().optional(),
  photos: yup
    .mixed()
    // Normalize FileList -> Array<File> so our tests are easy
    .transform((value) => {
      if (!value) return [];
      if (typeof FileList !== "undefined" && value instanceof FileList) {
        return Array.from(value);
      }
      return Array.isArray(value) ? value : [];
    })
    .test("max-count", `You can upload up to ${MAX_FILES} photos`, (files) => {
      if (!files) return true;
      return files.length <= MAX_FILES;
    })
    .test(
      "file-size",
      `Each photo must be smaller than ${MAX_SIZE_BYTES / (1024 * 1024)} MB`,
      (files) => {
        if (!files) return true;
        return files.every((f) => f.size <= MAX_SIZE_BYTES);
      },
    )
    .test(
      "file-type",
      "Only JPG, JPEG, PNG, or WEBP images are allowed",
      (files) => {
        if (!files) return true;
        return files.every((f) => ALLOWED_TYPES.includes(f.type));
      },
    ),
});

export const createRepairJobSchema = yup.object({
  request: yup.string().required("Missing request id"),
  customer: yup.string().required("Missing customer id"),
  note: yup.string().max(500, "Note is too long").optional(),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .nullable()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    ),
  shippingIncluded: yup.boolean().required("Missing shipping fee check box"),
});

//coupons
const num = (label) =>
  yup
    .number()
    .transform((val, originalVal) => (originalVal === "" ? undefined : val))
    .typeError(`${label} must be a number`)
    .min(0, `${label} must be >= 0`)
    .required(`${label} is required`);

export const couponSchema = yup.object({
  code: yup
    .string()
    .trim()
    .required("Coupon code is required")
    .matches(/^[A-Z0-9_-]+$/, "Use only A-Z, 0-9, _ or -"),
  minSubtotal: num("Min subtotal"),
  discountAmount: num("Discount amount"),
  isActive: yup.boolean().default(true),

  // ✅ v1
  expiresAt: yup.string().nullable(),

  // ✅ NEW
  startsAt: yup
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  endsAt: yup
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .test(
      "after-start",
      "End date must be after start date",
      function (endsAt) {
        const { startsAt } = this.parent;
        if (!startsAt || !endsAt) return true;
        return new Date(endsAt) >= new Date(startsAt);
      },
    ),
});
