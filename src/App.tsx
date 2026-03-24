import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye,
  EyeOff,
  ShieldCheck,
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
  ArrowRight,
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
  Type as TypeIcon,
  Filter,
  ChevronDown,
  BarChart3,
  Users,
  MessageCircle,
  Edit2,
  FileEdit,
  ThumbsUp,
  ThumbsDown,
  UserPlus,
  UserMinus,
  Ban,
  AlertTriangle
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
import { GoogleGenAI, Type } from "@google/genai";
import { Article, MOCK_ARTICLES, Comment, Profile, BlockedUser } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Auth } from './components/Auth';
import { auth } from './lib/firebase';
import { onIdTokenChanged, User as FirebaseUser } from 'firebase/auth';

const Navbar = ({ isDark, toggleDark, user, profile }: { isDark: boolean, toggleDark: () => void, user: any | null, profile: Profile | null }) => {
  const handleLogout = async () => {
    await auth.signOut();
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
                    to={`/profile/${user.uid}`}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                    title="Мой профиль"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="/settings"
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                    title="Настройки"
                  >
                    <Settings className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-700 dark:text-zinc-400 hover:text-red-600 transition-colors"
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
          <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 text-xs font-medium">
            {article.category.toLowerCase()}
          </span>
          {article.is_draft && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              черновик
            </span>
          )}
          <span className="text-zinc-500 dark:text-zinc-600 text-xs">•</span>
          <span className="text-zinc-500 dark:text-zinc-500 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" /> {article.read_time}
          </span>
          <span className="text-zinc-500 dark:text-zinc-600 text-xs">•</span>
          <span className="text-zinc-500 dark:text-zinc-500 text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" /> {article.views_count || 0}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors leading-tight dark:text-zinc-100">
          {article.title}
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 mb-4">
          {article.excerpt}
        </p>
      </Link>
      <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800">
        <Link 
          to={`/profile/${article.author_id || article.author}`}
          className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center">
            {article.author_profile?.avatar_url ? (
              <img 
                src={article.author_profile.avatar_url} 
                alt={article.author}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-400">{article.author.toLowerCase()}</span>
            {article.author_is_verified && (
              <ShieldCheck className="w-3 h-3 text-blue-500 fill-blue-500/10" />
            )}
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

const CommentSection = ({ articleId, user }: { articleId: string, user: any | null }) => {
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
          profile:profiles!inner(*)
        `)
        .eq('article_id', articleId)
        .eq('profile.is_banned', false)
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
        
        if (profileData?.is_banned) return; // Don't add if banned

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
        user_id: user.uid,
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
                      className="text-sm font-bold dark:text-zinc-100 hover:underline flex items-center gap-1.5"
                    >
                      {comment.profile?.username || 'аноним'}
                      {comment.profile?.is_verified && (
                        <ShieldCheck className="w-3 h-3 text-blue-500 fill-blue-500/10" />
                      )}
                      {comment.profile?.badge && (
                        <span className="px-1 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[8px] font-bold uppercase tracking-wider">
                          {comment.profile.badge}
                        </span>
                      )}
                    </Link>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-600 uppercase tracking-widest">
                      {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  {user?.uid === comment.user_id && (
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
                <p className="text-sm text-zinc-700 dark:text-zinc-400 leading-relaxed">
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

const ArticleDetail = ({ user }: { user: any | null }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [reactionLoading, setReactionLoading] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [authorProfile, setAuthorProfile] = useState<Profile | null>(null);
  const [moreArticles, setMoreArticles] = useState<Article[]>([]);
  const [moreArticlesLoading, setMoreArticlesLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setLoading(true);

      // First check mock articles
      const mockIndex = MOCK_ARTICLES.findIndex(a => a.id === id);
      if (mockIndex !== -1) {
        const mock = MOCK_ARTICLES[mockIndex];
        mock.views_count = (mock.views_count || 0) + 1;
        setArticle({ ...mock });
        setLikesCount(mock.likes_count || 0);
        setDislikesCount(mock.dislikes_count || 0);
        setViewsCount(mock.views_count);
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
          if (data.is_draft && (!user || data.author_id !== user.uid)) {
            setArticle(null);
          } else {
            setArticle(data);
            setLikesCount(data.likes_count || 0);
            setDislikesCount(data.dislikes_count || 0);
            setViewsCount((data.views_count || 0) + 1);
            
            // Increment views count in database
            if (data.views_count !== undefined) {
              supabase
                .from('articles')
                .update({ views_count: (data.views_count || 0) + 1 })
                .eq('id', id)
                .then(({ error }) => {
                  if (error) {
                    console.error('Error incrementing views:', error);
                    // If column is missing, we don't want to spam console in production
                    // but here it helps user diagnose.
                  }
                });
            }
            
            // Fetch author profile
            if (data.author_id) {
              supabase
                .from('profiles')
                .select('*')
                .eq('id', data.author_id)
                .single()
                .then(({ data: pData }) => {
                  if (pData) {
                    setAuthorProfile(pData);
                    if (pData.is_banned) {
                      setArticle(null);
                    }
                  }
                });
            }
            
            // Fetch user reaction and follow status
            if (user) {
              const [reactionRes, followRes] = await Promise.all([
                supabase
                  .from('article_reactions')
                  .select('type')
                  .eq('article_id', id)
                  .eq('user_id', user.uid)
                  .maybeSingle(),
                data.author_id ? supabase
                  .from('follows')
                  .select('*')
                  .eq('follower_id', user.uid)
                  .eq('following_id', data.author_id)
                  .maybeSingle() : Promise.resolve({ data: null })
              ]);
              
              if (reactionRes.data) {
                setUserReaction(reactionRes.data.type as 'like' | 'dislike');
              }
              if (followRes.data) {
                setIsFollowingAuthor(true);
              }
            }
          }
        }
      }
      setLoading(false);
    };

    fetchArticle();
    fetchMoreArticles();
  }, [id, user]);

  const fetchMoreArticles = async () => {
    if (!isSupabaseConfigured) {
      setMoreArticles(MOCK_ARTICLES.filter(a => a.id !== id).slice(0, 3));
      return;
    }

    setMoreArticlesLoading(true);
    try {
      // Get blocked users to filter them out
      let blockedUserIds: string[] = [];
      if (user) {
        const { data: blockedData } = await supabase
          .from('blocked_users')
          .select('blocked_id')
          .eq('blocker_id', user.uid);
        if (blockedData) {
          blockedUserIds = blockedData.map(b => b.blocked_id);
        }
      }

      const { data, error } = await supabase
        .from('articles')
        .select('*, profiles(username, avatar_url)')
        .eq('is_draft', false)
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (data) {
        const mapped = data
          .filter(a => !blockedUserIds.includes(a.author_id))
          .map(a => ({
            ...a,
            author_profile: a.profiles
          }));
        setMoreArticles(mapped as any);
      }
    } catch (err) {
      console.error('Error fetching more articles:', err);
    } finally {
      setMoreArticlesLoading(false);
    }
  };

  const handleFollowAuthor = async () => {
    if (!user || !article || !article.author_id || !isSupabaseConfigured || followLoading || user.uid === article.author_id) return;

    setFollowLoading(true);
    try {
      if (isFollowingAuthor) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.uid)
          .eq('following_id', article.author_id);
        
        if (error) throw error;
        setIsFollowingAuthor(false);
      } else {
        const { error } = await supabase
          .from('follows')
          .insert([{ follower_id: user.uid, following_id: article.author_id }]);
        
        if (error) throw error;
        setIsFollowingAuthor(true);
      }
    } catch (err: any) {
      console.error('Error handling follow in article detail:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user || !id || !isSupabaseConfigured || reactionLoading) return;

    setReactionLoading(true);
    try {
      if (userReaction === type) {
        // Remove reaction
        const { error } = await supabase
          .from('article_reactions')
          .delete()
          .eq('article_id', id)
          .eq('user_id', user.uid);
        
        if (error) throw error;
        
        if (type === 'like') setLikesCount(prev => Math.max(0, prev - 1));
        else setDislikesCount(prev => Math.max(0, prev - 1));
        setUserReaction(null);
      } else {
        // Add or change reaction
        const { error } = await supabase
          .from('article_reactions')
          .upsert({
            article_id: id,
            user_id: user.uid,
            type: type
          }, { onConflict: 'article_id,user_id' });
        
        if (error) throw error;

        if (userReaction === null) {
          if (type === 'like') setLikesCount(prev => prev + 1);
          else setDislikesCount(prev => prev + 1);
        } else {
          // Changed from like to dislike or vice versa
          if (type === 'like') {
            setLikesCount(prev => prev + 1);
            setDislikesCount(prev => Math.max(0, prev - 1));
          } else {
            setDislikesCount(prev => prev + 1);
            setLikesCount(prev => Math.max(0, prev - 1));
          }
        }
        setUserReaction(type);
      }

      // Update article counts in background (simplified for this demo)
      // In a real app, you'd use a database trigger or a more robust update
      await supabase.from('articles').update({
        likes_count: type === 'like' ? (userReaction === 'like' ? likesCount - 1 : likesCount + 1) : (userReaction === 'like' ? likesCount - 1 : likesCount),
        dislikes_count: type === 'dislike' ? (userReaction === 'dislike' ? dislikesCount - 1 : dislikesCount + 1) : (userReaction === 'dislike' ? dislikesCount - 1 : dislikesCount)
      }).eq('id', id);

    } catch (err: any) {
      console.error('Error handling reaction:', err);
      setError('Ошибка при обновлении реакции');
    } finally {
      setReactionLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
    </div>
  );

  if (!article) return (
    <div className="text-center py-20 dark:text-zinc-100">
      <h2 className="text-2xl font-bold mb-4">статья не найдена</h2>
      <button 
        onClick={() => navigate('/')}
        className="text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
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
      color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-900 dark:hover:bg-white dark:hover:text-zinc-900 hover:text-white transition-all'
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
          className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">назад</span>
        </button>

        {user?.uid === article.author_id && (
          <div className="flex items-center gap-3">
            <Link 
              to={`/edit/${article.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-bold"
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
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-sm leading-relaxed">
                вы уверены, что хотите безвозвратно удалить эту статью? это действие нельзя будет отменить.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
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
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {viewsCount}</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight dark:text-zinc-100">
          {article.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-y border-zinc-200 dark:border-zinc-800 gap-6">
          <div className="flex items-center gap-4">
            <Link 
              to={`/profile/${article.author_id || article.author}`}
              className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center">
                {authorProfile?.avatar_url ? (
                  <img 
                    src={authorProfile.avatar_url} 
                    alt={authorProfile.username}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold dark:text-zinc-100">{(authorProfile?.username || article.author).toLowerCase()}</p>
                  {authorProfile?.is_verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                  )}
                  {(authorProfile?.badge || article.author_badge) && (
                    <span className="px-1.5 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-wider">
                      {authorProfile?.badge || article.author_badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">технический эксперт</p>
              </div>
            </Link>

            {user && article.author_id && user.uid !== article.author_id && (
              <button
                onClick={handleFollowAuthor}
                disabled={followLoading}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                  isFollowingAuthor
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
                    : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90'
                } disabled:opacity-50`}
              >
                {followLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : isFollowingAuthor ? (
                  <UserMinus className="w-3 h-3" />
                ) : (
                  <UserPlus className="w-3 h-3" />
                )}
                {isFollowingAuthor ? 'Отписаться' : 'Подписаться'}
              </button>
            )}
          </div>
          
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

      <div className="flex items-center gap-4 my-12 py-6 border-y border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => handleReaction('like')}
          disabled={!user || reactionLoading}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl transition-all font-bold text-sm ${
            userReaction === 'like' 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          } disabled:opacity-50`}
        >
          <ThumbsUp className={`w-4 h-4 ${userReaction === 'like' ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => handleReaction('dislike')}
          disabled={!user || reactionLoading}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl transition-all font-bold text-sm ${
            userReaction === 'dislike' 
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          } disabled:opacity-50`}
        >
          <ThumbsDown className={`w-4 h-4 ${userReaction === 'dislike' ? 'fill-current' : ''}`} />
          <span>{dislikesCount}</span>
        </button>

        {!user && (
          <p className="text-xs text-zinc-500 dark:text-zinc-500 italic">
            войдите, чтобы оценивать статьи
          </p>
        )}
      </div>

      <CommentSection articleId={article.id} user={user} />

      <section className="mt-20 pt-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold dark:text-zinc-100 flex items-center gap-3">
            <Zap className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
            Читайте также
          </h3>
          <Link 
            to="/" 
            className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 group"
          >
            все статьи
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {moreArticlesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {moreArticles.map(a => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>

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

const ProfileView = ({ user }: { user: any | null }) => {
  const { author } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [hasBlocked, setHasBlocked] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!author) return;
      
      setLoading(true);
      try {
        // 1. Try to fetch by ID
        let { data: profileData, error: idError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', author)
          .maybeSingle();
        
        // 2. If not found by ID, try by username
        if (!profileData) {
          const { data: usernameData } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', author.startsWith('@') ? author : `@${author}`)
            .maybeSingle();
          profileData = usernameData;
        }
        
        if (profileData) {
          setProfile(profileData);
          setFollowersCount(profileData.followers_count || 0);
          setFollowingCount(profileData.following_count || 0);

          // Check if current user is following or blocked
          if (user && user.uid !== profileData.id) {
            const [followRes, blockRes] = await Promise.all([
              supabase
                .from('follows')
                .select('*')
                .eq('follower_id', user.uid)
                .eq('following_id', profileData.id)
                .maybeSingle(),
              supabase
                .from('blocked_users')
                .select('*')
                .or(`and(blocker_id.eq.${user.uid},blocked_id.eq.${profileData.id}),and(blocker_id.eq.${profileData.id},blocked_id.eq.${user.uid})`)
            ]);
            
            setIsFollowing(!!followRes.data);
            
            if (blockRes.data) {
              setHasBlocked(blockRes.data.some(b => b.blocker_id === user.uid));
              setIsBlocked(blockRes.data.some(b => b.blocker_id === profileData.id));
            }
          }
        } else {
          setProfile({
            id: 'mock',
            username: author,
            created_at: new Date().toISOString()
          });
        }

        // Fetch articles
        if (isSupabaseConfigured) {
          const authorId = profileData?.id || author;
          const authorName = profileData?.username || author;

          let query = supabase
            .from('articles')
            .select('*')
            .or(`author_id.eq.${authorId},author.eq.${authorName}`)
            .order('created_at', { ascending: false });
          
          if (user?.uid !== authorId) {
            query = query.eq('is_draft', false);
          }

          const { data: supabaseArticles } = await query;
          let mappedArticles = supabaseArticles || [];

          if (mappedArticles.length > 0) {
            const authorIds = Array.from(new Set(mappedArticles.map(a => a.author_id).filter(Boolean)));
            if (authorIds.length > 0) {
              const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, badge, is_verified')
                .in('id', authorIds);
              
              if (profilesData) {
                const profileMap = profilesData.reduce((acc, p) => {
                  acc[p.id] = p;
                  return acc;
                }, {} as Record<string, any>);

                mappedArticles = mappedArticles.map(a => ({
                  ...a,
                  author_badge: (a.author_id && profileMap[a.author_id]?.badge) || a.author_badge,
                  author_is_verified: a.author_id && profileMap[a.author_id]?.is_verified
                }));
              }
            }
          }

          const mockArticles = MOCK_ARTICLES.filter(a => a.author === authorName || a.author === author);
          setArticles([...mappedArticles, ...mockArticles]);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const subscription = supabase
      .channel(`profile-articles-${author || 'unknown'}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'articles' 
      }, (payload) => {
        setArticles(prev => prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new } : a));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [author, user]);

  const handleFollow = async () => {
    if (!user || !profile || profile.id === 'mock' || !isSupabaseConfigured || followLoading || user.uid === profile.id || hasBlocked || isBlocked) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.uid)
          .eq('following_id', profile.id);
        
        if (error) throw error;
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        const { error } = await supabase
          .from('follows')
          .insert([{ follower_id: user.uid, following_id: profile.id }]);
        
        if (error) throw error;
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }

      await Promise.all([
        supabase.rpc('increment_followers', { profile_id: profile.id, increment: isFollowing ? -1 : 1 }),
        supabase.rpc('increment_following', { profile_id: user.uid, increment: isFollowing ? -1 : 1 })
      ]).catch(() => {
        supabase.from('profiles').update({ followers_count: isFollowing ? followersCount - 1 : followersCount + 1 }).eq('id', profile.id);
      });

    } catch (err: any) {
      console.error('Error handling follow:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleBlock = async () => {
    if (!user || !profile || profile.id === 'mock' || blockLoading || user.uid === profile.id) return;

    setBlockLoading(true);
    try {
      if (hasBlocked) {
        await supabase
          .from('blocked_users')
          .delete()
          .eq('blocker_id', user.uid)
          .eq('blocked_id', profile.id);
        setHasBlocked(false);
      } else {
        await supabase
          .from('blocked_users')
          .insert([{ blocker_id: user.uid, blocked_id: profile.id }]);
        setHasBlocked(true);
        setIsFollowing(false);
      }
    } catch (err) {
      console.error('Error blocking:', err);
    } finally {
      setBlockLoading(false);
    }
  };

  const authorBadge = articles[0]?.author_badge;

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
    </div>
  );

  if (profile?.is_banned) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="text-6xl mb-6">🚫</div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Этот пользователь заблокирован</h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
          Этот пользователь заблокирован модерацией.
        </p>
        <button onClick={() => navigate('/')} className="mt-8 text-sm font-bold text-zinc-900 dark:text-zinc-100 underline">вернуться на главную</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">назад</span>
      </button>

      {isBlocked && (
        <div className="mb-8 p-6 bg-red-500 text-white rounded-3xl flex items-center gap-4 shadow-xl">
          <Ban className="w-6 h-6 shrink-0" />
          <p className="font-bold">Этот пользователь заблокировал вас. Вы не можете видеть его посты или взаимодействовать с ним.</p>
        </div>
      )}

      {/* Banner & Profile Header */}
      <div className="relative mb-24">
        <div className="h-48 md:h-64 w-full rounded-3xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {profile?.banner_url ? (
            <img src={profile.banner_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900" />
          )}
        </div>
        
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-white dark:bg-zinc-950 p-1.5 shadow-2xl">
            <div className="w-full h-full rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-16 h-16 text-zinc-600 dark:text-zinc-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center mb-16">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-black dark:text-zinc-100 tracking-tight">{profile?.username?.toLowerCase()}</h1>
          {profile?.is_verified && (
            <ShieldCheck className="w-8 h-8 text-blue-500 fill-blue-500/10" />
          )}
          {(profile?.badge || authorBadge) && (
            <span className="px-3 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-black uppercase tracking-widest">
              {profile?.badge || authorBadge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-2xl font-black dark:text-zinc-100">{followersCount}</p>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">подписчиков</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black dark:text-zinc-100">{followingCount}</p>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">подписок</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          {user && profile && user.uid === profile.id && (
            <Link 
              to="/create"
              className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-black text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" /> создать пост
            </Link>
          )}
          {user && profile && user.uid !== profile.id && profile.id !== 'mock' && !isBlocked && (
            <>
              <button
                onClick={handleFollow}
                disabled={followLoading || hasBlocked}
                className={`px-8 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 shadow-lg ${
                  isFollowing
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
                    : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:scale-105 active:scale-95'
                } disabled:opacity-50`}
              >
                {followLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isFollowing ? <><UserMinus className="w-4 h-4" /> отписаться</> : <><UserPlus className="w-4 h-4" /> подписаться</>}
              </button>
              
              <button
                onClick={handleBlock}
                disabled={blockLoading}
                className={`p-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 border shadow-sm ${
                  hasBlocked
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                    : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-red-500 hover:border-red-500'
                } disabled:opacity-50`}
                title={hasBlocked ? "Разблокировать" : "Заблокировать"}
              >
                {blockLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-5 h-5" />}
              </button>
            </>
          )}
        </div>

        <p className="text-zinc-600 dark:text-zinc-400 max-w-xl text-lg leading-relaxed">
          {profile?.bio || "Этот пользователь не оставил описания."}
        </p>
      </div>

      {!isBlocked && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const SettingsView = ({ profile, profileLoading, profileError, onUpdate }: { profile: Profile | null, profileLoading: boolean, profileError: string | null, onUpdate: () => void }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(profile?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [bannerUrl, setBannerUrl] = useState(profile?.banner_url || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'blocking'>('profile');

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setAvatarUrl(profile.avatar_url || '');
      setBannerUrl(profile.banner_url || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchBlocked = async () => {
      if (!auth.currentUser || !isSupabaseConfigured) return;
      const { data, error } = await supabase
        .from('blocked_users')
        .select('*, profile:profiles!blocked_id(*)')
        .eq('blocker_id', auth.currentUser.uid);
      
      if (!error && data) {
        setBlockedUsers(data as any);
      }
    };
    fetchBlocked();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || loading || !isSupabaseConfigured) {
      if (!isSupabaseConfigured) setError('Supabase не настроен. Сохранение невозможно.');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.startsWith('@') ? username : `@${username}`,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
          bio: bio,
        })
        .eq('id', profile.id);

      if (error) throw error;

      setSuccess(true);
      onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || loading) return;

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // Update Email
      if (email !== auth.currentUser.email) {
        const { updateEmail } = await import('firebase/auth');
        await updateEmail(auth.currentUser, email);
      }

      // Update Password
      if (newPassword) {
        const { updatePassword } = await import('firebase/auth');
        await updatePassword(auth.currentUser, newPassword);
        setNewPassword('');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating account:', err);
      if (err.code === 'auth/requires-recent-login') {
        setError('Для изменения почты или пароля нужно перезайти в аккаунт');
      } else {
        setError(err.message || 'Ошибка при обновлении аккаунта');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (blockedId: string) => {
    if (!auth.currentUser || !isSupabaseConfigured) return;

    try {
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', auth.currentUser.uid)
        .eq('blocked_id', blockedId);

      if (error) throw error;
      setBlockedUsers(prev => prev.filter(b => b.blocked_id !== blockedId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (profileLoading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500">Загрузка настроек...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 px-4 dark:text-zinc-100 max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertIcon className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-black mb-4 tracking-tight">профиль не загружен</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed">
          {profileError || 'произошла ошибка при получении данных профиля. пожалуйста, проверьте подключение к интернету или настройки базы данных.'}
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onUpdate}
            className="w-full px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold shadow-lg shadow-zinc-200 dark:shadow-black/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            попробовать снова
          </button>
          {!isSupabaseConfigured && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mt-4">
              совет: убедитесь, что supabase подключен в настройках проекта.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <h2 className="text-2xl font-black mb-6 dark:text-zinc-100 tracking-tight px-4">настройки</h2>
          {[
            { id: 'profile', label: 'Профиль', icon: User },
            { id: 'account', label: 'Аккаунт', icon: Shield },
            { id: 'blocking', label: 'Блокировки', icon: Ban },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-black/50'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
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

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                  {/* Banner Preview */}
                  <div className="relative h-32 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-12 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    {bannerUrl ? (
                      <img src={bannerUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute -bottom-8 left-8">
                      <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-900 p-1">
                        <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <User className="w-8 h-8 text-zinc-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">
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
                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">
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

                    <div>
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">
                        ссылка на баннер
                      </label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="url"
                          value={bannerUrl}
                          onChange={(e) => setBannerUrl(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
                          placeholder="https://example.com/banner.jpg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">
                        о себе
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 w-4 h-4 text-zinc-400" />
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100 min-h-[120px] resize-none"
                          placeholder="расскажите о себе..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="text-emerald-500 text-sm font-bold flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" /> сохранено
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    сохранить профиль
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleUpdateAccount} className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                  <h3 className="text-lg font-black mb-6 dark:text-zinc-100 tracking-tight">управление аккаунтом</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">
                        электронная почта
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">
                        новый пароль (оставьте пустым, если не хотите менять)
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="text-emerald-500 text-sm font-bold flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" /> обновлено
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    обновить данные
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'blocking' && (
            <motion.div
              key="blocking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                <h3 className="text-lg font-black mb-6 dark:text-zinc-100 tracking-tight">заблокированные пользователи</h3>
                
                {blockedUsers.length > 0 ? (
                  <div className="space-y-4">
                    {blockedUsers.map((blocked) => (
                      <div key={blocked.blocked_id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                            {blocked.profile?.avatar_url ? (
                              <img src={blocked.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-full h-full p-2 text-zinc-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold dark:text-zinc-100">{blocked.profile?.username || 'Пользователь'}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">заблокирован {new Date(blocked.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnblock(blocked.blocked_id)}
                          className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                          разблокировать
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                      <Ban className="w-8 h-8 text-zinc-400" />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">у вас нет заблокированных пользователей</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-center group/admin">
        <button
          onClick={() => navigate('/admin')}
          className="text-[10px] text-zinc-200 dark:text-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:scale-150 active:scale-90 p-2 flex items-center gap-1"
          title="админ"
        >
          .
          <span className="opacity-0 group-hover/admin:opacity-100 transition-opacity text-[8px] font-bold uppercase tracking-widest">admin</span>
        </button>
      </div>
    </motion.div>
  );
};

const HomeView = ({ user }: { user: any | null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('все');
  const [selectedAuthor, setSelectedAuthor] = useState('все');
  const [dateRange, setDateRange] = useState('все');
  const [showFilters, setShowFilters] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchBlocked = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('blocked_users')
        .select('blocked_id')
        .eq('blocker_id', user.uid);
      if (data) setBlockedUserIds(data.map(b => b.blocked_id));
    };
    fetchBlocked();
  }, [user]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

        const { data, error } = await supabase
          .from('articles')
          .select('*, profiles!inner(id, badge, is_verified, is_banned, username, avatar_url)')
          .eq('is_draft', false)
          .eq('profiles.is_banned', false)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching articles:', error);
        } else if (data) {
          const mappedArticles = data.map(a => ({
            ...a,
            author: (a.profiles as any)?.username || a.author,
            author_badge: (a.profiles as any)?.badge || a.author_badge,
            author_is_verified: (a.profiles as any)?.is_verified,
            author_profile: a.profiles as any
          }));
          setArticles([...mappedArticles, ...MOCK_ARTICLES]);
        }
      setLoading(false);
    };

    fetchArticles();

    const subscription = supabase
      .channel('articles-realtime')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'articles' 
      }, (payload) => {
        setArticles(prev => prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new } : a));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const filteredArticles = articles.filter(article => {
    // Filter blocked users
    if (blockedUserIds.includes(article.author_id || '')) return false;

    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'все' || article.category === selectedCategory;
    const matchesAuthor = selectedAuthor === 'все' || article.author === selectedAuthor;
    
    let matchesDate = true;
    if (dateRange !== 'все') {
      const articleDate = new Date(article.created_at || article.date);
      const now = new Date();
      if (dateRange === 'сегодня') {
        matchesDate = articleDate.toDateString() === now.toDateString();
      } else if (dateRange === 'неделя') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = articleDate >= weekAgo;
      } else if (dateRange === 'месяц') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = articleDate >= monthAgo;
      }
    }

    return matchesSearch && matchesCategory && matchesAuthor && matchesDate;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('все');
    setSelectedAuthor('все');
    setDateRange('все');
  };

  const categories = ['все', ...Array.from(new Set(articles.map(a => a.category)))];
  const authors = Array.from(new Set(articles.map(a => a.author)));

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
        <h2 className="text-4xl font-extrabold mb-8 tracking-tight dark:text-zinc-100">Посты, статьи, и т.д.</h2>

        <div className="relative max-w-xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="поиск по статьям или авторам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-2xl border transition-all flex items-center gap-2 text-sm font-medium ${
                showFilters || selectedCategory !== 'все' || selectedAuthor !== 'все' || dateRange !== 'все'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">фильтры</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-4 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl z-20"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                      <Layout className="w-3 h-3" /> категория
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                      <User className="w-3 h-3" /> автор
                    </label>
                    <div className="relative">
                      <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className="w-full appearance-none bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      >
                        <option value="все">все авторы</option>
                        {authors.map(author => (
                          <option key={author} value={author}>{author}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> дата
                    </label>
                    <div className="relative">
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full appearance-none bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                      >
                        <option value="все">за все время</option>
                        <option value="сегодня">за сегодня</option>
                        <option value="неделя">за неделю</option>
                        <option value="месяц">за месяц</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <p className="text-xs text-zinc-400">
                    найдено статей: <span className="font-bold text-zinc-900 dark:text-zinc-100">{filteredArticles.length}</span>
                  </p>
                  <button
                    onClick={resetFilters}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    сбросить все
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

const ArticleEditor = ({ user, profile }: { user: any | null, profile: Profile | null }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Новости');
  const [loading, setLoading] = useState(false);
  const [checkingCompliance, setCheckingCompliance] = useState(false);
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
          if (user && data.author_id !== user.uid) {
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

    const isDraft = (e.nativeEvent as any).submitter?.name === 'draft';

    // AI Compliance Check
    if (!isDraft) {
      setCheckingCompliance(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Проверь статью на соответствие правилам (https://blog-vlessfree.vercel.app/terms). 
          Дополнительное правило: использование слова "tqweji23" строго запрещено в любом контексте.
          Заголовок: ${title}
          Описание: ${excerpt}
          Текст: ${content}`,
          config: {
            tools: [{ urlContext: {} }],
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isCompliant: { type: Type.BOOLEAN },
                reason: { type: Type.STRING, description: "Причина нарушения, если есть (на русском языке)" }
              },
              required: ["isCompliant"]
            }
          }
        });

        const result = JSON.parse(response.text || '{}');
        if (result.isCompliant === false) {
          setError(`Статья нарушает правила: ${result.reason || 'неизвестная причина'}`);
          setLoading(false);
          setCheckingCompliance(false);
          return;
        }
      } catch (err: any) {
        console.error('AI Compliance check failed:', err);
        // If AI fails, we might still want to allow publishing or show a warning.
        // For now, let's just log it and proceed, or show a non-blocking warning.
      } finally {
        setCheckingCompliance(false);
      }
    }
    
    const articleData = {
      title,
      excerpt,
      content,
      image,
      category,
      read_time: `${Math.ceil(content.split(' ').length / 200)} мин`,
    };

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
        navigate(isDraft ? `/profile/${user.uid}` : `/article/${id}`);
      }
    } else {
      // Insert
      const { error } = await supabase.from('articles').insert([
        {
          ...articleData,
          author: profile.username,
          author_id: user.uid,
          date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
          edit_count: 0,
          is_draft: isDraft
        }
      ]);

      if (error) {
        console.error('Error creating article:', error);
        setError(`Ошибка при создании статьи: ${error.message}`);
      } else {
        navigate(isDraft ? `/profile/${user.uid}` : '/');
      }
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
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
        className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors group"
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
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-widest mb-3 ml-1">
              заголовок
            </label>
            <div className="relative">
              <TypeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
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
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-widest mb-3 ml-1">
                категория
              </label>
              <div className="relative">
                <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
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
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-widest mb-3 ml-1">
                ссылка на обложку
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
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
            disabled={loading || checkingCompliance}
            className="px-10 py-4 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {checkingCompliance ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                проверка ИИ...
              </>
            ) : loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {id ? 'сохранить изменения' : 'опубликовать статью'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const AdminView = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'articles' | 'users' | 'comments'>('stats');
  const [articles, setArticles] = useState<Article[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editIsVerified, setEditIsVerified] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const ADMIN_EMAILS = ['bubinadubina5@gmail.com'];
  const ADMIN_PASSWORD = 'MiOiJzdXBhYmFzZSIsInJlZiI6Im';

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [articlesRes, profilesRes, commentsRes] = await Promise.all([
        supabase.from('articles').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('comments').select('*').order('created_at', { ascending: false })
      ]);

      if (articlesRes.error) throw articlesRes.error;
      if (profilesRes.error) throw profilesRes.error;
      if (commentsRes.error) throw commentsRes.error;

      if (articlesRes.data) setArticles(articlesRes.data);
      if (profilesRes.data) setProfiles(profilesRes.data);
      
      if (commentsRes.data) {
        // Join comments with articles and profiles in memory
        const joinedComments = commentsRes.data.map(comment => {
          const article = articlesRes.data?.find(a => a.id === comment.article_id);
          const profile = profilesRes.data?.find(p => p.id === comment.user_id);
          return {
            ...comment,
            articles: article ? { title: article.title } : null,
            profiles: profile ? { username: profile.username } : null
          };
        });
        setComments(joinedComments);
      }
      
      setToast({ message: 'Данные обновлены!', type: 'success' });
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      setToast({ message: 'Ошибка при загрузке: ' + err.message, type: 'error' });
    }
    setLoading(false);
  };

  // Move all hooks to the top, before any early returns
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchAllData();

      // Subscribe to articles changes for real-time views/likes
      const articlesSub = supabase
        .channel('admin-articles-realtime')
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'articles' 
        }, (payload) => {
          setArticles(prev => prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new } : a));
        })
        .subscribe();

      // Subscribe to profiles changes
      const profilesSub = supabase
        .channel('admin-profiles-realtime')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, (payload) => {
          if (payload.eventType === 'UPDATE') {
            setProfiles(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p));
          } else if (payload.eventType === 'DELETE') {
            setProfiles(prev => prev.filter(p => p.id !== payload.old.id));
          } else if (payload.eventType === 'INSERT') {
            setProfiles(prev => [payload.new as Profile, ...prev]);
          }
        })
        .subscribe();

      // Subscribe to comments changes
      const commentsSub = supabase
        .channel('admin-comments-realtime')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'comments' 
        }, (payload) => {
          if (payload.eventType === 'UPDATE') {
            setComments(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
          } else if (payload.eventType === 'DELETE') {
            setComments(prev => prev.filter(c => c.id !== payload.old.id));
          } else if (payload.eventType === 'INSERT') {
            setComments(prev => [payload.new as Comment, ...prev]);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(articlesSub);
        supabase.removeChannel(profilesSub);
        supabase.removeChannel(commentsSub);
      };
    }
  }, [isAuthorized]);

  if (isAuthorized && !currentUser) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 text-center">
          <AlertIcon className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Нужна авторизация</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Вы ввели пароль от админки, но не вошли в свой аккаунт Supabase. 
            Пожалуйста, войдите под одной из разрешенных почт (например, <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{ADMIN_EMAILS[0]}</span>), чтобы база данных разрешила изменения.
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="w-full py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold"
          >
            Перейти к входу
          </button>
        </div>
      </div>
    );
  }

  if (isAuthorized && !ADMIN_EMAILS.includes(currentUser?.email)) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Доступ ограничен</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Вы вошли как <span className="font-bold">{currentUser?.email}</span>. 
            У этого аккаунта нет прав администратора в базе данных.
          </p>
          <button 
            onClick={() => supabase.auth.signOut().then(() => navigate('/auth'))}
            className="w-full py-3 rounded-2xl bg-red-600 text-white font-bold"
          >
            Выйти и зайти под админом
          </button>
        </div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert('Неверный пароль');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) return;
    setActionLoading(id);
    try {
      const { error, count } = await supabase.from('articles').delete({ count: 'exact' }).eq('id', id);
      if (error) throw error;
      if (count === 0) throw new Error('У вас нет прав на удаление или статья не найдена.');
      
      setArticles(articles.filter(a => a.id !== id));
      setToast({ message: 'Статья удалена!', type: 'success' });
    } catch (error: any) {
      console.error('Admin: Error deleting article:', error);
      setToast({ message: 'Ошибка: ' + error.message, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот профиль?')) return;
    console.log('Admin: Deleting profile:', id);
    setActionLoading(id);
    try {
      const { error, count } = await supabase.from('profiles').delete({ count: 'exact' }).eq('id', id);
      if (error) throw error;
      if (count === 0) throw new Error('У вас нет прав на удаление или профиль не найден.');
      
      setProfiles(prev => prev.filter(p => p.id !== id));
      setToast({ message: 'Профиль удален!', type: 'success' });
    } catch (error: any) {
      console.error('Admin: Error deleting profile:', error);
      setToast({ message: 'Ошибка: ' + error.message, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) return;
    console.log('Admin: Deleting comment:', id);
    setActionLoading(id);
    try {
      const { error, count } = await supabase.from('comments').delete({ count: 'exact' }).eq('id', id);
      if (error) throw error;
      if (count === 0) throw new Error('У вас нет прав на удаление или комментарий не найден.');
      
      setComments(prev => prev.filter(c => c.id !== id));
      setToast({ message: 'Комментарий удален!', type: 'success' });
    } catch (error: any) {
      console.error('Admin: Error deleting comment:', error);
      setToast({ message: 'Ошибка: ' + error.message, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleDraft = async (article: Article) => {
    console.log('Admin: Toggling draft for:', article.id);
    setActionLoading(article.id);
    try {
      const { error, count } = await supabase
        .from('articles')
        .update({ is_draft: !article.is_draft }, { count: 'exact' })
        .eq('id', article.id);
      
      if (error) throw error;
      if (count === 0) throw new Error('У вас нет прав на изменение или статья не найдена.');
      
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, is_draft: !a.is_draft } : a));
      setToast({ 
        message: article.is_draft ? 'Статья опубликована!' : 'Статья переведена в черновики!', 
        type: 'success' 
      });
    } catch (error: any) {
      console.error('Admin: Error toggling draft:', error);
      setToast({ message: 'Ошибка: ' + error.message, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleApplyChanges = async (id: string) => {
    console.log('Admin: Applying article changes for:', id);
    setActionLoading(id);
    try {
      const { error, count } = await supabase
        .from('articles')
        .update({ 
          title: editTitle,
          category: editCategory
        }, { count: 'exact' })
        .eq('id', id);
      
      if (error) throw error;
      if (count === 0) throw new Error('У вас нет прав на изменение или статья не найдена.');
      
      setArticles(prev => prev.map(a => a.id === id ? { ...a, title: editTitle, category: editCategory } : a));
      setEditingArticleId(null);
      setToast({ message: 'Статья обновлена!', type: 'success' });
      await fetchAllData(); // Refresh to be sure
    } catch (error: any) {
      console.error('Admin: Error updating article:', error);
      setToast({ message: 'Ошибка: ' + error.message, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const startEditing = (article: Article) => {
    setEditingArticleId(article.id);
    setEditTitle(article.title);
    setEditCategory(article.category);
  };

  const handleApplyProfileChanges = async (id: string) => {
    console.log('Admin: Applying profile changes for:', id);
    setActionLoading(id);
    try {
      const formattedUsername = editUsername.startsWith('@') ? editUsername : `@${editUsername}`;
      const { error, count } = await supabase
        .from('profiles')
        .update({ 
          username: formattedUsername,
          bio: editBio,
          badge: editBadge,
          is_verified: editIsVerified
        }, { count: 'exact' })
        .eq('id', id);
      
      if (error) throw error;
      if (count === 0) throw new Error('У вас нет прав на изменение или профиль не найден.');
      
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, username: formattedUsername, bio: editBio, badge: editBadge, is_verified: editIsVerified } : p));
      setEditingProfileId(null);
      setToast({ message: 'Профиль обновлен!', type: 'success' });
      await fetchAllData(); // Refresh to be sure
    } catch (error: any) {
      console.error('Admin: Error updating profile:', error);
      setToast({ message: 'Ошибка: ' + error.message, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const startEditingProfile = (profile: Profile) => {
    setEditingProfileId(profile.id);
    setEditUsername(profile.username);
    setEditBio(profile.bio || '');
    setEditBadge(profile.badge || '');
    setEditIsVerified(profile.is_verified || false);
  };

  const toggleBan = async (profile: Profile) => {
    console.log('Admin: Toggling ban for:', profile.id);
    setActionLoading(profile.id);
    try {
      const { error, count } = await supabase
        .from('profiles')
        .update({ is_banned: !profile.is_banned }, { count: 'exact' })
        .eq('id', profile.id);
      
      if (error) throw error;
      if (count === 0) throw new Error('У вас нет прав на это действие (RLS блокирует обновление).');
      
      setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, is_banned: !profile.is_banned } : p));
      setToast({ 
        message: profile.is_banned ? 'Пользователь разбанен!' : 'Пользователь забанен!', 
        type: 'success' 
      });
      await fetchAllData(); // Refresh to be sure
    } catch (error: any) {
      console.error('Admin: Error toggling ban:', error);
      setToast({ message: 'Ошибка: ' + error.message, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleApplyCommentChanges = async (id: string) => {
    console.log('Admin: Applying comment changes for:', id);
    setActionLoading(id);
    try {
      const { error, count } = await supabase
        .from('comments')
        .update({ 
          content: editCommentContent
        }, { count: 'exact' })
        .eq('id', id);
      
      if (error) throw error;
      if (count === 0) throw new Error('У вас нет прав на изменение или комментарий не найден.');
      
      setComments(prev => prev.map(c => c.id === id ? { ...c, content: editCommentContent } : c));
      setEditingCommentId(null);
      setToast({ message: 'Комментарий обновлен!', type: 'success' });
      await fetchAllData(); // Refresh to be sure
    } catch (error: any) {
      console.error('Admin: Error updating comment:', error);
      setToast({ message: 'Ошибка: ' + error.message, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const startEditingComment = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProfiles = profiles.filter(p => 
    p.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComments = comments.filter(c => 
    c.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.profiles?.username || c.author_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl"
        >
          <div className="w-16 h-16 bg-zinc-900 dark:bg-zinc-100 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-lg">
            <Shield className="w-8 h-8 text-white dark:text-zinc-900" />
          </div>
          <h2 className="text-2xl font-black mb-2 text-center dark:text-zinc-100 tracking-tight">ADMIN ACCESS</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center mb-8">введите секретный ключ для входа (v2.0)</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-4 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100 font-mono"
                placeholder="••••••••••••"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-black hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-zinc-900/10 dark:shadow-white/5"
            >
              АВТОРИЗОВАТЬСЯ
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-widest">System</span>
            <h2 className="text-4xl font-black dark:text-zinc-100 tracking-tighter">АДМИН-ПАНЕЛЬ</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">Управление контентом, пользователями и безопасностью</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${
                  toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
            />
          </div>
          <button 
            onClick={fetchAllData}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2 font-bold text-sm"
          >
            <Zap className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Обновить данные
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Выход
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-zinc-100 dark:bg-zinc-900/50 rounded-3xl w-fit border border-zinc-200 dark:border-zinc-800">
        {[
          { id: 'stats', label: 'Статистика', icon: BarChart3 },
          { id: 'articles', label: 'Статьи', icon: FileText },
          { id: 'users', label: 'Пользователи', icon: Users },
          { id: 'comments', label: 'Комментарии', icon: MessageCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-md ring-1 ring-zinc-200 dark:ring-zinc-700' 
                : 'text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Всего статей', value: articles.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Пользователей', value: profiles.length, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Комментариев', value: comments.length, icon: MessageCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-4xl font-black dark:text-zinc-100 mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xl font-black mb-6 dark:text-zinc-100 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-500" /> Последние действия
            </h3>
            <div className="space-y-4">
              {articles.slice(0, 3).map(a => (
                <div key={a.id} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm dark:text-zinc-300 font-medium">Новая статья: <span className="font-bold text-zinc-900 dark:text-zinc-100">{a.title}</span></span>
                  </div>
                  <span className="text-xs text-zinc-500">{new Date(a.created_at || '').toLocaleDateString()}</span>
                </div>
              ))}
              {comments.slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm dark:text-zinc-300 font-medium">Новый комментарий от <span className="font-bold text-zinc-900 dark:text-zinc-100">{c.profiles?.username || c.author_name || 'Аноним'}</span></span>
                  </div>
                  <span className="text-xs text-zinc-500">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Статья</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Автор</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Просмотры</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Статус</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img src={article.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                        <div className="flex-1">
                          {editingArticleId === article.id ? (
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 dark:text-zinc-100 mb-2"
                            />
                          ) : (
                            <div className="font-bold text-sm dark:text-zinc-100 line-clamp-1 mb-1">{article.title}</div>
                          )}
                          <div className="flex items-center gap-2">
                            {editingArticleId === article.id ? (
                              <select
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-[10px] focus:outline-none dark:text-zinc-100"
                              >
                                {['Новости', 'Инструкции', 'Технологии', 'Обзоры'].map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">{article.category}</span>
                            )}
                            <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {article.read_time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                          <User className="w-3 h-3 text-zinc-500" />
                        </div>
                        <span className="text-sm dark:text-zinc-300 font-bold">{article.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-bold text-sm">
                        <Eye className="w-4 h-4" />
                        {article.views_count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        article.is_draft 
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                        {article.is_draft ? 'Черновик' : 'Опубликовано'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {editingArticleId === article.id ? (
                          <>
                            <button 
                               onClick={() => handleApplyChanges(article.id)}
                               disabled={actionLoading === article.id}
                               className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                             >
                               {actionLoading === article.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Применить
                             </button>
                            <button 
                              onClick={() => setEditingArticleId(null)}
                              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => toggleDraft(article)}
                              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                              title={article.is_draft ? "Опубликовать" : "В черновики"}
                            >
                              {article.is_draft ? <ShieldCheck className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => startEditing(article)}
                              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                              title="Быстрое редактирование"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => navigate(`/edit/${article.id}`)}
                              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                              title="Полное редактирование"
                            >
                              <FileEdit className="w-4 h-4" />
                            </button>
                            <Link 
                              to={`/article/${article.id}`}
                              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                              title="Просмотр"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDeleteArticle(article.id)}
                              disabled={actionLoading === article.id}
                              className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-zinc-700 dark:text-zinc-400 hover:text-red-600 disabled:opacity-50"
                              title="Удалить"
                            >
                              {actionLoading === article.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Профиль</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Регистрация</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shadow-sm">
                          {p.avatar_url ? (
                            <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-zinc-500" />
                          )}
                        </div>
                        <div>
                          {editingProfileId === p.id ? (
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 dark:text-zinc-100"
                                placeholder="Username"
                              />
                              <textarea
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 dark:text-zinc-100 min-h-[60px] resize-none"
                                placeholder="Bio"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editBadge}
                                  onChange={(e) => setEditBadge(e.target.value)}
                                  className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-[10px] focus:outline-none dark:text-zinc-100"
                                  placeholder="Badge (e.g. Админ)"
                                />
                                <label className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editIsVerified}
                                    onChange={(e) => setEditIsVerified(e.target.checked)}
                                    className="rounded border-zinc-300 dark:border-zinc-700"
                                  />
                                  Галочка
                                </label>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5">
                                <div className="font-bold text-sm dark:text-zinc-100">{p.username}</div>
                                {p.is_verified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-500 line-clamp-1 max-w-[200px]">{p.bio || "Нет описания"}</div>
                              {p.badge && (
                                <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[8px] font-black uppercase tracking-wider">
                                  {p.badge}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-mono text-zinc-500">{p.id}</td>
                    <td className="px-6 py-5 text-sm text-zinc-500 font-medium">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingProfileId === p.id ? (
                          <>
                            <button 
                               onClick={() => handleApplyProfileChanges(p.id)}
                               disabled={actionLoading === p.id}
                               className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                             >
                               {actionLoading === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Применить
                             </button>
                            <button 
                              onClick={() => setEditingProfileId(null)}
                              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => toggleBan(p)}
                              disabled={actionLoading === p.id}
                              className={`p-2.5 rounded-xl transition-colors disabled:opacity-50 ${
                                p.is_banned 
                                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-400'
                              }`}
                              title={p.is_banned ? "Разбанить" : "Забанить"}
                            >
                              {actionLoading === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => startEditingProfile(p)}
                              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                              title="Редактировать"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <Link 
                              to={`/profile/${p.id}`}
                              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                              title="Просмотр"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDeleteProfile(p.id)}
                              disabled={actionLoading === p.id}
                              className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-zinc-700 dark:text-zinc-400 hover:text-red-600 disabled:opacity-50"
                              title="Удалить"
                            >
                              {actionLoading === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Комментарий</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Статья</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Автор</th>
                  <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredComments.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-5">
                      {editingCommentId === c.id ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={editCommentContent}
                            onChange={(e) => setEditCommentContent(e.target.value)}
                            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 dark:text-zinc-100 w-full min-h-[80px] resize-none"
                          />
                          <div className="text-[10px] text-zinc-500">{new Date(c.created_at).toLocaleString()}</div>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm dark:text-zinc-100 line-clamp-2 max-w-md font-medium leading-relaxed">{c.content}</div>
                          <div className="text-[10px] text-zinc-500 mt-1">{new Date(c.created_at).toLocaleString()}</div>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs text-zinc-500 font-bold line-clamp-1 max-w-[200px]">
                        {c.articles?.title || 'Удаленная статья'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm dark:text-zinc-300 font-bold">{c.profiles?.username || c.author_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingCommentId === c.id ? (
                          <>
                            <button 
                               onClick={() => handleApplyCommentChanges(c.id)}
                               disabled={actionLoading === c.id}
                               className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                             >
                               {actionLoading === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Применить
                             </button>
                            <button 
                              onClick={() => setEditingCommentId(null)}
                              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEditingComment(c)}
                              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-400"
                              title="Редактировать"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteComment(c.id)}
                              disabled={actionLoading === c.id}
                              className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-zinc-700 dark:text-zinc-400 hover:text-red-600 disabled:opacity-50"
                              title="Удалить"
                            >
                              {actionLoading === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const TermsView = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto py-12 px-4"
    >
      <h1 className="text-4xl font-bold mb-8 dark:text-zinc-100">Условия использования</h1>
      
      <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">1. Принятие условий</h2>
          <p>
            Используя платформу vlessfree, вы соглашаетесь соблюдать данные Условия использования. Если вы не согласны с каким-либо пунктом, пожалуйста, прекратите использование сервиса.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">2. Правила сообщества</h2>
          <p>
            Пользователи несут полную ответственность за публикуемый контент. Запрещено:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Публиковать контент, нарушающий законодательство.</li>
            <li>Публиковать контент, содержащий чужие личные данные, порнографию, и так далее.</li>
            <li>Оскорблять других участников сообщества.</li>
            <li>Распространять спам или вредоносное ПО.</li>
            <li>Выдавать себя за других лиц или представителей администрации.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">3. Интеллектуальная собственность</h2>
          <p>
            Вы сохраняете права на контент, который создаете. Однако, публикуя его на vlessfree, вы предоставляете нам неисключительную лицензию на его отображение, хранение и распространение в рамках работы сервиса.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">4. Модерация и блокировка</h2>
          <p>
            Администрация оставляет за собой право удалять контент или блокировать аккаунты пользователей, нарушающих данные правила, без предварительного уведомления.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">5. Отказ от ответственности</h2>
          <p>
            Сервис предоставляется "как есть". Мы не гарантируем бесперебойную работу и не несем ответственности за возможную потерю данных или ущерб, возникший в результате использования платформы.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">6. Изменения условий</h2>
          <p>
            Мы можем обновлять данные условия в любое время. Продолжение использования сервиса после внесения изменений означает ваше согласие с новой редакцией.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <Link to="/" className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:underline">
          ← Вернуться на главную
        </Link>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    // Listen for auth changes in Firebase
    const unsubscribe = onIdTokenChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        setUser(firebaseUser);
        fetchProfile(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
        setProfileLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (userOrId: FirebaseUser | string) => {
    const userId = typeof userOrId === 'string' ? userOrId : userOrId.uid;
    setProfileLoading(true);
    setProfileError(null);

    if (!isSupabaseConfigured) {
      // Mock profile for demo mode
      setProfile({
        id: userId,
        username: typeof userOrId !== 'string' ? userOrId.displayName || 'Demo User' : 'Demo User',
        avatar_url: typeof userOrId !== 'string' ? userOrId.photoURL || '' : '',
        banner_url: '',
        bio: 'Это демо-профиль. Подключите Supabase для сохранения данных.',
        created_at: new Date().toISOString()
      });
      setProfileLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          let email = '';
          let displayName = '';
          
          if (typeof userOrId !== 'string') {
            email = userOrId.email || '';
            displayName = userOrId.displayName || '';
          } else if (user) {
            email = user.email || '';
            displayName = user.displayName || '';
          }

          const username = displayName || (email ? `@${email.split('@')[0]}` : `@user_${userId.slice(0, 8)}`);
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ id: userId, username }])
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating profile for new user:', createError);
            setProfileError('Ошибка при создании профиля. Пожалуйста, убедитесь, что таблица profiles создана в Supabase.');
          } else {
            setProfile(newProfile);
          }
        } else {
          console.error('Error fetching profile:', error);
          setProfileError(`Ошибка при получении профиля: ${error.message}`);
          
          // Fallback to basic info so the app doesn't break completely
          if (typeof userOrId !== 'string') {
            setProfile({
              id: userId,
              username: userOrId.displayName || `@user_${userId.slice(0, 8)}`,
              avatar_url: userOrId.photoURL || '',
              banner_url: '',
              bio: 'Профиль загружен в ограниченном режиме из-за ошибки базы данных.',
              created_at: new Date().toISOString()
            });
          }
        }
      } else {
        setProfile(data);
        // Check if user is banned
        if (data?.is_banned) {
          console.warn('User is banned, logging out...');
          await auth.signOut();
          setUser(null);
          setProfile(null);
        }
      }
    } catch (err: any) {
      console.error('Unexpected error in fetchProfile:', err);
      setProfileError(err.message || 'Произошла непредвиденная ошибка');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 bg-zinc-50 dark:bg-zinc-950 selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900 ${isDark ? 'dark' : ''}`}>
        {!isSupabaseConfigured && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertIcon className="w-3 h-3" />
                режим демо: база данных не подключена.
              </p>
              <Link 
                to="/auth" 
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors"
              >
                подключить supabase
              </Link>
            </div>
          </div>
        )}
        <Navbar 
          isDark={isDark} 
          toggleDark={() => setIsDark(!isDark)} 
          user={user}
          profile={profile}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeView user={user} />} />
              <Route path="/article/:id" element={<ArticleDetail user={user} />} />
              <Route path="/profile/:author" element={<ProfileView user={user} />} />
              <Route path="/create" element={user ? <ArticleEditor user={user} profile={profile} /> : <Navigate to="/auth" />} />
              <Route path="/edit/:id" element={user ? <ArticleEditor user={user} profile={profile} /> : <Navigate to="/auth" />} />
              <Route path="/settings" element={user ? <SettingsView profile={profile} profileLoading={profileLoading} profileError={profileError} onUpdate={() => fetchProfile(user)} /> : <Navigate to="/auth" />} />
              <Route path="/admin" element={<AdminView />} />
              <Route path="/terms" element={<TermsView />} />
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
              <div className="flex items-center gap-6">
                <Link to="/terms" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">условия использования</Link>
                <div className="text-sm text-zinc-400 dark:text-zinc-600">
                  © 2026 vlessfree. все права защищены.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
