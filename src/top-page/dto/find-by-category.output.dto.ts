export class PageDto {
  alias: string;
  title: string;
  _id: string;
}

export class FindByCategoryDto {
  _id: string;
  pages: PageDto[];
}
