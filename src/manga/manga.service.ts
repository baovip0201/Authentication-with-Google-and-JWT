/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MangaEntity } from './manga.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Manga } from './manga.interface';
import { Observable, from } from 'rxjs';

@Injectable()
export class MangaService {
    constructor (
        @InjectRepository(MangaEntity)
        private readonly mangaRepository: Repository<MangaEntity>){}

    async createManga(manga: Manga): Promise<Observable<Manga>>{
        return from(this.mangaRepository.save(manga))
    }
}
