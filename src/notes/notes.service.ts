import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateNoteDto } from './dto/create-note.dto';
import type { Note } from './note.interface';

@Injectable()
export class NotesService {
  private readonly notes = new Map<string, Note>();

  create(dto: CreateNoteDto): Note {
    const note: Note = {
      id: randomUUID(),
      title: dto.title,
      content: dto.content,
      createdAt: new Date(),
    };
    this.notes.set(note.id, note);
    return note;
  }

  findAll(): Note[] {
    return [...this.notes.values()];
  }

  findOne(id: string): Note {
    const note = this.notes.get(id);
    if (!note) {
      throw new NotFoundException(`Note ${id} not found`);
    }
    return note;
  }

  remove(id: string): void {
    if (!this.notes.delete(id)) {
      throw new NotFoundException(`Note ${id} not found`);
    }
  }
}
