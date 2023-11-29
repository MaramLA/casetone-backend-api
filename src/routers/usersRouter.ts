import express from 'express'
const router = express.Router()

import * as controller from '../controllers/usersController'
import { userRegistrationValidation } from '../validation/userValidation'
import { runValidation } from '../validation/runValidation'

//GET --> get all users
router.get('/', controller.getAllUsers)

//GET --> get a single user by ID
router.get('/:id', controller.getSingleUser)

//POST --> register a user
router.post('/register', userRegistrationValidation, runValidation, controller.registUser)

//POST --> activate a user
router.post('/activate', controller.activateUser)

//PUT --> update a single user by ID
router.put('/:id', controller.updateUser)

//PUT --> ban a single user by ID
router.put('/ban/:id', controller.banUser)

//PUT --> unban a single user by ID
router.put('/unban/:id', controller.unBanUser)

//PUT --> upgrade single user role to admin
router.put('/admin/:id', controller.upgradeUserRole)

//PUT --> downgrade single user role to admin
router.put('/notadmin/:id', controller.downgradeUserRole)

//DELETE --> delete a single user by ID
router.delete('/:id', controller.deleteUser)

export default router
