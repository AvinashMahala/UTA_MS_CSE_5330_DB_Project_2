import { Router } from 'express';
import { CarController } from '../controllers/CarController';
import { Application } from 'express';

export class CarRoutes {
  private carController: CarController;
  public router: Router;

  constructor(app: Application) {
    this.carController = new CarController(app);
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/', this.carController.getAllCars);
    this.router.get('/:id', this.carController.getCarById);
    this.router.post('/', this.carController.createCar);
    this.router.patch('/:id', this.carController.updateCar);
    this.router.delete('/:id', this.carController.deleteCar);
  }
}
