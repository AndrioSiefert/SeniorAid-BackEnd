import { BaseEntity, DeleteResult, FindOptionsWhere, Repository } from 'typeorm';

class GenericRepository<Entity extends BaseEntity> {
    protected repository: Repository<Entity>;

    constructor(repository: Repository<Entity>) {
        this.repository = repository;
    }

    async getAll(): Promise<Entity[]> {
        return this.repository.find();
    }

    async getById(id: number): Promise<Entity | undefined> {
        const result = await this.repository.findOne({
            where: { id } as any,
        });
        return result || undefined;
    }

    async findOneByUser(user: string): Promise<Entity | null> {
        return this.repository.findOne({ where: { user: user } } as any);
    }

    async create(entity: Entity): Promise<Entity> {
        return this.repository.save(entity);
    }

    async update(id: string, update: Entity): Promise<Entity> {
        await this.repository.findOne({
            where: { id },
        } as any);
        return this.repository.save({ ...update, id });
    }

    async delete(id: string): Promise<{ message: string }> {
        const deleteResult: DeleteResult = await this.repository.softDelete(id);
        if (deleteResult.affected === 0) {
            throw new Error('Erro ao deletar');
        }
        return { message: 'Deletado com sucesso' };
    }

    async login(email: string, password: string): Promise<Entity | null> {
        return this.repository.findOne({
            where: { email, password } as unknown as FindOptionsWhere<Entity>,
        });
    }

    async save(entity: Entity): Promise<Entity> {
        return this.repository.save(entity);
    }
}

export default GenericRepository;
