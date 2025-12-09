export interface CreateNoteDTO {
  title: string;
  content?: string;
  tags?: string[];
}

export interface UpdateNoteDTO {
  title?: string;
  content?: string;
  tags?: string[];
}
