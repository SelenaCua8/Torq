import React, { useState } from 'react';
import api from '../Services/api';
import { Wrench, CheckCircle2, AlertOctagon, Clock } from 'lucide-react';

const C = '#F5A623';

const CHECKLIST_ITEMS = {
    1:  "Ruedas Motrices (banda de rodaje, presión, desgaste)",
    2:  "Ruedas Directrices (banda de rodaje, presión, desgaste)",
    3:  "Fijación de brazos de horquilla / uñas",
    4:  "Mandos en servicio",
    5:  "Bocina",
    6:  "Luces de posición",
    7:  "Luces de freno",
    8:  "Luces de trabajo",
    9:  "Alarma / dispositivo de retroceso",
    10: "Freno de mano",
    11: "Freno de pie",
    12: "Espejo(s) retrovisor(es)",
    13: "Extintor",
    14: "Cinturón de seguridad",
    15: "Niveles de aceite",
    16: "Estado del asiento",
    17: "Arresta llamas",
    18: "Fugas en circuito hidráulico",
    19: "Fugas en mangueras y/o conexiones",
    20: "Fugas en motor",
    21: "Nivel de líquido refrigerante",
    22: "Estado de batería y bornes",
    23: "Estructura general y chasis",
};

const STATUS_OPTIONS = ['Apto', 'No Apto', 'Reparar'];

const initialChecklist = () =>
    Object.fromEntries(
        Object.entries(CHECKLIST_ITEMS).map(([k, name]) => [k, { name, status: 'Apto', obs: '' }])
    );

export default function MechanicChecklist({ machineId, mechanicId, onServiceSaved }) {
    const [serviceHours, setServiceHours] = useState('');
    const [serviceType, setServiceType]   = useState('preventive');
    const [notes, setNotes]               = useState('');
    const [checklist, setChecklist]       = useState(initialChecklist());
    const [saving, setSaving]             = useState(false);

    const setItem = (key, field, value) =>
        setChecklist(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

    const noAptos = Object.values(checklist).filter(i => i.status !== 'Apto').length;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/maintenance-checklists', {
                machine_id: machineId,
                service_hours: parseInt(serviceHours),
                type: serviceType,
                inspections: checklist,
                general_observations: notes,
            });
            alert('¡Inspección guardada y notificada al administrador!');
            if (onServiceSaved) onServiceSaved();
        } catch (err) {
            console.error(err.response?.data);
            alert('Error al guardar la planilla. Revisá la consola.');
        } finally {
            setSaving(false);
        }
    };

    const statusColor = (s) =>
        s === 'Apto'    ? { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)' } :
        s === 'No Apto' ? { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' } :
                          { color: C, bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.25)' };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 h-full flex flex-col overflow-hidden">
            {/* Cabecera del control */}
            <div className="p-4 rounded-2xl" style={{ background: '#111', border: '1px solid #222' }}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black flex items-center gap-2">
                        <Wrench className="w-4 h-4" style={{ color: C }} />
                        Control Preventivo Digital
                    </h3>
                    {noAptos > 0 && (
                        <span className="text-xs font-black px-3 py-1 rounded-full"
                            style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
                            ⚠ {noAptos} ítem{noAptos > 1 ? 's' : ''} con observación
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>
                            <Clock className="w-3 h-3 inline mr-1" />Horómetro actual
                        </label>
                        <input type="number" required min="0" value={serviceHours} onChange={e => setServiceHours(e.target.value)}
                            className="block w-full rounded-xl text-sm px-3 py-2.5" placeholder="Ej: 320" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>
                            Tipo de control
                        </label>
                        <select value={serviceType} onChange={e => setServiceType(e.target.value)}
                            className="block w-full rounded-xl text-sm px-3 py-2.5">
                            <option value="preventive">Preventivo</option>
                            <option value="corrective">Correctivo</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla de checklist */}
            <div className="flex-1 overflow-hidden rounded-2xl" style={{ border: '1px solid #222' }}>
                <div className="overflow-y-auto h-full">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10">
                            <tr style={{ background: '#161616', borderBottom: '1px solid #222' }}>
                                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest w-8" style={{ color: '#555' }}>#</th>
                                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest" style={{ color: '#555' }}>Componente</th>
                                <th className="px-4 py-3 text-center text-[10px] font-black uppercase tracking-widest w-36" style={{ color: '#555' }}>Estado</th>
                                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest w-48" style={{ color: '#555' }}>Observación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(checklist).map(([key, item], idx) => {
                                const sc = statusColor(item.status);
                                return (
                                    <tr key={key}
                                        style={{
                                            background: idx % 2 === 0 ? '#0d0d0d' : '#111',
                                            borderBottom: '1px solid #1a1a1a',
                                        }}>
                                        <td className="px-4 py-3 font-black text-xs" style={{ color: '#444' }}>{key}</td>
                                        <td className="px-4 py-3 text-sm" style={{ color: '#ccc' }}>{item.name}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={item.status}
                                                onChange={e => setItem(key, 'status', e.target.value)}
                                                className="w-full text-xs rounded-lg px-2 py-1.5 font-bold text-center"
                                                style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={item.obs}
                                                onChange={e => setItem(key, 'obs', e.target.value)}
                                                className="w-full text-xs rounded-lg px-2 py-1.5"
                                                placeholder="Opcional..."
                                                style={{ background: '#161616', border: '1px solid #2a2a2a', color: '#aaa' }} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 rounded-2xl space-y-4" style={{ background: '#111', border: '1px solid #222' }}>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>
                        Diagnóstico / Observaciones generales
                    </label>
                    <textarea rows="3" value={notes} onChange={e => setNotes(e.target.value)}
                        className="block w-full rounded-xl text-sm px-3 py-2.5"
                        placeholder="Describí el estado general de la máquina, intervenciones realizadas, etc." />
                </div>
                <button type="submit" disabled={saving}
                    className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition"
                    style={{
                        background: saving ? '#333' : C,
                        color: saving ? '#888' : '#0a0a0a',
                        cursor: saving ? 'not-allowed' : 'pointer'
                    }}>
                    {saving ? 'Archivando...' : '✓ Firmar y Archivar Planilla'}
                </button>
            </div>
        </form>
    );
}
