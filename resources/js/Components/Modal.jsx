// Modal — disponible para uso futuro con diseño Torq
import React from 'react';

export default function Modal({ children, show = false, onClose = () => {}, title = '' }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-xl rounded-2xl animate-fadeIn" style={{ background: '#111', border: '1px solid #222' }}>
                {title && (
                    <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #222' }}>
                        <h3 className="font-black">{title}</h3>
                        <button onClick={onClose} className="text-xs px-3 py-1.5 rounded-lg transition"
                            style={{ background: '#1a1a1a', color: '#888', border: '1px solid #2a2a2a' }}>
                            Cerrar
                        </button>
                    </div>
                )}
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}
