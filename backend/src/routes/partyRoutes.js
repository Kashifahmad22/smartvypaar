const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createParty,
  getParties,
  getPartyById
} = require("../controllers/partyController");

router.post("/", protect, createParty);
router.get("/", protect, getParties);
router.get("/:id", protect, getPartyById);

module.exports = router;