import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/use-api';
import { useAuthStore } from '../stores/auth.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Vote } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginMutation.mutateAsync({ input: data });
      login(result.login);
      navigate('/');
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleGoogleLogin = () => {
    window.open(
      `http://localhost:3000/api/auth/google`,
      '_blank',
      'width=500,height=600',
    );
  };

  return (
    <div className="min-h-screen flex bg-navy">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-navy-light relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-32 right-16 w-80 h-80 bg-green/[0.04] rounded-full blur-[100px]" />
          <div className="absolute bottom-24 left-20 w-64 h-64 bg-violet/[0.04] rounded-full blur-[80px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-12"
        >
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center">
            <Vote size={44} className="text-green" strokeWidth={1.8} />
          </div>
          <h1 className="text-5xl font-display font-800 text-white mb-4 tracking-tight">
            ControlProject
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
            Votacion electronica para asambleas de propiedad horizontal
          </p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-lg"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3.5 mb-12">
            <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center">
              <Vote size={26} className="text-green" />
            </div>
            <span className="text-white font-display font-800 text-xl">ControlProject</span>
          </div>

          <h2 className="text-4xl font-display font-800 text-white mb-3 tracking-tight">
            Iniciar sesion
          </h2>
          <p className="text-gray-400 mb-10 text-[16px]">
            Ingresa tus credenciales para acceder
          </p>

          {loginMutation.isError && (
            <div className="mb-6 p-4 rounded-xl bg-red/10 border border-red/20 text-red text-sm font-medium">
              Credenciales incorrectas. Verifica tu email y contrasena.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[15px] font-semibold text-gray-300 mb-2.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={22}
                  strokeWidth={1.8}
                />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="tu@email.com"
                  className="w-full pl-14 pr-4 py-4 bg-navy-light border border-white/10 rounded-xl text-white text-[16px] placeholder:text-gray-600 focus:outline-none focus:border-green/50 focus:ring-2 focus:ring-green/10 transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[15px] font-semibold text-gray-300 mb-2.5">
                Contrasena
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={22}
                  strokeWidth={1.8}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Minimo 6 caracteres"
                  className="w-full pl-14 pr-14 py-4 bg-navy-light border border-white/10 rounded-xl text-white text-[16px] placeholder:text-gray-600 focus:outline-none focus:border-green/50 focus:ring-2 focus:ring-green/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg"
                >
                  {showPassword ? <EyeOff size={22} strokeWidth={1.8} /> : <Eye size={22} strokeWidth={1.8} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-4 bg-green text-navy font-semibold rounded-xl hover:bg-green-dim transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 text-[16px]"
            >
              {loginMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={22} strokeWidth={2} />
                  Iniciar sesion
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-navy text-gray-500">o continua con</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-3 text-[16px]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-500">
            No tienes cuenta?{' '}
            <Link
              to="/register"
              className="text-green hover:text-green-dim transition-colors font-semibold"
            >
              Registrate
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
