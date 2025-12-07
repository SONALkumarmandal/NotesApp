export interface CreateNoteDTO {
  title: string;
  content?: string;
}

export interface UpdateNoteDTO {
  title?: string;
  content?: string;
}
