# Reglas de Proyecto y Recordatorios - APR Neumáticos

## Contexto de la Aplicación y Cambios Recientes

> [!IMPORTANT]
> Hemos realizado una reestructuración total y profesional de la plataforma React. La web ya no tiene componentes básicos y cuenta con:
> 1. **Navegación Premium:** Mega-menú flotante translúcido con retardo de 250ms al salir y puente invisible (CSS mouse bridge) para evitar cierres accidentados. Todo el banner de "Catálogo Oficial" es clickeable.
> 2. **Medidas Agrícolas Especiales:** Se detectan y formatean correctamente medidas de pulgadas y telas (ej: `7.50-16` y `12 PR`) en tarjetas, comparador y ficha técnica, eliminando barras `/` o letras `R` incorrectas.
> 3. **Paginación Inteligente:** La grilla del catálogo está limitada a **8 neumáticos por página** con controles responsivos y scroll automático hacia arriba al cambiar de página.
> 4. **Marcas Dinámicas:** La sección "Marcas" es 100% automática a partir de las cargadas en el catálogo (Michelin fue excluida automáticamente).

---

## Importación de Catálogo desde Excel/CSV (Roadmap para mañana)

El usuario modificará los precios y stock del catálogo completo de neumáticos (745 productos importados de Sunset Paraguay a tasa $1600 ARS/USD) utilizando el archivo de Excel:
* [tires_catalog.csv](file:///C:/Users/pepo/.gemini/antigravity/scratch/apr-neumaticoss/tires_catalog.csv)

### Siguientes Pasos
Cuando el usuario retome mañana:
1. **Ejecutar el script de importación:** Correr el importador para procesar el CSV modificado y guardar los cambios en la base de datos de React:
   ```bash
   node scripts/import_from_csv.js
   ```
2. **Validar la compilación:** Hacer un build de prueba para comprobar que no existan errores de sintaxis en el archivo generado:
   ```bash
   npm run build
   ```
3. **Verificar precios:** Asegurarse de que los valores editados en Excel se visualicen correctamente en las tarjetas y calculadora de cuotas de la web.
