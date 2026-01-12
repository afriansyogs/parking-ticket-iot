const { createTicket, checkFee, getAllTickets, payTicket } = require("../controllers/TicketController");
import  express  from "express";
import { protect } from "../middlewares/AuthMiddleware";
import { searchTicketById, totalParking } from "../controllers/TicketController";
const router = express.Router()

// router.get('/ticket-stash', protect, getDashboardTicketStats);
router.get('/ticket-stream', protect, createTicket);
router.get('/total-parking', protect, totalParking);
router.get('/allTicket', protect, getAllTickets);
router.get('/searchTicket', protect, searchTicketById);
router.get('/check-fee/:id', protect, checkFee);
router.patch('/pay/', protect, payTicket);

module.exports = router;