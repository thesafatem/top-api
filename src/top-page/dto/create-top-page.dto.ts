export enum TopCategory {
  Courses,
  Services,
  Books,
  Goods,
}

export class HhData {
  count: number;
  juniorSalary: number;
  middleSalary: number;
  seniorSalary: number;
}

export class TopPageAdvantage {
  title: string;
  description: string;
}

export class CreateTopPageDto {
  firstCategory: TopCategory;
  secondCategory: string;
  alias: string;
  title: string;
  category: string;
  hh?: HhData;
  advantages: TopPageAdvantage[];
  seoText: string;
  tagsTitle: string;
  tags: string[];
}
