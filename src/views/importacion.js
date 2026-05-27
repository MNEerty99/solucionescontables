/* -------------------------------------------------------------
   VMP Studio Contable - Importación ARCA View Component
   ------------------------------------------------------------- */
import { getActiveCompany, addTransaction } from '../db/mockdb.js';

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

  return `
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
        <h4>Arrastrá aquí tus comprobantes ARCA</h4>
        <p>Soportamos formatos oficiales de ARCA (Excel .xls / .xlsx, TXT o CSV de "Mis Comprobantes Emitidos/Recibidos").</p>
        
        <label class="btn btn-outline btn-sm" style="cursor: pointer;">
          Examinar Archivo
          <input type="file" id="afip-file-input" style="display: none;">
        </label>

        <div class="demo-afip-pills">
          <div class="afip-sample-pill" id="btn-simulate-emitidas">
            <i data-lucide="sparkles" style="width: 12px; height: 12px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
            Simular Emitidas (Ventas)
          </div>
          <div class="afip-sample-pill" id="btn-simulate-recibidas">
            <i data-lucide="sparkles" style="width: 12px; height: 12px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
            Simular Recibidas (Compras)
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
  `;
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
    // Resetear vistas
    resContainer.style.display = 'none';
    progContainer.style.display = 'block';
    
    let percent = 0;
    progBar.style.width = '0%';
    progPercent.textContent = '0%';
    progTitle.textContent = 'Leyendo estructura del archivo ARCA...';

    const interval = setInterval(() => {
      percent += 5;
      if (percent > 100) percent = 100;
      
      progBar.style.width = percent + '%';
      progPercent.textContent = percent + '%';

      if (percent === 30) {
        progTitle.textContent = 'Procesando comprobantes y cruzando CUITs...';
      } else if (percent === 70) {
        progTitle.textContent = 'Calculando alícuotas de IVA y saldos técnicos...';
      } else if (percent === 100) {
        clearInterval(interval);
        
        // Cargar en la DB temporal
        batch.forEach(tx => {
          addTransaction(activeCompany.id, type, tx);
        });

        // Mostrar listado de resultados
        progContainer.style.display = 'none';
        resContainer.style.display = 'block';
        
        mainApp.showToast(`¡Importación completada! Se cargaron ${batch.length} comprobantes.`, 'success');

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
    }, 100);
  };

  // Drag & drop visual events
  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone?.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    
    // Simular emitidas por defecto al arrastrar cualquier archivo
    startSimulation(ARCA_MOCK_EMITIDAS, 'ventas');
  });

  fileInput?.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      startSimulation(ARCA_MOCK_EMITIDAS, 'ventas');
    }
  });

  // Buttons simulation
  btnSimEmitidas?.addEventListener('click', (e) => {
    e.stopPropagation();
    startSimulation(ARCA_MOCK_EMITIDAS, 'ventas');
  });

  btnSimRecibidas?.addEventListener('click', (e) => {
    e.stopPropagation();
    startSimulation(ARCA_MOCK_RECIBIDAS, 'compras');
  });
}
