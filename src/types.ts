export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  author_id?: string;
  author_badge?: string;
  category: string;
  read_time: string;
  image: string;
  edit_count?: number;
  is_draft?: boolean;
  created_at?: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Сайт скоро будет готов',
    excerpt: 'Ожидайте запуск полноценной версии сайта в ближайшее время.',
    content: '01.04.2026',
    date: '17 Марта 2026',
    author: 'aliwin',
    author_badge: 'создатель',
    category: 'Новости',
    read_time: '1 мин',
    image: 'https://i.ibb.co/xSrJq5ZZ/2026-03-17-214505.png',
    created_at: '2026-03-17T12:00:00Z'
  }
];
