export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  authorBadge?: string;
  category: string;
  readTime: string;
  image: string;
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Сайт скоро будет готов',
    excerpt: 'Ожидайте запуск полноценной версии сайта в ближайшее время.',
    content: '01.04.2026',
    date: '17 Марта 2026',
    author: 'aliwin',
    authorBadge: 'создатель',
    category: 'Новости',
    readTime: '1 мин',
    image: 'https://i.ibb.co/xSrJq5ZZ/2026-03-17-214505.png'
  }
];
