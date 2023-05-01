import { Request, Response } from 'express';
import { CarService } from '../services/CarService';
import { Application } from 'express';

export class CarController {
  private carService: CarService;

  constructor(app: Application) {
    this.carService = new CarService(app);
  }

  public getAllCars = async (req: Request, res: Response): Promise<void> => {
    const cars = await this.carService.getAllCars();
    res.json(cars);
  };

  public getCarById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const car = await this.carService.getCarById(id);
    res.json(car);
  };

  public createCar = async (req: Request, res: Response): Promise<void> => {
    const car = await this.carService.createCar(req.body);
    res.status(201).json(car);
  };

  public updateCar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const car = await this.carService.updateCar(id, req.body);
    res.json(car);
  };

  public deleteCar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    await this.carService.deleteCar(id);
    res.sendStatus(204);
  };
}
