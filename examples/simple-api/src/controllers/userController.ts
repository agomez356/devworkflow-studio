import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

// In-memory storage (replace with database in production)
const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', createdAt: new Date() },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', createdAt: new Date() },
];

export class UserController {
  /**
   * Get all users
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = users.find((u) => u.id === req.params.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new user
   */
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        res.status(400).json({
          success: false,
          message: 'Name and email are required',
        });
        return;
      }

      const newUser: User = {
        id: String(users.length + 1),
        name,
        email,
        createdAt: new Date(),
      };

      users.push(newUser);

      res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   */
  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userIndex = users.findIndex((u) => u.id === req.params.id);

      if (userIndex === -1) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      const { name, email } = req.body;
      users[userIndex] = {
        ...users[userIndex],
        ...(name && { name }),
        ...(email && { email }),
      };

      res.json({
        success: true,
        data: users[userIndex],
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userIndex = users.findIndex((u) => u.id === req.params.id);

      if (userIndex === -1) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      users.splice(userIndex, 1);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
