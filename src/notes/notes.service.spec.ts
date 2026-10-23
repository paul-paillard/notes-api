import { NotFoundException } from '@nestjs/common';
import type { DatabaseService } from '../database/database.service';
import type { Note } from './note.interface';
import { NotesService } from './notes.service';

const note: Note = {
  id: '3f2b8c1e-5d4a-4b7e-9c1a-2e6f8a0b4d12',
  title: 'Title',
  content: 'Content',
  createdAt: new Date('2026-01-01T10:00:00Z'),
};

function serviceReturning(rows: unknown[]): NotesService {
  const database = {
    query: () => Promise.resolve(rows),
  } as unknown as DatabaseService;
  return new NotesService(database);
}

describe('NotesService', () => {
  it('returns the note created in the database', async () => {
    const service = serviceReturning([note]);

    await expect(
      service.create({ title: 'Title', content: 'Content' }),
    ).resolves.toEqual(note);
  });

  it('lists the notes', async () => {
    const service = serviceReturning([note, note]);

    await expect(service.findAll()).resolves.toHaveLength(2);
  });

  it('finds a note by id', async () => {
    const service = serviceReturning([note]);

    await expect(service.findOne(note.id)).resolves.toEqual(note);
  });

  it('throws NotFoundException when the note does not exist', async () => {
    const service = serviceReturning([]);

    await expect(service.findOne(note.id)).rejects.toThrow(NotFoundException);
  });

  it('removes an existing note', async () => {
    const service = serviceReturning([{ id: note.id }]);

    await expect(service.remove(note.id)).resolves.toBeUndefined();
  });

  it('throws NotFoundException when removing an unknown note', async () => {
    const service = serviceReturning([]);

    await expect(service.remove(note.id)).rejects.toThrow(NotFoundException);
  });
});
