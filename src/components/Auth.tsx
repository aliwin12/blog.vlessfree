import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { auth, googleProvider } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Auth = () => {
  const navigate = useNavigate();
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
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update display name in Firebase
        await updateProfile(user, {
          displayName: username.startsWith('@') ? username : `@${username}`
        });

        // Send verification email
        await sendEmailVerification(user);
        
        setSuccess('Ссылка для подтверждения отправлена на вашу почту!');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (!user.emailVerified) {
          setError('Пожалуйста, подтвердите вашу почту перед входом. Проверьте папку "Спам".');
          return;
        }

        // Check ban status in Supabase using Firebase UID
        const { data: pData } = await supabase
          .from('profiles')
          .select('is_banned')
          .eq('id', user.uid)
          .single();
        
        if (pData?.is_banned) {
          await auth.signOut();
          throw new Error('Ваш аккаунт заблокирован. Доступ запрещен.');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = 'Произошла ошибка при авторизации';
      if (err.code === 'auth/email-already-in-use') message = 'Этот email уже используется';
      if (err.code === 'auth/invalid-credential') message = 'Неверный email или пароль';
      if (err.code === 'auth/weak-password') message = 'Пароль слишком слабый';
      setError(err.message || message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setSuccess('Новая ссылка для подтверждения отправлена!');
      } else {
        throw new Error('Сначала войдите в систему');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при повторной отправке');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          setSuccess('Почта подтверждена! Теперь вы можете войти.');
          // Optional: automatically login or redirect
          navigate('/');
        } else {
          setError('Почта все еще не подтверждена. Пожалуйста, проверьте ваш почтовый ящик.');
        }
      } else {
        throw new Error('Сначала войдите в систему');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при проверке');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check ban status in Supabase
      const { data: pData } = await supabase
        .from('profiles')
        .select('is_banned')
        .eq('id', user.uid)
        .single();
      
      if (pData?.is_banned) {
        await auth.signOut();
        throw new Error('Ваш аккаунт заблокирован. Доступ запрещен.');
      }
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'Ошибка при входе через Google');
      setLoading(false);
    }
  };

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
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-widest mb-2 ml-1">
                    email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
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
                    <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-widest mb-2 ml-1">
                      имя пользователя
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
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
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-widest mb-2 ml-1">
                    пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
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
                  <div className="space-y-2">
                    <div className="text-red-500 text-xs font-medium px-1 flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </div>
                    {error.includes('подтвердите вашу почту') && (
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={handleResendConfirmation}
                          className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-bold uppercase tracking-widest ml-1 underline underline-offset-4 text-left"
                        >
                          отправить ссылку повторно
                        </button>
                        <button
                          type="button"
                          onClick={handleCheckVerification}
                          className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-bold uppercase tracking-widest ml-1 underline underline-offset-4 text-left"
                        >
                          я подтвердил почту
                        </button>
                      </div>
                    )}
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

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500 font-bold tracking-widest">или</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-2xl py-3 text-sm font-bold flex items-center justify-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  войти через Google
                </button>

                {isSignUp && (
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-600 text-center px-4 leading-relaxed">
                    Регистрируясь, вы соглашаетесь с{' '}
                    <Link to="/terms" className="text-zinc-900 dark:text-zinc-100 font-bold hover:underline">
                      условиями использования
                    </Link>
                  </p>
                )}
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
