const express = require("express");
const {
  getTransaction,
  getTransactionById,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} = require("../controller/transactionController");
const router = express.Router();

router.get("/", getTransaction);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
