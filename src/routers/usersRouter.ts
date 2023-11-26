import express from 'express'
const router = express.Router()

import * as controller from '../controllers/usersController'

//GET --> get all users
router.get('/', controller.getAllUsers)

//GET --> get a single user by ID
router.get('/:id', controller.getSingleUser)

//POST --> register a user
router.post('/register', controller.registUser)

//POST --> activate a user
router.post('/activate', controller.activateUser)

//PUT --> update a single user by ID
router.put('/:id', controller.updateUser)

//DELETE --> delete a single user by ID
router.delete('/:id', controller.deleteUser)

//GET --> search users by name
router.get('/search/:firstName', controller.searchUsers)

export default router
