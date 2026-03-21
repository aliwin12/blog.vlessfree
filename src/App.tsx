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
  Sun,
  Send,
  Twitter,
  Link as LinkIcon,
  Check,
  LogOut,
  LogIn,
  Search,
  MessageSquare,
  Loader2,
  AlertCircle as AlertIcon,
  Settings,
  Trash2,
  Camera,
  ExternalLink,
  Plus,
  Layout,
  FileText,
  Image as ImageIcon,
  Type as TypeIcon
} from 'lucide-react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useParams,
  Navigate
} from 'react-router-dom';
import Markdown from 'react-markdown';
import { Article, MOCK_ARTICLES, Comment, Profile } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Auth } from './components/Auth';
import { User as SupabaseUser } from '@supabase/supabase-js';

const Navbar = ({ isDark, toggleDark, user, profile }: { isDark: boolean, toggleDark: () => void, user: SupabaseUser | null, profile: Profile | null }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link 
            to="/"
            className="flex items-center cursor-pointer" 
          >
            <span className="text-xl font-medium text-zinc-900 dark:text-zinc-100">vlessfree</span>
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

            {user ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/create"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:opacity-80 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>создать пост</span>
                </Link>

                <div className="flex items-center gap-1">
                  <Link 
                    to={`/profile/${user.id}`}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
                    title="Мой профиль"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="/settings"
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
                    title="Настройки"
                  >
                    <Settings className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-600 dark:text-zinc-400 hover:text-red-600 transition-colors"
                    title="Выйти"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" />
                <span>войти</span>
              </Link>
            )}
            
            <div className="md:hidden">
              <Menu className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

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
          {article.is_draft && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              черновик
            </span>
          )}
          <span className="text-zinc-400 dark:text-zinc-600 text-xs">•</span>
          <span className="text-zinc-400 dark:text-zinc-500 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" /> {article.read_time}
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
          to={`/profile/${article.author_id || article.author}`}
          className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
            <User className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{article.author.toLowerCase()}</span>
            {article.author_badge && (
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-wider">
                {article.author_badge}
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

const CommentSection = ({ articleId, user }: { articleId: string, user: SupabaseUser | null }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setFetching(false);
      return;
    }

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data || []);
      }
      setFetching(false);
    };

    fetchComments();

    // Subscribe to comments changes
    const subscription = supabase
      .channel(`comments-${articleId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'comments',
        filter: `article_id=eq.${articleId}`
      }, async (payload) => {
        // Fetch profile for the new comment
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', payload.new.user_id)
          .single();
        
        const commentWithProfile = { ...payload.new, profile: profileData } as Comment;
        setComments(prev => {
          if (prev.some(c => c.id === commentWithProfile.id)) return prev;
          return [commentWithProfile, ...prev];
        });
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'comments',
        filter: `article_id=eq.${articleId}`
      }, (payload) => {
        setComments(prev => prev.filter(c => c.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [articleId]);

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId);

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || loading) return;

    setLoading(true);
    const { error } = await supabase.from('comments').insert([
      {
        article_id: articleId,
        user_id: user.id,
        content: newComment.trim(),
      }
    ]);

    if (error) {
      console.error('Error posting comment:', error);
      alert('Ошибка при отправке комментария');
    } else {
      setNewComment('');
    }
    setLoading(false);
  };

  return (
    <section className="mt-16 pt-12 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
        <h3 className="text-2xl font-extrabold dark:text-zinc-100 tracking-tight">комментарии ({comments.length})</h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm focus-within:border-zinc-900 dark:focus-within:border-zinc-100 transition-colors">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="напишите ваш комментарий..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm dark:text-zinc-100 resize-none min-h-[100px]"
              required
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="px-6 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                отправить
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center mb-12">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">войдите, чтобы оставить комментарий</p>
          <Link to="/auth" className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity">
            <LogIn className="w-4 h-4" /> войти
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {fetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                {comment.profile?.avatar_url ? (
                  <img src={comment.profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/profile/${comment.profile?.id || comment.user_id}`}
                      className="text-sm font-bold dark:text-zinc-100 hover:underline"
                    >
                      {comment.profile?.username || 'аноним'}
                    </Link>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                      {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  {user?.id === comment.user_id && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 disabled:opacity-50"
                      title="Удалить"
                    >
                      {deletingId === comment.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-zinc-500 dark:text-zinc-400 text-sm py-8">пока нет комментариев. станьте первым!</p>
        )}
      </div>
    </section>
  );
};

const ArticleDetail = ({ user }: { user: SupabaseUser | null }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      // First check mock articles
      const mock = MOCK_ARTICLES.find(a => a.id === id);
      if (mock) {
        setArticle(mock);
        setLoading(false);
        return;
      }

      // If not mock, fetch from Supabase
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (data) {
          if (data.is_draft && (!user || data.author_id !== user.id)) {
            setArticle(null);
          } else {
            setArticle(data);
          }
        }
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
    </div>
  );

  if (!article) return (
    <div className="text-center py-20 dark:text-zinc-100">
      <h2 className="text-2xl font-bold mb-4">статья не найдена</h2>
      <button 
        onClick={() => navigate('/')}
        className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
      >
        вернуться на главную
      </button>
    </div>
  );

  const shareUrl = window.location.href;
  const shareTitle = article.title;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'Telegram',
      icon: <Send className="w-4 h-4" />,
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white transition-all'
    },
    {
      name: 'VK',
      icon: <Share2 className="w-4 h-4" />,
      url: `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-4 h-4" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900 dark:hover:bg-white dark:hover:text-zinc-900 hover:text-white transition-all'
    }
  ];

  const handleDelete = async () => {
    if (!article || !isSupabaseConfigured) {
      setError('Supabase не настроен или статья не найдена');
      setShowDeleteConfirm(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', article.id);

      if (error) throw error;
      
      setShowDeleteConfirm(false);
      navigate('/');
    } catch (err: any) {
      console.error('Error deleting article:', err);
      setError(`Ошибка при удалении: ${err.message || 'неизвестная ошибка'}`);
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">назад</span>
        </button>

        {user?.id === article.author_id && (
          <div className="flex items-center gap-3">
            <Link 
              to={`/edit/${article.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-bold"
            >
              <Settings className="w-4 h-4" />
              редактировать
            </Link>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-bold disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              удалить
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-zinc-100">удалить статью?</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed">
                вы уверены, что хотите безвозвратно удалить эту статью? это действие нельзя будет отменить.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  отмена
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'удалить'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <AlertIcon className="w-5 h-5" />
            <span className="text-sm font-bold">{error}</span>
            <button onClick={() => setError(null)} className="hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium">
            {article.category.toLowerCase()}
          </span>
          <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500 text-sm">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {article.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {article.read_time}</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight dark:text-zinc-100">
          {article.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-y border-zinc-200 dark:border-zinc-800 gap-6">
          <Link 
            to={`/profile/${article.author_id || article.author}`}
            className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold dark:text-zinc-100">{article.author.toLowerCase()}</p>
                {article.author_badge && (
                  <span className="px-1.5 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-wider">
                    {article.author_badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">технический эксперт</p>
            </div>
          </Link>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mr-2">поделиться:</span>
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl flex items-center justify-center ${link.color}`}
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
            <button 
              onClick={handleCopyLink}
              className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                copied 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
              title="Копировать ссылку"
            >
              {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            </button>
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

      <div className="markdown-body relative">
        <Markdown>{article.content}</Markdown>
        {article.edit_count && article.edit_count > 0 && (
          <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-900 text-xs text-zinc-400 dark:text-zinc-600 italic flex items-center gap-1.5">
            <AlertIcon className="w-3 h-3" />
            изменено ({article.edit_count}) раз
          </div>
        )}
      </div>

      <CommentSection articleId={article.id} user={user} />

      <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <div className="text-zinc-400 dark:text-zinc-500 text-sm font-mono">
          <p className="mb-2">--------------------------------------</p>
          <p>Это конец статьи.</p>
          <p>(с) 2026 vlessfree</p>
        </div>
      </footer>
    </motion.div>
  );
};

const ProfileView = ({ user }: { user: SupabaseUser | null }) => {
  const { author } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!author) return;
      
      // Try to fetch by ID first (new system)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', author)
        .single();
      
      let currentProfile = profileData;
      if (profileData) {
        setProfile(profileData);
      } else {
        // Fallback for mock articles where author is a string name
        currentProfile = {
          id: 'mock',
          username: author,
          created_at: new Date().toISOString()
        };
        setProfile(currentProfile);
      }

      // Fetch articles for this author
      if (isSupabaseConfigured) {
        let query = supabase
          .from('articles')
          .select('*')
          .or(`author_id.eq.${author},author.eq.${author}`)
          .order('created_at', { ascending: false });
        
        // Only show drafts to the author themselves
        if (user?.id !== author) {
          query = query.eq('is_draft', false);
        }

        const { data: supabaseArticles } = await query;
        
        const mockArticles = MOCK_ARTICLES.filter(a => a.author === author || (currentProfile && a.author === currentProfile.username));
        setArticles([...(supabaseArticles || []), ...mockArticles]);
      } else {
        setArticles(MOCK_ARTICLES.filter(a => a.author === author));
      }

      setLoading(false);
    };

    fetchData();
  }, [author, user]);

  const authorBadge = articles[0]?.author_badge;

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
    </div>
  );

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
        <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-6 shadow-xl overflow-hidden">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User className="w-12 h-12 text-zinc-500 dark:text-zinc-400" />
          )}
        </div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-extrabold dark:text-zinc-100 tracking-tight">{profile?.username?.toLowerCase()}</h1>
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
        {articles.map((article) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
          />
        ))}
      </div>
    </motion.div>
  );
};

const SettingsView = ({ profile, onUpdate }: { profile: Profile | null, onUpdate: () => void }) => {
  const [username, setUsername] = useState(profile?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || loading) return;

    setLoading(true);
    setSuccess(false);
    setError(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        username: username.startsWith('@') ? username : `@${username}`,
        avatar_url: avatarUrl,
      })
      .eq('id', profile.id);

    if (error) {
      console.error('Error updating profile:', error);
      setError('Ошибка при обновлении профиля');
    } else {
      setSuccess(true);
      onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      <h2 className="text-3xl font-extrabold mb-8 dark:text-zinc-100 tracking-tight">настройки профиля</h2>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <AlertIcon className="w-5 h-5" />
            <span className="text-sm font-bold">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleUpdate} className="space-y-8">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-8 h-8 text-zinc-400" />
              )}
            </div>
            <div>
              <h4 className="font-bold dark:text-zinc-100 mb-1">фото профиля</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">вставьте прямую ссылку на изображение</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 ml-1">
                имя пользователя
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
                  placeholder="@username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 ml-1">
                ссылка на аватар
              </label>
              <div className="relative">
                <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-emerald-500 text-sm font-bold flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> изменения сохранены
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            сохранить изменения
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const HomeView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
      } else if (data) {
        setArticles([...data, ...MOCK_ARTICLES]);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
        <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8">
          актуальные новости, подробные инструкции и лучшие практики по настройке vless, vpn и прокси.
        </p>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="поиск по статьям или авторам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <Search className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-500 dark:text-zinc-400">ничего не найдено по запросу "{searchQuery}"</p>
            </div>
          )}
          
          {searchQuery === '' && (
            <div className="bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center p-8 text-center">
              <Globe className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
              <h4 className="font-bold text-zinc-400 dark:text-zinc-600">больше статей скоро</h4>
              <p className="text-zinc-400 dark:text-zinc-600 text-sm">мы работаем над новыми материалами для вас.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const ArticleEditor = ({ user, profile }: { user: SupabaseUser | null, profile: Profile | null }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Новости');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [editCount, setEditCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && isSupabaseConfigured) {
      const fetchArticle = async () => {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (data) {
          if (user && data.author_id !== user.id) {
            setError('Вы не можете редактировать чужую статью');
            setTimeout(() => navigate('/'), 2000);
            return;
          }
          setTitle(data.title);
          setExcerpt(data.excerpt);
          setContent(data.content);
          setImage(data.image);
          setCategory(data.category);
          setEditCount(data.edit_count || 0);
        }
        setInitialLoading(false);
      };
      fetchArticle();
    }
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || loading) return;

    if (!profile) {
      setError('Профиль еще загружается или не найден. Попробуйте обновить страницу.');
      return;
    }

    setLoading(true);
    setError(null);
    
    const articleData = {
      title,
      excerpt,
      content,
      image,
      category,
      read_time: `${Math.ceil(content.split(' ').length / 200)} мин`,
    };

    const isDraft = (e.nativeEvent as any).submitter?.name === 'draft';

    if (id) {
      // Update
      const { error } = await supabase
        .from('articles')
        .update({
          ...articleData,
          edit_count: editCount + 1,
          is_draft: isDraft
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating article:', error);
        setError(`Ошибка при обновлении статьи: ${error.message}`);
      } else {
        navigate(isDraft ? `/profile/${user.id}` : `/article/${id}`);
      }
    } else {
      // Insert
      const { error } = await supabase.from('articles').insert([
        {
          ...articleData,
          author: profile.username,
          author_id: user.id,
          date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
          edit_count: 0,
          is_draft: isDraft
        }
      ]);

      if (error) {
        console.error('Error creating article:', error);
        setError(`Ошибка при создании статьи: ${error.message}`);
      } else {
        navigate(isDraft ? `/profile/${user.id}` : '/');
      }
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">назад</span>
      </button>

      <h2 className="text-3xl font-extrabold mb-8 dark:text-zinc-100 tracking-tight">
        {id ? 'редактировать пост' : 'создать новый пост'}
      </h2>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <AlertIcon className="w-5 h-5" />
            <span className="text-sm font-bold">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 ml-1">
              заголовок
            </label>
            <div className="relative">
              <TypeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
                placeholder="введите заголовок статьи"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 ml-1">
                категория
              </label>
              <div className="relative">
                <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100 appearance-none"
                >
                  <option value="Новости">Новости</option>
                  <option value="Инструкции">Инструкции</option>
                  <option value="Технологии">Технологии</option>
                  <option value="Обзоры">Обзоры</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 ml-1">
                ссылка на обложку
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 ml-1">
              краткое описание
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-4 h-4 text-zinc-400" />
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                rows={2}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100 resize-none"
                placeholder="коротко о чем статья..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 ml-1">
              содержание (markdown)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100 font-mono"
              placeholder="# заголовок&#10;&#10;ваш текст здесь..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            name="draft"
            disabled={loading}
            className="px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Bookmark className="w-5 h-5" />
            сохранить черновик
          </button>
          <button
            type="submit"
            name="publish"
            disabled={loading}
            className="px-10 py-4 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {id ? 'сохранить изменения' : 'опубликовать статью'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
  };

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Router>
      <div className="min-h-screen transition-colors duration-300 bg-zinc-50 dark:bg-zinc-950 selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
        <Navbar 
          isDark={isDark} 
          toggleDark={() => setIsDark(!isDark)} 
          user={user}
          profile={profile}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/article/:id" element={<ArticleDetail user={user} />} />
              <Route path="/profile/:author" element={<ProfileView user={user} />} />
              <Route path="/create" element={user ? <ArticleEditor user={user} profile={profile} /> : <Navigate to="/auth" />} />
              <Route path="/edit/:id" element={user ? <ArticleEditor user={user} profile={profile} /> : <Navigate to="/auth" />} />
              <Route path="/settings" element={user ? <SettingsView profile={profile} onUpdate={() => fetchProfile(user.id)} /> : <Navigate to="/auth" />} />
              <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
              <Route path="*" element={
                <div className="text-center py-20 dark:text-zinc-100">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-8">страница не найдена</p>
                  <Link to="/" className="text-zinc-900 dark:text-zinc-100 underline">вернуться на главную</Link>
                </div>
              } />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12 mt-20 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center">
              <span className="text-lg font-medium text-zinc-900 dark:text-zinc-100">vlessfree</span>
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
