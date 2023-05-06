import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MangaController } from './manga.controller';
import { MangaEntity } from './manga.entity';
import { MangaService } from './manga.service';

@Module({
  imports: [TypeOrmModule.forFeature([MangaEntity])],
  controllers: [MangaController],
  providers: [MangaService],
})
export class MangaModule {}
