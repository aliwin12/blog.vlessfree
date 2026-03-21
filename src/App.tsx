import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Clock, 
  Calendar, 
  User, 
  Shield, 
  Globe, 
  Zap,
  ArrowLeft,
  Share2,
  Bookmark,
  Moon,
  Sun
} from 'lucide-react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useParams 
} from 'react-router-dom';
import Markdown from 'react-markdown';
import { Article, MOCK_ARTICLES } from './types';

const Navbar = ({ isDark, toggleDark }: { isDark: boolean, toggleDark: () => void }) => (
  <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <Link 
          to="/"
          className="flex items-center gap-1 cursor-pointer" 
        >
          <span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-100">vlessfree</span>
          <span className="text-lg font-medium text-zinc-500 dark:text-zinc-400 ml-1">blog</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://vlessfree.vercel.app" 
            className="hidden sm:block text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            вернуться на vlessfree
          </a>
          
          <button 
            onClick={toggleDark}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="md:hidden">
            <Menu className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const ArticleCard = ({ article }: { article: Article }) => (
  <motion.div 
    layoutId={`card-${article.id}`}
    className="group cursor-pointer bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-all duration-300"
  >
    <Link to={`/article/${article.id}`}>
      <div className="aspect-video overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>
    </Link>
    <div className="p-6">
      <Link to={`/article/${article.id}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
            {article.category.toLowerCase()}
          </span>
          <span className="text-zinc-400 dark:text-zinc-600 text-xs">•</span>
          <span className="text-zinc-400 dark:text-zinc-500 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" /> {article.readTime}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors leading-tight dark:text-zinc-100">
          {article.title}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 mb-4">
          {article.excerpt}
        </p>
      </Link>
      <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800">
        <Link 
          to={`/profile/${article.author}`}
          className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
            <User className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{article.author.toLowerCase()}</span>
            {article.authorBadge && (
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-wider">
                {article.authorBadge}
              </span>
            )}
          </div>
        </Link>
        <Link to={`/article/${article.id}`}>
          <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  </motion.div>
);

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = MOCK_ARTICLES.find(a => a.id === id);

  if (!article) return <div className="text-center py-20 dark:text-zinc-100">статья не найдена</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">назад</span>
      </button>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium">
            {article.category.toLowerCase()}
          </span>
          <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500 text-sm">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {article.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {article.readTime}</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight dark:text-zinc-100">
          {article.title}
        </h1>

        <div className="flex items-center justify-between py-6 border-y border-zinc-200 dark:border-zinc-800">
          <Link 
            to={`/profile/${article.author}`}
            className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold dark:text-zinc-100">{article.author.toLowerCase()}</p>
                {article.authorBadge && (
                  <span className="px-1.5 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-wider">
                    {article.authorBadge}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">технический эксперт</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><Share2 className="w-5 h-5 text-zinc-500 dark:text-zinc-400" /></button>
            <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><Bookmark className="w-5 h-5 text-zinc-500 dark:text-zinc-400" /></button>
          </div>
        </div>
      </header>

      <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-zinc-200 dark:shadow-black/50">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="markdown-body">
        <Markdown>{article.content}</Markdown>
      </div>

      <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="bg-zinc-900 dark:bg-zinc-800 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">понравилась статья?</h3>
            <p className="text-zinc-400 text-sm">подпишитесь на нашу рассылку, чтобы получать новые туториалы первыми.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="email" 
              placeholder="ваш email" 
              className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm flex-grow md:w-64 focus:outline-none focus:border-white/40"
            />
            <button className="bg-white text-zinc-900 px-6 py-2 rounded-full text-sm font-bold hover:bg-zinc-100 transition-colors">
              ok
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

const ProfileView = () => {
  const { author } = useParams();
  const navigate = useNavigate();
  const authorArticles = MOCK_ARTICLES.filter(a => a.author === author);
  const authorBadge = authorArticles[0]?.authorBadge;

  if (!author) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-12 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">назад</span>
      </button>

      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-6 shadow-xl">
          <User className="w-12 h-12 text-zinc-500 dark:text-zinc-400" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-extrabold dark:text-zinc-100 tracking-tight">{author.toLowerCase()}</h1>
          {authorBadge && (
            <span className="px-2 py-1 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-widest">
              {authorBadge}
            </span>
          )}
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg">
          технический эксперт и автор блога vlessfree. делится опытом настройки безопасных соединений и обхода блокировок.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {authorArticles.map((article) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
          />
        ))}
      </div>
    </motion.div>
  );
};

const HomeView = () => (
  <motion.div
    key="list"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="mb-16 text-center max-w-2xl mx-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-6"
      >
        <Zap className="w-3 h-3 fill-current" /> новые технологии
      </motion.div>
      <h2 className="text-4xl font-extrabold mb-4 tracking-tight dark:text-zinc-100">блог о свободе интернета</h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg">
        актуальные новости, подробные инструкции и лучшие практики по настройке vless, vpn и прокси.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {MOCK_ARTICLES.map((article) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
        />
      ))}
      
      {/* Placeholder for more articles */}
      <div className="bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center p-8 text-center">
        <Globe className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
        <h4 className="font-bold text-zinc-400 dark:text-zinc-600">больше статей скоро</h4>
        <p className="text-zinc-400 dark:text-zinc-600 text-sm">мы работаем над новыми материалами для вас.</p>
      </div>
    </div>
  </motion.div>
);

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Router>
      <div className="min-h-screen transition-colors duration-300">
        <Navbar 
          isDark={isDark} 
          toggleDark={() => setIsDark(!isDark)} 
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/profile/:author" element={<ProfileView />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12 mt-20 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold tracking-tighter text-zinc-900 dark:text-zinc-100">vlessfree</span>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 ml-1">blog</span>
              </div>
              <div className="text-sm text-zinc-400 dark:text-zinc-600">
                © 2026 vlessfree. все права защищены.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
