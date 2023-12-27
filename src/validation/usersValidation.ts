import { check } from 'express-validator'

export const userRegistrationValidation = [
  check('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name must not be empty')
    .isLength({ min: 3, max: 20 })
    .withMessage('First name must be at least 3 charachters')
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'),
  check('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name must not be empty')
    .isLength({ min: 3, max: 20 })
    .withMessage('Last name must be at least 3 characters')
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'),
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Email is not a valid'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty')
    .isLength({ min: 5 })
    .withMessage('password must be at least 5 characters'),
  check('address').trim().notEmpty().withMessage('address must not be empty'),
]

export const userUpdateValidation = [
  check('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name must not be empty')
    .isLength({ min: 3, max: 20 })
    .withMessage('First name must be at least 3 charachters')
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'),
  check('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name must not be empty')
    .isLength({ min: 3, max: 20 })
    .withMessage('Last name must be at least 3 charachters')
    .isLength({ min: 3, max: 20 })
    .withMessage('Last name must be at least 3 characters')
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'),
  check('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Email is not a valid'),
  check('password')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty')
    .isLength({ min: 5 })
    .withMessage('password must be at least 5 characters'),
  check('address').optional().trim().notEmpty().withMessage('address must not be empty'),
]

export const userLoginValidation = [
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Email is not valid'),
  check('password').trim().notEmpty().withMessage('Password must not be empty'),
]

export const userForgetPasswordValidation = [
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Email is not valid'),
]

export const userResetPasswordValidation = [
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty')
    .isLength({ min: 5 })
    .withMessage('password must be at least 5 characters'),
]
