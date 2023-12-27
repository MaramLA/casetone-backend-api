import { Router } from 'express'

import * as controller from '../controllers/ordersController'
import { isAdmin, isLoggedIn } from '../middlewares/authentication'

const router = Router()

//GET --> get all user orders
router.get('/', isLoggedIn, controller.getOrdersForUser)

//GET --> get all orders for an admin
router.get('/all-orders', isLoggedIn, isAdmin, controller.getOrdersForAdmin)

//DELETE --> delete a single order by ID
router.delete('/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, controller.deleteOrder)

//DELETE --> delete all user orders
router.delete(
  '/delete-all/:id([0-9a-fA-F]{24})',
  isLoggedIn,
  isAdmin,
  controller.deleteAllUserOrders
)

//PUT --> update a single order by ID
router.put('/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, controller.updateOrder)

export default router
