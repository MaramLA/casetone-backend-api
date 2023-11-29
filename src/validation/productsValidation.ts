import { check } from 'express-validator'

export const productValidation = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name must not be empty')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .isLength({ max: 150 })
    .withMessage('Name must be less than 150 characters'),
  check('price')
    .trim()
    .notEmpty()
    .withMessage('Price must not be empty')
    .isFloat({ min: 1 })
    .withMessage('Price Must be a positive number'),
  check('image')
    .trim()
    .notEmpty()
    .withMessage('Image must not be empty'),
    // .isURL()
    // .withMessage('Image must be in a URL format'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Description must not be empty')
    .isLength({ min: 3 })
    .withMessage('Description must be at least 3 characters')
    .isLength({ max: 300 })
    .withMessage('Description must be less than 300 characters'),
  check('categories').trim()
  .notEmpty()
  .withMessage('At least 1 category must be selected'),
  check('quantity').trim().default(1).isInt().withMessage('Quantity must be non-decimal number'),
  check('sold').trim().default(0).isInt().withMessage('Sold must be non-decimal number'),
]
