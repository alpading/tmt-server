import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferenceCategory } from './preference-category.entity';
import { PreferenceQuestion } from './preference-question.entity';
import { DomainEnum } from '../common/enums';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(PreferenceCategory)
    private readonly categoryRepo: Repository<PreferenceCategory>,
    @InjectRepository(PreferenceQuestion)
    private readonly questionRepo: Repository<PreferenceQuestion>,
  ) {}

  async getQuestions() {
    const rows = await this.questionRepo.find({
      order: { sectionOrder: 'ASC', dispOrder: 'ASC' },
    });

    // section별로 그룹핑
    const sectionMap = new Map<string, { sectionTitle: string; sectionOrder: number; questions: any[] }>();
    for (const r of rows) {
      if (!sectionMap.has(r.sectionTitle)) {
        sectionMap.set(r.sectionTitle, { sectionTitle: r.sectionTitle, sectionOrder: r.sectionOrder, questions: [] });
      }
      sectionMap.get(r.sectionTitle)!.questions.push({
        id:      r.id,
        text:    r.questionText,
        prefKey: r.prefKey,
        options: [r.optionHigh, r.optionMid, r.optionLow],
      });
    }

    return Array.from(sectionMap.values()).sort((a, b) => a.sectionOrder - b.sectionOrder);
  }

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
