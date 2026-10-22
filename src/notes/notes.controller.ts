import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import type { Note } from './note.interface';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() dto: CreateNoteDto): Note {
    return this.notesService.create(dto);
  }

  @Get()
  findAll(): Note[] {
    return this.notesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Note {
    return this.notesService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.notesService.remove(id);
  }
}
