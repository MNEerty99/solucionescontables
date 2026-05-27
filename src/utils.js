/* -------------------------------------------------------------
   VMP Studio Contable — Shared Utilities
   ------------------------------------------------------------- */

/**
 * Formatea un número como moneda argentina.
 * @param {number} n
 * @param {number} decimals
 * @returns {string}
 */
export function fmt(n, decimals = 2) {
  if (typeof n !== 'number' || isNaN(n)) return '0,00';
  return n.toLocaleString('es-AR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) como DD/MM/YYYY.
 * @param {string} isoDate
 * @returns {string}
 */
export function fmtDate(isoDate) {
  if (!isoDate) return '';
  return isoDate.split('-').reverse().join('/');
}

/**
 * Retorna el último dígito de un CUIT limpio.
 * @param {string} cuit  Formato XX-XXXXXXXX-X o XXXXXXXXXXX
 * @returns {number}
 */
export function cuitLastDigit(cuit) {
  const clean = cuit.replace(/-/g, '');
  return parseInt(clean.slice(-1), 10);
}

/**
 * Calendario de vencimientos ARCA según terminación de CUIT.
 * Devuelve los días de vencimiento del mes siguiente para cada obligación.
 * @param {string} cuit
 * @returns {Object}
 */
export function getVencimientos(cuit) {
  const term = cuitLastDigit(cuit);
  const ivaMap = {
    0: { dia: 18, alt: 20 }, 1: { dia: 18, alt: 20 },
    2: { dia: 19, alt: 21 }, 3: { dia: 19, alt: 21 },
    4: { dia: 20, alt: 22 }, 5: { dia: 20, alt: 22 },
    6: { dia: 21, alt: 23 }, 7: { dia: 21, alt: 23 },
    8: { dia: 22, alt: 24 }, 9: { dia: 22, alt: 24 },
  };
  const autonomosMap = {
    0: { dia: 5 }, 1: { dia: 5 }, 2: { dia: 5 }, 3: { dia: 5 },
    4: { dia: 6 }, 5: { dia: 6 }, 6: { dia: 6 },
    7: { dia: 7 }, 8: { dia: 7 }, 9: { dia: 7 },
  };
  const sussMap = {
    0: { dia: 9 }, 1: { dia: 9 }, 2: { dia: 9 }, 3: { dia: 9 },
    4: { dia: 10 }, 5: { dia: 10 }, 6: { dia: 10 },
    7: { dia: 13 }, 8: { dia: 13 }, 9: { dia: 13 },
  };
  return {
    iva: ivaMap[term] || { dia: 20, alt: 22 },
    autonomos: autonomosMap[term] || { dia: 6 },
    suss: sussMap[term] || { dia: 10 },
    casasParticulares: { dia: 10 },
    monotributo: { dia: 20 },
  };
}

/**
 * Determina la categoría RT 54 en base a ingresos anuales.
 * Umbrales base oct-2022 reexpresados por coeficiente inflacionario.
 * El coeficiente se actualiza manualmente por ejercicio.
 * @param {number} ingresosAnuales  Moneda homogénea reexpresada.
 * @returns {'pequena'|'mediana'|'restante'}
 */
export const RT54_COEF = 18.4; // Coeficiente inflacionario acumulado base oct/22
export const RT54_BASE_MEDIANA  = 650_000_000;   // Base oct 2022
export const RT54_BASE_RESTANTE = 3_250_000_000; // Base oct 2022

export function categorizarRT54(ingresosAnuales) {
  const umbralMediana  = RT54_BASE_MEDIANA  * RT54_COEF;
  const umbralRestante = RT54_BASE_RESTANTE * RT54_COEF;
  if (ingresosAnuales <= umbralMediana)  return 'pequena';
  if (ingresosAnuales <= umbralRestante) return 'mediana';
  return 'restante';
}

/**
 * Descarga un archivo de texto en el navegador.
 * @param {string} filename
 * @param {string} content
 * @param {string} mimeType
 */
export function downloadFile(filename, content, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
