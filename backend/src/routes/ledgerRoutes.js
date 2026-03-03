const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  addLedgerEntry,
  getLedgerHistory
} = require("../controllers/ledgerController");

router.post("/", protect, addLedgerEntry);
router.get("/:partyId", protect, getLedgerHistory);

module.exports = router;