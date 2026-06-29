import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login({ errors }) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        router.post('/login', { email, password });
    };

    const fill = (e, p) => { setEmail(e); setPassword(p); };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: '#0a0a0a' }}>

            {/* Fondo decorativo */}
            <div className="fixed inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(245,166,35,0.06) 0%, transparent 55%)',
            }} />

            <div className="relative z-10 w-full max-w-md animate-fadeIn">

                {/* Card principal */}
                <div className="rounded-2xl p-8 space-y-7" style={{ background: '#111', border: '1px solid #222' }}>

                    {/* Logo */}
                    <div className="flex flex-col items-center space-y-4">
                        <img src="/images/logo-torq.png" alt="Torq" className="w-44 object-contain" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
                            style={{ color: '#F5A623', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
                            Acceso al Sistema
                        </span>
                    </div>

                    {/* Error */}
                    {errors && (errors.email || errors.error) && (
                        <div className="flex items-center gap-2 p-3 rounded-xl text-xs"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errors.email || errors.error}</span>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3 w-4 h-4" style={{ color: '#555' }} />
                                <input
                                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                                    placeholder="usuario@torq.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3 w-4 h-4" style={{ color: '#555' }} />
                                <input
                                    type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm"
                                    placeholder="••••••••"
                                />
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

                    {/* Accesos rápidos de prueba */}
                    <div style={{ borderTop: '1px solid #222' }} className="pt-5">
                        <p className="text-center text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#F5A623' }}>
                            Cuentas de prueba · Clave: 123456
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Admin', email: 'admin1@torq.com' },
                                { label: 'Mecánico', email: 'mecanico1@torq.com' },
                                { label: 'Cliente', email: 'cliente1@torq.com' },
                            ].map(u => (
                                <button key={u.label} type="button"
                                    onClick={() => fill(u.email, '123456')}
                                    className="py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition"
                                    style={{ background: '#161616', border: '1px solid #2a2a2a', color: '#888' }}
                                    onMouseOver={e => { e.currentTarget.style.borderColor='rgba(245,166,35,0.4)'; e.currentTarget.style.color='#F5A623'; }}
                                    onMouseOut={e => { e.currentTarget.style.borderColor='#2a2a2a'; e.currentTarget.style.color='#888'; }}
                                >
                                    {u.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-center text-[11px] mt-4" style={{ color: '#444' }}>
                    Torq · Software de Gestión de Maquinaria
                </p>
            </div>
        </div>
    );
}
