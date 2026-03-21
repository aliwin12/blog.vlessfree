import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        if (username.length < 3) throw new Error('Имя пользователя должно быть не менее 3 символов');
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        
        if (signUpData.user) {
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: signUpData.user.id,
              username: username.startsWith('@') ? username : `@${username}`,
            }
          ]);
          if (profileError) {
            console.error('Error creating profile:', profileError);
            // We don't throw here to allow sign up to complete even if profile fails
          }
        }
        
        setSuccess('Проверьте вашу почту для подтверждения регистрации!');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Произошла ошибка при авторизации');
    } finally {
      setLoading(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto px-4 py-12"
      >
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200 mb-2">Supabase не настроен</h2>
          <p className="text-amber-700 dark:text-amber-400 text-sm mb-6">
            Для работы системы аккаунтов необходимо добавить переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.
          </p>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 text-left font-mono text-xs text-zinc-500 dark:text-zinc-400 border border-amber-100 dark:border-amber-900/20">
            <p>1. Перейдите в настройки Supabase</p>
            <p>2. Скопируйте URL и Anon Key</p>
            <p>3. Добавьте их в Settings {"->"} Secrets</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto px-4 py-12"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold dark:text-zinc-100 tracking-tight">
            {isSignUp ? 'создать аккаунт' : 'войти в систему'}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            {isSignUp ? 'присоединяйтесь к сообществу vlessfree' : 'с возвращением в vlessfree'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl p-4 flex items-start gap-3 mb-4"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  {success}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="auth-fields"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2 ml-1">
                    email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2 ml-1">
                      имя пользователя
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required={isSignUp}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
                        placeholder="@username"
                      />
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2 ml-1">
                    пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-xs font-medium px-1 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl py-3 text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'зарегистрироваться' : 'войти'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(null);
            }}
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            {isSignUp ? 'уже есть аккаунт? войти' : 'нет аккаунта? зарегистрироваться'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
