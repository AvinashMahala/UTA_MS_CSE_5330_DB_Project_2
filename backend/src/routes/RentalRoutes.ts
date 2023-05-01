import { Router } from 'express';
import { RentalController } from '../controllers/RentalController';
import { Application } from 'express';

export class RentalRoutes {
  private rentalController: RentalController;
  public router: Router;

  constructor(app: Application) {
    this.rentalController = new RentalController(app);
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/', this.rentalController.getAllRentals);
    this.router.get('/:id', this.rentalController.getRentalById);
    this.router.post('/', this.rentalController.createRental);
    this.router.patch('/:id', this.rentalController.updateRental);
    this.router.delete('/:id', this.rentalController.deleteRental);
  }
}
