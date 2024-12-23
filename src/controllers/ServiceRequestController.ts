import ServiceRequestRepository from '../repository/ServiceRequestRepository';
import Controllers from './Controllers';
import { Request, Response } from 'express';
import ServiceRequestEntity from '../entities/ServiceRequestEntity';
import CaregiverEntity from '../entities/CaregiverEntity';
import SeniorServiceEntity from '../entities/SeniorServiceEntity';

class ServiceRequestController extends Controllers<ServiceRequestRepository> {
    constructor(repository: ServiceRequestRepository) {
        super(repository);
    }

    getById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const serviceRequest = await this.repository.getServiceRequestDetails(Number(id));
            if (!serviceRequest) {
                return res.status(404).json({ message: 'Service request not found' });
            }
            return res.status(200).json(serviceRequest);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    getAllRequest = async (req: Request, res: Response) => {
        try {
            const serviceRequests = await this.repository.getServiceAllRequests();
            return res.status(200).json(serviceRequests);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const { caregiverId, serviceId } = req.body;

        if (!caregiverId || !serviceId) {
            res.status(400).json({ message: 'Caregiver ID and Service ID are required' });
            return;
        }

        const requestExists = await this.repository.findServiceRequest(caregiverId, serviceId);

        if (requestExists) {
            res.status(400).json({ message: 'Serviço já solicitado' });
            return;
        }

        try {
            const caregiver = { id: caregiverId } as CaregiverEntity;
            const service = { id: serviceId } as SeniorServiceEntity;

            const serviceRequest = new ServiceRequestEntity(caregiver, service);
            await this.repository.createService(serviceRequest);

            res.status(201).json(serviceRequest);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar serviço', error });
        }
    };

    acceptServiceRequest = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'ID parameter is required' });
            }

            const { accepted } = req.body;
            if (accepted === undefined) {
                return res.status(400).json({ message: 'Accepted status is required' });
            }

            const serviceRequest = await this.repository.acceptServiceRequest(Number(id), accepted);

            return res.status(200).json(serviceRequest);
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    finishServiceRequest = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'ID parameter is required' });
            }

            const { finished } = req.body;
            if (finished === undefined) {
                return res.status(400).json({ message: 'Finished status is required' });
            }

            const serviceRequest = await this.repository.finishServiceRequest(Number(id), finished);

            return res.status(200).json(serviceRequest);
        } catch (error) {
            return res.status(500).json(error);
        }
    };
}
export default ServiceRequestController;
