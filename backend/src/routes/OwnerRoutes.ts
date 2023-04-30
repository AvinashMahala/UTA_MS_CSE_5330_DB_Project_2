import { Router } from 'express';
import { OwnerController } from '../controllers/OwnerController';
import { Application } from 'express';

export class OwnerRoutes {
  private ownerController: OwnerController;
  public router: Router;

  constructor(app: Application) {
    this.ownerController = new OwnerController(app);
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/', this.ownerController.getAllOwners);
    this.router.get('/:id', this.ownerController.getOwnerById);
    this.router.post('/', this.ownerController.createOwner);
    this.router.patch('/:id', this.ownerController.updateOwner);
    this.router.delete('/:id', this.ownerController.deleteOwner);
  }
}
