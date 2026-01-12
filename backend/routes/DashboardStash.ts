const { getDashboardTicketStats } = require("../controllers/DashboardStashController");
import  express  from "express";
import { protect } from "../middlewares/AuthMiddleware";
import { getRevenueLastWeek, getSlotParking } from "../controllers/DashboardStashController";
const router = express.Router()

router.get('/stash', protect, getDashboardTicketStats);
router.get('/ravenueLastWeek', protect, getRevenueLastWeek);
router.get('/slotKosong', protect, getSlotParking);

module.exports = router;