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
  },
  {
    id: '2',
    title: 'Как настроить VLESS на iOS',
    excerpt: 'Подробная инструкция по настройке протокола VLESS с использованием клиента FoXray.',
    content: '# Инструкция по VLESS\n\n1. Скачайте FoXray из App Store...\n2. Скопируйте ссылку...',
    date: '20 Марта 2026',
    author: 'aliwin',
    category: 'Инструкции',
    read_time: '5 мин',
    image: 'https://picsum.photos/seed/ios/800/600',
    created_at: '2026-03-20T10:00:00Z'
  },
  {
    id: '3',
    title: 'Обзор лучших VPN протоколов 2026',
    excerpt: 'Сравнение VLESS, Reality, Shadowsocks и WireGuard в современных реалиях.',
    content: 'В 2026 году выбор протокола стал критически важным...',
    date: '21 Марта 2026',
    author: 'tech_expert',
    category: 'Обзоры',
    read_time: '8 мин',
    image: 'https://picsum.photos/seed/vpn/800/600',
    created_at: '2026-03-21T15:00:00Z'
  }
];
