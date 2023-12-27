import { Router } from 'express'

import * as controller from '../controllers/categoriesController'

import { isAdmin, isLoggedIn } from '../middlewares/authentication'

import { categoryValidation } from '../validation/categoriesValidation'
import { runValidation } from '../validation/runValidation'

const router = Router()

//GET --> get all categories
router.get('/', controller.getAllCategories)

//GET --> get a single category by ID
router.get('/:id([0-9a-fA-F]{24})', controller.getSingleCategory)

//POST --> create a category
router.post('/', isLoggedIn, isAdmin, categoryValidation, runValidation, controller.createCategory)

//DELETE --> delete a single category by ID
router.delete('/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, controller.deleteCategory)

//PUT --> update a single category by ID
router.put(
  '/:id([0-9a-fA-F]{24})',
  isLoggedIn,
  isAdmin,
  categoryValidation,
  runValidation,
  controller.updateCategory
)

export default router
