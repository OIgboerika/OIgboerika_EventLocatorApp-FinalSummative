const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createCategoryValidation,
  updateCategoryValidation,
} = require("../middleware/validators/categoryValidators");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get("/:id", getCategoryById);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  isAdmin,
  createCategoryValidation,
  validate,
  createCategory
);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category (admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 maxLength: 200
 *               icon:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin)
 */
router.put(
  "/:id",
  authenticate,
  isAdmin,
  updateCategoryValidation,
  validate,
  updateCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category (admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 maxLength: 200
 *               icon:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Category not found
 */
router.delete("/:id", authenticate, isAdmin, deleteCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category (admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Category not found
 */

module.exports = router;
