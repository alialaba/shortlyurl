import express from 'express';

const router =  express.Router();

import { signup,login } from '../Controllers/Auth';

router.route("/signup").post(signup);
router.route("/login").post(login);

export default router;