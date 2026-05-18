import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferenceCategory } from './preference-category.entity';
import { DomainEnum } from '../common/enums';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(PreferenceCategory)
    private readonly categoryRepo: Repository<PreferenceCategory>,
  ) {}

  async getFiltersByDomain(domain: DomainEnum) {
    const categories = await this.categoryRepo.find({
      where: { domain },
      relations: { attributes: true },
      order: { id: 'ASC' },
    });

    return categories.map((cat) => ({
      categoryId: cat.id,
      categoryName: cat.name,
      targetRating: cat.targetRating,
      attributes: cat.attributes.map((attr) => ({
        id: attr.id,
        name: attr.name,
        profileCol: attr.profileCol,
      })),
    }));
  }
}
