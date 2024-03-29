import express from 'express'

import * as controller from '../controllers/usersController'

import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/authentication'

import { runValidation } from '../validation/runValidation'
import * as validation from '../validation/usersValidation'

const router = express.Router()

//GET --> get all users
router.get('/', controller.getAllUsers)
//GET --> get a single user by ID
router.get('/profile', isLoggedIn, controller.getSingleUser)
//POST --> register a user
router.post(
  '/register',
  validation.userRegistrationValidation,
  runValidation,
  controller.registUser
)
//POST --> activate a user
router.post('/activate', controller.activateUser)
//PUT --> update a single user by ID
router.put(
  '/profile',
  isLoggedIn,
  validation.userUpdateValidation,
  runValidation,
  controller.updateUser
)
//PUT --> ban a single user by ID
router.put('/ban/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, controller.banUser)

//PUT --> unban a single user by ID
router.put('/unban/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, controller.unBanUser)

//PUT --> upgrade single user role to admin
router.put('/admin/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, controller.upgradeUserRole)

//PUT --> downgrade single admin role to user
router.put('/notadmin/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, controller.downgradeUserRole)

//DELETE --> delete a single user by ID
router.delete('/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, controller.deleteUser)

//POST --> send reset email when forget password
router.post(
  '/forget-password',
  validation.userForgetPasswordValidation,
  runValidation,
  controller.forgetPassword
)

//POST --> reset password
router.post(
  '/reset-password',
  validation.userResetPasswordValidation,
  runValidation,
  controller.resetPassword
)

export default router
