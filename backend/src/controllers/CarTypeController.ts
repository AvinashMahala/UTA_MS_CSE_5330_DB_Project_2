import { Request, Response } from 'express';
import { CarTypeService } from '../services/CarTypeService';
import { Application } from 'express';

export class CarTypeController {
  private carTypeService: CarTypeService;

  constructor(app: Application) {
    this.carTypeService = new CarTypeService(app);
  }

  public getAllCarTypes = async (req: Request, res: Response): Promise<void> => {
    const carTypes = await this.carTypeService.getAllCarTypes();
    res.json(carTypes);
  };

  public getCarTypeById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const carType = await this.carTypeService.getCarTypeById(id);
    res.json(carType);
  };

  public createCarType = async (req: Request, res: Response): Promise<void> => {
    const carType = await this.carTypeService.createCarType(req.body);
    res.status(201).json(carType);
  };

  public updateCarType = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const carType = await this.carTypeService.updateCarType(id, req.body);
    res.json(carType);
  };

  public deleteCarType = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    await this.carTypeService.deleteCarType(id);
    res.sendStatus(204);
  };
}
