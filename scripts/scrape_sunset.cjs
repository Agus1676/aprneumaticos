const https = require('https');
const fs = require('fs');
const path = require('path');

// ==========================================
// CONFIGURACIÓN DE CONVERSIÓN
// ==========================================
const CONFIG = {
  // Tasa de cambio de USD a Pesos Argentinos (ARS) para la reventa
  // Multiplicamos el valor en USD por 1600 según lo solicitado
  DOLAR_REVENDEDOR: 1600, 
  
  // Ruta de destino del catálogo de React
  OUTPUT_FILE: path.join(__dirname, '../src/data/productsData.js')
};

// Listado de páginas de categorías a descargar
const CATEGORIES = [
  { url: 'https://www.sunset.com.py/cubiertas-para-auto/', category: 'autos' },
  { url: 'https://www.sunset.com.py/cubiertas-para-camionetas/', category: 'camionetas' },
  { url: 'https://www.sunset.com.py/cubiertas-para-camiones/', category: 'camiones' },
  { url: 'https://www.sunset.com.py/cubiertas-agricolas/', category: 'agricolas' },
  { url: 'https://www.sunset.com.py/cubiertas-industriales/', category: 'agricolas' } // Mapeadas a la pestaña agrícolas
];

const allTiresList = [];
const seenKeys = new Set(); // Para evitar duplicados
let idCounter = 1;

console.log('Iniciando descarga completa de TODO el catálogo de Sunset Paraguay...');
console.log(`Tasa de conversión configurada: $ ${CONFIG.DOLAR_REVENDEDOR} ARS/USD\n`);

// Función helper para descargar una URL
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => resolve(html));
    }).on('error', (err) => reject(err));
  });
}

// Procesar secuencialmente todas las categorías
async function runScraper() {
  for (const cat of CATEGORIES) {
    console.log(`Descargando categoría: ${cat.url}...`);
    try {
      const html = await fetchUrl(cat.url);
      const blocks = html.split("<section class='prod_item_gral'");
      console.log(`Página leída. Se encontraron ${blocks.length - 1} bloques de productos.`);
      
      let importedCount = 0;

      for (let i = 1; i < blocks.length; i++) {
        const block = blocks[i];

        // 1. Extraer imagen
        const imgMatch = block.match(/src='([^']*)'/);
        // 2. Extraer título
        const titleMatch = block.match(/class='prod_item_descri_item'>\s*([\s\S]*?)\s*<\/span>/);
        // 3. Extraer precio en USD
        const usdMatch = block.match(/U\$ ([\d.,]+)/);

        if (imgMatch && titleMatch && usdMatch) {
          let imgUrl = 'https://www.sunset.com.py' + imgMatch[1];
          if (imgUrl.includes('imagenno.jpg')) {
            imgUrl = "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=500";
          }
          let rawTitle = titleMatch[1].trim()
            .replace(/\s+/g, ' ')
            .replace(/^CUBIERTA\s+/i, ''); // Quitar palabra "CUBIERTA" al inicio

          const usdPrice = parseFloat(usdMatch[1].replace(',', '.'));
          const priceArs = Math.round(usdPrice * CONFIG.DOLAR_REVENDEDOR);

          // Parsear marca y medidas del título
          const titleWords = rawTitle.split(' ');
          const brandRaw = titleWords[0];
          const brand = brandRaw.charAt(0).toUpperCase() + brandRaw.slice(1).toLowerCase();

          // 2. Medidas (ej: 175/70R13 o 265/70R17) o Flotación/LT (ej: 31X10.50R15) o Agrícolas (ej: 7.50-16 o 10-16.5)
          const measureRegex = /(\d{3})\/(\d{2})Z?R(\d{2})/i;
          const ltRegex = /\b(?:LT)?(\d+)[xX](\d+(?:\.\d+)?)R(\d+)/i;
          const agricolaRegex = /\b(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\b/;

          const measureMatch = rawTitle.match(measureRegex);
          const ltMatch = rawTitle.match(ltRegex);
          const agricolaMatch = rawTitle.match(agricolaRegex);

          let width = "205";
          let profile = "55";
          let rim = "16";

          if (measureMatch) {
            width = measureMatch[1];
            profile = measureMatch[2];
            rim = measureMatch[3];
          } else if (ltMatch) {
            // Guardamos ancho y perfil formateados para coincidir con el buscador de Sunset
            width = parseFloat(ltMatch[1]).toFixed(2);
            profile = parseFloat(ltMatch[2]).toFixed(2);
            rim = ltMatch[3];
          } else if (agricolaMatch) {
            width = agricolaMatch[1];
            profile = "--";
            rim = agricolaMatch[2];
          }

          // 3. Índice de carga y velocidad (ej: 91V o 104R) o Ply Rating (ej: 12PR)
          const loadSpeedRegex = /\b(\d{2,3})([A-Z])\b/;
          const prRegex = /\b(\d{1,2})PR\b/i;

          const loadSpeedMatch = rawTitle.match(loadSpeedRegex);
          const prMatch = rawTitle.match(prRegex);

          let loadIndex = "91 (Hasta 615 kg)";
          let speedRating = "V (Hasta 240 km/h)";

          if (loadSpeedMatch) {
            loadIndex = loadSpeedMatch[1];
            speedRating = loadSpeedMatch[2];
          } else if (prMatch) {
            loadIndex = `${prMatch[1]} PR`;
            speedRating = "--";
          }

          // Extraer modelo limpio
          let model = rawTitle
            .replace(brandRaw, '')
            .replace(measureRegex, '')
            .replace(ltRegex, '')
            .replace(agricolaRegex, '')
            .replace(loadSpeedRegex, '')
            .replace(prRegex, '')
            .trim();

          // Limpiar duplicaciones al final del modelo
          const modelWords = model.split(' ');
          if (modelWords.length > 1 && modelWords[modelWords.length - 1] === modelWords[modelWords.length - 1].toLowerCase()) {
            modelWords.pop();
            model = modelWords.join(' ');
          }
          if (!model) model = 'Cubierta Performance';
          model = model.toUpperCase();

          // Crear clave de deduplicación
          const dupKey = `${brand}-${model}-${width}-${profile}-${rim}`.toLowerCase();
          
          if (!seenKeys.has(dupKey)) {
            seenKeys.add(dupKey);

            // Generar tag aleatorio o destacado
            let tag = "";
            if (importedCount % 8 === 0) tag = "Destacado";
            if (importedCount % 12 === 0) tag = "Oferta";
            if (importedCount % 15 === 0) tag = "Premium";

            // Crear ficha técnica con 3 características
            const features = [
              "Gran adherencia y estabilidad en curvas exigentes",
              "Banda de rodadura diseñada contra aquaplaning",
              "Rodar suave y silencioso de alta duración kilométrica"
            ];

            allTiresList.push({
              id: idCounter++,
              brand,
              model,
              width,
              profile,
              rim,
              category: cat.category,
              price: priceArs,
              stock: Math.floor(Math.random() * 24) + 4, // Stock simulado
              tag,
              image: imgUrl,
              description: `Neumático ${brand} ${model} de gran desempeño comercial, importado por APR Neumáticos. Diseñado bajo estándares premium para ofrecer el máximo confort de rodamiento y tracción segura en todo momento.`,
              speedRating,
              loadIndex,
              features,
              bestFor: {
                usage: cat.category === 'autos' ? 'ciudad' : (cat.category === 'camionetas' ? 'barro' : 'trabajo'),
                priority: importedCount % 2 === 0 ? 'duracion' : 'confort'
              }
            });

            importedCount++;
          }
        }
      }
      console.log(`Categoría "${cat.category}": Se importaron ${importedCount} neumáticos nuevos.\n`);
    } catch (err) {
      console.error(`Error al procesar la categoría ${cat.url}:`, err.message);
    }
  }

  // Guardar catálogo en el archivo de React
  writeToReactFile(allTiresList);
}

function writeToReactFile(tiresList) {
  // Mantener los accesorios preexistentes
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

  const fileContent = `// ==========================================
// ARCHIVO AUTOGENERADO POR SCRAPER SUNSET COMPLETO
// Tasa de conversión: $ ${CONFIG.DOLAR_REVENDEDOR} ARS/USD (USD x 1.600)
// ==========================================

export const tiresData = ${JSON.stringify(tiresList, null, 2)};

export const accessoriesData = ${JSON.stringify(accessoriesData, null, 2)};

export const filterOptions = {
  widths: ${JSON.stringify(widths)},
  profiles: ${JSON.stringify(profiles)},
  rims: ${JSON.stringify(rims)}
};
`;

  fs.writeFileSync(CONFIG.OUTPUT_FILE, fileContent, 'utf-8');
  console.log('----------------------------------------------------');
  console.log(`Catálogo guardado con éxito. Se importaron un total de ${tiresList.length} neumáticos únicos.`);
  console.log(`Conversor de moneda aplicado: USD x ${CONFIG.DOLAR_REVENDEDOR}`);
  console.log(`Ubicación del archivo: ${CONFIG.OUTPUT_FILE}`);
  console.log('----------------------------------------------------');
}

// Ejecutar
runScraper();
