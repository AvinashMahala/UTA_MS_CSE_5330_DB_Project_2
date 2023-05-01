import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { Application } from 'express';

export class CustomerRoutes {
  private customerController: CustomerController;
  public router: Router;

  constructor(app: Application) {
    this.customerController = new CustomerController(app);
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get('/', this.customerController.getAllCustomers);
    this.router.get('/:id', this.customerController.getCustomerById);
    this.router.post('/', this.customerController.createCustomer);
    this.router.patch('/:id', this.customerController.updateCustomer);
    this.router.delete('/:id', this.customerController.deleteCustomer);
  }
}
