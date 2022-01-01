const { v4: uuidv4 } = require("uuid");
const fs = require("fs/promises");

const readDB = async (path) => {
  const data = await fs.readFile(path, "utf-8");
  return JSON.parse(data);
};

const saveTransaction = (data) => {
  fs.writeFile("./dbs/transactions.json", JSON.stringify(data));
};

const searchCategory = async (categoryId) => {
  const categories = await readDB("./dbs/categories.json");
  return categories.find((ele) => ele.id === categoryId);
};

const commentIsProvided = (comment) =>
  comment !== undefined && comment !== null && String(comment).trim() !== "";
//Transactions

// {
//   id(type: string, format: uuid): "uuid",
//   payee(type: string, required): "Transportation",
//   date(type: date, required format: date): "2021-02-21"
//   amount(type:number, required): 200,
//   categoryId:(type:string, format: uuid, required): "uuid"
//   comment:(type: string): "Comment",
// }

// Create

// GET /transactions
// parameter: none
// response:
// 200 OK {message: "success", transactions: [{id, payee, amount, categoryId, comment}]}
// 500 Internal Server Error {message: "Internal Server Error"}

const getTransaction = async (req, res, next) => {
  try {
    const transactions = await readDB("./dbs/transactions.json");
    const categories = await readDB("./dbs/categories.json");
    const temp = transactions.map(({ categoryId, ...data }) => {
      const cat = categories.find((ele) => ele.id === categoryId);
      // const categories = await searchCategory(categoryId);
      data.category = cat;
      return data;
    });
    res.json({ transactions: temp });
  } catch (err) {
    next(err);
  }
};

// GET /transactions/:id
// parameter: path { id }
// response:
// 200 OK {message: "success", transaction: {id, payee, amount, categoryId, comment}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}
const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transactions = await readDB("./dbs/transactions.json");
    const categories = await readDB("./dbs/categories.json");
    const oldTransactions = transactions.find((item) => item.id === id);
    if (oldTransactions === undefined) {
      return res.json({ transaction: null });
    }
    const { categoryId, ...originalTransaction } = oldTransactions;

    const category = await searchCategory(categoryId);

    res.json({ transaction: { ...originalTransaction, category } ?? null });
  } catch (err) {
    next(err);
  }
};
// POST /transactions/
// parameter: body { payee, amount, categoryId, comment, date }
// response:
// 201 Created {message: "success", transaction: {id, payee, amount, categoryId, comment, date}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

const createTransaction = async (req, res, next) => {
  try {
    const { payee, amount, categoryId, comment, date } = req.body;

    if (typeof payee !== "string") {
      return res.status(400).json({ message: "payee must be a string" });
    }
    if (payee.trim() === "") {
      return res.status(400).json({ message: "payee is required" });
    }
    if (typeof categoryId !== "string") {
      return res.status(400).json({ message: "categoryId must be a string" });
    }
    if (typeof amount !== "number") {
      return res.status(400).json({ message: "amount must be a number" });
    }
    if (amount < 0) {
      return res.status(400).json({ message: "amount must be greater than 0" });
    }
    if (date === undefined) {
      return res.status(400).json({ message: "date is required" });
    }
    if (isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: "date is invalid format" });
    }

    const categories = await readDB("./dbs/categories.json");
    const categoryIndex = categories.findIndex(
      (item) => item.id === categoryId
    );

    if (categoryIndex === -1) {
      return res.status(400).json({ message: "Category not exist" });
    }

    const newTransaction = {
      id: uuidv4(),
      payee,
      amount,
      categoryId,
      date: new Date(date),
    };
    const transactions = await readDB("./dbs/transactions.json");

    if (commentIsProvided(comment)) {
      newTransaction.comment = comment;
    }

    transactions.push(newTransaction);
    console.log(newTransaction);
    // await saveTransaction(transactions);
    res.json({ transaction: newTransaction });
  } catch (error) {
    next(error);
  }
};

// PUT /transactions/:id
// parameter: body { payee, amount, categoryId, comment }
// response:
// 200 Created {message: "success", transaction: {id, payee, amount, categoryId, comment}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payee, amount, categoryId, comment } = req.body;

    if (typeof payee !== "string") {
      return res.status(400).json({ message: "payee must be a string" });
    }
    if (payee.trim() === "") {
      return res.status(400).json({ message: "payee is required" });
    }
    if (typeof categoryId !== "string") {
      return res.status(400).json({ message: "categoryId must be a string" });
    }
    if (categoryId.trim() === "") {
      return res.status(400).json({ message: "categoryId is required" });
    }
    if (typeof amount !== "number" && !isNaN(amount)) {
      return res.status(400).json({ message: "amount must be a number" });
    }
    if (amount < 0) {
      return res.status(400).json({ message: "amount must be greater than 0" });
    }

    const categories = await readDB("./dbs/categories.json");
    const categoryIndex = categories.findIndex(
      (item) => item.id === categoryId
    );

    if (categoryIndex === -1) {
      return res.status(400).json({ message: "Category not exist" });
    }

    const oldTransactions = await readDB("./dbs/transactions.json");
    const transactionIndex = oldTransactions.findIndex(
      (item) => item.id === id
    );

    if (transactionIndex === -1) {
      return res.status(400).json({ message: "id is not found" });
    }

    const newTransaction = { id: uuidv4(), payee, amount, categoryId };

    if (commentIsProvided(comment)) {
      newTransaction.comment = comment;
    }

    oldTransactions[transactionIndex] = newTransaction;

    await saveTransaction(oldTransactions);
    res.json({ transaction: newTransaction });
  } catch (error) {
    next(error);
  }
};

// DELETE /transactions/:id
// parameter: {}
// response:
// 204 no content {message: "success", transaction: {id, payee, amount, categoryId, comment}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldTransactions = await readDB("./dbs/transactions.json");
    const idx = oldTransactions.findIndex((item) => item.id === id);
    if (idx === -1) {
      return res.status(400).json({ message: "id not found" });
    }
    oldTransactions.splice(idx, 1);
    await saveTransaction(oldTransactions);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransaction,
  getTransactionById,
  createTransaction,
  deleteTransaction,
  updateTransaction,
};
