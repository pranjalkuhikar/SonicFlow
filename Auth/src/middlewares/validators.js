import { check, validationResult } from "express-validator";

const registerValidation = [
  check("firstName").trim().notEmpty().withMessage("First name is required"),
  check("lastName").trim().notEmpty().withMessage("Last name is required"),
  check("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  check("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const loginValidation = [
  check("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  check("password").isString().notEmpty().withMessage("Password is required"),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

export const registerValidator = [...registerValidation, handleValidation];
export const loginValidator = [...loginValidation, handleValidation];
