const { Category } = require("../models");

const createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const category = await Category.create({
      name,
      description,
      icon,
    });

    res.status(201).json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });

    res.json({
      status: "success",
      data: { categories },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Event,
          as: "events",
          through: { attributes: [] },
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    res.json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    const { name, description, icon } = req.body;

    await category.update({
      name,
      description,
      icon,
    });

    res.json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    await category.destroy();

    res.json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
