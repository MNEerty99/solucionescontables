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

/**
 * Renderiza una capa de previsualización bloqueada para venta/marketing (Sales Teaser).
 * @param {string} childHTML El contenido HTML original a empañar.
 * @param {string} title Título del beneficio premium.
 * @param {string} description Descripción corta del valor del módulo.
 * @returns {string} HTML con el overlay y desenfoque aplicados.
 */
export function renderPremiumTeaser(childHTML, title, description) {
  return `
  <div class="locked-container" style="width: 100%; min-height: 520px; display: flex; flex-direction: column;">
    <div class="locked-blur" style="flex-grow: 1;">
      ${childHTML}
    </div>
    <div class="premium-lock-overlay">
      <div class="premium-lock-card">
        <div class="premium-lock-icon">
          <i data-lucide="lock" style="width: 24px; height: 24px;"></i>
        </div>
        <h3 style="font-size: 17px; font-weight: 800; color: #0f172a; margin: 0;">${title}</h3>
        <p style="font-size: 12.5px; color: #475569; line-height: 1.5; margin: 0; max-width: 360px;">
          ${description}
        </p>
        <div style="background: rgba(13, 148, 136, 0.03); border: 1px solid rgba(13, 148, 136, 0.12); padding: 12px; border-radius: 6px; width: 100%; text-align: left; font-size: 11px; line-height: 1.4; color: #475569;">
          💡 <strong>Servicio Exclusivo:</strong> Este módulo es una herramienta de alta fidelidad disponible únicamente para clientes activos que contratan el abono mensual del **Estudio Contable Comahue**.
        </div>
        <button class="btn btn-primary" onclick="alert('Estudio Contable Comahue\\n\\n📞 Teléfono: +54 299 448-1234\\n✉️ Email: contacto@estudiocomahue.com.ar\\n📍 Ubicación: Neuquén, Argentina')" style="width: 100%; background: #6366f1; border-color: #6366f1; font-weight: 700; margin-top: 4px; padding: 10px; border-radius: 6px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i data-lucide="phone" style="width: 16px; height: 16px;"></i> Contactar al Estudio Contable
        </button>
      </div>
    </div>
  </div>
  `;
}

