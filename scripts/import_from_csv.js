import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../tires_catalog.csv');
const outputPath = path.join(__dirname, '../src/data/productsData.js');

console.log('Iniciando importación desde el archivo tires_catalog.csv...');

if (!fs.existsSync(csvPath)) {
  console.error(`Error: No se encontró el archivo CSV en la ruta: ${csvPath}`);
  console.error('Asegurate de haber ejecutado primero: node scripts/export_to_csv.js');
  process.exit(1);
}

const csvContent = fs.readFileSync(csvPath, 'utf-8');
// Separar por salto de línea y filtrar líneas vacías
const lines = csvContent.split('\n')
  .map(l => l.trim())
  .filter(line => line !== '');

// Función helper para procesar correctamente celdas con comillas y punto y coma
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Saltar comilla doble escapada
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ';' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

const tires = [];
// Omitir cabecera (línea 0)
for (let i = 1; i < lines.length; i++) {
  const row = parseCSVLine(lines[i]);
  // Validar longitud mínima de campos
  if (row.length < 14) {
    console.warn(`Línea ${i + 1} omitida por falta de columnas suficientes (detectadas: ${row.length}).`);
    continue;
  }

  const [id, brand, model, width, profile, rim, category, price, stock, tag, description, speedRating, loadIndex, image] = row;

  tires.push({
    id: parseInt(id) || i,
    brand: brand.trim(),
    model: model.trim().toUpperCase(),
    width: width.trim(),
    profile: profile.trim(),
    rim: rim.trim(),
    category: category.trim(),
    price: Math.round(parseFloat(price) || 0),
    stock: parseInt(stock) || 0,
    tag: tag.trim(),
    image: image.trim().includes('imagenno.jpg') 
      ? "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=500" 
      : image.trim(),
    description: description.trim().replace(/Sunset/gi, 'APR Neumáticos'),
    speedRating: speedRating.trim(),
    loadIndex: loadIndex.trim(),
    features: [
      "Gran adherencia y estabilidad en curvas exigentes",
      "Banda de rodadura diseñada contra aquaplaning",
      "Rodar suave y silencioso de alta duración kilométrica"
    ],
    bestFor: {
      usage: category.trim() === 'autos' ? 'ciudad' : (category.trim() === 'camionetas' ? 'barro' : 'trabajo'),
      priority: i % 2 === 0 ? 'duracion' : 'confort'
    }
  });
}

// Definición estática y completa de todas las medidas oficiales de Sunset
const widths = [
  "145", "155", "165", "175", "185", "195", "205", "215", "225", "235", "245", "255", "265", "275", "285", "295", "305", "315", "320", "380", "385", "400", "405", "460", "600", "650", "850",
  "05.00", "06.00", "06.50", "07.00", "07.50", "08.25", "08.30", "09.00", "09.50", "10.00", "11.00", "12.4", "13.00", "13.6", "14.00", "14.9", "15.5", "16.9", "17.5", "18.4", "19.5", "20.5", "20.8", "21.00", "23.5", "23.1", "24.5", "27", "28.00", "30.5", "31.00", "32.00", "33.00", "35.00",
  "10.5/80", "12.5/80", "16/70"
];
const profiles = [
  "10.50", "12.50", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "8.50", "80", "85", "90"
];
const rims = [
  "08", "09", "10", "12", "13", "14", "15", "15.3", "15.5", "16", "16.5", "17", "17.5", "18", "19", "19.5", "20", "21", "22", "22.5", "24", "24.5", "25", "26", "28", "30", "30.5", "32", "34", "36", "38", "42", "46"
];

// Accesorios estáticos predefinidos para la web
const accessoriesData = [
  {
    id: 101,
    brand: "Keko",
    name: "Lona Marítima KGR-Premium",
    category: "lonas",
    price: 165000,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500",
    description: "Lona náutica impermeable con perfiles de aluminio y encaje rápido. Ideal para proteger cargas en la caja de Hilux, Ranger o Amarok contra lluvia y polvo."
  },
  {
    id: 102,
    brand: "Bracco",
    name: "Barra Antivuelco Black Sport",
    category: "barras",
    price: 280000,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500",
    description: "Barra antivuelco reforzada en acero carbono con pintura epoxi texturada de alta protección. Calce perfecto y diseño aerodinámico deportivo."
  },
  {
    id: 103,
    brand: "Stanley",
    name: "Caja de Herramientas + Llaves",
    category: "herramientas",
    price: 85000,
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=500",
    description: "Set completo de herramientas Stanley de cromo vanadio (150 piezas). Incluye llaves cricket, bocallaves y destornilladores en maletín reforzado."
  },
  {
    id: 104,
    brand: "Stanley",
    name: "Llave de Impacto Eléctrica 20V",
    category: "herramientas",
    price: 195000,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=500",
    description: "Pistola de impacto Stanley a batería para aflojar tuercas de cubiertas con torque extremo de 370 Nm. Ideal para emergencias en ruta."
  },
  {
    id: 105,
    brand: "Bracco",
    name: "Estribos Laterales de Aluminio",
    category: "variado",
    price: 210000,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500",
    description: "Estribos laterales planos con pisaderas antideslizantes de caucho. Aportan estilo y facilitan el ingreso a pickups de doble cabina."
  }
];

const fileContent = `// ==========================================
// ARCHIVO AUTOGENERADO DESDE EXPORTACIÓN DE EXCEL/CSV
// ==========================================

export const tiresData = ${JSON.stringify(tires, null, 2)};

export const accessoriesData = ${JSON.stringify(accessoriesData, null, 2)};

export const filterOptions = {
  widths: ${JSON.stringify(widths)},
  profiles: ${JSON.stringify(profiles)},
  rims: ${JSON.stringify(rims)}
};
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log('----------------------------------------------------');
console.log('¡Catálogo importado y cargado con éxito!');
console.log(`Ubicación del archivo de React actualizado: ${outputPath}`);
console.log(`Se cargaron un total de ${tires.length} neumáticos en la web.`);
console.log('----------------------------------------------------');
