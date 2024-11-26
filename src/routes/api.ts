import express from "express";
import uploadMiddleware from "../middlewares/upload.middleware";
import uploadController from "../controllers/upload.controller";
import productsController from "../controllers/products.controller";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { createOrder, findAllOrders } from "../controllers/order.controller";
import { changeOrderStatus } from '../controllers/status.controller';

const router = express.Router();

// CRUD Products
router.get("/products", productsController.findAll);
router.post("/products", authMiddleware, productsController.create);
router.get("/products/:id", productsController.findOne);
router.put("/products/:id", authMiddleware, productsController.update);
router.delete("/products/:id", authMiddleware, productsController.delete);

// Upload routes
router.post("/upload", uploadMiddleware.single, uploadController.single);
router.post("/uploads", uploadMiddleware.multiple, uploadController.multiple);

// Auth routes
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.put("/auth/update-profile", authMiddleware, authController.profile);

// Order routes
router.post("/orders", createOrder);
router.get("/orders", findAllOrders);
// Status order
router.patch('/orders/:id/status', authMiddleware, changeOrderStatus);

export default router;