import { Router } from 'express';
import { CarAvailabilityController } from '../controllers/CarAvailabilityController';
import { Application } from 'express';

export class CarAvailabilityRoutes {
  private carAvailabilityController: CarAvailabilityController;
  public router: Router;

  constructor(app: Application) {
    this.carAvailabilityController = new CarAvailabilityController(app);
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/', this.carAvailabilityController.getAllCarAvailabilities);
    this.router.get('/:id', this.carAvailabilityController.getCarAvailabilityById);
    this.router.post('/', this.carAvailabilityController.createCarAvailability);
    this.router.patch('/:id', this.carAvailabilityController.updateCarAvailability);
    this.router.delete('/:id', this.carAvailabilityController.deleteCarAvailability);
  }
}
