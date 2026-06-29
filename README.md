# 🚜 TORQ - Sistema de Control de Maquinaria Vial

¡Bienvenido/a a **TORQ**! Este proyecto es el resultado de una reingeniería profunda de software, transformando un prototipo conceptual en una aplicación web robusta, multiperfil y escalable para la gestión de flota pesada, alquileres y control preventivo.

---

## 📑 La Historia del Proyecto: Del Prototipo IA a Software Industrial

El proyecto nació a partir de una necesidad real. Un cliente se presentó con un archivo monolítico en React (`.jsx`) generado mediante **Claude AI**. Si bien la interfaz estética y los flujos visuales eran excelentes, el prototipo presentaba serias limitaciones técnicas para su uso en producción:

* **Persistencia ficticia:** Utilizaba `localStorage` simulando una base de datos.
* **Arquitectura monolítica:** Todo el sistema (Admin, Cliente y Mecánico) convivía en un único archivo de más de 1000 líneas.
* **Dependencia rígida:** Estaba acoplado a servicios externos como Firebase sin validaciones del lado del servidor.

### 🛠️ El Proceso de Migración y Rediseño

Tomé ese requerimiento inicial y lideré la migración completa hacia un entorno **MVC Moderno (Decoupled)** utilizando **Laravel (PHP)** y **React (Vite)**.

1.  **Desacoplamiento de Componentes:** Despedacé el archivo gigante original y lo estructuré en componentes modulares reutilizables dentro de `resources/js/Components/`.
2.  **Modelado de Base de Datos:** Diseñé la estructura relacional e implementé las migraciones en **MySQL (XAMPP)** para auditar máquinas, clientes, alquileres e historiales técnicos de forma segura.
3.  **Lógica del Servidor:** Creé controladores y modelos en Laravel para manejar la validación de datos, la seguridad y la API interna (reemplazando la lógica simulada por transacciones reales).

---

## 🚀 Nuevas Características Incorporadas (Según SRS)

Además de la migración técnica, expandí el sistema para cumplir con los requisitos del **SRS (Especificación de Requisitos de Software)**:

* **Propiedad de Flota:** Ahora el Administrador puede clasificar las unidades entre maquinaria **Propia** o de **Terceros** (subalquilada).
* **Portal de Autogestión del Cliente:** Vista exclusiva donde las empresas clientes ven sus equipos activos en obra y disponen de un **Botón de Emergencia** para solicitar servicio técnico ante fallas de forma inmediata.
* **Perfil del Mecánico & Checklist Digital:** El operario técnico accede a su agenda y puede rellenar la **Planilla de Inspección de 20 puntos críticos** (frenos, luces, fugas, niveles) basada en las planillas de control real de la empresa.
* **Historial Clínico de Unidades:** Cada máquina archiva de forma automática e histórica todos los checklists y servicios de horometría (250h / 500h) firmados por los mecánicos para auditorías del dueño.

---

## 💻 Stack Tecnológico

* **Backend:** Laravel (PHP) - API REST & MVC Moderno.
* **Frontend:** React.js + Vite (JavaScript).
* **Base de Datos:** MySQL (XAMPP).
* **Estilos e Iconos:** Tailwind CSS & Lucide React.
* **Analíticas:** Recharts (Gráficos interactivos del estado de la flota).

---

## 🔧 Instrucciones de Instalación Local

Para correr **TORQ** en tu máquina Windows con XAMPP:

1. Cloná el repositorio:
   ```bash
   git clone [https://github.com/SelenaCua8/Torq.git](https://github.com/SelenaCua8/Torq.git)

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
# MaquiControl
