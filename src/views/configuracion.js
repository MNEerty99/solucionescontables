/* -------------------------------------------------------------
   VMP Studio Contable - Configuración ARCA View Component
   ------------------------------------------------------------- */
import { getCompanies, getActiveCompany } from '../db/mockdb.js';

export function renderConfiguracion() {
  const activeCompany = getActiveCompany();
  const companies = getCompanies();

  // Load configuration settings from localStorage
  const modelType = localStorage.getItem('vmp_arca_model_type') || 'hybrid';
  const certUploaded = localStorage.getItem('vmp_arca_cert_uploaded') === 'true';
  const certName = localStorage.getItem('vmp_arca_cert_name') || 'estudio_comahue_arca.crt';

  return `
  <div class="view-header">
    <div>
      <h1 class="view-title">Configuración ARCA</h1>
      <p class="view-subtitle">Vinculación de firmas digitales y certificados para facturación y Libro de IVA.</p>
    </div>
    <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); padding: 8px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; color: var(--color-accent);">
      Canal Seguro de Enlace Encriptado
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 32px; align-items: start;">
    
    <!-- Left Column: Settings and certificate upload -->
    <div style="display: flex; flex-direction: column; gap: 24px;">
      
      <!-- Model selector card -->
      <div class="card">
        <div class="card-header">
          <h3><i data-lucide="git-fork" style="color: #6366f1;"></i> Modelo de Vinculación ARCA</h3>
        </div>
        <div class="card-body">
          <p class="text-secondary" style="font-size: 13.5px; margin-bottom: 20px;">
            Seleccioná cómo querés gestionar los certificados de firma digital (delegación de servicios) para operar con ARCA.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <!-- Hybrid option -->
            <label class="trial-action-btn" style="border-color: ${modelType === 'hybrid' ? '#6366f1' : 'var(--border-color)'}; background: ${modelType === 'hybrid' ? 'rgba(99, 102, 241, 0.01)' : '#fff'}; display: flex; align-items: flex-start; gap: 14px; text-align: left; cursor: pointer;">
              <input type="radio" name="arca-model-type" value="hybrid" ${modelType === 'hybrid' ? 'checked' : ''} style="margin-top: 4px; accent-color: #6366f1;">
              <div>
                <h5 style="font-size: 13.5px; font-weight: 700; margin-bottom: 2px; color: var(--color-primary);">Modelo Híbrido Delegado (Recomendado)</h5>
                <p style="font-size: 11px; color: var(--text-secondary); white-space: normal; line-height: 1.4;">
                  El estudio contable carga su certificado único de CUIT. Tus clientes delegan el servicio "Libro de IVA Digital" en ARCA a tu CUIT. <strong>No requiere configurar nada por cada cliente nuevo.</strong>
                </p>
              </div>
            </label>

            <!-- Individual option -->
            <label class="trial-action-btn" style="border-color: ${modelType === 'individual' ? '#6366f1' : 'var(--border-color)'}; background: ${modelType === 'individual' ? 'rgba(99, 102, 241, 0.01)' : '#fff'}; display: flex; align-items: flex-start; gap: 14px; text-align: left; cursor: pointer;">
              <input type="radio" name="arca-model-type" value="individual" ${modelType === 'individual' ? 'checked' : ''} style="margin-top: 4px; accent-color: #6366f1;">
              <div>
                <h5 style="font-size: 13.5px; font-weight: 700; margin-bottom: 2px; color: var(--color-primary);">Modelo Certificados Individuales</h5>
                <p style="font-size: 11px; color: var(--text-secondary); white-space: normal; line-height: 1.4;">
                  Cada empresa cliente del estudio genera y carga de manera autónoma sus propios certificados y claves privadas (.key y .crt) en su panel de configuración.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Certificate Upload Card -->
      <div class="card" id="cert-upload-panel">
        <div class="card-header">
          <h3><i data-lucide="shield-check" style="color: var(--color-accent);"></i> Firma Digital del Estudio</h3>
          <span class="badge" style="margin: 0; font-size: 10px; color: var(--color-accent); border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.05);">CUIT: 30-71938495-2</span>
        </div>
        <div class="card-body">
          ${certUploaded ? `
            <!-- Uploaded active state -->
            <div style="background: rgba(16, 185, 129, 0.02); border: 1px solid rgba(16, 185, 129, 0.15); border-radius: var(--radius-md); padding: 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="background: rgba(16, 185, 129, 0.08); color: var(--color-accent); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <i data-lucide="lock" style="width: 20px; height: 20px;"></i>
                </div>
                <div>
                  <h4 style="font-size: 13.5px; font-weight: 700; color: var(--color-primary);">${certName}</h4>
                  <p style="font-size: 10.5px; color: var(--text-secondary); margin-top: 2px;">Válido hasta: <span style="font-weight: 600; color: var(--color-accent);">24 Mayo 2028</span> (Emisor: AC ARCA)</p>
                </div>
              </div>
              <button class="btn btn-outline btn-sm" id="btn-delete-cert" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.2); padding: 6px 12px; font-size: 12px;">Eliminar</button>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: var(--text-secondary); padding: 0 4px;">
              <i data-lucide="check-circle" style="width: 14px; height: 14px; color: var(--color-accent);"></i> Certificado encriptado en servidor seguro y enlazado con WSAA.
            </div>
          ` : `
            <!-- Empty state / upload area -->
            <p class="text-secondary" style="font-size: 13px; margin-bottom: 20px;">
              Arrastrá los archivos generados en el portal de ARCA para activar el canal seguro automatizado.
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              
              <!-- CRT Upload Box -->
              <div class="import-area" id="crt-dropzone" style="padding: 20px; margin-bottom: 0; cursor: pointer;">
                <i data-lucide="file-badge" style="width: 28px; height: 28px; color: #6366f1; margin-bottom: 8px;"></i>
                <h5 style="font-size: 12px; font-weight: 700;">Subir Certificado (.crt)</h5>
                <p style="font-size: 9.5px; color: var(--text-secondary); margin-top: 4px;">Archivo de Certificado ARCA</p>
                <input type="file" id="crt-file-input" style="display: none;" accept=".crt,.pem">
              </div>

              <!-- KEY Upload Box -->
              <div class="import-area" id="key-dropzone" style="padding: 20px; margin-bottom: 0; cursor: pointer;">
                <i data-lucide="key" style="width: 28px; height: 28px; color: #6366f1; margin-bottom: 8px;"></i>
                <h5 style="font-size: 12px; font-weight: 700;">Subir Clave Privada (.key)</h5>
                <p style="font-size: 9.5px; color: var(--text-secondary); margin-top: 4px;">Clave privada generada en CSR</p>
                <input type="file" id="key-file-input" style="display: none;" accept=".key">
              </div>

            </div>
            
            <div style="text-align: center;">
              <button class="btn btn-primary" id="btn-simulate-upload-cert" style="background: #6366f1; border-color: #6366f1; font-size: 12.5px; padding: 8px 16px;">
                <i data-lucide="shield-check"></i> Enlazar y Homologar Firma Digital
              </button>
            </div>
          `}
        </div>
      </div>

      <!-- Gemini API Key configuration card for the Studio -->
      <div class="card" style="border-color: rgba(99, 102, 241, 0.3); background: rgba(99, 102, 241, 0.01);">
        <div class="card-header" style="border-bottom-color: rgba(99, 102, 241, 0.1);">
          <h3><i data-lucide="key" style="color: #6366f1;"></i> Motor IA del Estudio (Gemini OCR Centralizado)</h3>
          <span class="badge" style="margin: 0; font-size: 10px; background: rgba(99, 102, 241, 0.08); color: #818cf8; border-color: rgba(99, 102, 241, 0.2);">Estudio Contable</span>
        </div>
        <div class="card-body">
          <p class="text-secondary" style="font-size: 13px; line-height: 1.5; margin-bottom: 16px;">
            Ingresá tu clave API de Gemini. Tus clientes **no tendrán que configurar nada**; heredarán automáticamente tu credencial para digitalizar tickets y facturas desde su celular.
          </p>
          <div style="display: flex; gap: 12px; align-items: flex-end;">
            <div style="flex: 1;">
              <label style="font-size: 11.5px; font-weight: 600; display: block; margin-bottom: 6px;">Gemini API Key del Estudio</label>
              <input type="password" id="gemini-api-key-input" class="form-input" style="width: 100%; padding: 8px 12px; font-size: 12.5px; background: #fff;" placeholder="Pega tu API Key de Google Gemini..." value="${localStorage.getItem('vmp_gemini_api_key') || ''}">
            </div>
            <button id="btn-save-gemini-key" class="btn btn-primary" style="background: #6366f1; border-color: #6366f1; height: 38px;">
              Guardar Clave
            </button>
          </div>
          <div style="margin-top: 12px; display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-secondary);">
            <i data-lucide="info" style="width: 13px; height: 13px; color: #818cf8;"></i>
            <span>¿No tenés una clave? Podés obtener una gratis en <a href="https://aistudio.google.com/" target="_blank" style="color: #818cf8; text-decoration: underline; font-weight: 600;">Google AI Studio</a>.</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Right Column: Delegated CUITs status & instructions -->
    <div style="display: flex; flex-direction: column; gap: 24px;">
      
      <!-- Delegated status panel -->
      <div class="card">
        <div class="card-header">
          <h3><i data-lucide="users" style="color: #6366f1;"></i> Control de CUITs Delegados</h3>
          <span class="badge" style="margin: 0; font-size: 10px;">${companies.length} Empresas</span>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Razón Social</th>
                  <th>CUIT</th>
                  <th>Delegación</th>
                </tr>
              </thead>
              <tbody id="delegation-list-body">
                ${companies.map(c => {
                  const delegationActive = localStorage.getItem(`vmp_delegation_active_${c.id}`) === 'true';
                  return `
                  <tr>
                    <td style="font-weight: 600; font-size: 12.5px;">${c.razon_social}</td>
                    <td class="font-mono text-xs">${c.cuit}</td>
                    <td id="cell-delegation-${c.id}">
                      ${delegationActive ? `
                        <span style="font-size: 10px; font-weight: 700; color: var(--color-accent); display: flex; align-items: center; gap: 4px;">
                          <i data-lucide="check-circle-2" style="width: 12px; height: 12px;"></i> Activa
                        </span>
                      ` : `
                        <button class="btn-check-delegation btn-outline" data-id="${c.id}" style="padding: 2px 8px; font-size: 10px; border-radius: 4px;">
                          Verificar
                        </button>
                      `}
                    </td>
                  </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ARCA Delegation Instructions -->
      <div class="card">
        <div class="card-header" style="border-bottom-color: rgba(99, 102, 241, 0.1); background: rgba(99,102,241,0.01);">
          <h3 style="color:#818cf8;"><i data-lucide="help-circle"></i> ¿Cómo delega el cliente en ARCA?</h3>
        </div>
        <div class="card-body">
          <p class="text-secondary" style="font-size: 12px; line-height: 1.4; margin-bottom: 14px;">
            Para que funcione el modelo híbrido delegado, tu cliente debe realizar este trámite por única vez en la web de ARCA:
          </p>
          <ul style="list-style-type: decimal; padding-left: 16px; font-size: 11.5px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px;">
            <li>Ingresa con su Clave Fiscal a la web de ARCA.</li>
            <li>Accede al servicio de <strong>Administrador de Relaciones de Clave Fiscal</strong>.</li>
            <li>Hace clic en <strong>Nueva Relación</strong> -> Buscar Servicio -> <strong>ARCA</strong> -> WebServices.</li>
            <li>Selecciona el servicio: <code>"Reg. Único Tributario (RUT)"</code> o <code>"Libro de IVA Digital"</code>.</li>
            <li>En Representante, ingresa el **CUIT de tu Estudio Contable** (el CUIT que diste de alta con la firma).</li>
            <li>Confirma con su Clave Fiscal y ¡listo! El SaaS empezará a sincronizar sus facturas al instante.</li>
          </ul>
        </div>
      </div>

    </div>

  </div>
  `;
}

export function initConfiguracion(mainApp) {
  if (window.lucide) window.lucide.createIcons();

  const delegationBody = document.getElementById('delegation-list-body');

  // Handle Model Radio Toggle
  document.querySelectorAll('input[name="arca-model-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const selected = e.target.value;
      localStorage.setItem('vmp_arca_model_type', selected);
      mainApp.showToast(`Modelo de vinculación cambiado a: ${selected === 'hybrid' ? 'Híbrido Delegado' : 'Certificados Individuales'}`, 'info');
      mainApp.router();
    });
  });

  // Sincronizar y Enlazar Certificado ARCA
  const btnSimUpload = document.getElementById('btn-simulate-upload-cert');
  btnSimUpload?.addEventListener('click', (e) => {
    e.stopPropagation();
    mainApp.showToast("Iniciando handshake criptográfico con WSAA de ARCA...", "info");
    
    setTimeout(() => {
      mainApp.showToast("Verificando cadena de confianza con AC ARCA...", "info");
      
      setTimeout(() => {
        localStorage.setItem('vmp_arca_cert_uploaded', 'true');
        localStorage.setItem('vmp_arca_cert_name', 'estudio_comahue_arca_2026.crt');
        mainApp.showToast("¡Firma digital vinculada y autorizada por ARCA en producción!", "success");
        mainApp.router();
      }, 1200);
    }, 1000);
  });

  // Delete Certificate
  const btnDeleteCert = document.getElementById('btn-delete-cert');
  btnDeleteCert?.addEventListener('click', (e) => {
    e.stopPropagation();
    localStorage.removeItem('vmp_arca_cert_uploaded');
    localStorage.removeItem('vmp_arca_cert_name');
    mainApp.showToast("Certificado eliminado del servidor contable.", "info");
    mainApp.router();
  });

  // Verify Delegated CUITs
  document.querySelectorAll('.btn-check-delegation').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const coId = btn.dataset.id;
      const cell = document.getElementById(`cell-delegation-${coId}`);
      
      btn.textContent = "Verificando...";
      btn.disabled = true;

      setTimeout(() => {
        localStorage.setItem(`vmp_delegation_active_${coId}`, 'true');
        cell.innerHTML = `
          <span style="font-size: 10px; font-weight: 700; color: var(--color-accent); display: flex; align-items: center; gap: 4px; animation: fadeIn 0.3s ease;">
            <i data-lucide="check-circle-2" style="width: 12px; height: 12px;"></i> Activa
          </span>
        `;
        if (window.lucide) window.lucide.createIcons({ root: cell });
        mainApp.showToast("¡Delegación impositiva validada con éxito en ARCA!", "success");
      }, 1500);
    });
  });

  // Drag and drop file handlers
  const crtDrop = document.getElementById('crt-dropzone');
  const keyDrop = document.getElementById('key-dropzone');
  
  const processFileDrop = (name) => {
    mainApp.showToast(`Archivo "${name}" cargado y procesado. Cifrando claves...`, "info");
  };

  crtDrop?.addEventListener('click', () => {
    processFileDrop("estudio_comahue.crt");
  });
  
  keyDrop?.addEventListener('click', () => {
    processFileDrop("estudio_comahue.key");
  });

  // Save Gemini Key from Studio Configuration
  const btnSaveGeminiKey = document.getElementById('btn-save-gemini-key');
  const geminiInput = document.getElementById('gemini-api-key-input');
  btnSaveGeminiKey?.addEventListener('click', () => {
    const key = geminiInput?.value.trim();
    if (key) {
      localStorage.setItem('vmp_gemini_api_key', key);
      mainApp.showToast("¡Clave de Gemini guardada! Agente IA activo para todos tus clientes.", "success");
    } else {
      localStorage.removeItem('vmp_gemini_api_key');
      mainApp.showToast("Clave de Gemini eliminada. Tus clientes operarán en modo de carga manual offline.", "info");
    }
  });
}
