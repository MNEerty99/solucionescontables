/* -------------------------------------------------------------
   VMP Studio Contable - Portal Cliente View Component
   ------------------------------------------------------------- */
import { getActiveCompany, addTransaction } from '../db/mockdb.js';

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
    
    <!-- Left column -->
    <div style="display: flex; flex-direction: column; gap: 24px;">
      
      <!-- Gemini API Key configuration card -->
      <div class="card" style="border-color: rgba(99, 102, 241, 0.2); background: rgba(99, 102, 241, 0.01);">
        <div class="card-body" style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 250px;">
            <div style="background: rgba(99, 102, 241, 0.08); color: #818cf8; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink:0;">
              <i data-lucide="key"></i>
            </div>
            <div>
              <h4 style="font-size: 13.5px; font-weight: 700; margin-bottom: 2px;">Agente IA Activo (Gemini OCR)</h4>
              <p style="font-size: 11px; color: var(--text-secondary); margin: 0;">Ingresá tu clave API de Google para digitalizar comprobantes reales.</p>
            </div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-grow: 1; justify-content: flex-end;">
            <input type="password" id="gemini-api-key-input" class="form-input" style="max-width: 240px; font-size: 12.5px; padding: 6px 12px; height: 34px; background: #ffffff;" placeholder="API Key de Gemini...">
            <button id="btn-save-gemini-key" class="btn btn-primary" style="padding: 6px 14px; font-size: 12.5px; height: 34px; background: #6366f1; border-color: #6366f1;">Guardar</button>
          </div>
        </div>
      </div>

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

  const apiKeyInput = document.getElementById('gemini-api-key-input');
  const btnSaveKey = document.getElementById('btn-save-gemini-key');
  
  if (apiKeyInput) {
    apiKeyInput.value = localStorage.getItem('vmp_gemini_api_key') || '';
  }

  btnSaveKey?.addEventListener('click', (e) => {
    e.stopPropagation();
    const key = apiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('vmp_gemini_api_key', key);
      mainApp.showToast("¡Clave de Gemini guardada! Agente IA activo.", "success");
    } else {
      localStorage.removeItem('vmp_gemini_api_key');
      mainApp.showToast("Clave de Gemini eliminada. Modo simulación activo.", "info");
    }
  });

  // Render tickets table list helper
  const renderTicketsList = () => {
    const tickets = JSON.parse(localStorage.getItem(`vmp_tickets_${activeCompany.id}`)) || [];
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
  };

  // Real AI OCR using Gemini API
  const processRealTicketWithGemini = async (file) => {
    const apiKey = localStorage.getItem('vmp_gemini_api_key');
    
    dropzone.style.display = 'none';
    progressContainer.style.display = 'block';
    progressTxt.textContent = "Conectando con el Agente de IA (Gemini 2.5 Flash)...";

    try {
      // 1. Convert file to Base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      progressTxt.textContent = "El Agente IA está extrayendo información fiscal del comprobante...";

      // 2. Fetch Gemini API
      const model = "gemini-2.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const prompt = `Analizá esta imagen de ticket de compra o factura. Extraé los datos clave del comprobante en el siguiente formato JSON estricto:
      {
        "proveedor": "Nombre del Comercio / Razón Social",
        "cuit": "CUIT del proveedor en formato XX-XXXXXXXX-X (si no encontrás CUIT real, inventá uno realista)",
        "tipo_comprobante": "Factura A" o "Factura B" o "Ticket C" (según corresponda)",
        "numero": "Número de comprobante (formato XXXX-XXXXXXXX, si no hay, inventá uno realista)",
        "neto": Monto neto sin IVA como número,
        "iva": Monto del IVA (21% del neto) como número,
        "total": Monto total final como número
      }
      Es fundamental que el total, el neto y el IVA cuadren matemáticamente (neto + iva = total).
      Devolvé ÚNICAMENTE el objeto JSON puro sin bloques de código markdown ni texto extra.`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: file.type,
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const resData = await response.json();
      const rawText = resData.candidates[0].content.parts[0].text;
      const parsedData = JSON.parse(rawText.trim());

      // 3. Save to digitalized tickets lists
      const date = new Date().toISOString().slice(0, 10);
      const newTicket = {
        id: "t-" + Date.now(),
        fecha: date,
        detalle: parsedData.proveedor,
        archivo: file.name,
        tipo: "Compra",
        monto: parsedData.total,
        estado: "Aprobado"
      };

      const tickets = JSON.parse(localStorage.getItem(`vmp_tickets_${activeCompany.id}`)) || [];
      tickets.unshift(newTicket);
      localStorage.setItem(`vmp_tickets_${activeCompany.id}`, JSON.stringify(tickets));

      // 4. Save to actual transactions ledger (mockdb)
      const newPurchase = {
        fecha: date,
        proveedor: parsedData.proveedor,
        cuit: parsedData.cuit,
        tipo_comprobante: parsedData.tipo_comprobante || "Factura A",
        numero: parsedData.numero || "0001-00001234",
        neto: Number(parsedData.neto) || Number(parsedData.total) / 1.21,
        iva: Number(parsedData.iva) || Number(parsedData.total) - (Number(parsedData.total) / 1.21),
        total: Number(parsedData.total)
      };

      addTransaction(activeCompany.id, 'compras', newPurchase);

      progressContainer.style.display = 'none';
      dropzone.style.display = 'flex';

      mainApp.showToast(`¡Agente IA: digitalizado ticket de "${parsedData.proveedor}" por $ ${parsedData.total}!`, "success");
      renderTicketsList();

    } catch (error) {
      console.error("Gemini OCR Error:", error);
      progressContainer.style.display = 'none';
      dropzone.style.display = 'flex';
      mainApp.showToast("Error de conexión con el Agente IA de Gemini. Corrobore la clave API.", "error");
    }
  };

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

        // Save to mockdb transactions!
        const newPurchase = {
          fecha: date,
          proveedor: "Easy Ferreterías",
          cuit: "30-58839210-9",
          tipo_comprobante: "Factura A",
          numero: "0002-0000" + Math.floor(1000 + Math.random() * 9000),
          neto: 28512.4,
          iva: 5987.6,
          total: 34500
        };
        addTransaction(activeCompany.id, 'compras', newPurchase);

        // Reset elements
        progressContainer.style.display = 'none';
        dropzone.style.display = 'flex';

        mainApp.showToast("¡Simulación: ticket enviado al contador con éxito!", "success");
        renderTicketsList();

      }, 1500);
    }, 1200);
  };

  const handleFileProcess = (file) => {
    if (!file) return;
    const apiKey = localStorage.getItem('vmp_gemini_api_key');
    if (apiKey) {
      processRealTicketWithGemini(file);
    } else {
      startUploadSimulation();
    }
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
    if (e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  });

  fileInput?.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleFileProcess(fileInput.files[0]);
    }
  });

  btnSim?.addEventListener('click', (e) => {
    e.stopPropagation();
    startUploadSimulation();
  });
}
