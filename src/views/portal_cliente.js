/* -------------------------------------------------------------
   VMP Studio Contable - Portal Cliente View Component
   ------------------------------------------------------------- */
import { getActiveCompany } from '../db/mockdb.js';

// Pre-loaded digital tickets
const INITIAL_DIGITAL_TICKETS = [
  { id: "t-1", fecha: "2026-05-25", detalle: "Ticket Nafta Infinia - YPF", archivo: "ticket_ypf.jpg", tipo: "Compra", monto: 18500, estado: "Procesado" },
  { id: "t-2", fecha: "2026-05-24", detalle: "Factura Fibertel - Telecom", archivo: "factura_internet.pdf", tipo: "Compra", monto: 24000, estado: "Aprobado" },
  { id: "t-3", fecha: "2026-05-23", detalle: "Librería San Martín (Insumos)", archivo: "insumos_oficina.png", tipo: "Compra", monto: 6500, estado: "Recibido" }
];

export function renderPortalCliente() {
  const activeCompany = getActiveCompany();

  // Load from local storage if exists
  if (!localStorage.getItem(`vmp_tickets_${activeCompany.id}`)) {
    localStorage.setItem(`vmp_tickets_${activeCompany.id}`, JSON.stringify(INITIAL_DIGITAL_TICKETS));
  }
  const tickets = JSON.parse(localStorage.getItem(`vmp_tickets_${activeCompany.id}`));

  return `
  <div class="view-header">
    <div>
      <h1 class="view-title">Portal Cliente (Vista Simplificada)</h1>
      <p class="view-subtitle">Esto es lo que ve el comercio/cliente del estudio desde su celular para pasarte información.</p>
    </div>
    <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.2); padding: 8px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; color: #818cf8;">
      Acceso: Cliente Final (${activeCompany.razon_social})
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 32px; align-items: start;">
    
    <!-- Left: Upload panel -->
    <div class="card">
      <div class="card-header">
        <h3><i data-lucide="smartphone"></i> Enviar Comprobante al Contador</h3>
      </div>
      <div class="card-body">
        <p class="text-secondary" style="font-size: 13.5px; margin-bottom: 24px;">
          Subí una foto del ticket impreso, arrastrá un PDF recibido por email o usá la cámara de tu celular. Tu contador lo recibirá limpio y clasificado de forma inmediata.
        </p>

        <!-- Dynamic Dropzone -->
        <div class="import-area" id="ticket-dropzone" style="border-color: rgba(99, 102, 241, 0.3); background: rgba(99, 102, 241, 0.01); padding: 32px;">
          <div class="import-icon" style="background: rgba(99, 102, 241, 0.08); color: #818cf8; border-color: rgba(99, 102, 241, 0.2);">
            <i data-lucide="camera"></i>
          </div>
          <h4>Arrastrá el ticket o sacá una foto</h4>
          <p style="font-size: 12px;">Soportamos JPG, PNG y PDF (facturas electrónicas de email).</p>
          
          <label class="btn btn-outline btn-sm" style="border-color: rgba(99, 102, 241, 0.3); color: #818cf8; cursor: pointer;">
            <i data-lucide="upload"></i> Elegir Archivo
            <input type="file" id="ticket-file-input" style="display: none;" accept="image/*,application/pdf">
          </label>

          <div class="demo-afip-pills" style="margin-top: 16px;">
            <div class="afip-sample-pill" id="btn-simulate-ticket" style="border-color: rgba(99, 102, 241, 0.25);">
              <i data-lucide="sparkles" style="width: 12px; height: 12px; display: inline; vertical-align: middle; margin-right: 4px; color:#818cf8;"></i>
              Simular Carga de Ticket
            </div>
          </div>
        </div>

        <!-- Progress animation -->
        <div id="ticket-progress" style="display: none; text-align: center; padding: 16px;">
          <div class="spinner" style="margin: 0 auto 12px; border-left-color: #818cf8;"></div>
          <p style="font-size: 13px; font-weight: 600;" id="ticket-progress-txt">Subiendo y extrayendo datos con IA...</p>
        </div>
      </div>
    </div>

    <!-- Right: List of uploaded documents -->
    <div class="card">
      <div class="card-header">
        <h3><i data-lucide="check-square"></i> Documentos Digitalizados</h3>
        <span class="badge" style="margin: 0; font-size: 10px; color:#818cf8; border-color: rgba(99, 102, 241, 0.25); background: rgba(99, 102, 241, 0.05);">Control Mensual</span>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Comprobante</th>
                <th class="text-right">Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody id="ticket-table-body">
              ${tickets.map(t => `
                <tr>
                  <td class="font-mono text-xs">${t.fecha.split('-').reverse().join('/')}</td>
                  <td>
                    <div style="font-weight: 600; font-size: 13px;">${t.detalle}</div>
                    <div style="font-size: 10px; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
                      <i data-lucide="file" style="width: 10px; height: 10px;"></i> ${t.archivo}
                    </div>
                  </td>
                  <td class="font-mono text-right" style="font-weight: 700;">$ ${t.monto.toLocaleString('es-AR')}</td>
                  <td>
                    <span class="badge-status ${t.estado === 'Aprobado' ? 'active' : (t.estado === 'Procesado' ? 'pending' : 'inactive')}" style="font-size: 10px; padding: 1px 6px;">
                      ${t.estado}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
  `;
}

export function initPortalCliente(mainApp) {
  if (window.lucide) window.lucide.createIcons();

  const activeCompany = getActiveCompany();
  
  const dropzone = document.getElementById('ticket-dropzone');
  const fileInput = document.getElementById('ticket-file-input');
  const btnSim = document.getElementById('btn-simulate-ticket');
  
  const progressContainer = document.getElementById('ticket-progress');
  const progressTxt = document.getElementById('ticket-progress-txt');
  const tableBody = document.getElementById('ticket-table-body');

  const startUploadSimulation = () => {
    dropzone.style.display = 'none';
    progressContainer.style.display = 'block';
    progressTxt.textContent = "Subiendo archivo a la nube...";

    setTimeout(() => {
      progressTxt.textContent = "Digitalizando ticket y extrayendo CUIT con OCR...";
      
      setTimeout(() => {
        // Create new mock ticket
        const date = new Date().toISOString().slice(0, 10);
        const newTicket = {
          id: "t-" + Date.now(),
          fecha: date,
          detalle: "Compra Materiales - Easy Ferreterías",
          archivo: "ticket_easy_" + Math.floor(Math.random() * 1000) + ".jpg",
          tipo: "Compra",
          monto: 34500,
          estado: "Recibido"
        };

        // Save to local storage
        const tickets = JSON.parse(localStorage.getItem(`vmp_tickets_${activeCompany.id}`)) || [];
        tickets.unshift(newTicket);
        localStorage.setItem(`vmp_tickets_${activeCompany.id}`, JSON.stringify(tickets));

        // Reset elements
        progressContainer.style.display = 'none';
        dropzone.style.display = 'flex';

        mainApp.showToast("¡Ticket enviado al contador con éxito!", "success");

        // Refresh view table list
        tableBody.innerHTML = tickets.map(t => `
          <tr>
            <td class="font-mono text-xs">${t.fecha.split('-').reverse().join('/')}</td>
            <td>
              <div style="font-weight: 600; font-size: 13px;">${t.detalle}</div>
              <div style="font-size: 10px; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
                <i data-lucide="file" style="width: 10px; height: 10px;"></i> ${t.archivo}
              </div>
            </td>
            <td class="font-mono text-right" style="font-weight: 700;">$ ${t.monto.toLocaleString('es-AR')}</td>
            <td>
              <span class="badge-status ${t.estado === 'Aprobado' ? 'active' : (t.estado === 'Procesado' ? 'pending' : 'inactive')}" style="font-size: 10px; padding: 1px 6px;">
                ${t.estado}
              </span>
            </td>
          </tr>
        `).join('');

        if (window.lucide) window.lucide.createIcons({ root: tableBody });

      }, 1500);
    }, 1200);
  };

  // Drag and drop events
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
    startUploadSimulation();
  });

  fileInput?.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      startUploadSimulation();
    }
  });

  btnSim?.addEventListener('click', (e) => {
    e.stopPropagation();
    startUploadSimulation();
  });
}
