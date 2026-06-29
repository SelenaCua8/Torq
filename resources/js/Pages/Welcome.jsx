import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Torq — Software de Gestión de Maquinaria" />
            <div className="min-h-screen font-sans" style={{ background: '#0a0a0a', color: '#E8E8E8' }}>

                {/* NAV */}
                <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'rgba(10,10,10,0.95)', borderColor: '#222', backdropFilter: 'blur(12px)' }}>
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <img src="/images/logo-torq.png" alt="Torq" className="h-10 object-contain" />
                        <nav className="flex items-center gap-6 text-sm">
                            <a href="#funciones" className="transition" style={{ color: '#888' }} onMouseOver={e => e.target.style.color='#F5A623'} onMouseOut={e => e.target.style.color='#888'}>Funciones</a>
                            <a href="#roles" className="transition" style={{ color: '#888' }} onMouseOver={e => e.target.style.color='#F5A623'} onMouseOut={e => e.target.style.color='#888'}>Roles</a>
                            {auth?.user ? (
                                <Link href={route('dashboard')} className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition" style={{ background: '#F5A623', color: '#0a0a0a' }}>
                                    Ir al Panel
                                </Link>
                            ) : (
                                <Link href={route('login')} className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition" style={{ background: '#F5A623', color: '#0a0a0a' }}>
                                    Iniciar Sesión
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* HERO */}
                <section className="relative flex items-center justify-center min-h-screen pt-20 overflow-hidden">
                    {/* Fondo con grid sutil */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(245,166,35,0.07) 0%, transparent 60%), linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
                        backgroundSize: 'auto, 60px 60px, 60px 60px'
                    }} />

                    <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                        <img src="/images/logo-torq.png" alt="Torq" className="h-28 object-contain mx-auto mb-10" />

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8" style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            Software de Gestión de Maquinaria Pesada
                        </div>

                        <h1 className="text-6xl font-black tracking-tight leading-none mb-6" style={{ color: '#E8E8E8' }}>
                            Toda tu flota,<br />
                            <span style={{ color: '#F5A623' }}>bajo control.</span>
                        </h1>

                        <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: '#888' }}>
                            Gestioná alquileres, mecánicos y clientes desde un solo lugar. Control de horómetros, alertas de service automáticas y analíticas reales en tiempo real.
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <Link href={route('login')} className="px-8 py-4 rounded-xl font-black uppercase tracking-wider text-sm transition-all torq-glow" style={{ background: '#F5A623', color: '#0a0a0a' }}>
                                Acceder al sistema →
                            </Link>
                            <a href="#funciones" className="px-8 py-4 rounded-xl font-bold text-sm transition" style={{ border: '1px solid #333', color: '#888' }}>
                                Ver funciones
                            </a>
                        </div>
                    </div>

                    {/* Línea naranja decorativa */}
                    <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #F5A623, transparent)' }} />
                </section>

                {/* STATS */}
                <section style={{ background: '#111', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
                    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { num: '3', label: 'Roles integrados' },
                            { num: '23', label: 'Puntos de checklist' },
                            { num: '250h', label: 'Alertas automáticas' },
                            { num: '100%', label: 'Datos reales de DB' },
                        ].map(s => (
                            <div key={s.label} className="text-center">
                                <p className="text-4xl font-black" style={{ color: '#F5A623' }}>{s.num}</p>
                                <p className="text-sm mt-1" style={{ color: '#888' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FUNCIONES */}
                <section id="funciones" className="py-24 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#F5A623' }}>Plataforma completa</p>
                        <h2 className="text-4xl font-black" style={{ color: '#E8E8E8' }}>Todo lo que necesitás</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '📊',
                                title: 'Dashboard Analítico',
                                desc: 'Facturación real, margen por flota propia vs terceros y tasa de ocupación calculados directamente desde tu base de datos.',
                            },
                            {
                                icon: '🔧',
                                title: 'Control de Mantenimiento',
                                desc: 'Checklist digital de 23 puntos para mecánicos. Alertas automáticas por horómetro y notificación al admin por mail.',
                            },
                            {
                                icon: '📋',
                                title: 'Gestión de Alquileres',
                                desc: 'Contratos activos, fechas, precios pactados y cliente asignado por máquina. Historial completo auditado.',
                            },
                            {
                                icon: '👥',
                                title: 'Multi-Rol',
                                desc: 'Admin, Mecánico y Cliente con acceso diferenciado. El admin crea usuarios, nadie se registra solo.',
                            },
                            {
                                icon: '🚜',
                                title: 'Flota Propia y Terceros',
                                desc: 'Máquinas propias y de terceros con costo de subalquiler separado. El margen real siempre visible.',
                            },
                            {
                                icon: '📩',
                                title: 'Cotizaciones por Mail',
                                desc: 'Los clientes consultan disponibilidad y el admin recibe el pedido con todos los datos por correo.',
                            },
                        ].map(f => (
                            <div key={f.title} className="p-6 rounded-2xl transition group" style={{ background: '#111', border: '1px solid #222' }}
                                onMouseOver={e => e.currentTarget.style.borderColor='rgba(245,166,35,0.4)'}
                                onMouseOut={e => e.currentTarget.style.borderColor='#222'}
                            >
                                <div className="text-3xl mb-4">{f.icon}</div>
                                <h3 className="text-lg font-black mb-2" style={{ color: '#E8E8E8' }}>{f.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#888' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ROLES */}
                <section id="roles" style={{ background: '#111', borderTop: '1px solid #222' }}>
                    <div className="max-w-7xl mx-auto px-6 py-24">
                        <div className="text-center mb-16">
                            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#F5A623' }}>Accesos diferenciados</p>
                            <h2 className="text-4xl font-black" style={{ color: '#E8E8E8' }}>Un sistema, tres roles</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    role: 'Administrador',
                                    badge: 'Control total',
                                    color: '#F5A623',
                                    items: ['Dashboard con analíticas reales', 'Alta y baja de usuarios', 'Gestión de flota completa', 'Historial de checklists', 'Contratos y alquileres activos'],
                                },
                                {
                                    role: 'Mecánico',
                                    badge: 'Operativo',
                                    color: '#60a5fa',
                                    items: ['Ficha de taller por máquina', 'Checklist de 23 puntos', 'Bitácora de mantenimiento', 'Notificación al completar service', 'Alertas por horómetro'],
                                },
                                {
                                    role: 'Cliente',
                                    badge: 'Portal contratista',
                                    color: '#34d399',
                                    items: ['Ver equipos alquilados activos', 'Catálogo de disponibles con precios', 'Solicitar cotización por mail', 'Reportar asistencia técnica', 'Historial de contratos'],
                                },
                            ].map(r => (
                                <div key={r.role} className="p-6 rounded-2xl flex flex-col" style={{ background: '#161616', border: '1px solid #222' }}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
                                        <div>
                                            <h3 className="font-black text-lg" style={{ color: '#E8E8E8' }}>{r.role}</h3>
                                            <span className="text-[10px] uppercase font-black tracking-widest" style={{ color: r.color }}>{r.badge}</span>
                                        </div>
                                    </div>
                                    <ul className="space-y-3 flex-1">
                                        {r.items.map(item => (
                                            <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#888' }}>
                                                <span style={{ color: r.color, marginTop: '2px', flexShrink: 0 }}>✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA FINAL */}
                <section className="py-24 text-center px-6" style={{ background: '#0a0a0a' }}>
                    <h2 className="text-4xl font-black mb-4" style={{ color: '#E8E8E8' }}>Listo para operar.</h2>
                    <p className="mb-8 text-lg" style={{ color: '#888' }}>Ingresá al sistema y tomá el control de tu flota ahora.</p>
                    <Link href={route('login')} className="inline-block px-10 py-4 rounded-xl font-black uppercase tracking-wider text-sm torq-glow transition" style={{ background: '#F5A623', color: '#0a0a0a' }}>
                        Acceder a Torq →
                    </Link>
                </section>

                {/* FOOTER */}
                <footer className="py-6 text-center text-xs" style={{ borderTop: '1px solid #222', color: '#555' }}>
                    © {new Date().getFullYear()} Torq — Software de Gestión de Maquinaria. Todos los derechos reservados.
                </footer>
            </div>
        </>
    );
}
