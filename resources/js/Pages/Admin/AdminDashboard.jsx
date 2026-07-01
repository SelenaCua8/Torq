import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    LayoutDashboard, Car, AlertTriangle,
    CheckCircle, Clock, BarChart3, Wrench, Users,
    LogOut, Trash2, UserPlus, Building2, TrendingUp, DollarSign,
    History, Calendar, Info, Pencil, ChevronRight, Activity, Send, FileText,
    Menu, X
} from 'lucide-react';
import api from '../../Services/api';
import MachineForm from '../../Components/MachineForm';

const C = '#F5A623';

// Componente stat card reutilizable
const StatCard = ({ label, value, color, icon: Icon, active, onClick }) => (
    <button onClick={onClick} className="p-5 rounded-2xl text-left relative overflow-hidden transition-all"
        style={{
            background: active ? 'rgba(245,166,35,0.08)' : '#111',
            border: active ? `1px solid ${color || C}` : '1px solid #222',
        }}>
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: color || '#888' }}>{label}</p>
        <p className="text-3xl font-black mt-2" style={{ color: color || '#E8E8E8' }}>{value}</p>
        <Icon className="absolute right-3 bottom-3 w-10 h-10 opacity-10" style={{ color: color || '#888' }} />
    </button>
);

export default function AdminDashboard() {
    const [machines, setMachines]           = useState([]);
    const [users, setUsers]                 = useState([]);
    const [stats, setStats]                 = useState({ total: 0, propias: 0, terceros: 0, disponibles: 0, alquiladas: 0 });
    const [activeTab, setActiveTab]         = useState('overview');
    const [filterType, setFilterType]       = useState('all');
    const [selectedMachineMaster, setSelectedMachineMaster] = useState(null);
    const [selectedClientHistory, setSelectedClientHistory] = useState(null);
    const [salesPeriod, setSalesPeriod]     = useState('monthly');
    const [financeStats, setFinanceStats]   = useState({ facturacion: 0, margen: 0, costo: 0, tasa_ocupacion: 0 });
    const [newUser, setNewUser]             = useState({
        role: 'client', email: '', password: '', username: '',
        first_name: '', last_name: '', phone: '', company_name: '', cuit: '', business_name: ''
    });
    const [maintenanceHistory, setMaintenanceHistory]         = useState([]);
    const [selectedChecklistDetails, setSelectedChecklistDetails] = useState(null);
    const [showRentalForm, setShowRentalForm]   = useState(false);
    const [sendingReport, setSendingReport]     = useState(false);
    const [rentalForm, setRentalForm]           = useState({
        client_id: '', start_date: '', end_date: '',
        price: '', price_per_hour: '', payment_type: 'monthly_advance'
    });

    const fetchMachines = async () => {
        try {
            const res = await api.get('/machines');
            const { machines: data, analytics } = res.data;
            const list = data || [];
            setMachines(list);
            setStats({
                total: list.length,
                propias: list.filter(m => m.ownership_type === 'propia').length,
                terceros: list.filter(m => m.ownership_type === 'terceros').length,
                disponibles: list.filter(m => m.status === 'available').length,
                alquiladas: list.filter(m => m.status === 'rented').length,
            });
            if (analytics) {
                setFinanceStats(salesPeriod === 'weekly' ? {
                    facturacion: analytics.facturacion_semanal,
                    margen: analytics.margen_propio_semanal,
                    costo: analytics.costo_terceros_semanal,
                    tasa_ocupacion: analytics.tasa_ocupacion ?? 0,
                } : {
                    facturacion: analytics.facturacion_mensual,
                    margen: analytics.margen_propio_mensual,
                    costo: analytics.costo_terceros_mensual,
                    tasa_ocupacion: analytics.tasa_ocupacion ?? 0,
                });
            }
        } catch (e) { console.error(e); }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch { setUsers([]); }
    };

    const fetchQuotes = async () => {
        try {
            const res = await api.get('/quote-requests');
            setQuotes(res.data.quotes || []);
            setUnreadQuotes(res.data.unread || 0);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchMachines(); fetchUsers(); fetchQuotes(); }, [salesPeriod]);

    const handleLogout = () => router.post('/logout');

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                role: newUser.role,
                username: newUser.username,
                email: newUser.email || null,
                password: newUser.password,
                name: newUser.role === 'mechanic' ? `${newUser.first_name} ${newUser.last_name}` : newUser.company_name,
                phone: newUser.phone, cuit: newUser.cuit, business_name: newUser.business_name,
            };
            await api.post('/users', payload);
            alert(`¡Éxito! Usuario ${payload.name} registrado. Usuario de acceso: ${payload.username}`);
            fetchUsers();
            setNewUser({ role: 'client', email: '', password: '', username: '', first_name: '', last_name: '', phone: '', company_name: '', cuit: '', business_name: '' });
        } catch (err) {
            const msg = err.response?.data?.errors?.username?.[0] || 'Error al registrar el usuario. Revisá la consola.';
            console.error(err);
            alert(msg);
        }
    };

    const handleDeleteUser = async (id) => {
        if (confirm('¿Seguro que querés eliminar este usuario?')) {
            try { await api.delete(`/users/${id}`); setUsers(users.filter(u => u.id !== id)); }
            catch { alert('Error al eliminar el usuario.'); }
        }
    };

    const handleDeleteMachine = async (id) => {
        if (confirm('¿Seguro que querés dar de baja esta máquina?')) {
            try {
                await api.delete(`/machines/${id}`);
                fetchMachines();
                if (selectedMachineMaster?.id === id) setSelectedMachineMaster(null);
            } catch { alert('Error al eliminar la máquina.'); }
        }
    };

    const handleAssignRental = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rentals', {
                machine_id: selectedMachineMaster.id,
                client_id: rentalForm.client_id,
                start_date: rentalForm.start_date,
                end_date: rentalForm.end_date || null,
                price: rentalForm.price || null,
                price_per_hour: rentalForm.price_per_hour || null,
                payment_type: rentalForm.payment_type,
            });
            alert('¡Alquiler asignado correctamente!');
            setShowRentalForm(false);
            setRentalForm({ client_id: '', start_date: '', end_date: '', price: '', price_per_hour: '', payment_type: 'monthly_advance' });
            await fetchMachines();
            // Refrescar la máquina seleccionada con los datos actualizados
            const res = await api.get('/machines');
            const updated = res.data.machines.find(m => m.id === selectedMachineMaster.id);
            if (updated) setSelectedMachineMaster(updated);
        } catch (err) {
            alert(err.response?.data?.message || 'Error al asignar el alquiler.');
        }
    };

    const handleEndRental = async (rentalId) => {
        if (!rentalId) { alert('No se encontró el contrato activo.'); return; }
        if (confirm('¿Seguro que querés finalizar este contrato? La máquina volverá a estar disponible.')) {
            try {
                await api.delete(`/rentals/${rentalId}`);
                alert('Contrato finalizado. La máquina vuelve a estar disponible.');
                setSelectedMachineMaster(null);
                setSelectedChecklistDetails(null);
                // Esperar un tick y luego refrescar para que el backend actualice el estado
                setTimeout(() => fetchMachines(), 300);
            } catch { alert('Error al finalizar el contrato.'); }
        }
    };

    const handleSendReport = async () => {
        setSendingReport(true);
        try {
            const res = await api.post('/reports/monthly/send');
            alert(res.data.message || 'Reporte enviado correctamente.');
        } catch (err) {
            alert(err.response?.data?.message || 'Error al enviar el reporte por mail.');
        } finally {
            setSendingReport(false);
        }
    };

    const handleToggleRead = async (id) => {
        try {
            await api.patch(`/quote-requests/${id}/toggle-read`);
            fetchQuotes();
        } catch (e) { console.error(e); }
    };

    const handleDeleteQuote = async (id) => {
        if (confirm('¿Eliminar esta solicitud?')) {
            try { await api.delete(`/quote-requests/${id}`); fetchQuotes(); }
            catch (e) { console.error(e); }
        }
    };

    const filteredMachines = machines.filter(m => {
        if (filterType === 'propia') return m.ownership_type === 'propia';
        if (filterType === 'terceros') return m.ownership_type === 'terceros';
        if (filterType === 'available') return m.status === 'available';
        if (filterType === 'rented') return m.status === 'rented';
        return true;
    });

    const navItems = [
        { id: 'overview',    label: 'Panel de Control', icon: LayoutDashboard },
        { id: 'analytics',   label: 'Analíticas',       icon: BarChart3 },
        { id: 'solicitudes', label: 'Solicitudes',      icon: FileText, badge: unreadQuotes },
        { id: 'users',       label: 'Usuarios',         icon: Users },
    ];


    const [quotes, setQuotes]               = useState([]);
    const [unreadQuotes, setUnreadQuotes]   = useState(0);
    const [sidebarOpen, setSidebarOpen]     = useState(false);

    const handleTabChange = (id) => {
        setActiveTab(id);
        setSelectedMachineMaster(null);
        setSidebarOpen(false);
    };

    return (
        <div className="flex h-screen font-sans overflow-hidden" style={{ background: '#0a0a0a', color: '#E8E8E8' }}>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black bg-opacity-60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* SIDEBAR */}
            <aside className={`fixed lg:relative z-40 h-full flex flex-col justify-between p-5 transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64 lg:w-60`}
                style={{ background: '#111', borderRight: '1px solid #222' }}>
                <div className="space-y-6">
                    <div className="flex flex-col items-center pb-5" style={{ borderBottom: '1px solid #222' }}>
                        <img src="/images/logo-torq.png" alt="Torq" className="w-32 object-contain" />
                    </div>
                    <nav className="space-y-1">
                        {navItems.map(({ id, label, icon: Icon, badge }) => (
                            <button key={id} onClick={() => handleTabChange(id)}
                                className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                                style={activeTab === id ? { background: C, color: '#0a0a0a', fontWeight: 800 } : { color: '#888' }}>
                                <Icon className="w-4 h-4 shrink-0" />
                                <span className="flex-1 text-left">{label}</span>
                                {badge > 0 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black"
                                        style={activeTab === id
                                            ? { background: 'rgba(0,0,0,0.2)', color: '#0a0a0a' }
                                            : { background: '#ef4444', color: '#fff' }}>
                                        {badge}
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
                    <div className="p-3 rounded-xl flex items-center gap-2 text-xs" style={{ background: '#161616', border: '1px solid #222' }}>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span style={{ color: '#888' }}>Admin conectado</span>
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

                {/* VISTA DETALLE DE MÁQUINA */}
                {selectedMachineMaster ? (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <button onClick={() => { setSelectedMachineMaster(null); setSelectedChecklistDetails(null); }}
                                className="text-xs font-bold px-4 py-2 rounded-xl transition"
                                style={{ background: '#111', border: '1px solid #222', color: '#888' }}>
                                ← Volver
                            </button>
                            <span className={selectedMachineMaster.status === 'available' ? 'badge-available' : 'badge-rented'}>
                                {selectedMachineMaster.status === 'available' ? 'Disponible' : 'Alquilada'}
                            </span>
                        </div>

                        <div className="p-5 rounded-2xl" style={{ background: '#111', border: '1px solid #222' }}>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h2 className="text-2xl font-black" style={{ color: C }}>{selectedMachineMaster.name}</h2>
                                <span className={selectedMachineMaster.ownership_type === 'propia' ? 'badge-propia' : 'badge-terceros'}>
                                    {selectedMachineMaster.ownership_type}
                                </span>
                            </div>
                            <p className="text-xs mb-4" style={{ color: '#888' }}>
                                Modelo: {selectedMachineMaster.model} · S/N: {selectedMachineMaster.serial_number}
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: '#161616', border: '1px solid #222' }}>
                                    <Clock className="w-4 h-4 shrink-0" style={{ color: C }} />
                                    <div>
                                        <p className="text-[10px] uppercase font-black" style={{ color: '#888' }}>Horómetro</p>
                                        <p className="font-black text-sm">{selectedMachineMaster.current_hours} hs</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: '#161616', border: '1px solid #222' }}>
                                    <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: '#444' }} />
                                    <div>
                                        <p className="text-[10px] uppercase font-black" style={{ color: '#888' }}>Próx. Service</p>
                                        <p className="font-black text-sm">{250 - (selectedMachineMaster.current_hours % 250)} hs</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contrato activo */}
                        <div className="p-5 rounded-2xl" style={{ background: '#111', border: '1px solid #222' }}>
                            <h3 className="font-black text-sm flex items-center gap-2 pb-3 mb-4" style={{ borderBottom: '1px solid #222' }}>
                                <Calendar className="w-4 h-4" style={{ color: C }} /> Contrato Activo
                            </h3>
                            {selectedMachineMaster.status === 'rented' ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-black mb-1" style={{ color: '#888' }}>Cliente</p>
                                            <p className="font-bold text-sm">{selectedMachineMaster.client_rented_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black mb-1" style={{ color: '#888' }}>Período</p>
                                            <p className="text-xs">{selectedMachineMaster.rented_from} → {selectedMachineMaster.rented_to || 'Sin definir'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black mb-1" style={{ color: '#888' }}>Valor</p>
                                            <p className="font-black" style={{ color: '#4ade80' }}>
                                                ${selectedMachineMaster.rental_price ? Number(selectedMachineMaster.rental_price).toLocaleString() : '—'} USD
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleEndRental(selectedMachineMaster.rental_id)}
                                        className="text-xs font-bold px-4 py-2 rounded-xl transition"
                                        style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                                        Finalizar Contrato y Liberar Máquina
                                    </button>
                                </div>
                            ) : showRentalForm ? (
                                <form onSubmit={handleAssignRental} className="space-y-3 animate-fadeIn">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>Cliente</label>
                                            <select required value={rentalForm.client_id}
                                                onChange={e => setRentalForm({...rentalForm, client_id: e.target.value})}
                                                className="block w-full rounded-xl text-sm px-3 py-2.5">
                                                <option value="">Seleccionar...</option>
                                                {users.filter(u => u.role === 'client').map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>Forma de pago</label>
                                            <select value={rentalForm.payment_type}
                                                onChange={e => setRentalForm({...rentalForm, payment_type: e.target.value})}
                                                className="block w-full rounded-xl text-sm px-3 py-2.5">
                                                <option value="monthly_advance">Mensual adelantado</option>
                                                <option value="monthly_expired">Mensual vencido</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>Fecha inicio</label>
                                            <input type="date" required value={rentalForm.start_date}
                                                onChange={e => setRentalForm({...rentalForm, start_date: e.target.value})}
                                                className="block w-full rounded-xl text-sm px-3 py-2.5" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>Fecha fin</label>
                                            <input type="date" value={rentalForm.end_date}
                                                onChange={e => setRentalForm({...rentalForm, end_date: e.target.value})}
                                                className="block w-full rounded-xl text-sm px-3 py-2.5" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>Valor total (USD)</label>
                                            <input type="number" min="0" step="0.01" value={rentalForm.price}
                                                onChange={e => setRentalForm({...rentalForm, price: e.target.value})}
                                                className="block w-full rounded-xl text-sm px-3 py-2.5" placeholder="Ej: 14400" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>Tarifa/hora (USD)</label>
                                            <input type="number" min="0" step="0.01" value={rentalForm.price_per_hour}
                                                onChange={e => setRentalForm({...rentalForm, price_per_hour: e.target.value})}
                                                className="block w-full rounded-xl text-sm px-3 py-2.5" placeholder="Ej: 120" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button type="button" onClick={() => setShowRentalForm(false)}
                                            className="px-4 py-2.5 rounded-xl text-xs font-bold"
                                            style={{ background: '#1a1a1a', color: '#888', border: '1px solid #2a2a2a' }}>Cancelar</button>
                                        <button type="submit"
                                            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider"
                                            style={{ background: C, color: '#0a0a0a' }}>Confirmar</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <p className="text-xs italic" style={{ color: '#666' }}>No hay contrato activo.</p>
                                    <button onClick={() => setShowRentalForm(true)}
                                        className="text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl"
                                        style={{ background: C, color: '#0a0a0a' }}>
                                        + Asignar Alquiler
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Historial checklists */}
                        <div className="p-5 rounded-2xl" style={{ background: '#111', border: '1px solid #222' }}>
                            <h3 className="font-black text-sm flex items-center gap-2 pb-3 mb-4" style={{ borderBottom: '1px solid #222' }}>
                                <Wrench className="w-4 h-4" style={{ color: C }} /> Planillas Técnicas
                            </h3>
                            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4">
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {maintenanceHistory.length === 0 ? (
                                        <p className="text-xs italic" style={{ color: '#666' }}>Sin planillas.</p>
                                    ) : maintenanceHistory.map(log => (
                                        <div key={log.id} onClick={() => setSelectedChecklistDetails(log)}
                                            className="p-3 rounded-xl text-xs cursor-pointer transition"
                                            style={selectedChecklistDetails?.id === log.id
                                                ? { background: 'rgba(245,166,35,0.1)', border: `1px solid ${C}` }
                                                : { background: '#161616', border: '1px solid #222' }}>
                                            <div className="flex justify-between">
                                                <span className="font-bold" style={selectedChecklistDetails?.id === log.id ? { color: C } : {}}>Control #{log.id}</span>
                                                <span style={{ color: '#666' }}>{new Date(log.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="mt-1" style={{ color: '#888' }}>Por: {log.mechanic_name}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="col-span-2 rounded-xl p-4 min-h-32" style={{ background: '#0d0d0d', border: '1px solid #1e1e1e' }}>
                                    {selectedChecklistDetails ? (
                                        <div className="space-y-2 animate-fadeIn">
                                            <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid #1e1e1e' }}>
                                                <h4 className="font-black text-sm" style={{ color: C }}>Planilla Oficial</h4>
                                                <span className="text-[10px] font-black px-2 py-0.5 rounded" style={{ background: '#161616', color: '#888' }}>
                                                    CERT-{selectedChecklistDetails.id}
                                                </span>
                                            </div>
                                            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                                {selectedChecklistDetails.inspections && (() => {
                                                    let parsed = selectedChecklistDetails.inspections;
                                                    if (typeof parsed === 'string') try { parsed = JSON.parse(parsed); } catch { return null; }
                                                    const items = Array.isArray(parsed) ? parsed : Object.values(parsed);
                                                    return items.map((item, idx) => {
                                                        const sc = item.status === 'Apto' ? '#4ade80' : item.status === 'No Apto' ? '#f87171' : C;
                                                        return (
                                                            <div key={idx} className="flex justify-between items-center px-2 py-1.5 rounded-lg text-xs"
                                                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e1e1e' }}>
                                                                <span style={{ color: '#ccc' }}>{(item.id || idx+1)}. {item.name}</span>
                                                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded shrink-0"
                                                                    style={{ color: sc, background: `${sc}15`, border: `1px solid ${sc}33` }}>
                                                                    {item.status}
                                                                </span>
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                            <div className="p-2 rounded-xl text-xs" style={{ background: '#161616', border: '1px solid #222' }}>
                                                <strong className="block text-[9px] uppercase tracking-widest mb-1" style={{ color: C }}>Diagnóstico:</strong>
                                                <p className="italic" style={{ color: '#aaa' }}>"{selectedChecklistDetails.general_observations || 'Sin comentarios.'}"</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full py-4">
                                            <p className="text-xs" style={{ color: '#555' }}>Seleccioná una planilla.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                ) : (
                    <>
                        {/* TAB: OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="space-y-5 animate-fadeIn">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Panel de Control</h1>
                                        <p className="text-sm mt-1" style={{ color: '#888' }}>Clic en cualquier máquina para ver su ficha.</p>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <a href="/reports/monthly/download"
                                            className="flex items-center gap-2 text-xs font-bold px-3 py-2.5 rounded-xl transition"
                                            style={{ background: '#161616', color: '#888', border: '1px solid #222' }}>
                                            <FileText className="w-4 h-4" /> Reporte
                                        </a>
                                        <button onClick={handleSendReport} disabled={sendingReport}
                                            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider px-3 py-2.5 rounded-xl transition"
                                            style={{ background: C, color: '#0a0a0a' }}>
                                            <Send className="w-4 h-4" /> {sendingReport ? 'Enviando...' : 'Mail'}
                                        </button>
                                    </div>
                                </div>

                                {/* Stats — scroll horizontal en mobile */}
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-4">
                                    <StatCard label="Total"       value={stats.total}       icon={Car}         active={filterType==='all'}       onClick={() => setFilterType('all')} />
                                    <StatCard label="Propia"      value={stats.propias}     icon={CheckCircle} color="#4ade80" active={filterType==='propia'}    onClick={() => setFilterType('propia')} />
                                    <StatCard label="Terceros"    value={stats.terceros}    icon={Building2}   color="#60a5fa" active={filterType==='terceros'}  onClick={() => setFilterType('terceros')} />
                                    <StatCard label="Disponibles" value={stats.disponibles} icon={CheckCircle} color="#34d399" active={filterType==='available'} onClick={() => setFilterType('available')} />
                                    <StatCard label="Alquiladas"  value={stats.alquiladas}  icon={Clock}       color={C}       active={filterType==='rented'}    onClick={() => setFilterType('rented')} />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                    <div className="lg:col-span-1">
                                        <MachineForm onMachineAdded={fetchMachines} />
                                    </div>
                                    <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: '#111', border: '1px solid #222' }}>
                                        <div className="flex justify-between items-center pb-3 mb-4" style={{ borderBottom: '1px solid #222' }}>
                                            <h3 className="font-black">Monitoreo de Flota</h3>
                                            <span className="text-[10px] uppercase font-black px-2 py-1 rounded" style={{ background: '#161616', color: '#888', border: '1px solid #222' }}>
                                                {filterType}
                                            </span>
                                        </div>
                                        <div className="divide-y overflow-y-auto max-h-96 pr-1" style={{ borderColor: '#1e1e1e' }}>
                                            {filteredMachines.length === 0 ? (
                                                <p className="text-sm text-center py-8" style={{ color: '#888' }}>Sin maquinarias para este filtro.</p>
                                            ) : filteredMachines.map(m => (
                                                <div key={m.id}
                                                    onClick={() => {
                                                        setSelectedMachineMaster(m);
                                                        api.get(`/maintenance-checklists/machine/${m.id}`)
                                                            .then(res => setMaintenanceHistory(res.data || []))
                                                            .catch(console.error);
                                                    }}
                                                    className="flex items-center justify-between py-3 first:pt-0 cursor-pointer px-2 rounded-xl transition group"
                                                    onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                                                    onMouseOut={e => e.currentTarget.style.background='transparent'}>
                                                    <div className="space-y-1 flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="font-bold text-sm truncate">{m.name}</p>
                                                            <span className={m.ownership_type === 'propia' ? 'badge-propia' : 'badge-terceros'}>{m.ownership_type}</span>
                                                        </div>
                                                        <p className="text-xs" style={{ color: '#888' }}>S/N: {m.serial_number} · <span style={{ color: '#aaa', fontWeight: 600 }}>{m.current_hours} hs</span></p>
                                                        {m.status === 'rented' && (
                                                            <p className="text-xs" style={{ color: '#888' }}>
                                                                📍 <span style={{ color: C, fontWeight: 700 }}>{m.client_rented_name}</span>
                                                                {m.rental_price && <span className="ml-2 font-black" style={{ color: '#4ade80' }}>${Number(m.rental_price).toLocaleString()}</span>}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className={`hidden sm:inline ${m.status === 'available' ? 'badge-available' : 'badge-rented'}`}>
                                                            {m.status === 'available' ? 'Disponible' : 'Alquilada'}
                                                        </span>
                                                        <button onClick={e => { e.stopPropagation(); handleDeleteMachine(m.id); }}
                                                            className="p-2 rounded-xl transition"
                                                            style={{ background: '#161616', color: '#555', border: '1px solid #222' }}
                                                            onMouseOver={e => { e.currentTarget.style.color='#f87171'; }}
                                                            onMouseOut={e => { e.currentTarget.style.color='#555'; }}>
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <div className="p-2 rounded-xl" style={{ background: '#161616', border: '1px solid #222', color: '#555' }}>
                                                            <ChevronRight className="w-3.5 h-3.5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: ANALYTICS */}
                        {activeTab === 'analytics' && (
                            <div className="space-y-5 animate-fadeIn">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div>
                                        <h2 className="text-2xl font-black">Analíticas</h2>
                                        <p className="text-xs mt-1" style={{ color: '#888' }}>Datos reales de contratos activos.</p>
                                    </div>
                                    <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#111', border: '1px solid #222' }}>
                                        <button onClick={() => setSalesPeriod('weekly')}
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                            style={salesPeriod === 'weekly' ? { background: C, color: '#0a0a0a' } : { color: '#888' }}>
                                            Semanal
                                        </button>
                                        <button onClick={() => setSalesPeriod('monthly')}
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                            style={salesPeriod === 'monthly' ? { background: C, color: '#0a0a0a' } : { color: '#888' }}>
                                            Mensual
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: `Facturación (${salesPeriod === 'weekly' ? 'Semanal' : 'Mensual'})`, value: financeStats.facturacion, color: C, icon: TrendingUp },
                                        { label: 'Margen Flota Propia', value: financeStats.margen, color: '#4ade80', icon: DollarSign },
                                        { label: 'Costo Subalquileres', value: financeStats.costo, color: '#60a5fa', icon: Building2 },
                                    ].map(s => (
                                        <div key={s.label} className="p-5 rounded-2xl flex items-center justify-between" style={{ background: '#111', border: '1px solid #222' }}>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#888' }}>{s.label}</p>
                                                <p className="text-2xl font-black mt-1" style={{ color: s.color }}>${Number(s.value).toLocaleString()}</p>
                                            </div>
                                            <s.icon className="w-8 h-8 opacity-15" style={{ color: s.color }} />
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ background: '#111', border: '1px solid #222' }}>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#888' }}>Tasa de Ocupación</p>
                                        <p className="text-2xl font-black" style={{ color: C }}>{financeStats.tasa_ocupacion}%</p>
                                        <p className="text-[10px]" style={{ color: '#555' }}>{stats.alquiladas} de {stats.total} unidades alquiladas</p>
                                    </div>
                                    <div className="w-full sm:w-40">
                                        <div className="h-3 rounded-full overflow-hidden" style={{ background: '#222' }}>
                                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${financeStats.tasa_ocupacion}%`, background: C }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl" style={{ background: '#111', border: '1px solid #222' }}>
                                    <h3 className="font-black mb-4 flex items-center gap-2">
                                        <Activity className="w-4 h-4" style={{ color: C }} /> Contratos Activos
                                    </h3>
                                    <div className="space-y-3">
                                        {machines.filter(m => m.status === 'rented').length === 0 ? (
                                            <p className="text-sm" style={{ color: '#888' }}>No hay contratos activos.</p>
                                        ) : machines.filter(m => m.status === 'rented').map((m, idx) => (
                                            <div key={m.id} className="p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                                                style={{ background: '#161616', border: '1px solid #222' }}>
                                                <div>
                                                    <p className="font-bold text-sm">{idx + 1}. {m.name}</p>
                                                    <p className="text-xs mt-0.5" style={{ color: '#888' }}>
                                                        Cliente: <span style={{ color: '#aaa' }}>{m.client_rented_name}</span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {m.rental_price && <p className="font-black" style={{ color: '#4ade80' }}>${Number(m.rental_price).toLocaleString()} USD</p>}
                                                    <span className={m.ownership_type === 'propia' ? 'badge-propia' : 'badge-terceros'}>{m.ownership_type}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: SOLICITUDES */}
                        {activeTab === 'solicitudes' && (
                            <div className="space-y-5 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black">Solicitudes de Cotización</h2>
                                        <p className="text-xs mt-1" style={{ color: '#888' }}>
                                            {unreadQuotes > 0
                                                ? <span style={{ color: '#ef4444' }}>{unreadQuotes} sin leer</span>
                                                : 'Todas leídas'}
                                        </p>
                                    </div>
                                </div>

                                {quotes.length === 0 ? (
                                    <div className="py-16 rounded-2xl text-center" style={{ background: '#111', border: '1px solid #222' }}>
                                        <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: '#333' }} />
                                        <p style={{ color: '#888' }}>No hay solicitudes todavía.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {quotes.map(q => (
                                            <div key={q.id} className="p-5 rounded-2xl transition-all"
                                                style={{
                                                    background: q.read ? '#111' : 'rgba(245,166,35,0.04)',
                                                    border: q.read ? '1px solid #222' : `1px solid rgba(245,166,35,0.3)`,
                                                }}>
                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            {!q.read && (
                                                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                                                                    style={{ background: '#ef4444', color: '#fff' }}>
                                                                    Nueva
                                                                </span>
                                                            )}
                                                            <h3 className="font-black text-sm">{q.machine_name}</h3>
                                                        </div>
                                                        <p className="text-xs mb-3" style={{ color: '#888' }}>
                                                            Cliente: <strong style={{ color: C }}>{q.client_name}</strong>
                                                            {' · '}{new Date(q.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                                            <div className="p-2.5 rounded-xl" style={{ background: '#161616', border: '1px solid #1e1e1e' }}>
                                                                <p className="text-[9px] uppercase font-black mb-1" style={{ color: '#555' }}>Período</p>
                                                                <p style={{ color: '#ccc' }}>{q.start_date} → {q.end_date}</p>
                                                            </div>
                                                            <div className="p-2.5 rounded-xl" style={{ background: '#161616', border: '1px solid #1e1e1e' }}>
                                                                <p className="text-[9px] uppercase font-black mb-1" style={{ color: '#555' }}>Destino</p>
                                                                <p style={{ color: '#ccc' }}>{q.location}</p>
                                                            </div>
                                                            {q.notes && (
                                                                <div className="p-2.5 rounded-xl" style={{ background: '#161616', border: '1px solid #1e1e1e' }}>
                                                                    <p className="text-[9px] uppercase font-black mb-1" style={{ color: '#555' }}>Notas</p>
                                                                    <p style={{ color: '#ccc' }}>{q.notes}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 shrink-0">
                                                        <button onClick={() => handleToggleRead(q.id)}
                                                            className="text-xs font-bold px-3 py-2 rounded-xl transition"
                                                            style={q.read
                                                                ? { background: '#161616', color: '#888', border: '1px solid #222' }
                                                                : { background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                                                            {q.read ? '○ No leído' : '✓ Leído'}
                                                        </button>
                                                        <button onClick={() => handleDeleteQuote(q.id)}
                                                            className="p-2 rounded-xl transition"
                                                            style={{ background: '#161616', color: '#555', border: '1px solid #222' }}
                                                            onMouseOver={e => e.currentTarget.style.color='#f87171'}
                                                            onMouseOut={e => e.currentTarget.style.color='#555'}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: USUARIOS */}
                        {activeTab === 'users' && (
                            <div className="space-y-5 animate-fadeIn">
                                <div>
                                    <h2 className="text-2xl font-black">Usuarios</h2>
                                    <p className="text-xs mt-1" style={{ color: '#888' }}>Alta y baja de clientes y mecánicos.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                    {/* Formulario */}
                                    <form onSubmit={handleCreateUser} className="lg:col-span-1 p-5 rounded-2xl space-y-4 h-fit" style={{ background: '#111', border: '1px solid #222' }}>
                                        <h3 className="font-black flex items-center gap-2">
                                            <UserPlus className="w-4 h-4" style={{ color: C }} /> Nuevo Usuario
                                        </h3>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>Rol</label>
                                            <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}
                                                className="block w-full rounded-xl text-sm px-3 py-2">
                                                <option value="client">Cliente</option>
                                                <option value="mechanic">Mecánico</option>
                                            </select>
                                        </div>
                                        <div className="p-3 rounded-xl space-y-3" style={{ background: '#161616', border: '1px solid #1e1e1e' }}>
                                            {newUser.role === 'mechanic' ? (
                                                <>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="block text-[10px] font-black uppercase mb-1" style={{ color: '#888' }}>Nombre</label>
                                                            <input type="text" required value={newUser.first_name}
                                                                onChange={e => setNewUser({...newUser, first_name: e.target.value})}
                                                                className="block w-full rounded-xl text-sm px-3 py-2" placeholder="Juan" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-black uppercase mb-1" style={{ color: '#888' }}>Apellido</label>
                                                            <input type="text" required value={newUser.last_name}
                                                                onChange={e => setNewUser({...newUser, last_name: e.target.value})}
                                                                className="block w-full rounded-xl text-sm px-3 py-2" placeholder="Pérez" />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase mb-1" style={{ color: '#888' }}>Empresa</label>
                                                    <input type="text" required value={newUser.company_name}
                                                        onChange={e => setNewUser({...newUser, company_name: e.target.value})}
                                                        className="block w-full rounded-xl text-sm px-3 py-2" placeholder="Constructora Sur S.A." />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3 pt-1" style={{ borderTop: '1px solid #222' }}>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase mb-1.5" style={{ color: '#888' }}>Usuario (para iniciar sesión)</label>
                                                <input type="text" required value={newUser.username}
                                                    onChange={e => setNewUser({...newUser, username: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                                                    className="block w-full rounded-xl text-sm px-3 py-2" placeholder="ej: jperez" />
                                                <p className="text-[10px] mt-1" style={{ color: '#555' }}>Sin espacios. Lo usa para loguearse.</p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase mb-1.5" style={{ color: '#888' }}>Email (opcional)</label>
                                                <input type="email" value={newUser.email}
                                                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                                                    className="block w-full rounded-xl text-sm px-3 py-2" placeholder="correo@empresa.com" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase mb-1.5" style={{ color: '#888' }}>Contraseña</label>
                                                <input type="password" required value={newUser.password}
                                                    onChange={e => setNewUser({...newUser, password: e.target.value})}
                                                    className="block w-full rounded-xl text-sm px-3 py-2" placeholder="••••••••" />
                                            </div>
                                        </div>
                                        <button type="submit"
                                            className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition"
                                            style={{ background: C, color: '#0a0a0a' }}>
                                            Inscribir en Torq
                                        </button>
                                    </form>

                                    {/* Lista usuarios */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="p-5 rounded-2xl" style={{ background: '#111', border: '1px solid #222' }}>
                                            <h3 className="font-black mb-4">Nómina del Sistema</h3>
                                            <div className="divide-y" style={{ borderColor: '#1e1e1e' }}>
                                                {users.length === 0 ? (
                                                    <p className="text-sm text-center py-4" style={{ color: '#888' }}>Sin usuarios registrados.</p>
                                                ) : users.map(u => (
                                                    <div key={u.id}
                                                        onClick={() => u.role === 'client' ? setSelectedClientHistory(u) : null}
                                                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0 px-2 rounded-xl transition"
                                                        style={u.role === 'client' ? { cursor:'pointer' } : {}}
                                                        onMouseOver={e => u.role === 'client' && (e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                                                        onMouseOut={e => e.currentTarget.style.background='transparent'}>
                                                        <div>
                                                            <p className="font-bold text-sm">{u.name}</p>
                                                            <p className="text-xs mt-0.5" style={{ color: '#888' }}>
                                                                @{u.username} ·{' '}
                                                                <span className="font-black uppercase text-[9px]" style={{ color: u.role === 'mechanic' ? '#60a5fa' : C }}>
                                                                    {u.role === 'mechanic' ? 'Mecánico' : 'Cliente'}
                                                                </span>
                                                            </p>
                                                            {u.email && (
                                                                <p className="text-[10px] mt-0.5" style={{ color: '#666' }}>✉ {u.email}</p>
                                                            )}
                                                        </div>
                                                        <button onClick={e => { e.stopPropagation(); handleDeleteUser(u.id); }}
                                                            className="p-2 rounded-xl transition"
                                                            style={{ background:'#161616', color:'#555', border:'1px solid #222' }}
                                                            onMouseOver={e => e.currentTarget.style.color='#f87171'}
                                                            onMouseOut={e => e.currentTarget.style.color='#555'}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedClientHistory && (
                                            <div className="p-5 rounded-2xl animate-fadeIn" style={{ background:'#111', border:`1px solid ${C}40` }}>
                                                <div className="flex justify-between items-center mb-4">
                                                    <div>
                                                        <h4 className="font-black">{selectedClientHistory.name}</h4>
                                                        <p className="text-xs" style={{ color:'#888' }}>Contratos activos</p>
                                                    </div>
                                                    <button onClick={() => setSelectedClientHistory(null)}
                                                        className="text-xs px-3 py-1.5 rounded-lg"
                                                        style={{ background:'#161616', color:'#888', border:'1px solid #222' }}>
                                                        Cerrar
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {machines.filter(m => m.client_rented_name === selectedClientHistory.name).length === 0 ? (
                                                        <p className="text-sm italic" style={{ color:'#888' }}>Sin contratos activos.</p>
                                                    ) : machines.filter(m => m.client_rented_name === selectedClientHistory.name).map(m => (
                                                        <div key={m.id} className="p-4 rounded-xl flex justify-between items-center"
                                                            style={{ background:'#161616', border:'1px solid #222' }}>
                                                            <div>
                                                                <p className="font-bold text-sm">🚜 {m.name}</p>
                                                                <p className="text-xs mt-0.5" style={{ color:'#888' }}>{m.rented_from} → {m.rented_to}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="badge-rented block mb-1">Vigente</span>
                                                                {m.rental_price && <p className="font-black" style={{ color:'#4ade80' }}>${Number(m.rental_price).toLocaleString()} USD</p>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                </main>
            </div>
        </div>
    );
}
