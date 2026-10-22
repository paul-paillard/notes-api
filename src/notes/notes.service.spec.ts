import { NotFoundException } from '@nestjs/common';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(() => {
    service = new NotesService();
  });

  it('creates a note with an id and a creation date', () => {
    const note = service.create({ title: 'Title', content: 'Content' });

    expect(note.id).toBeDefined();
    expect(note.title).toBe('Title');
    expect(note.content).toBe('Content');
    expect(note.createdAt).toBeInstanceOf(Date);
  });

  it('lists the created notes', () => {
    service.create({ title: 'First', content: 'a' });
    service.create({ title: 'Second', content: 'b' });

    expect(service.findAll()).toHaveLength(2);
  });

  it('finds a note by id', () => {
    const created = service.create({ title: 'Title', content: 'Content' });

    expect(service.findOne(created.id)).toEqual(created);
  });

  it('throws NotFoundException for an unknown id', () => {
    expect(() => service.findOne('unknown')).toThrow(NotFoundException);
  });

  it('removes a note', () => {
    const created = service.create({ title: 'Title', content: 'Content' });

    service.remove(created.id);

    expect(service.findAll()).toHaveLength(0);
  });

  it('throws NotFoundException when removing an unknown note', () => {
    expect(() => service.remove('unknown')).toThrow(NotFoundException);
  });
});
