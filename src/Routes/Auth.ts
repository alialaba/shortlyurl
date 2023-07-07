import express from 'express';

const router =  express.Router();

import { signup } from '../Controllers/Auth';

router.route("/signup").post(signup);

export default router;