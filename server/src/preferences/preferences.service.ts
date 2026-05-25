import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferenceCategory } from './preference-category.entity';
import { Preference } from './preference.entity';
import { DomainEnum } from '../common/enums';

const DOMAIN_SECTION: Record<string, { title: string; order: number }> = {
  restaurant: { title: '식당 취향 질문',     order: 1 },
  stay:       { title: '숙소 취향 질문',     order: 2 },
  activity:   { title: '액티비티 취향 질문', order: 3 },
};

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(PreferenceCategory)
    private readonly categoryRepo: Repository<PreferenceCategory>,
    @InjectRepository(Preference)
    private readonly prefRepo: Repository<Preference>,
  ) {}

  async getQuestions() {
    const rows = await this.prefRepo.find({
      relations: { category: true },
      order: { id: 'ASC' },
    });

    // domain별로 하나의 섹션으로 그룹핑
    const sectionMap = new Map<string, { sectionTitle: string; sectionOrder: number; questions: any[] }>();
    for (const r of rows) {
      if (!r.questionText) continue; // 질문 없는 행 skip
      const domain = r.category.domain as string;
      const sec = DOMAIN_SECTION[domain];
      if (!sec) continue;
      if (!sectionMap.has(domain)) {
        sectionMap.set(domain, { sectionTitle: sec.title, sectionOrder: sec.order, questions: [] });
      }
      sectionMap.get(domain)!.questions.push({
        id:      r.id,
        text:    r.questionText,
        prefKey: r.profileCol?.replace(/_([a-z])/g, (_, c) => c.toUpperCase()) ?? r.profileCol,
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
