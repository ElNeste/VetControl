import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate as per RNF20: Campo de usuario / Campo de contraseña
    if (!username.trim()) {
      setError('Por favor, ingrese su usuario.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor, ingrese su contraseña.');
      return;
    }

    // Interactive hypothetical user mapping
    const normalizedUser = username.trim().toLowerCase();
    let finalName = '';
    
    if (normalizedUser === 'admin') {
      finalName = 'Dr. Ricardo Méndez';
    } else if (normalizedUser === 'vet') {
      finalName = 'Dra. Marta Valle';
    } else {
      // Capitalize the entered username for custom simulation
      const formattedUser = username.trim().charAt(0).toUpperCase() + username.trim().slice(1);
      finalName = `Dr. ${formattedUser}`;
    }

    onLoginSuccess(finalName);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="w-full max-w-[440px] flex flex-col items-center relative z-10">
        
        {/* Brand identity header */}
        <header className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md transform hover:rotate-6 transition-transform">
              <span className="text-white text-3xl font-bold font-mono">🐾</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">VetControl</h1>
          <p className="text-sm text-slate-500 mt-1">Acceso Seguro para Profesionales</p>
        </header>

        {/* Login Form Card */}
        <div className="w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow transition-shadow">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Error Message if valid state fail */}
            {error && (
              <div id="login-error" className="flex items-start gap-2.5 bg-red-50 border-l-4 border-red-500 p-3.5 rounded-lg text-red-800 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1" htmlFor="username">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Cualquier nombre de usuario"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-700" htmlFor="password">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-600 font-semibold hover:underline"
                  onClick={() => alert('El inicio de sesión es hipotético. Puede ingresar cualquier usuario y contraseña para simular el ingreso.')}
                >
                  ¿Cómo ingresar?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-10 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Cualquier contraseña"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-btn"
              type="submit"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              <span>Iniciar Sesión</span>
              <span>→</span>
            </button>
          </form>
        </div>

        {/* Third Party Login / Decors */}
        <footer className="mt-8 text-center flex flex-col gap-5 w-full">
          <div className="flex items-center gap-3">
            <div className="h-[1px] bg-slate-200 flex-grow"></div>
            <span className="text-xs text-slate-400 font-medium font-sans">O continuar con</span>
            <div className="h-[1px] bg-slate-200 flex-grow"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onLoginSuccess('Profesional Google')}
              className="flex items-center justify-center gap-2 h-11 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 active:scale-95 transition-all text-sm font-medium"
            >
              <img
                alt="Google"
                className="w-4 h-4 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0d--xgSKjkL2ZFiTfM4VnSzVF3vlvkkJG7_lZMasDyItuNWNEx0VPVZMZ5GjCBiYXWIXVr4gUtfj8wAZN0aWQl3Mxu30rkznLDHF4PWUaQXTGWwUwV3zqFGlQq2GS9jyjZ_tes_qlRVimjYkwk6BAT8D6vwIIGHDQYCwZrnkGpVBP1dUhFpbTqjvChprLjQt8IxtG2xOFB4NI8mXYKaK94qYqz1s9Am1DXRLr16DTAZlOOuvkM-0zh49A6fsYF-yfx0YcB215LHU8"
              />
              <span>Google</span>
            </button>
            <button
              onClick={() => onLoginSuccess('Directorio Clínico')}
              className="flex items-center justify-center gap-2 h-11 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 active:scale-95 transition-all text-sm font-medium text-slate-800"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Directorio</span>
            </button>
          </div>

          <div className="mt-6 text-xs text-slate-400">
            <p>© 2026 VetControl. Todos los derechos reservados.</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="#" className="hover:text-blue-600">Términos</a>
              <a href="#" className="hover:text-blue-600">Privacidad</a>
              <a href="#" className="hover:text-blue-600">Soporte</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Subtle Clinical Decors */}
      <div className="absolute top-10 right-10 opacity-[0.02] text-slate-900 pointer-events-none select-none">
        <ShieldCheck className="w-[300px] h-[300px]" />
      </div>
      <div className="absolute -bottom-16 -left-16 opacity-[0.02] text-slate-900 pointer-events-none select-none">
        <div className="text-[350px]">❤️</div>
      </div>
    </div>
  );
}
