import { prisma } from "../database/prisma";
import { CreateNoteDTO, UpdateNoteDTO } from "../types/notes";

export const getAllNotes = async () => {
  return prisma.note.findMany({ orderBy: { createdAt: "desc" } });
};

export const getNoteById = async (id: number) => {
  return prisma.note.findUnique({ where: { id } });
};

export const createNote = async (payload: CreateNoteDTO) => {
  return prisma.note.create({ data: payload });
};

export const updateNote = async (id: number, payload: UpdateNoteDTO) => {
  return prisma.note.update({
    where: { id },
    data: payload
  });
};

export const deleteNote = async (id: number) => {
  return prisma.note.delete({ where: { id } });
};
