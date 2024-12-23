import { Repository } from 'typeorm';
import GenericRepository from './GenericRepository';
import CaregiverServiceEntity from '../entities/CaregiverServiceEntity';

class CaregiverServiceRepository extends GenericRepository<CaregiverServiceEntity> {
    constructor(services: Repository<CaregiverServiceEntity>) {
        super(services);
    }

    async checkService(caregiverId: string) {
        return await this.repository.findOne({
            where: { caregiverId: Number(caregiverId) },
            relations: ['caregiver'],
        });
    }

    allCaregiverWhithService() {
        return this.repository.find({
            relations: ['caregiver'],
        });
    }
}

export default CaregiverServiceRepository;
