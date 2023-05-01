import { Request, Response } from 'express';
import { CustomerService } from '../services/CustomerService';
import { Application } from 'express';

export class CustomerController {
  private customerService: CustomerService;

  constructor(app: Application) {
    this.customerService = new CustomerService(app);
  }

  public getAllCustomers = async (req: Request, res: Response): Promise<void> => {
    const customers = await this.customerService.getAllCustomers();
    res.json(customers);
  };

  public getCustomerById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const customer = await this.customerService.getCustomerById(id);
    res.json(customer);
  };

  public createCustomer = async (req: Request, res: Response): Promise<void> => {
    const customer = await this.customerService.createCustomer(req.body);
    res.status(201).json(customer);
  };

  public updateCustomer = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const customer = await this.customerService.updateCustomer(id, req.body);
    res.json(customer);
  };

  public deleteCustomer = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    await this.customerService.deleteCustomer(id);
    res.sendStatus(204);
  };
}
