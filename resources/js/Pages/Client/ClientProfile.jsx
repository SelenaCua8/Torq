import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    Car, CheckCircle, Clock, LogOut, Wrench,
    Calendar, Send, MapPin, FileText, AlertTriangle,
    ChevronRight, Menu, X
} from 'lucide-react';
import api from '../../Services/api';

const C = '#F5A623';

export default function ClientProfile({ auth }) {
    const clientId   = auth?.user?.id   || 3;
    const clientName = auth?.user?.name || 'Cliente';

    const [activeTab, setActiveTab]   = useState('my-rentals');
    const [machines, setMachines]     = useState([]);
    const [reportingId, setReportingId] = useState(null);
    const [issueDescription, setIssueDesc] = useState('');
    const [quotingId, setQuotingId]   = useState(null);
    const [quoteForm, setQuoteForm]   = useState({ startDate:'', endDate:'', location:'', notes:'' });
    const [sending, setSending]       = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchMachines = async () => {
        try {
            const res = await api.get('/machines');
            setMachines(res.data.machines || []);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchMachines(); }, []);

    const handleLogout = () => router.post('/logout');

    const handleReportIssue = async (e, machineId) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post('/service-requests', { machine_id: machineId, client_id: clientId, issue_description: issueDescription });
            alert('¡Alerta enviada! El equipo técnico ha sido notificado.');
            setReportingId(null); setIssueDesc('');
        } catch { alert('Error al enviar la solicitud.'); }
        finally { setSending(false); }
    };

    const handleQuoteRequest = async (e, machine) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post('/request-quote', {
                machine_id: machine.id, machine_name: machine.name,
                client_id: clientId, client_name: clientName,
                start_date: quoteForm.startDate, end_date: quoteForm.endDate,
                location: quoteForm.location, notes: quoteForm.notes
            });
            alert('¡Solicitud enviada! El administrador se contactará a la brevedad.');
            setQuotingId(null); setQuoteForm({ startDate:'', endDate:'', location:'', notes:'' });
        } catch { alert('Error al enviar la cotización.'); }
        finally { setSending(false); }
    };

    const myRentals         = machines.filter(m => m.status === 'rented' && m.client_rented_name === clientName);
    const availableMachines = machines.filter(m => m.status === 'available');

    const navItems = [
        { id: 'my-rentals', label: 'Mis Equipos', icon: Car },
        { id: 'available',  label: 'Catálogo',    icon: CheckCircle },
    ];

    const handleTabChange = (id) => { setActiveTab(id); setSidebarOpen(false); };

    return (
        <div className="flex h-screen font-sans overflow-hidden" style={{ background: '#0a0a0a', color: '#E8E8E8' }}>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black bg-opacity-60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* SIDEBAR */}
            <aside className={`fixed lg:relative z-40 h-full flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                w-64 lg:w-60`}
                style={{ background: '#111', borderRight: '1px solid #222' }}>

                <div className="space-y-6">
                    <div className="flex flex-col items-center pb-5 space-y-3" style={{ borderBottom: '1px solid #222' }}>
                        <img src="/images/logo-torq.png" alt="Torq" className="w-32 object-contain" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                            style={{ color: C, background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
                            Portal Contratista
                        </span>
                    </div>
                    <nav className="space-y-1">
                        {navItems.map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => handleTabChange(id)}
                                className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                                style={activeTab === id ? { background: C, color: '#0a0a0a', fontWeight: 800 } : { color: '#888' }}>
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{label}</span>
                                {id === 'my-rentals' && myRentals.length > 0 && (
                                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-black"
                                        style={activeTab === id ? { background:'rgba(0,0,0,0.2)' } : { background:'rgba(245,166,35,0.15)', color: C }}>
                                        {myRentals.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="space-y-3">
                    <button onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2.5 rounded-xl text-sm font-bold"
                        style={{ color: '#ef4444' }}>
                        <LogOut className="w-4 h-4" /><span>Cerrar Sesión</span>
                    </button>
                    <div className="p-3 rounded-xl text-xs" style={{ background: '#161616', border: '1px solid #222' }}>
                        <p className="uppercase text-[9px] font-black tracking-widest mb-1" style={{ color: '#555' }}>Empresa</p>
                        <p className="font-bold truncate" style={{ color: C }}>{clientName}</p>
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header mobile */}
                <div className="flex items-center justify-between px-4 py-3 lg:hidden" style={{ background: '#111', borderBottom: '1px solid #222' }}>
                    <img src="/images/logo-torq.png" alt="Torq" className="h-8 object-contain" />
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: '#888' }}>
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {/* MIS ALQUILERES */}
                    {activeTab === 'my-rentals' && (
                        <div className="space-y-6 animate-fadeIn max-w-5xl">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black tracking-tight">Flota Asignada</h1>
                                <p className="text-sm mt-1" style={{ color: '#888' }}>Equipos actualmente en obra bajo su contrato.</p>
                            </div>

                            {myRentals.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 rounded-2xl" style={{ background:'#111', border:'1px solid #222' }}>
                                    <Car className="w-10 h-10 mb-3" style={{ color: '#333' }} />
                                    <p className="font-bold" style={{ color: '#888' }}>No hay contratos activos</p>
                                    <button onClick={() => setActiveTab('available')}
                                        className="mt-4 px-5 py-2 rounded-xl font-bold text-xs uppercase transition"
                                        style={{ background: 'rgba(245,166,35,0.1)', color: C, border: '1px solid rgba(245,166,35,0.2)' }}>
                                        Ver catálogo disponible
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {myRentals.map(m => (
                                        <div key={m.id} className="rounded-2xl overflow-hidden flex flex-col" style={{ background:'#111', border:'1px solid #222' }}>
                                            <div className="p-4 flex justify-between items-start" style={{ borderBottom:'1px solid #222' }}>
                                                <div>
                                                    <h3 className="text-base font-black" style={{ color: C }}>{m.name}</h3>
                                                    <p className="text-xs mt-0.5" style={{ color:'#888' }}>S/N: {m.serial_number}</p>
                                                </div>
                                                <span className="badge-rented">En Obra</span>
                                            </div>
                                            <div className="p-4 flex-1 space-y-2.5">
                                                <div className="flex items-center gap-2 text-xs" style={{ color:'#aaa' }}>
                                                    <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color:'#555' }} />
                                                    <span>Vigencia: <strong style={{ color:'#E8E8E8' }}>{m.rented_from}</strong> al <strong style={{ color:'#E8E8E8' }}>{m.rented_to}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs" style={{ color:'#aaa' }}>
                                                    <Clock className="w-3.5 h-3.5 shrink-0" style={{ color:'#555' }} />
                                                    <span>Horómetro: <strong style={{ color:'#E8E8E8' }}>{m.current_hours} hs</strong></span>
                                                </div>
                                                {m.rental_price && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span style={{ color:'#555' }}>Contrato:</span>
                                                        <strong style={{ color:'#4ade80' }}>${Number(m.rental_price).toLocaleString()} USD</strong>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3" style={{ borderTop:'1px solid #1a1a1a' }}>
                                                {reportingId === m.id ? (
                                                    <form onSubmit={(e) => handleReportIssue(e, m.id)} className="space-y-2.5 animate-fadeIn">
                                                        <textarea required rows="3" value={issueDescription} onChange={e => setIssueDesc(e.target.value)}
                                                            className="w-full rounded-xl text-xs px-3 py-2"
                                                            placeholder="Describí la falla..." />
                                                        <div className="flex gap-2">
                                                            <button type="button" onClick={() => setReportingId(null)}
                                                                className="flex-1 py-2 rounded-xl text-xs font-bold"
                                                                style={{ background:'#1a1a1a', color:'#888', border:'1px solid #2a2a2a' }}>Cancelar</button>
                                                            <button type="submit" disabled={sending}
                                                                className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                                                                style={{ background:'#ef4444', color:'#fff' }}>
                                                                <Send className="w-3 h-3" /> Enviar
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <button onClick={() => setReportingId(m.id)}
                                                        className="w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                                                        style={{ background:'#1a1a1a', color:'#888', border:'1px solid #2a2a2a' }}>
                                                        <Wrench className="w-3.5 h-3.5" /> Solicitar Asistencia
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* CATÁLOGO */}
                    {activeTab === 'available' && (
                        <div className="space-y-6 animate-fadeIn max-w-5xl">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black tracking-tight">Catálogo Disponible</h1>
                                <p className="text-sm mt-1" style={{ color:'#888' }}>Equipos listos para despachar.</p>
                            </div>
                            {availableMachines.length === 0 ? (
                                <div className="py-12 rounded-2xl text-center text-sm" style={{ background:'#111', border:'1px solid #222', color:'#888' }}>
                                    No hay unidades disponibles.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {availableMachines.map(m => (
                                        <div key={m.id} className="rounded-2xl overflow-hidden flex flex-col" style={{ background:'#111', border:'1px solid #222' }}>
                                            <div className="p-4">
                                                <span className="badge-available mb-2 inline-block">Lista para Despacho</span>
                                                <h3 className="text-sm font-black mt-1">{m.name}</h3>
                                                <p className="text-xs mt-0.5" style={{ color:'#888' }}>Modelo: {m.model}</p>
                                            </div>
                                            <div className="px-4 pb-3 space-y-1.5 flex-1" style={{ borderTop:'1px solid #1a1a1a' }}>
                                                <div className="flex justify-between text-xs pt-2">
                                                    <span style={{ color:'#888' }}>Horómetro</span>
                                                    <span className="font-bold">{m.current_hours} hs</span>
                                                </div>
                                                {m.price_per_hour && (
                                                    <div className="flex justify-between text-xs">
                                                        <span style={{ color:'#888' }}>Tarifa/hora</span>
                                                        <span className="font-black" style={{ color: C }}>${Number(m.price_per_hour).toLocaleString()} USD/h</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3" style={{ borderTop:'1px solid #1a1a1a' }}>
                                                {quotingId === m.id ? (
                                                    <form onSubmit={(e) => handleQuoteRequest(e, m)} className="space-y-2.5 animate-fadeIn">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="text-[10px] uppercase font-bold block mb-1" style={{ color:'#888' }}>Desde</label>
                                                                <input type="date" required value={quoteForm.startDate}
                                                                    onChange={e => setQuoteForm({...quoteForm, startDate: e.target.value})}
                                                                    className="w-full text-xs px-2 py-1.5 rounded-lg" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] uppercase font-bold block mb-1" style={{ color:'#888' }}>Hasta</label>
                                                                <input type="date" required value={quoteForm.endDate}
                                                                    onChange={e => setQuoteForm({...quoteForm, endDate: e.target.value})}
                                                                    className="w-full text-xs px-2 py-1.5 rounded-lg" />
                                                            </div>
                                                        </div>
                                                        <input type="text" required placeholder="Destino / Obra" value={quoteForm.location}
                                                            onChange={e => setQuoteForm({...quoteForm, location: e.target.value})}
                                                            className="w-full text-xs px-2 py-1.5 rounded-lg" />
                                                        <textarea rows="2" placeholder="Notas (opcional)" value={quoteForm.notes}
                                                            onChange={e => setQuoteForm({...quoteForm, notes: e.target.value})}
                                                            className="w-full text-xs px-2 py-1.5 rounded-lg" />
                                                        <div className="flex gap-2">
                                                            <button type="button" onClick={() => setQuotingId(null)}
                                                                className="flex-1 py-2 rounded-lg text-xs font-bold"
                                                                style={{ background:'#1a1a1a', color:'#888', border:'1px solid #2a2a2a' }}>Cancelar</button>
                                                            <button type="submit" disabled={sending}
                                                                className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                                                style={{ background:'#22c55e', color:'#fff' }}>
                                                                <Send className="w-3 h-3" /> Enviar
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <button onClick={() => setQuotingId(m.id)}
                                                        className="w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                                                        style={{ background:'rgba(34,197,94,0.08)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.2)' }}>
                                                        Consultar Cotización <ChevronRight className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
