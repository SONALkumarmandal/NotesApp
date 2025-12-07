import { Router } from "express";
import { getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote } from "../controllers/utils.controller";
import { getAppHealth, getAppInfo, getEnv } from "../controllers/info.controller";

const router =Router()

router.get("/aapinfo" , getAppInfo)
router.get("/apphealth" , getAppHealth)
router.get("/getenv" ,getEnv)

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);


export default router