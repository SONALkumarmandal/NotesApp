import { Router } from "express";
import { createNote } from "../controllers/utils.controller";
import { getAppHealth, getAppInfo, getEnv } from "../controllers/info.controller";
const router = Router();
router.get("/aapinfo", getAppInfo);
router.get("/apphealth", getAppHealth);
router.get("/getenv", getEnv);
router.post("/create", createNote);
export default router;
//# sourceMappingURL=noteRoutes.js.map