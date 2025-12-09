import { Request, Response, NextFunction } from "express";
import * as noteService from "../services/notes.service";
import { respond } from "../utils/respond";

export const getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await noteService.getAllNotes();
    return respond(res, 200, notes);
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const note = await noteService.getNoteById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    return respond(res, 200, note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const newNote = await noteService.createNote({ title, content, tags });
    return respond(res, 201, newNote);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const { title, content, tags } = req.body;
    const updated = await noteService.updateNote(id, { title, content, tags });
    return respond(res, 200, updated);
  } catch (err: any) {
    // If note not found prisma will throw; convert to 404
    if (err?.code === "P2025") {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    next(err);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const result = await noteService.deleteNote(id);
    return respond(res, 200, result);
  } catch (err: any) {
    if (err?.code === "P2025") {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    next(err);
  }
};
