import { prisma } from "../database/prisma";
export const getAllNotes = async () => {
    return prisma.note.findMany({ orderBy: { createdAt: "desc" } });
};
export const getNoteById = async (id) => {
    return prisma.note.findUnique({ where: { id } });
};
export const createNote = async (payload) => {
    return prisma.note.create({ data: payload });
};
export const updateNote = async (id, payload) => {
    return prisma.note.update({
        where: { id },
        data: payload
    });
};
export const deleteNote = async (id) => {
    return prisma.note.delete({ where: { id } });
};
