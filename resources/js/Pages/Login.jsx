import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login({ errors }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        router.post('/login', { username, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: '#0a0a0a' }}>
            <div className="fixed inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(245,166,35,0.06) 0%, transparent 55%)',
            }} />

            <div className="relative z-10 w-full max-w-md animate-fadeIn">
                <div className="rounded-2xl p-8 space-y-7" style={{ background: '#111', border: '1px solid #222' }}>

                    <div className="flex flex-col items-center space-y-4">
                        <img src="/images/logo-torq.png" alt="Torq" className="w-44 object-contain" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
                            style={{ color: '#F5A623', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
                            Acceso al Sistema
                        </span>
                    </div>

                    {errors && (errors.username || errors.error) && (
                        <div className="flex items-center gap-2 p-3 rounded-xl text-xs"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errors.username || errors.error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>
                                Usuario
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-3 w-4 h-4" style={{ color: '#555' }} />
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" placeholder="tu_usuario" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3 w-4 h-4" style={{ color: '#555' }} />
                                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-3 transition" style={{ color: '#555' }}>
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit"
                            className="w-full py-3 mt-2 rounded-xl font-black text-sm uppercase tracking-[0.15em] transition-all torq-glow"
                            style={{ background: '#F5A623', color: '#0a0a0a' }}>
                            Ingresar al Sistema
                        </button>
                    </form>
                </div>

                <p className="text-center text-[11px] mt-4" style={{ color: '#444' }}>
                    Torq · Software de Gestión de Maquinaria
                </p>
            </div>
        </div>
    );
}