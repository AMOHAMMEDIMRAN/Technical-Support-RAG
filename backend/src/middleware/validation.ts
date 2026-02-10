import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array().map((err) => ({
        field: err.type === "field" ? err.path : undefined,
        message: err.msg,
      })),
    });
  }

  next();
};

// Auth validation rules
export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

export const registerValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("firstName").notEmpty().trim().withMessage("First name is required"),
  body("lastName").notEmpty().trim().withMessage("Last name is required"),
  validate,
];

// Organization validation
export const createOrganizationValidation = [
  body("name").notEmpty().trim().withMessage("Organization name is required"),
  body("domain")
    .notEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Domain is required"),
  validate,
];

// User validation
export const createUserValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("firstName").notEmpty().trim().withMessage("First name is required"),
  body("lastName").notEmpty().trim().withMessage("Last name is required"),
  body("role").notEmpty().withMessage("Role is required"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

export const updateUserValidation = [
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("firstName").optional().notEmpty().trim(),
  body("lastName").optional().notEmpty().trim(),
  body("role").optional().notEmpty(),
  body("status").optional().notEmpty(),
  validate,
];

// Chat validation
export const createChatValidation = [
  body("title").optional().trim(),
  body("message").notEmpty().trim().withMessage("Message is required"),
  validate,
];

export const sendMessageValidation = [
  body("message").notEmpty().trim().withMessage("Message is required"),
  validate,
];

// Document validation
export const updateDocumentValidation = [
  body("accessLevel").optional().notEmpty(),
  body("allowedRoles").optional().isArray(),
  body("allowedUsers").optional().isArray(),
  body("metadata.description").optional().trim(),
  body("metadata.tags").optional().isArray(),
  body("metadata.category").optional().trim(),
  validate,
];

// Pagination validation
export const paginationValidation = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("sortBy").optional().trim(),
  query("sortOrder").optional().isIn(["asc", "desc"]),
  validate,
];

// ID validation
export const idValidation = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  validate,
];
