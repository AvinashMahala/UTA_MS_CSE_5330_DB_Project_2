import { Request, Response } from 'express';
import { OwnerService } from '../services/OwnerService';
import { Application } from 'express';

export class OwnerController {
  private ownerService: OwnerService;

  constructor(app: Application) {
    this.ownerService = new OwnerService(app);
  }

  public getAllOwners = async (req: Request, res: Response): Promise<void> => {
    const owners = await this.ownerService.getAllOwners();
    res.json(owners);
  };

  public getOwnerById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const owner = await this.ownerService.getOwnerById(id);
    res.json(owner);
  };

  public createOwner = async (req: Request, res: Response): Promise<void> => {
    const owner = await this.ownerService.createOwner(req.body);
    res.status(201).json(owner);
  };

  public updateOwner = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const owner = await this.ownerService.updateOwner(id, req.body);
    res.json(owner);
  };

  public deleteOwner = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    await this.ownerService.deleteOwner(id);
    res.sendStatus(204);
  };
}
