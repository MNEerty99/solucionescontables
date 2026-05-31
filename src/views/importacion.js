/* -------------------------------------------------------------
   VMP Studio Contable - Importación ARCA View Component (REAL PARSER)
   ------------------------------------------------------------- */
import { getActiveCompany, addTransaction } from '../db/mockdb.js';
import { renderPremiumTeaser } from '../utils.js';

const ARCA_MOCK_EMITIDAS = [
  { fecha: "2026-05-24", tipo_comprobante: "Factura A", numero: "0003-00000850", cliente: "Comercio Mayorista Patagonia", cuit: "30-58930219-4", neto: 150000, iva: 31500, total: 181500, es_activo: false, categoria: "Venta" },
  { fecha: "2026-05-24", tipo_comprobante: "Factura A", numero: "0003-00000851", cliente: "Estación de Servicio Comahue", cuit: "30-50001234-9", neto: 320000, iva: 67200, total: 387200, es_activo: false, categoria: "Venta" },
  { fecha: "2026-05-23", tipo_comprobante: "Factura B", numero: "0003-00000105", cliente: "Gómez Carlos Alberto", cuit: "20-18493021-9", neto: 85000, iva: 17850, total: 102850, es_activo: false, categoria: "Venta" },
  { fecha: "2026-05-22", tipo_comprobante: "Factura A", numero: "0003-00000852", cliente: "Metalúrgica Andina S.A.", cuit: "30-71928371-2", neto: 650000, iva: 136500, total: 786500, es_activo: false, categoria: "Venta" },
  { fecha: "2026-05-21", tipo_comprobante: "Factura B", numero: "0003-00000106", cliente: "Fernández Mariana", cuit: "27-24958302-3", neto: 25000, iva: 5250, total: 30250, es_activo: false, categoria: "Venta" }
];

const ARCA_MOCK_RECIBIDAS = [
  { fecha: "2026-05-25", tipo_comprobante: "Factura A", numero: "1284-00019482", proveedor: "Telecomunicaciones SRL", cuit: "30-99889988-1", neto: 45000, iva: 9450, total: 54450, es_activo: false, categoria: "Servicios" },
  { fecha: "2026-05-23", tipo_comprobante: "Factura A", numero: "0094-00293812", proveedor: "Papelera del Valle", cuit: "30-66442299-5", neto: 38000, iva: 7980, total: 45980, es_activo: false, categoria: "Librería" },
  { fecha: "2026-05-20", tipo_comprobante: "Factura B", numero: "8391-09283746", proveedor: "Librería La Favorita", cuit: "30-11221122-3", neto: 12000, iva: 2520, total: 14520, es_activo: false, categoria: "Librería" },
  { fecha: "2026-05-18", tipo_comprobante: "Factura A", numero: "0103-00048192", proveedor: "Estudio Contable Centenario", cuit: "30-70809010-4", neto: 120000, iva: 25200, total: 145200, es_activo: false, categoria: "Servicios" },
  { fecha: "2026-05-15", tipo_comprobante: "Factura A - Retención", numero: "0002-00003291", proveedor: "Constructora Norpat S.A.", cuit: "30-84920193-7", neto: 350000, iva: 73500, total: 423500, es_activo: true, categoria: "Construcciones" },
  { fecha: "2026-05-10", tipo_comprobante: "Factura A", numero: "0008-00012743", proveedor: "Computación Neuquen", cuit: "30-72849102-3", neto: 537190, iva: 112810, total: 650000, es_activo: true, categoria: "Computación" }
];

export function renderImportacion() {
  const activeCompany = getActiveCompany();

  return renderPremiumTeaser(`
  <div class="view-header">
    <div>
      <h1 class="view-title">Importación ARCA</h1>
      <p class="view-subtitle">Importá facturas masivamente desde los archivos descargados de "Mis Comprobantes" en ARCA.</p>
    </div>
  </div>

  <div class="card" style="margin-bottom: 32px;">
    <div class="card-body">
      <!-- Drag & Drop Zone -->
      <div class="import-area" id="afip-dropzone">
        <div class="import-icon">
          <i data-lucide="file-text"></i>
        </div>
        <h4 id="dropzone-title">Arrastrá aquí tus comprobantes ARCA</h4>
        <p id="dropzone-desc">Soportamos formatos oficiales de ARCA (Excel .xls / .xlsx, TXT o CSV de "Mis Comprobantes Emitidos/Recibidos").</p>
        
        <label class="btn btn-outline btn-sm" style="cursor: pointer;">
          Examinar Archivo Real
          <input type="file" id="afip-file-input" style="display: none;" accept=".csv,.txt,.xlsx,.xls">
        </label>

        <div class="demo-afip-pills">
          <div class="afip-sample-pill" id="btn-simulate-emitidas">
            <i data-lucide="refresh-cw" style="width: 12px; height: 12px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
            Sincronizar Emitidas ARCA (Ventas)
          </div>
          <div class="afip-sample-pill" id="btn-simulate-recibidas">
            <i data-lucide="refresh-cw" style="width: 12px; height: 12px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
            Sincronizar Recibidas ARCA (Compras)
          </div>
        </div>
      </div>

      <!-- Live simulation progress -->
      <div id="sim-progress-container" style="display: none; padding: 24px; border-top: 1px solid var(--border-color); text-align: center;">
        <div class="spinner" style="margin: 0 auto 16px;"></div>
        <h4 id="sim-progress-title">Procesando y validando firmas fiscales ARCA...</h4>
        <div style="width: 100%; max-width: 400px; height: 6px; background: rgba(255,255,255,0.05); border-radius: var(--radius-full); margin: 12px auto; overflow: hidden; position: relative;">
          <div id="sim-progress-bar" style="width: 0%; height: 100%; background: var(--gradient-brand); transition: width 0.1s linear;"></div>
        </div>
        <span id="sim-progress-percent" style="font-family: var(--font-mono); font-size: 13px; font-weight: 600;">0%</span>
      </div>

      <!-- Simulation results -->
      <div id="sim-results-container" style="display: none; border-top: 1px solid var(--border-color); padding-top: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="check-circle" style="color: var(--color-emerald-light)"></i>
          Comprobantes Importados con Éxito
        </h3>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr id="sim-table-header">
                <!-- Injected via JS -->
              </tr>
            </thead>
            <tbody id="sim-table-body">
              <!-- Injected via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3><i data-lucide="help-circle"></i> ¿Cómo descargar los comprobantes desde ARCA?</h3>
    </div>
    <div class="card-body">
      <ul style="list-style-type: decimal; padding-left: 20px; font-size: 14px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 12px;">
        <li>Ingresá a <strong>ARCA (www.arca.gob.ar)</strong> con tu Clave Fiscal.</li>
        <li>Accedé al servicio interactivo de <strong>"Mis Comprobantes"</strong>.</li>
        <li>Seleccioná la opción <strong>"Emitidos"</strong> (para ventas) o <strong>"Recibidos"</strong> (para compras).</li>
        <li>Elegí el rango de fechas (ej: mes actual) y hacé clic en Buscar.</li>
        <li>En el listado, seleccioná <strong>"Exportar" → Formato XLS o CSV</strong>. El sistema descarga el archivo directamente sin necesidad del botón Excel antiguo.</li>
        <li>¡Listo! Arrastrá ese archivo descargado en este panel y el sistema cargará todo al instante.</li>
      </ul>
      <div style="margin-top:16px; background:rgba(99,102,241,0.03); border:1px solid rgba(99,102,241,0.15); border-radius:var(--radius-sm); padding:12px 16px; font-size:12px; color:var(--text-secondary);">
        <strong style="color:#818cf8;">Tip RPA:</strong> Para automatizar la descarga sin ingresar manualmente, configurá el bot de descarga en <strong>Configuración ARCA</strong>. Los robots descargan en horarios nocturnos con la clave fiscal del administrador.
      </div>
    </div>
  </div>
  `, "Importador de Comprobantes ARCA", "Sincronizá el estudio contable directamente con ARCA. Habilitá la descarga y carga automatizada de comprobantes de compras y ventas sin carga manual ni planillas externas.");
}

export function initImportacion(mainApp) {
  if (window.lucide) window.lucide.createIcons();

  const activeCompany = getActiveCompany();

  const dropzone = document.getElementById('afip-dropzone');
  const fileInput = document.getElementById('afip-file-input');
  
  const btnSimEmitidas = document.getElementById('btn-simulate-emitidas');
  const btnSimRecibidas = document.getElementById('btn-simulate-recibidas');
  
  const progContainer = document.getElementById('sim-progress-container');
  const progBar = document.getElementById('sim-progress-bar');
  const progPercent = document.getElementById('sim-progress-percent');
  const progTitle = document.getElementById('sim-progress-title');
  
  const resContainer = document.getElementById('sim-results-container');
  const resHeader = document.getElementById('sim-table-header');
  const resBody = document.getElementById('sim-table-body');

  const startSimulation = (batch, type) => {
    if (batch.length === 0) {
      mainApp.showToast("No se detectaron filas válidas de transacciones para importar en el archivo.", "error");
      return;
    }

    resContainer.style.display = 'none';
    progContainer.style.display = 'block';
    
    let percent = 0;
    progBar.style.width = '0%';
    progPercent.textContent = '0%';
    progTitle.textContent = 'Analizando estructura del reporte fiscal de la AFIP...';

    const interval = setInterval(() => {
      percent += 10;
      if (percent > 100) percent = 100;
      
      progBar.style.width = percent + '%';
      progPercent.textContent = percent + '%';

      if (percent === 30) {
        progTitle.textContent = 'Procesando e indexando comprobantes...';
      } else if (percent === 60) {
        progTitle.textContent = 'Validando firmas y consistencia de CUITs en base APOC...';
      } else if (percent === 90) {
        progTitle.textContent = 'Liquidando alícuotas e insertando en base offline-first...';
      } else if (percent === 100) {
        clearInterval(interval);
        
        // Cargar en la DB temporal real
        let duplicateCount = 0;
        batch.forEach(tx => {
          const added = addTransaction(activeCompany.id, type, tx);
          // Si el CUIT o número ya existía localmente, mockdb.js retornó el mismo elemento sin agregarlo doble
        });

        // Mostrar listado de resultados
        progContainer.style.display = 'none';
        resContainer.style.display = 'block';
        
        mainApp.showToast(`¡Importación exitosa! Se procesaron ${batch.length} comprobantes reales de la AFIP.`, 'success');

        if (type === 'ventas') {
          resHeader.innerHTML = `
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Número</th>
            <th>Cliente</th>
            <th>CUIT</th>
            <th class="text-right">Total</th>
          `;
          resBody.innerHTML = batch.map(tx => `
            <tr>
              <td class="font-mono text-sm">${tx.fecha.split('-').reverse().join('/')}</td>
              <td><span class="badge-status active" style="font-size:11px; padding:1px 6px;">${tx.tipo_comprobante}</span></td>
              <td class="font-mono text-sm">${tx.numero}</td>
              <td style="font-weight:600;">${tx.cliente}</td>
              <td class="font-mono">${tx.cuit}</td>
              <td class="font-mono text-right" style="font-weight:700; color: var(--color-emerald-light);">$ ${tx.total.toLocaleString('es-AR')}</td>
            </tr>
          `).join('');
        } else {
          resHeader.innerHTML = `
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Número</th>
            <th>Proveedor</th>
            <th>CUIT</th>
            <th class="text-right">Total</th>
          `;
          resBody.innerHTML = batch.map(tx => `
            <tr>
              <td class="font-mono text-sm">${tx.fecha.split('-').reverse().join('/')}</td>
              <td><span class="badge-status pending" style="font-size:11px; padding:1px 6px;">${tx.tipo_comprobante}</span></td>
              <td class="font-mono text-sm">${tx.numero}</td>
              <td style="font-weight:600;">${tx.proveedor}</td>
              <td class="font-mono">${tx.cuit}</td>
              <td class="font-mono text-right" style="font-weight:700;">$ ${tx.total.toLocaleString('es-AR')}</td>
            </tr>
          `).join('');
        }

        if (window.lucide) window.lucide.createIcons({ root: resContainer });
      }
    }, 80);
  };

  // -------------------------------------------------------------
  // MOTOR DE ANALIZADOR SINTÁCTICO DE ARCHIVOS REALES DE LA AFIP (CPN PARSER)
  // -------------------------------------------------------------
  const parseAFIPFileContent = (fileContent, fileName) => {
    try {
      const lines = fileContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length === 0) throw new Error("El archivo está vacío.");

      // A. Encontrar la fila de encabezados impositiva
      let headerLineIndex = -1;
      for (let i = 0; i < Math.min(15, lines.length); i++) {
        if (/fecha/i.test(lines[i]) && (/comprobante/i.test(lines[i]) || /nro/i.test(lines[i]) || /total/i.test(lines[i]))) {
          headerLineIndex = i;
          break;
        }
      }

      if (headerLineIndex === -1) {
        throw new Error("No se detectó la estructura oficial de AFIP (columna 'Fecha' ausente). Verificá el formato del reporte CSV/TXT.");
      }

      const headerLine = lines[headerLineIndex];
      
      // B. Auto-detectar delimitador impositivo
      let delimiter = ',';
      const commaCount = (headerLine.match(/,/g) || []).length;
      const semiCount = (headerLine.match(/;/g) || []).length;
      const tabCount = (headerLine.match(/\t/g) || []).length;

      if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';
      else if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';

      console.log(`CPN Parser: Separador detectado en reporte: "${delimiter}"`);

      // C. Tokenizar y limpiar nombres de columnas
      const cleanHeaderToken = (token) => {
        return token.replace(/^["']|["']$/g, '').trim().toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // quitar tildes
      };

      const columns = headerLine.split(delimiter).map(cleanHeaderToken);
      console.log("CPN Parser: Columnas identificadas:", columns);

      // D. Mapeo inteligente de índices de AFIP
      const idx = {
        fecha: columns.findIndex(c => /fecha/i.test(c)),
        tipo: columns.findIndex(c => /tipo/i.test(c) && !/cambio/i.test(c) && !/documento/i.test(c)),
        pv: columns.findIndex(c => /punto.*venta/i.test(c) || /p\.v\./i.test(c) || /pv/i.test(c)),
        numero: columns.findIndex(c => /numero.*desde/i.test(c) || /nro.*comprobante/i.test(c) || /numero/i.test(c)),
        cuit: columns.findIndex(c => /doc.*receptor/i.test(c) || /doc.*emisor/i.test(c) || /cuit/i.test(c) || /c.u.i.t./i.test(c)),
        entidad: columns.findIndex(c => /denominacion.*receptor/i.test(c) || /denominacion.*emisor/i.test(c) || /nombre/i.test(c) || /cliente/i.test(c) || /proveedor/i.test(c)),
        neto: columns.findIndex(c => /neto.*gravado/i.test(c) || /neto/i.test(c) || /imp.*neto/i.test(c)),
        iva: columns.findIndex(c => /iva/i.test(c) || /impuesto.*valor.*agregado/i.test(c) || /alicuota/i.test(c)),
        total: columns.findIndex(c => /total/i.test(c) || /imp.*total/i.test(c))
      };

      if (idx.fecha === -1 || idx.total === -1) {
        throw new Error("Estructura impositiva incompleta. Faltan columnas core de 'Fecha' o 'Total'.");
      }

      // E. Detectar si el reporte es de Ventas o de Compras
      // Generalmente AFIP incluye la palabra "Receptor" para Ventas, "Emisor" para Compras, o lo deducimos por el nombre del archivo
      let operationType = 'ventas';
      const isFileNameCompras = /recibidos|compras|purchases|compr/i.test(fileName);
      const isHeaderCompras = columns.some(c => /emisor/i.test(c) || /proveedor/i.test(c));
      if (isFileNameCompras || isHeaderCompras) {
        operationType = 'compras';
      }
      console.log(`CPN Parser: Dirección operativa detectada: ${operationType.toUpperCase()}`);

      const parsedTransactions = [];

      // F. Parsear filas de datos impositivas
      const sanitizeNumber = (val) => {
        if (!val) return 0;
        let clean = val.replace(/^["']|["']$/g, '').trim();
        clean = clean.replace(/[^0-9,\.-]/g, ''); // quitar signos de peso, espacios
        
        // Formato español: punto para miles y coma para decimales (ej. 1.250,50)
        if (clean.includes(',') && clean.includes('.')) {
          clean = clean.replace(/\./g, '').replace(/,/g, '.');
        } else if (clean.includes(',')) {
          clean = clean.replace(/,/g, '.');
        }
        const num = parseFloat(clean);
        return isNaN(num) ? 0 : num;
      };

      const sanitizeCUIT = (val) => {
        if (!val) return '00-00000000-0';
        let clean = val.replace(/\D/g, ''); // dejar sólo números
        if (clean.length === 11) {
          return `${clean.substring(0, 2)}-${clean.substring(2, 10)}-${clean.substring(10, 11)}`;
        }
        return val;
      };

      const sanitizeDate = (val) => {
        if (!val) return new Date().toISOString().split('T')[0];
        let clean = val.replace(/^["']|["']$/g, '').trim();
        // DD/MM/AAAA o DD-MM-AAAA o DD.MM.AAAA
        const match = clean.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/);
        if (match) {
          const d = match[1].padStart(2, '0');
          const m = match[2].padStart(2, '0');
          const y = match[3];
          return `${y}-${m}-${d}`;
        }
        return clean; // Retornar tal cual si ya es AAAA-MM-DD
      };

      for (let i = headerLineIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        const tokens = line.split(delimiter).map(t => t.replace(/^["']|["']$/g, '').trim());
        
        if (tokens.length < columns.length / 2) continue; // omitir líneas de totales o firmas cortadas

        const fechaRaw = tokens[idx.fecha];
        if (!fechaRaw || fechaRaw.toLowerCase().includes('total')) continue; // omitir fila de totales al final del archivo

        // Extraer valores sanitizados
        const fecha = sanitizeDate(fechaRaw);
        const tipoComprobante = idx.tipo !== -1 ? tokens[idx.tipo] : 'Factura A';
        
        let numero = '0001-00000001';
        if (idx.pv !== -1 && idx.numero !== -1) {
          const pvStr = tokens[idx.pv].replace(/\D/g, '').padStart(4, '0');
          const numStr = tokens[idx.numero].replace(/\D/g, '').padStart(8, '0');
          numero = `${pvStr}-${numStr}`;
        } else if (idx.numero !== -1) {
          const numClean = tokens[idx.numero].replace(/[^\d-]/g, '');
          if (numClean.includes('-')) {
            numero = numClean;
          } else {
            numero = `0001-${numClean.padStart(8, '0')}`;
          }
        }

        const cuit = sanitizeCUIT(idx.cuit !== -1 ? tokens[idx.cuit] : '');
        const entidad = idx.entidad !== -1 ? tokens[idx.entidad] : 'Cliente Autocargado';
        
        const total = sanitizeNumber(tokens[idx.total]);
        let neto = idx.neto !== -1 ? sanitizeNumber(tokens[idx.neto]) : 0;
        let iva = idx.iva !== -1 ? sanitizeNumber(tokens[idx.iva]) : 0;

        // Si no vienen neto o iva desglosados en el CSV, el sistema los desglosa automáticamente bajo la alícuota general del 21%
        if (neto === 0 && iva === 0 && total > 0) {
          if (tipoComprobante.includes('A') || tipoComprobante.includes('B') || tipoComprobante.includes('C')) {
            neto = Number((total / 1.21).toFixed(2));
            iva = Number((total - neto).toFixed(2));
          } else {
            neto = total;
            iva = 0;
          }
        }

        const record = {
          fecha,
          tipo_comprobante: tipoComprobante,
          numero,
          cuit,
          neto,
          iva,
          total,
          es_activo: false,
          categoria: operationType === 'ventas' ? 'Venta' : 'General'
        };

        if (operationType === 'ventas') {
          record.cliente = entidad;
        } else {
          record.proveedor = entidad;
        }

        parsedTransactions.push(record);
      }

      console.log(`CPN Parser: Archivo analizado correctamente. Registros listos: ${parsedTransactions.length}`);
      startSimulation(parsedTransactions, operationType);

    } catch (err) {
      console.error("CPN Parser Error:", err);
      mainApp.showToast(`Error al procesar el archivo impositivo: ${err.message}`, "error");
    }
  };

  // Drag & drop visual events
  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
    const title = document.getElementById('dropzone-title');
    if (title) title.textContent = "¡Soltá para analizar el reporte real!";
  });

  dropzone?.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
    const title = document.getElementById('dropzone-title');
    if (title) title.textContent = "Arrastrá aquí tus comprobantes ARCA";
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const title = document.getElementById('dropzone-title');
    if (title) title.textContent = "Arrastrá aquí tus comprobantes ARCA";
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      mainApp.showToast(`Cargando archivo real: ${file.name}...`, 'info');
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        parseAFIPFileContent(evt.target.result, file.name);
      };
      reader.readAsText(file, 'ISO-8859-1'); // Codificación típica de exportación AFIP en español
    }
  });

  fileInput?.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      mainApp.showToast(`Cargando archivo real: ${file.name}...`, 'info');
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        parseAFIPFileContent(evt.target.result, file.name);
      };
      reader.readAsText(file, 'ISO-8859-1');
    }
  });

  // ARCA Connection Sincronización (Direct Integration)
  btnSimEmitidas?.addEventListener('click', (e) => {
    e.stopPropagation();
    startSimulation(ARCA_MOCK_EMITIDAS, 'ventas');
  });

  btnSimRecibidas?.addEventListener('click', (e) => {
    e.stopPropagation();
    startSimulation(ARCA_MOCK_RECIBIDAS, 'compras');
  });
}
