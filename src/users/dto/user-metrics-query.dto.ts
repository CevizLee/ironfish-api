/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Type } from 'class-transformer';
import { IsDate, IsEnum, ValidateIf } from 'class-validator';
import { MetricsGranularity } from '../../common/enums/metrics-granularity';

export class UserMetricsQueryDto {
  @ValidateIf((o: UserMetricsQueryDto) => Boolean(o.end))
  @IsDate()
  @Type(() => Date)
  readonly start?: Date;

  @ValidateIf((o: UserMetricsQueryDto) => Boolean(o.start))
  @IsDate()
  @Type(() => Date)
  readonly end?: Date;

  @IsEnum(MetricsGranularity)
  readonly granularity!: MetricsGranularity;
}