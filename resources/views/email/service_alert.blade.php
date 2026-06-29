<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8fafc; color: #0f172a; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; border-top: 5px solid #eab308; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
        .title { color: #eab308; font-size: 24px; font-weight: 900; letter-spacing: 2px; }
        .machine-card { background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #eab308; }
        .machine-name { font-size: 18px; font-weight: bold; color: #1e293b; margin: 0 0 5px 0; }
        .machine-detail { margin: 0; font-size: 14px; color: #64748b; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">TORQ</div>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Control Predictivo de Flota</p>
        </div>
        
        <h2 style="color: #0f172a;">⚠️ Alerta de Mantenimiento</h2>
        <p>El sistema ha detectado maquinarias que están a <strong>50 horas o menos</strong> de requerir un mantenimiento preventivo. Se solicita programar la visita al taller.</p>

        @foreach($upcomingMachines as $machine)
            <div class="machine-card">
                <h3 class="machine-name">{{ $machine->name }} (S/N: {{ $machine->serial_number }})</h3>
                <p class="machine-detail"><strong>Horómetro Actual:</strong> {{ $machine->current_hours }} hs</p>
                <p class="machine-detail"><strong>Frecuencia de Service:</strong> Cada {{ $machine->hours_for_service }} hs</p>
            </div>
        @endforeach

        <div class="footer">
            Este es un mensaje automático generado por el Sistema Torq.<br>
            Por favor, coordine con el equipo de mecánicos para evitar roturas.
        </div>
    </div>
</body>
</html>