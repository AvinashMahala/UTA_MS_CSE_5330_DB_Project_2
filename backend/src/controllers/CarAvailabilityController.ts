import { Request, Response } from 'express';
import { CarAvailabilityService } from '../services/CarAvailabilityService';
import { Application } from 'express';

export class CarAvailabilityController {
  private carAvailabilityService: CarAvailabilityService;

  constructor(app: Application) {
    this.carAvailabilityService = new CarAvailabilityService(app);
  }

  public getAllCarAvailabilities = async (req: Request, res: Response): Promise<void> => {
    const carAvailabilities = await this.carAvailabilityService.getAllCarAvailabilities();
    res.json(carAvailabilities);
  };

  public getCarAvailabilityById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const carAvailability = await this.carAvailabilityService.getCarAvailabilityById(id);
    res.json(carAvailability);
  };

  public createCarAvailability = async (req: Request, res: Response): Promise<void> => {
    const carAvailability = await this.carAvailabilityService.createCarAvailability(req.body);
    res.status(201).json(carAvailability);
  };

  public updateCarAvailability = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const carAvailability = await this.carAvailabilityService.updateCarAvailability(id, req.body);
    res.json(carAvailability);
  };

  public deleteCarAvailability = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    await this.carAvailabilityService.deleteCarAvailability(id);
    res.sendStatus(204);
  };
}
