import { Router } from 'express';
import { CarTypeController } from '../controllers/CarTypeController';
import { Application } from 'express';

export class CarTypeRoutes {
  private carTypeController: CarTypeController;
  public router: Router;

  constructor(app: Application) {
    this.carTypeController = new CarTypeController(app);
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/', this.carTypeController.getAllCarTypes);
    this.router.get('/:id', this.carTypeController.getCarTypeById);
    this.router.post('/', this.carTypeController.createCarType);
    this.router.put('/:id', this.carTypeController.updateCarType);
    this.router.delete('/:id', this.carTypeController.deleteCarType);
  }
}
