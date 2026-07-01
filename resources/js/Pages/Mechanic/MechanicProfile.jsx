import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Wrench, ClipboardCheck, LogOut, History, FileText, ChevronRight, Menu, X } from 'lucide-react';
import api from '../../Services/api';
import MechanicChecklist from '../../Components/MechanicChecklist';

const C = '#F5A623';

export default function MechanicProfile({ auth, mechanicId = 1, mechanicName = 'Operario Técnico' }) {
    const resolvedId   = auth?.user?.id   || mechanicId;
    const resolvedName = auth?.user?.name || mechanicName;

    const [assignedMachines, setAssignedMachines] = useState([]);
    const [selectedMachine, setSelectedMachine]   = useState(null);
    const [activeTab, setActiveTab]               = useState('new');
    const [maintenanceHistory, setMaintenanceHistory] = useState([]);
    const [selectedChecklistDetails, setSelectedChecklistDetails] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const loadActiveMachines = async () => {
        try {
            const res = await api.get('/machines');
            const { machines: data } = res.data;
            setAssignedMachines(data || res.data || []);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { loadActiveMachines(); }, []);

    const handleLogout = () => router.post('/logout');

    const openMachineTask = async (machine) => {
        setSelectedMachine(machine);
        setActiveTab('new');
        setSelectedChecklistDetails(null);
        setSidebarOpen(false);
        try {
            const res = await api.get(`/maintenance-checklists/machine/${machine.id}`);
            setMaintenanceHistory(res.data || []);
        } catch (e) { console.error(e); }
    };

    const renderInspections = () => {
        if (!selectedChecklistDetails?.inspections) return <p style={{ color:'#666' }}>Sin datos.</p>;
        let parsed = selectedChecklistDetails.inspections;
        if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch { return <p style={{ color:'#ef4444' }}>Error al leer datos.</p>; }
        }
        const items = Array.isArray(parsed) ? parsed : Object.values(parsed);
        return items.map((item, idx) => {
            const key = item.id || idx + 1;
            const obs = item.obs || item.notes || '';
            const statusColor = item.status === 'Apto' ? '#4ade80' : item.status === 'No Apto' ? '#f87171' : C;
            const statusBg    = item.status === 'Apto' ? 'rgba(74,222,128,0.08)' : item.status === 'No Apto' ? 'rgba(248,113,113,0.08)' : 'rgba(245,166,35,0.08)';
            return (
                <div key={key} className="flex justify-between items-start px-3 py-2 rounded-lg gap-2"
                    style={{ background:'rgba(255,255,255,0.02)', border:'1px solid #1e1e1e' }}>
                    <span className="text-xs flex-1" style={{ color:'#ccc' }}>{key}. {item.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                        {obs.trim() !== '' && (
                            <span className="text-[10px] italic hidden md:block px-1.5 py-0.5 rounded max-w-[100px] truncate"
                                style={{ color:'#666', background:'#111', border:'1px solid #222' }} title={obs}>
                                "{obs}"
                            </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase"
                            style={{ color: statusColor, background: statusBg, border: `1px solid ${statusColor}33` }}>
                            {item.status}
                        </span>
                    </div>
                </div>
            );
        });
    };

    const horasRestantes = (m) => {
        if (!m.hours_for_service) return null;
        return m.hours_for_service - (m.current_hours % m.hours_for_service);
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
                style={{ background:'#111', borderRight:'1px solid #222' }}>

                <div className="space-y-5">
                    <div className="flex flex-col items-center pb-5 space-y-3" style={{ borderBottom:'1px solid #222' }}>
                        <img src="/images/logo-torq.png" alt="Torq" className="w-32 object-contain" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                            style={{ color: C, background:'rgba(245,166,35,0.08)', border:'1px solid rgba(245,166,35,0.2)' }}>
                            Control Técnico
                        </span>
                    </div>

                    <div className="p-3 rounded-xl" style={{ background:'#161616', border:'1px solid #222' }}>
                        <p className="text-[9px] uppercase font-black tracking-widest mb-1" style={{ color:'#555' }}>Mecánico Activo</p>
                        <p className="text-sm font-bold truncate">{resolvedName}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: C }}>ID Técnico: #{resolvedId}</p>
                    </div>

                    {selectedMachine && (
                        <div className="p-3 rounded-xl" style={{ background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.15)' }}>
                            <p className="text-[9px] uppercase font-black tracking-widest mb-1" style={{ color: C }}>Máquina Activa</p>
                            <p className="text-xs font-bold truncate">{selectedMachine.name}</p>
                            <p className="text-[10px] mt-0.5" style={{ color:'#888' }}>{selectedMachine.current_hours} hs</p>
                        </div>
                    )}
                </div>

                <button onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2.5 rounded-xl text-sm font-bold"
                    style={{ color:'#ef4444' }}>
                    <LogOut className="w-4 h-4" /><span>Cerrar Sesión</span>
                </button>
            </aside>

            {/* MAIN */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header mobile */}
                <div className="flex items-center justify-between px-4 py-3 lg:hidden" style={{ background:'#111', borderBottom:'1px solid #222' }}>
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-torq.png" alt="Torq" className="h-8 object-contain" />
                        {selectedMachine && (
                            <span className="text-xs font-bold truncate max-w-[120px]" style={{ color: C }}>{selectedMachine.name}</span>
                        )}
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: '#888' }}>
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {!selectedMachine ? (
                        <div className="space-y-5 animate-fadeIn">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black tracking-tight">Orden de Trabajo</h1>
                                <p className="text-sm mt-1" style={{ color:'#888' }}>Seleccioná una unidad para iniciar el control.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {assignedMachines.length === 0 ? (
                                    <p className="col-span-full text-center py-10 rounded-2xl text-sm" style={{ color:'#888', background:'#111', border:'1px solid #222' }}>
                                        No hay maquinarias registradas.
                                    </p>
                                ) : assignedMachines.map(m => {
                                    const hrs = horasRestantes(m);
                                    const urgent = hrs !== null && hrs <= 30;
                                    return (
                                        <div key={m.id} onClick={() => openMachineTask(m)}
                                            className="rounded-2xl flex flex-col cursor-pointer transition-all"
                                            style={{ background:'#111', border: urgent ? '1px solid rgba(251,191,36,0.4)' : '1px solid #222' }}>
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={m.ownership_type === 'propia' ? 'badge-propia' : 'badge-terceros'}>
                                                        {m.ownership_type}
                                                    </span>
                                                    {urgent && (
                                                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                                                            style={{ background:'rgba(251,191,36,0.15)', color:'#fbbf24', border:'1px solid rgba(251,191,36,0.3)' }}>
                                                            ⚠ Service
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-black text-sm mb-1">{m.name}</h3>
                                                <p className="text-xs" style={{ color:'#888' }}>S/N: {m.serial_number}</p>
                                            </div>
                                            <div className="px-4 pb-3 space-y-1.5">
                                                <div className="flex justify-between text-xs">
                                                    <span style={{ color:'#888' }}>Horómetro</span>
                                                    <span className="font-bold">{m.current_hours} hs</span>
                                                </div>
                                                {hrs !== null && (
                                                    <div className="flex justify-between text-xs">
                                                        <span style={{ color:'#888' }}>Próx. service</span>
                                                        <span className="font-bold" style={{ color: urgent ? '#fbbf24' : '#4ade80' }}>{hrs} hs</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-4 pb-4">
                                                <div className="w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                                                    style={{ background:'rgba(255,255,255,0.03)', color:'#888', border:'1px solid #1e1e1e' }}>
                                                    <Wrench className="w-3.5 h-3.5" /> Abrir Ficha
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fadeIn flex flex-col h-full">
                            {/* Header ficha */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl" style={{ background:'#111', border:'1px solid #222' }}>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setSelectedMachine(null)}
                                        className="text-xs font-bold px-3 py-2 rounded-lg shrink-0"
                                        style={{ background:'#161616', color:'#888', border:'1px solid #2a2a2a' }}>
                                        ← Volver
                                    </button>
                                    <div>
                                        <h2 className="text-lg font-black">{selectedMachine.name}</h2>
                                        <p className="text-xs" style={{ color:'#888' }}>S/N: {selectedMachine.serial_number} · {selectedMachine.current_hours} hs</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 p-1 rounded-xl" style={{ background:'#161616', border:'1px solid #222' }}>
                                    <button onClick={() => setActiveTab('new')}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition"
                                        style={activeTab === 'new' ? { background: C, color:'#0a0a0a' } : { color:'#888' }}>
                                        <ClipboardCheck className="w-3.5 h-3.5" /> Control
                                    </button>
                                    <button onClick={() => setActiveTab('history')}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition"
                                        style={activeTab === 'history' ? { background: C, color:'#0a0a0a' } : { color:'#888' }}>
                                        <History className="w-3.5 h-3.5" /> Historial ({maintenanceHistory.length})
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                {activeTab === 'new' ? (
                                    <MechanicChecklist
                                        machineId={selectedMachine.id}
                                        mechanicId={resolvedId}
                                        onServiceSaved={() => { setSelectedMachine(null); loadActiveMachines(); }}
                                    />
                                ) : (
                                    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 h-full">
                                        {/* Lista planillas */}
                                        <div className="lg:col-span-1 rounded-2xl p-4 flex flex-col max-h-60 lg:max-h-full overflow-hidden" style={{ background:'#111', border:'1px solid #222' }}>
                                            <h3 className="text-sm font-black pb-3 mb-3 shrink-0" style={{ borderBottom:'1px solid #222' }}>Bitácora</h3>
                                            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                                                {maintenanceHistory.length === 0 ? (
                                                    <p className="text-xs italic text-center py-4" style={{ color:'#666' }}>Sin controles previos.</p>
                                                ) : maintenanceHistory.map(log => (
                                                    <div key={log.id} onClick={() => setSelectedChecklistDetails(log)}
                                                        className="p-3 rounded-xl text-xs cursor-pointer transition"
                                                        style={selectedChecklistDetails?.id === log.id
                                                            ? { background:'rgba(245,166,35,0.1)', border:`1px solid ${C}` }
                                                            : { background:'#161616', border:'1px solid #222' }}>
                                                        <div className="flex justify-between">
                                                            <span className="font-bold" style={selectedChecklistDetails?.id === log.id ? { color: C } : {}}>
                                                                Planilla #{log.id}
                                                            </span>
                                                            <span style={{ color:'#666' }}>{new Date(log.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="mt-1" style={{ color:'#888' }}>Por: {log.mechanic_name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Detalle */}
                                        <div className="lg:col-span-2 rounded-2xl p-4 flex flex-col overflow-hidden" style={{ background:'#111', border:'1px solid #222' }}>
                                            {selectedChecklistDetails ? (
                                                <div className="flex flex-col h-full animate-fadeIn">
                                                    <div className="flex justify-between items-center pb-3 mb-3 shrink-0" style={{ borderBottom:'1px solid #222' }}>
                                                        <h4 className="font-black text-sm flex items-center gap-2">
                                                            <FileText className="w-4 h-4" style={{ color: C }} /> Inspección
                                                        </h4>
                                                        <span className="text-[10px] font-black px-2 py-1 rounded" style={{ background:'#161616', color: C, border:'1px solid #222' }}>
                                                            CERT-{selectedChecklistDetails.id}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                                                        {renderInspections()}
                                                    </div>
                                                    <div className="mt-3 p-3 rounded-xl text-xs shrink-0" style={{ background:'#161616', border:'1px solid #222' }}>
                                                        <strong className="block text-[9px] uppercase tracking-widest mb-1" style={{ color: C }}>Diagnóstico:</strong>
                                                        <p className="italic" style={{ color:'#aaa' }}>"{selectedChecklistDetails.general_observations || 'Sin comentarios.'}"</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex items-center justify-center text-center">
                                                    <p className="text-sm" style={{ color:'#555' }}>Seleccioná una planilla para ver el detalle.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
