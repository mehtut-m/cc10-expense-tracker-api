const { v4: uuidv4 } = require("uuid");
const fs = require("fs/promises");

const readCategory = async () => {
  const data = await fs.readFile("./dbs/categories.json", "utf-8");
  return JSON.parse(data);
};

const saveCategory = (data) => {
  fs.writeFile("./dbs/categories.json", JSON.stringify(data));
};

const readDB = async (path) => {
  const data = await fs.readFile(path, "utf-8");
  return JSON.parse(data);
};

const searchCategory = async (categoryId) => {
  const categories = await readDB("./dbs/categories.json");
  return categories.find((ele) => ele.id === categoryId);
};

const isCategoryInUse = async (categoryId) => {
  const transactions = await readDB("./dbs/transactions.json");
  return (
    transactions.find((ele) => ele.categoryId === categoryId) !== undefined
  );
};

// GET /transactions
// parameter: none
// response:
// 200 OK {message: "success", transactions: [{id, title, type}]}
// 500 Internal Server Error {message: "Internal Server Error"}

const getCategory = async (req, res, next) => {
  try {
    const categories = await readCategory();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// GET /transactions/:id
// parameter: path {id}
// response:
// 200 OK {message: "success", transaction: {id, title, type}}
// 500 Internal Server Error {message: "Internal Server Error"}

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categories = await readCategory();
    const item = categories.find((item) => item.id === id);
    res.json({ category: item ?? null });
  } catch (err) {
    next(err);
  }
};

// Create

// POST /transactions/
// parameter: body { title, type }
// response:
// 201 Created {message: "success", transaction: {id, title, type}}
// 400 BadRequest {message: "title is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

const createCategory = async (req, res, next) => {
  try {
    const { title, type } = req.body;

    if (typeof title !== "string") {
      return res.status(400).json({ message: "title must be a string" });
    }
    if (title.trim() === "") {
      return res.status(400).json({ message: "title is required" });
    }
    if (typeof type !== "string") {
      return res.status(400).json({ message: "type must be a string" });
    }
    if (type.trim() === "") {
      return res.status(400).json({ message: "type is required" });
    }
    if (type.toUpperCase() !== "EXPENSE" && type.toUpperCase() !== "INCOME") {
      return res
        .status(400)
        .json({ message: "type must be EXPENSE or INCOME" });
    }

    const newCategory = { id: uuidv4(), title, type: type.toUpperCase() };
    const categories = await readCategory();

    categories.push(newCategory);
    await saveCategory(categories);
    res.json({ category: newCategory });
  } catch (error) {
    next(error);
  }
};

// Update

// PUT /transactions/:id
// parameter: body { title, type }
// response:
// 200 OK {message: "success", transaction: {id, title, type}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, type } = req.body;

    if (typeof title !== "string") {
      return res.status(400).json({ message: "title must be a string" });
    }
    if (title.trim() === "") {
      return res.status(400).json({ message: "title is required" });
    }
    if (typeof type !== "string") {
      return res.status(400).json({ message: "type must be a string" });
    }
    if (type.trim() === "") {
      return res.status(400).json({ message: "type is required" });
    }
    if (type.toUpperCase() !== "EXPENSE" && type.toUpperCase() !== "INCOME") {
      return res
        .status(400)
        .json({ message: "type must be EXPENSE or INCOME" });
    }

    const categories = await readCategory();
    const idx = categories.findIndex((item) => item.id === id);

    if (idx === -1) {
      return res
        .status(400)
        .json({ message: "category with this id is not found" });
    }
    const newCategory = { ...categories[idx], title, type: type.toUpperCase() };
    categories[idx] = newCategory;
    saveCategory(categories);
    res.json({ category: categories[idx] });
  } catch (error) {
    next(error());
  }
};

// Delete

// DELETE /transactions/:id
// parameter: path { id }
// response:
// 204 No Content {message: "success"}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}
const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const category = await searchCategory(id);

  if (category === undefined) {
    return res
      .status(404)
      .json({ message: "category with this id does not exist" });
  }
  console.log(await isCategoryInUse(id));

  if (await isCategoryInUse(id)) {
    return res
      .status(400)
      .json({ message: "This category is bounded to transactions" });
  }
  const categories = await readDB("./dbs/categories.json");
  const idx = categories.findIndex((el) => el.id === id);
  categories.splice(idx, 1);
  saveCategory(categories);
  res.status(204).send();
};

module.exports = {
  getCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
