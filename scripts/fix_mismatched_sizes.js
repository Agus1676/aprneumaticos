import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tiresData, accessoriesData, filterOptions } from '../src/data/productsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, '../src/data/productsData.js');

console.log('Iniciando corrección de medidas desalineadas en la base de datos...');

let fixCount = 0;

const measureRegex = /(\d{3})\/(\d{2})Z?R(\d{2})/i;
const ltRegex = /\b(?:LT)?(\d+)[xX](\d+(?:\.\d+)?)R(\d+)/i;
const agricolaRegex = /\b(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\b/;

for (const tire of tiresData) {
  let matched = false;
  let newWidth = tire.width;
  let newProfile = tire.profile;
  let newRim = tire.rim;

  // Intentar parsear las medidas reales del nombre del modelo
  const measureMatch = tire.model.match(measureRegex);
  const ltMatch = tire.model.match(ltRegex);
  const agricolaMatch = tire.model.match(agricolaRegex);

  if (measureMatch) {
    newWidth = measureMatch[1];
    newProfile = measureMatch[2];
    newRim = measureMatch[3];
    matched = true;
  } else if (ltMatch) {
    newWidth = parseFloat(ltMatch[1]).toFixed(2);
    newProfile = parseFloat(ltMatch[2]).toFixed(2);
    newRim = ltMatch[3];
    matched = true;
  } else if (agricolaMatch) {
    newWidth = agricolaMatch[1];
    newProfile = "--";
    newRim = agricolaMatch[2];
    matched = true;
  }

  // Si las medidas detectadas difieren de las guardadas, las actualizamos
  if (matched && (newWidth !== tire.width || newProfile !== tire.profile || newRim !== tire.rim)) {
    console.log(`[Corrección] ID ${tire.id} - Modelo: "${tire.model}"`);
    console.log(`  Medida anterior: ${tire.width}/${tire.profile} R${tire.rim}`);
    console.log(`  Nueva medida corregida: ${newWidth}/${newProfile} R${newRim}`);
    
    tire.width = newWidth;
    tire.profile = newProfile;
    tire.rim = newRim;
    fixCount++;
  }
}

if (fixCount > 0) {
  const fileContent = `// ==========================================
// ARCHIVO CORREGIDO Y AUTOGENERADO
// ==========================================

export const tiresData = ${JSON.stringify(tiresData, null, 2)};

export const accessoriesData = ${JSON.stringify(accessoriesData, null, 2)};

export const filterOptions = ${JSON.stringify(filterOptions, null, 2)};
`;

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`\n¡Corrección finalizada! Se corrigieron ${fixCount} neumáticos con medidas desalineadas.`);
} else {
  console.log('\nNo se detectaron neumáticos con medidas desalineadas.');
}
