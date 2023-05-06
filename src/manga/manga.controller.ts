import { Controller, Post, Get, Patch, Delete, Body } from '@nestjs/common';
import { MangaService } from './manga.service';
import { Manga } from './manga.interface';
import { Observable } from 'rxjs/internal/Observable';

@Controller('manga')
export class MangaController {
  constructor(private mangaServive: MangaService) {}
  @Post()
  async create(@Body() manga: Manga): Promise<Observable<Manga>> {
    return this.mangaServive.createManga(manga);
  }
}
