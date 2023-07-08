import express from 'express';

const router =  express.Router();
import { protect } from '../Middlewares/auth';

import { shortenUrl, redirectUrl, deleteUrl } from '../Controllers/Url';


router.route("/create").post(protect,  shortenUrl);
router.route("/url/:urlId").get(protect, redirectUrl);
router.route("/url/:urlId").delete(protect, deleteUrl);

export default router;