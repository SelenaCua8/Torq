<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #0a0a0a; padding: 30px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; background: #111; border-radius: 12px; overflow: hidden;">
        <tr>
            <td style="background: #F5A623; padding: 24px; text-align: center;">
                <h1 style="margin: 0; color: #0a0a0a; font-size: 20px;">TORQ</h1>
                <p style="margin: 4px 0 0; color: #0a0a0a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Reporte Mensual de Gestión</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 28px; color: #E8E8E8;">
                <p style="font-size: 14px;">Hola,</p>
                <p style="font-size: 14px; line-height: 1.6;">
                    Adjunto encontrarás el reporte mensual de Torq correspondiente a
                    <strong style="color: #F5A623;">{{ ucfirst($data['periodo']) }}</strong>.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                        <td style="background: #161616; border-radius: 8px; padding: 14px; text-align: center; width: 33%;">
                            <div style="font-size: 20px; font-weight: bold; color: #F5A623;">{{ $data['total_maquinas'] }}</div>
                            <div style="font-size: 9px; color: #888; text-transform: uppercase;">Máquinas</div>
                        </td>
                        <td width="8"></td>
                        <td style="background: #161616; border-radius: 8px; padding: 14px; text-align: center; width: 33%;">
                            <div style="font-size: 20px; font-weight: bold; color: #4ade80;">${{ number_format($data['facturacion_total'], 0) }}</div>
                            <div style="font-size: 9px; color: #888; text-transform: uppercase;">Facturación</div>
                        </td>
                        <td width="8"></td>
                        <td style="background: #161616; border-radius: 8px; padding: 14px; text-align: center; width: 33%;">
                            <div style="font-size: 20px; font-weight: bold; color: #60a5fa;">{{ $data['total_clientes'] }}</div>
                            <div style="font-size: 9px; color: #888; text-transform: uppercase;">Clientes</div>
                        </td>
                    </tr>
                </table>

                <p style="font-size: 13px; color: #888; line-height: 1.6;">
                    El PDF adjunto incluye el detalle completo de flota, alquileres del período, controles de mantenimiento realizados y la nómina de usuarios del sistema.
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 16px; text-align: center; border-top: 1px solid #222;">
                <p style="font-size: 10px; color: #555; margin: 0;">Torq · Software de Gestión de Maquinaria</p>
            </td>
        </tr>
    </table>
</body>
</html>
