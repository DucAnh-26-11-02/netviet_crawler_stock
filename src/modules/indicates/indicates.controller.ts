import { Controller, Get, Param } from '@nestjs/common';
import { IIndicate, IIndicateInsight } from 'src/types/indicates.type';
import { IReponse } from 'src/types/response.type';
import { IndicateService } from './indicates.service';

@Controller('indicates')
export class IndicateController {
  constructor(private readonly indicateService: IndicateService) {}

  @Get('')
  public async getAll(): Promise<IReponse<IIndicate[]>> {
    try {
      const all = await this.indicateService.getAll();
      return {
        success: true,
        data: all,
      };
    } catch (e) {
      console.log(e);

      return {
        success: false,
        error: e.message,
      };
    }
  }

  @Get(':name')
  public async getByName(@Param('name') name: string): Promise<IReponse<IIndicateInsight>> {
    try {
      const data = await this.indicateService.getIndexes(name);
      return {
        success: true,
        data,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        error: e.message,
      };
    }
  }
}
