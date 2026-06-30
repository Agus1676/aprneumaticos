import { tiresData } from '../src/data/productsData.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exportar al directorio raíz del proyecto para fácil acceso del usuario
const csvPath = path.join(__dirname, '../tires_catalog.csv');

console.log('Iniciando exportación de neumáticos a formato Excel CSV...');

// Semicolon separator para apertura directa en Excel en español (Necochea, Argentina)
let csvContent = "ID;Brand;Model;Width;Profile;Rim;Category;Price;Stock;Tag;Description;SpeedRating;LoadIndex;Image\n";

for (const tire of tiresData) {
  const escape = (val) => {
    if (val === undefined || val === null) return '';
    const str = String(val).replace(/"/g, '""');
    // Si contiene punto y coma o comillas, envolver en comillas
    return str.includes(';') || str.includes('\n') || str.includes('"') ? `"${str}"` : str;
  };

  csvContent += [
    tire.id,
    escape(tire.brand),
    escape(tire.model),
    tire.width,
    tire.profile,
    tire.rim,
    escape(tire.category),
    tire.price,
    tire.stock,
    escape(tire.tag),
    escape(tire.description),
    escape(tire.speedRating),
    escape(tire.loadIndex),
    escape(tire.image)
  ].join(';') + '\n';
}

fs.writeFileSync(csvPath, csvContent, 'utf-8');

console.log('----------------------------------------------------');
console.log('¡Exportación finalizada con éxito!');
console.log(`Archivo generado en: ${csvPath}`);
console.log('Consejo: Abrí este archivo tires_catalog.csv en Excel o Google Sheets,');
console.log('modificá los valores de la columna Price (Precio) y Stock a tu gusto,');
console.log('guardalo manteniendo el formato CSV, y subilo ejecutando:');
console.log('node scripts/import_from_csv.js');
console.log('----------------------------------------------------');
