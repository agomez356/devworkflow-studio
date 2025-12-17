import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

/**
 * @route GET /api/users
 * @description Get all users
 */
router.get('/', userController.getAllUsers);

/**
 * @route GET /api/users/:id
 * @description Get user by ID
 */
router.get('/:id', userController.getUserById);

/**
 * @route POST /api/users
 * @description Create new user
 */
router.post('/', userController.createUser);

/**
 * @route PUT /api/users/:id
 * @description Update user
 */
router.put('/:id', userController.updateUser);

/**
 * @route DELETE /api/users/:id
 * @description Delete user
 */
router.delete('/:id', userController.deleteUser);

export { router as userRoutes };
