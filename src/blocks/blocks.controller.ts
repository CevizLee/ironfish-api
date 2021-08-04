/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UnprocessableEntityException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { List } from '../common/interfaces/list';
import { BlocksService } from './blocks.service';
import { BlocksQueryDto } from './dto/blocks-query.dto';
import { CreateBlocksDto } from './dto/create-blocks.dto';
import { Block } from '.prisma/client';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  async bulkCreate(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transform: true,
      }),
    )
    blocks: CreateBlocksDto,
  ): Promise<List<Block>> {
    return {
      data: await this.blocksService.bulkUpsert(blocks),
    };
  }

  @Get('head')
  async head(): Promise<Block> {
    return this.blocksService.head();
  }

  @Get()
  async list(
    @Query(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transform: true,
      }),
    )
    { start, end }: BlocksQueryDto,
  ): Promise<List<Block>> {
    const maxBlocksToReturn = 1000;
    if (start >= end) {
      throw new UnprocessableEntityException(
        `'start' must be strictly less than 'end'.`,
      );
    }
    if (end - start > maxBlocksToReturn) {
      throw new UnprocessableEntityException(
        `Range is too long. Max sequence difference is ${maxBlocksToReturn}.`,
      );
    }
    return {
      data: await this.blocksService.list(start, end),
    };
  }
}