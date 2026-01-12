
import  express  from "express";
import { getUserEmail, login, register } from "../controllers/AuthController";
import { adminOnly, protect } from "../middlewares/AuthMiddleware";
const router = express.Router()

router.post('/register', protect, adminOnly, register);
router.post('/login', login);
router.get('/getUserEmail', protect, getUserEmail);


module.exports = router;