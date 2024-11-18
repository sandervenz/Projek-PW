import express from "express";
import uploadMiddleware from "../middlewares/upload.middleware";
import uploadController from "../controllers/upload.controller";
import productsController from "../controllers/products.controller";
import categoriesController from "../controllers/categories.controller";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import rbacMiddleware from "../middlewares/rbac.middleware";
import { createOrder, findAllByUser } from "../controllers/order.controller";

const router = express.Router();

// CRUD Categories
router.get("/categories", categoriesController.findAll);
router.post("/categories", authMiddleware, categoriesController.create);
router.get("/categories/:id", categoriesController.findOne);
router.put("/categories/:id", authMiddleware, categoriesController.update);
router.delete("/categories/:id", authMiddleware, categoriesController.delete);

// CRUD Products
router.get("/products", productsController.findAll);
router.post("/products", authMiddleware, productsController.create);
router.get("/products/:id", productsController.findOne);
router.put("/products/:id", authMiddleware, productsController.update);
router.delete("/products/:id", authMiddleware, productsController.delete);

// Upload routes
router.post("/upload", authMiddleware, uploadMiddleware.single, uploadController.single);
router.post("/uploads", authMiddleware, uploadMiddleware.multiple, uploadController.multiple);

// Auth routes
router.post("/auth/login", authMiddleware, authController.login);
router.post("/auth/register", authController.register);

// Order routes
router.post("/orders", createOrder);
router.get("/orders", findAllByUser);

export default router;
