import { IIndicate, IIndicateInsight } from 'src/types/indicates.type';
import { IReponse } from 'src/types/response.type';
import { IndicateService } from './indicates.service';
export declare class IndicateController {
    private readonly indicateService;
    constructor(indicateService: IndicateService);
    getAll(): Promise<IReponse<IIndicate[]>>;
    getByName(name: string): Promise<IReponse<IIndicateInsight>>;
}
