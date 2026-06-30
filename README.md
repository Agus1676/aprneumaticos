# APR Neumáticos - Catálogo Oficial

Este repositorio contiene el código de la web oficial de **APR Neumáticos** (Necochea, Argentina). Es una aplicación web estática optimizada para dispositivos móviles que permite a los clientes explorar el catálogo de cubiertas, comparar modelos, recibir recomendaciones personalizadas y contactarse directamente por WhatsApp.

## 🚀 Características principales
- **Buscador interactivo:** Filtros por ancho, perfil, rodado y marca en tiempo real.
- **Recomendador de neumáticos:** Un asistente interactivo (quiz paso a paso) que sugiere el neumático ideal según el vehículo y el tipo de uso.
- **Comparador:** Permite seleccionar y comparar la ficha técnica de varios neumáticos en paralelo.
- **Panel de Administración:** Consola interna protegida por contraseña para editar precios, stock, pausar productos y apagar/encender secciones completas de la web en vivo.
- **Sincronización con Excel (CSV):** Carga y actualización del stock de más de 740 neumáticos de forma masiva directamente desde una planilla de cálculo.

## 🛠️ Tecnologías utilizadas
- **Frontend:** React (JavaScript), Vite (compilador rápido) y CSS Vanilla (diseño responsivo y personalizado en modo oscuro).
- **Backend / Automatización:** Node.js (scripts de importación y scrapers de datos).
- **Alojamiento:** Vercel con integración continua mediante GitHub.

## 📂 Estructura del proyecto
- `/src/components`: Componentes visuales de la interfaz (menú, catálogo, recomendador, etc.).
- `/src/data/productsData.js`: Base de datos estática autogenerada del catálogo de neumáticos y accesorios.
- `/scripts/import_from_csv.js`: Conversor Node que lee la planilla de Excel (`tires_catalog.csv`) y actualiza la web.
- `/scripts/export_to_csv.js`: Conversor que exporta los datos actuales de la web a un archivo de Excel para su fácil edición.

## 💻 Desarrollo local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Correr servidor de desarrollo:**
   ```bash
   npm run dev
   ```
3. **Compilar para producción:**
   ```bash
   npm run build
   ```

## 📊 Sincronizar catálogo con Excel
Para actualizar precios o stock de forma masiva:
1. Abrir `tires_catalog.csv` con Excel y modificar los valores en las columnas `Price` y `Stock`.
2. Guardar el archivo manteniendo el formato CSV.
3. Ejecutar en consola:
   ```bash
   node scripts/import_from_csv.js
   ```
4. Subir los cambios a GitHub (`git push`) para que Vercel actualice la web en producción automáticamente.
