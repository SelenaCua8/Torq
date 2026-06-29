<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px; }
        .container { background-color: #ffffff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; border-top: 5px solid #eab308; }
        .title { color: #18181b; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .text { color: #52525b; line-height: 1.6; }
        .highlight { font-weight: bold; color: #18181b; }
        .btn { display: inline-block; background-color: #18181b; color: #eab308; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="title">Torq - Reporte de Taller</div>
        <p class="text">Hola, Administrador.</p>
        <p class="text">El operario técnico <span class="highlight">{{ $mechanicName }}</span> acaba de finalizar y firmar una nueva planilla de Control Preventivo (Checklist 23 puntos).</p>
        
        <p class="text">
            <strong>🚜 Maquinaria:</strong> {{ $machine->name }}<br>
            <strong>📌 Nro. de Serie:</strong> {{ $machine->serial_number }}
        </p>

        <p class="text">Por favor, ingrese al sistema para auditar el reporte y revisar las alertas técnicas.</p>
        
        <a href="http://127.0.0.1:8000" class="btn">Abrir Dashboard Torq</a>
    </div>
</body>
</html>