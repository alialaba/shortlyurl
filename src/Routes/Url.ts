import express from 'express';

const router =  express.Router();
import { protect } from '../Middlewares/auth';
// import convertToCustomRequest from '../Middlewares/convertToCustomReq';

import { shortenUrl } from '../Controllers/Url';

router.route("/short").post(protect,  shortenUrl)

export default router;