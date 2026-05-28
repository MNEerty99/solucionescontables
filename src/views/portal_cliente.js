/* -------------------------------------------------------------
   VMP Studio Contable - Portal Cliente View Component
   ------------------------------------------------------------- */
import { getActiveCompany, addTransaction } from '../db/mockdb.js';
import { renderPremiumTeaser } from '../utils.js';

// Pre-loaded digital tickets
const INITIAL_DIGITAL_TICKETS = [
  { id: "t-1", fecha: "2026-05-25", detalle: "Ticket Nafta Infinia - YPF", archivo: "ticket_ypf.jpg", tipo: "Compra", monto: 18500, estado: "Procesado", es_activo: false, categoria: "Combustibles" },
  { id: "t-2", fecha: "2026-05-24", detalle: "Factura Fibertel - Telecom", archivo: "factura_internet.pdf", tipo: "Compra", monto: 24000, estado: "Aprobado", es_activo: false, categoria: "Servicios" },
  { id: "t-3", fecha: "2026-05-23", detalle: "Librería San Martín (Insumos)", archivo: "insumos_oficina.png", tipo: "Compra", monto: 6500, estado: "Recibido", es_activo: false, categoria: "Librería" }
];

export function renderPortalCliente() {
  const activeCompany = getActiveCompany();
  const hasApiKey = localStorage.getItem('vmp_gemini_api_key') ? true : false;

  // Load from local storage if exists
  if (!localStorage.getItem(`vmp_tickets_${activeCompany.id}`)) {
    localStorage.setItem(`vmp_tickets_${activeCompany.id}`, JSON.stringify(INITIAL_DIGITAL_TICKETS));
  }
  const tickets = JSON.parse(localStorage.getItem(`vmp_tickets_${activeCompany.id}`));

  return renderPremiumTeaser(`
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
      
      <!-- Gemini API Status Card (Inherited from the Studio) -->
      <div class="card" style="border-color: rgba(99, 102, 241, 0.2); background: rgba(99, 102, 241, 0.01);">
        <div class="card-body" style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 250px;">
            <div style="background: rgba(99, 102, 241, 0.08); color: #818cf8; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink:0;">
              <i data-lucide="sparkles"></i>
            </div>
            <div>
              <h4 style="font-size: 13.5px; font-weight: 700; margin-bottom: 2px;">Agente IA Activo (OCR Centralizado)</h4>
              <p style="font-size: 11px; color: var(--text-secondary); margin: 0;">Sincronizado con el motor del estudio. Las imágenes se procesarán automáticamente.</p>
            </div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            ${hasApiKey ? `
              <span style="font-size: 11.5px; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.08); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.2); display: flex; align-items: center; gap: 4px;">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981;"></span>
                Conectado (Estudio)
              </span>
            ` : `
              <span style="font-size: 11.5px; font-weight: 600; color: var(--text-secondary); background: var(--bg-secondary); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 4px;">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted);"></span>
                Modo Simulado
              </span>
            `}
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

          <div class="demo-afip-pills" style="margin-top: 16px; display: flex; gap: 8px; justify-content: center;">
            <div class="afip-sample-pill" id="btn-simulate-ticket" style="border-color: rgba(99, 102, 241, 0.25);">
              <i data-lucide="sparkles" style="width: 12px; height: 12px; display: inline; vertical-align: middle; margin-right: 4px; color:#818cf8;"></i>
              Simular Gasto (Nafta YPF)
            </div>
            <div class="afip-sample-pill" id="btn-simulate-asset" style="border-color: rgba(99, 102, 241, 0.4); color: #818cf8; font-weight: 600;">
              <i data-lucide="sparkles" style="width: 12px; height: 12px; display: inline; vertical-align: middle; margin-right: 4px; color:#818cf8;"></i>
              Simular Laptop (Activo)
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
                    <div style="font-size: 10px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                      <i data-lucide="file" style="width: 10px; height: 10px;"></i> ${t.archivo}
                      ${t.es_activo ? `
                        <span style="font-size: 8px; font-weight: 700; color: #818cf8; background: rgba(99, 102, 241, 0.08); padding: 1px 4px; border-radius: 3px; border: 1px solid rgba(99, 102, 241, 0.2);">BIEN DE USO</span>
                      ` : `
                        <span style="font-size: 8px; font-weight: 600; color: var(--text-muted); background: var(--bg-secondary); padding: 1px 4px; border-radius: 3px; border: 1px solid var(--border-color);">GASTO (${t.categoria || 'General'})</span>
                      `}
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
  `, "Portal de Clientes Móvil", "Habilitá un canal directo y exclusivo en el celular de tus clientes. Olvidate de perseguir papeles o recibir fotos borrosas por WhatsApp: tus clientes cargan sus comprobantes con fotos, y el sistema extrae automáticamente CUIT, neto e IVA.");
}

export function initPortalCliente(mainApp) {
  if (window.lucide) window.lucide.createIcons();

  const activeCompany = getActiveCompany();
  
  const dropzone = document.getElementById('ticket-dropzone');
  const fileInput = document.getElementById('ticket-file-input');
  const btnSim = document.getElementById('btn-simulate-ticket');
  const btnSimAsset = document.getElementById('btn-simulate-asset');
  
  const progressContainer = document.getElementById('ticket-progress');
  const progressTxt = document.getElementById('ticket-progress-txt');
  const tableBody = document.getElementById('ticket-table-body');

  // El cliente no ingresa Clave API, hereda la del Estudio Contable

  // Render tickets table list helper
  const renderTicketsList = () => {
    const tickets = JSON.parse(localStorage.getItem(`vmp_tickets_${activeCompany.id}`)) || [];
    tableBody.innerHTML = tickets.map(t => `
      <tr>
        <td class="font-mono text-xs">${t.fecha.split('-').reverse().join('/')}</td>
        <td>
          <div style="font-weight: 600; font-size: 13px;">${t.detalle}</div>
          <div style="font-size: 10px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; margin-top: 2px;">
            <i data-lucide="file" style="width: 10px; height: 10px;"></i> ${t.archivo}
            ${t.es_activo ? `
              <span style="font-size: 8px; font-weight: 700; color: #818cf8; background: rgba(99, 102, 241, 0.08); padding: 1px 4px; border-radius: 3px; border: 1px solid rgba(99, 102, 241, 0.2);">BIEN DE USO</span>
            ` : `
              <span style="font-size: 8px; font-weight: 600; color: var(--text-muted); background: var(--bg-secondary); padding: 1px 4px; border-radius: 3px; border: 1px solid var(--border-color);">GASTO (${t.categoria || 'General'})</span>
            `}
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

      const prompt = `Analizá esta imagen de ticket de compra o factura. Extraé los datos clave del comprobante y clasificalo.
      Determiná si el comprobante representa la compra de un ACTIVO (Bien de Uso / Bien de Capital / Activo Fijo, como computadoras, celulares, maquinaria, mobiliario, vehículos o refacciones de valor) o si es un GASTO OPERATIVO corriente (combustibles, librería, papelería, servicios, viáticos, internet).
      Extraé los datos en el siguiente formato JSON estricto:
      {
        "proveedor": "Nombre del Comercio / Razón Social",
        "cuit": "CUIT del proveedor en formato XX-XXXXXXXX-X (si no encontrás CUIT real, inventá uno realista)",
        "tipo_comprobante": "Factura A" o "Factura B" o "Ticket C" (según corresponda)",
        "numero": "Número de comprobante (formato XXXX-XXXXXXXX, si no hay, inventá uno realista)",
        "neto": Monto neto sin IVA como número,
        "iva": Monto del IVA (21% del neto) como número,
        "total": Monto total final como número,
        "categoria": "Categoría descriptiva de la compra (ej: Computación, Mobiliario, Combustibles, etc.)",
        "es_activo": true (si es una compra de activo/bien de uso como computadoras, servidores, aire acondicionado, etc.) o false (si es un gasto normal o servicio de consumo inmediato)
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
        estado: "Aprobado",
        es_activo: parsedData.es_activo === true,
        categoria: parsedData.categoria || "Otros"
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
        total: Number(parsedData.total),
        es_activo: parsedData.es_activo === true,
        categoria: parsedData.categoria || "Otros"
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

  const startUploadSimulation = (isAsset = false) => {
    dropzone.style.display = 'none';
    progressContainer.style.display = 'block';
    progressTxt.textContent = "Subiendo archivo a la nube...";

    setTimeout(() => {
      progressTxt.textContent = "Digitalizando ticket y extrayendo CUIT con OCR...";
      
      setTimeout(() => {
        // Create new mock ticket
        const date = new Date().toISOString().slice(0, 10);
        const newTicket = isAsset ? {
          id: "t-" + Date.now(),
          fecha: date,
          detalle: "Notebook Dell Latitude i7 - Megatone",
          archivo: "factura_compu_" + Math.floor(Math.random() * 1000) + ".pdf",
          tipo: "Compra",
          monto: 650000,
          estado: "Aprobado",
          es_activo: true,
          categoria: "Computación"
        } : {
          id: "t-" + Date.now(),
          fecha: date,
          detalle: "Ticket Combustibles - Combustibles YPF",
          archivo: "ticket_ypf_" + Math.floor(Math.random() * 1000) + ".jpg",
          tipo: "Compra",
          monto: 18500,
          estado: "Procesado",
          es_activo: false,
          categoria: "Combustibles"
        };

        // Save to local storage
        const tickets = JSON.parse(localStorage.getItem(`vmp_tickets_${activeCompany.id}`)) || [];
        tickets.unshift(newTicket);
        localStorage.setItem(`vmp_tickets_${activeCompany.id}`, JSON.stringify(tickets));

        // Save to mockdb transactions!
        const newPurchase = isAsset ? {
          fecha: date,
          proveedor: "Megatone S.A.",
          cuit: "30-54930281-2",
          tipo_comprobante: "Factura A",
          numero: "0005-0000" + Math.floor(1000 + Math.random() * 9000),
          neto: 537190.08,
          iva: 112809.92,
          total: 650000.00,
          es_activo: true,
          categoria: "Computación"
        } : {
          fecha: date,
          proveedor: "Combustibles YPF",
          cuit: "30-50001234-9",
          tipo_comprobante: "Factura A",
          numero: "4820-002" + Math.floor(10000 + Math.random() * 90000),
          neto: 15289.26,
          iva: 3210.74,
          total: 18500.00,
          es_activo: false,
          categoria: "Combustibles"
        };
        addTransaction(activeCompany.id, 'compras', newPurchase);

        // Reset elements
        progressContainer.style.display = 'none';
        dropzone.style.display = 'flex';

        mainApp.showToast(isAsset ? "¡Simulación: Bien de Uso (Activo Fijo) digitalizado!" : "¡Simulación: ticket enviado al contador con éxito!", "success");
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
      const isAssetSim = file.name.toLowerCase().includes('compu') || 
                         file.name.toLowerCase().includes('notebook') || 
                         file.name.toLowerCase().includes('activo') || 
                         file.name.toLowerCase().includes('dell') ||
                         file.name.toLowerCase().includes('laptop') ||
                         file.name.toLowerCase().includes('pc');
      startUploadSimulation(isAssetSim);
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
    startUploadSimulation(false);
  });

  btnSimAsset?.addEventListener('click', (e) => {
    e.stopPropagation();
    startUploadSimulation(true);
  });
}
