import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/use-api';
import { useAuthStore } from '../stores/auth.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Vote } from 'lucide-react';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Minimo 2 caracteres'),
    email: z.string().email('Email invalido'),
    password: z.string().min(6, 'Minimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerMutation.mutateAsync({
        input: { name: data.name, email: data.email, password: data.password },
      });
      login(result.register);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center">
            <Vote size={40} className="text-green" strokeWidth={1.8} />
          </div>
          <h1 className="text-4xl font-display font-800 text-white tracking-tight">
            Crear cuenta
          </h1>
          <p className="text-gray-400 mt-3 text-[16px]">Registrate para empezar a usar ControlProject</p>
        </div>

        {registerMutation.isError && (
          <div className="mb-6 p-4 rounded-xl bg-red/10 border border-red/20 text-red text-sm font-medium">
            Error al registrar. Intenta con otro email.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[15px] font-semibold text-gray-300 mb-2.5">
              Nombre completo
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={22}
                strokeWidth={1.8}
              />
              <input
                type="text"
                {...register('name')}
                placeholder="Tu nombre"
                className="w-full pl-14 pr-4 py-4 bg-navy-light border border-white/10 rounded-xl text-white text-[16px] placeholder:text-gray-600 focus:outline-none focus:border-green/50 focus:ring-2 focus:ring-green/10 transition-all"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red">{errors.name.message}</p>
            )}
          </div>

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

          <div>
            <label className="block text-[15px] font-semibold text-gray-300 mb-2.5">
              Confirmar contrasena
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={22}
                strokeWidth={1.8}
              />
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="Repite tu contrasena"
                className="w-full pl-14 pr-4 py-4 bg-navy-light border border-white/10 rounded-xl text-white text-[16px] placeholder:text-gray-600 focus:outline-none focus:border-green/50 focus:ring-2 focus:ring-green/10 transition-all"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-4 bg-green text-navy font-semibold rounded-xl hover:bg-green-dim transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 text-[16px]"
          >
            {registerMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={22} strokeWidth={2} />
                Crear cuenta
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-green hover:text-green-dim transition-colors font-semibold"
          >
            Inicia sesion
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
