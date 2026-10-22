import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @MaxLength(10000)
  content!: string;
}
