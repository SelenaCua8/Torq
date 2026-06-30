<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 30px 35px; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #1a1a1a; }

        .header { border-bottom: 3px solid #F5A623; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { font-size: 22px; margin: 0; color: #1a1a1a; }
        .header .sub { font-size: 11px; color: #888; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .header .period { font-size: 13px; color: #F5A623; font-weight: bold; margin-top: 8px; }

        .stats-grid { width: 100%; margin-bottom: 22px; }
        .stats-grid td { width: 20%; padding: 10px 6px; text-align: center; border: 1px solid #e0e0e0; }
        .stats-grid .num { font-size: 18px; font-weight: bold; color: #F5A623; display: block; }
        .stats-grid .label { font-size: 8px; color: #888; text-transform: uppercase; }

        h2 { font-size: 13px; color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 4px; margin-top: 24px; margin-bottom: 10px; }

        table.data { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        table.data th { background: #1a1a1a; color: #fff; padding: 6px 8px; text-align: left; font-size: 8px; text-transform: uppercase; }
        table.data td { padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 9px; }
        table.data tr:nth-child(even) { background: #fafafa; }

        .badge { padding: 2px 6px; border-radius: 3px; font-size: 7px; font-weight: bold; text-transform: uppercase; }
        .badge-rented { background: #fef3c7; color: #92400e; }
        .badge-available { background: #d1fae5; color: #065f46; }
        .badge-propia { background: #d1fae5; color: #065f46; }
        .badge-terceros { background: #dbeafe; color: #1e40af; }

        .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 8px; color: #aaa; text-align: center; }
        .empty { color: #aaa; font-style: italic; font-size: 9px; padding: 8px 0; }
    </style>
</head>
<body>

    <div class="header">
        <h1>TORQ — Reporte Mensual de Gestión</h1>
        <div class="sub">Software de Gestión de Maquinaria</div>
        <div class="period">Período: {{ ucfirst($periodo) }}</div>
    </div>

    <table class="stats-grid">
        <tr>
            <td><span class="num">{{ $total_maquinas }}</span><span class="label">Total Flota</span></td>
            <td><span class="num">{{ $maquinas_alquiladas }}</span><span class="label">Alquiladas</span></td>
            <td><span class="num">{{ $maquinas_disponibles }}</span><span class="label">Disponibles</span></td>
            <td><span class="num">{{ $total_clientes }}</span><span class="label">Clientes</span></td>
            <td><span class="num">${{ number_format($facturacion_total, 0) }}</span><span class="label">Facturación USD</span></td>
        </tr>
    </table>

    <h2>Flota de Maquinaria</h2>
    @if(count($machines) > 0)
    <table class="data">
        <thead>
            <tr>
                <th>Máquina</th>
                <th>S/N</th>
                <th>Propiedad</th>
                <th>Horómetro</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($machines as $m)
            <tr>
                <td>{{ $m->name }}</td>
                <td>{{ $m->serial_number }}</td>
                <td><span class="badge badge-{{ $m->ownership_type }}">{{ $m->ownership_type }}</span></td>
                <td>{{ $m->current_hours }} hs</td>
                <td><span class="badge badge-{{ $m->status === 'rented' ? 'rented' : 'available' }}">{{ $m->status === 'rented' ? 'Alquilada' : 'Disponible' }}</span></td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
        <p class="empty">Sin maquinaria registrada.</p>
    @endif

    <h2>Alquileres del Período</h2>
    @if(count($rentals) > 0)
    <table class="data">
        <thead>
            <tr>
                <th>Máquina</th>
                <th>Cliente</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Valor (USD)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rentals as $r)
            <tr>
                <td>{{ $r->machine_name }}</td>
                <td>{{ $r->client_name }}</td>
                <td>{{ $r->start_date }}</td>
                <td>{{ $r->end_date ?? 'Activo' }}</td>
                <td>{{ $r->price ? '$' . number_format($r->price, 2) : '—' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
        <p class="empty">Sin alquileres registrados en este período.</p>
    @endif

    <h2>Mantenimientos Realizados</h2>
    @if(count($maintenance) > 0)
    <table class="data">
        <thead>
            <tr>
                <th>Máquina</th>
                <th>Fecha</th>
                <th>Mecánico</th>
                <th>Tipo</th>
            </tr>
        </thead>
        <tbody>
            @foreach($maintenance as $log)
            <tr>
                <td>{{ $log->machine_name }}</td>
                <td>{{ \Carbon\Carbon::parse($log->created_at)->format('d/m/Y') }}</td>
                <td>{{ $log->mechanic_name ?? '—' }}</td>
                <td>{{ $log->type ?? 'Preventivo' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
        <p class="empty">Sin controles de mantenimiento en este período.</p>
    @endif

    <h2>Nómina de Usuarios</h2>
    <table class="data">
        <thead>
            <tr><th>Nombre</th><th>Email</th><th>Rol</th></tr>
        </thead>
        <tbody>
            @foreach($clients as $c)
            <tr><td>{{ $c->name }}</td><td>{{ $c->email }}</td><td>Cliente</td></tr>
            @endforeach
            @foreach($mechanics as $m)
            <tr><td>{{ $m->name }}</td><td>{{ $m->email }}</td><td>Mecánico</td></tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Reporte generado automáticamente por Torq el {{ $fecha_generacion }} — Software de Gestión de Maquinaria
    </div>

</body>
</html>
