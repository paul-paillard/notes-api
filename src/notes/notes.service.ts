import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './note.interface';

@Injectable()
export class NotesService {
  constructor(private readonly database: DatabaseService) {}

  async create(dto: CreateNoteDto): Promise<Note> {
    const rows = await this.database.query<Note>(
      `INSERT INTO notes (title, content)
       VALUES ($1, $2)
       RETURNING id, title, content, created_at AS "createdAt"`,
      [dto.title, dto.content],
    );
    return rows[0];
  }

  async findAll(): Promise<Note[]> {
    return this.database.query<Note>(
      `SELECT id, title, content, created_at AS "createdAt"
       FROM notes
       ORDER BY created_at DESC`,
    );
  }

  async findOne(id: string): Promise<Note> {
    const rows = await this.database.query<Note>(
      `SELECT id, title, content, created_at AS "createdAt"
       FROM notes
       WHERE id = $1`,
      [id],
    );
    if (rows.length === 0) {
      throw new NotFoundException(`Note ${id} not found`);
    }
    return rows[0];
  }

  async remove(id: string): Promise<void> {
    const rows = await this.database.query<{ id: string }>(
      'DELETE FROM notes WHERE id = $1 RETURNING id',
      [id],
    );
    if (rows.length === 0) {
      throw new NotFoundException(`Note ${id} not found`);
    }
  }
}
