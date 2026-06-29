import React, { useState } from 'react';
import api from '../Services/api';
import { PlusCircle, Building2, DollarSign, Wrench } from 'lucide-react';

const C = '#F5A623';

const Field = ({ label, children }) => (
    <div>
        <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: '#888' }}>{label}</label>
        {children}
    </div>
);

const inputClass = "block w-full rounded-xl text-sm px-3 py-2.5";

export default function MachineForm({ onMachineAdded }) {
    const [formData, setFormData] = useState({
        name: '', model: '', serial_number: '', current_hours: '',
        hours_for_service: '250', price_per_hour: '',
        ownership_type: 'propia', supplier_name: '', subrental_cost: ''
    });
    const [saving, setSaving] = useState(false);

    const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/machines', formData);
            setFormData({
                name: '', model: '', serial_number: '', current_hours: '',
                hours_for_service: '250', price_per_hour: '',
                ownership_type: 'propia', supplier_name: '', subrental_cost: ''
            });
            if (onMachineAdded) onMachineAdded();
        } catch (err) {
            const msg = err.response?.data?.errors?.serial_number?.[0]
                || 'Error al guardar. El Número de Serie debe ser único.';
            alert(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl space-y-4 h-fit" style={{ background: '#111', border: '1px solid #222' }}>
            <h3 className="font-black flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid #222' }}>
                <PlusCircle className="w-4 h-4" style={{ color: C }} />
                Alta de Maquinaria
            </h3>

            <Field label="Nombre / Descripción">
                <input type="text" required value={formData.name} onChange={e => set('name', e.target.value)}
                    className={inputClass} placeholder="Ej: Excavadora CAT 320" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Modelo (Año)">
                    <input type="text" required value={formData.model} onChange={e => set('model', e.target.value)}
                        className={inputClass} placeholder="Ej: 2024" />
                </Field>
                <Field label="Nº de Serie">
                    <input type="text" required value={formData.serial_number} onChange={e => set('serial_number', e.target.value)}
                        className={inputClass} placeholder="CAT-9921" />
                </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Horómetro Inicial">
                    <input type="number" required min="0" value={formData.current_hours} onChange={e => set('current_hours', e.target.value)}
                        className={inputClass} placeholder="0" />
                </Field>
                <Field label="Service cada (hs)">
                    <input type="number" min="1" value={formData.hours_for_service} onChange={e => set('hours_for_service', e.target.value)}
                        className={inputClass} placeholder="250" />
                </Field>
            </div>

            <Field label="Tarifa al cliente (USD/h)">
                <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4" style={{ color: '#555' }} />
                    <input type="number" min="0" step="0.01" value={formData.price_per_hour} onChange={e => set('price_per_hour', e.target.value)}
                        className={inputClass + " pl-9"} placeholder="Ej: 120" />
                </div>
            </Field>

            <Field label="Propiedad">
                <select value={formData.ownership_type} onChange={e => set('ownership_type', e.target.value)} className={inputClass}>
                    <option value="propia">Flota Propia</option>
                    <option value="terceros">De Terceros</option>
                </select>
            </Field>

            {formData.ownership_type === 'terceros' && (
                <div className="p-4 rounded-xl space-y-3 animate-fadeIn" style={{ background: '#0d0d0d', border: '1px solid rgba(96,165,250,0.2)' }}>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#60a5fa' }}>
                        <Building2 className="w-3 h-3 inline mr-1" />Datos del Propietario
                    </p>
                    <Field label="Propietario / Proveedor">
                        <input type="text" required value={formData.supplier_name} onChange={e => set('supplier_name', e.target.value)}
                            className={inputClass} placeholder="Nombre del dueño" />
                    </Field>
                    <Field label="Costo subalquiler (USD/h)">
                        <input type="number" required min="0" step="0.01" value={formData.subrental_cost} onChange={e => set('subrental_cost', e.target.value)}
                            className={inputClass} placeholder="Ej: 45" />
                    </Field>
                </div>
            )}

            <button type="submit" disabled={saving}
                className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition"
                style={{ background: saving ? '#333' : C, color: saving ? '#888' : '#0a0a0a', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Guardando...' : 'Registrar en Torq'}
            </button>
        </form>
    );
}
