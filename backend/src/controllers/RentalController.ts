import { Request, Response } from 'express';
import { RentalService } from '../services/RentalService';
import { Application } from 'express';

export class RentalController {
  private rentalService: RentalService;

  constructor(app: Application) {
    this.rentalService = new RentalService(app);
  }

  public getAllRentals = async (req: Request, res: Response): Promise<void> => {
    const rentals = await this.rentalService.getAllRentals();
    res.json(rentals);
  };

  public getRentalById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const rental = await this.rentalService.getRentalById(id);
    res.json(rental);
  };

  public createRental = async (req: Request, res: Response): Promise<void> => {
    const rental = await this.rentalService.createRental(req.body);
    res.status(201).json(rental);
  };

  public updateRental = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const rental = await this.rentalService.updateRental(id, req.body);
    res.json(rental);
  };

  public deleteRental = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    await this.rentalService.deleteRental(id);
    res.sendStatus(204);
  };
}
