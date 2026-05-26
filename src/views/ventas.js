/* -------------------------------------------------------------
   VMP Studio Contable - Ventas y Compras View Component
   ------------------------------------------------------------- */
import { getActiveCompany, getTransactions, addTransaction } from '../db/mockdb.js';

export function renderVentas() {
  const activeCompany = getActiveCompany();
  const txs = getTransactions(activeCompany.id);

  return `
  <div class="view-header">
    <div>
      <h1 class="view-title">Comprobantes Registrados</h1>
      <p class="view-subtitle">Gestioná las facturas emitidas y recibidas de la empresa.</p>
    </div>
    <button class="btn btn-primary" id="btn-show-add-tx">
      <i data-lucide="plus"></i> Cargar Comprobante
    </button>
  </div>

  <!-- Add Transaction Form Container -->
  <div class="card id-form-card" id="add-tx-form-container" style="display: none; margin-bottom: 32px;">
    <div class="card-header">
      <h3><i data-lucide="file-plus"></i> Registrar Comprobante Manual</h3>
      <button class="btn-icon-sm" id="btn-cancel-add-tx" title="Cancelar"><i data-lucide="x"></i></button>
    </div>
    <div class="card-body">
      <form id="add-tx-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="form-group">
          <label class="form-label">Tipo de Operación *</label>
          <select id="tx-operation-type" class="form-select">
            <option value="ventas">Venta (Emitido)</option>
            <option value="compras">Compra (Recibido)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Fecha *</label>
          <input type="date" id="tx-date" class="form-input" value="2026-05-25" required>
        </div>
        <div class="form-group">
          <label class="form-label">Tipo de Comprobante *</label>
          <select id="tx-voucher-type" class="form-select">
            <option value="Factura A">Factura A</option>
            <option value="Factura B">Factura B</option>
            <option value="Factura C">Factura C</option>
            <option value="Factura E (Export.)">Factura E (Exportación)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Número de Comprobante *</label>
          <input type="text" id="tx-number" class="form-input" placeholder="0001-00001234" required>
        </div>
        <div class="form-group">
          <label class="form-label" id="lbl-entity">Cliente *</label>
          <input type="text" id="tx-entity" class="form-input" placeholder="Razón Social / Consumidor Final" required>
        </div>
        <div class="form-group">
          <label class="form-label">CUIT Cliente/Proveedor *</label>
          <input type="text" id="tx-cuit" class="form-input" placeholder="30-11223344-5" required>
        </div>
        <div class="form-group">
          <label class="form-label">Importe Neto Gravado *</label>
          <input type="number" id="tx-net" class="form-input" placeholder="0.00" min="0" step="0.01" required>
        </div>
        <div class="form-group">
          <label class="form-label">Alícuota IVA %</label>
          <select id="tx-iva-rate" class="form-select">
            <option value="21">21.0 % (Estándar)</option>
            <option value="10.5">10.5 % (Reducido)</option>
            <option value="27">27.0 % (Servicios)</option>
            <option value="0">0.0 % (Exento / No Gravado)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Importe IVA Calculado</label>
          <input type="number" id="tx-iva" class="form-input" style="background: rgba(255,255,255,0.02); color: var(--text-secondary);" placeholder="0.00" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Total Facturado</label>
          <input type="number" id="tx-total" class="form-input" style="background: rgba(255,255,255,0.02); color: var(--color-teal-light); font-weight: 700;" placeholder="0.00" readonly>
        </div>

        <div style="grid-column: span 2; display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
          <button type="button" class="btn btn-outline" id="btn-tx-form-cancel">Cancelar</button>
          <button type="submit" class="btn btn-primary">Registrar Comprobante</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Tabs Navigation -->
  <div style="display: flex; gap: 8px; margin-bottom: 24px;">
    <button class="btn btn-outline active" id="btn-tab-ventas" style="border-radius: var(--radius-full); padding: 8px 20px; font-size: 13px;">
      Ventas Emitidas (${txs.ventas.length})
    </button>
    <button class="btn btn-outline" id="btn-tab-compras" style="border-radius: var(--radius-full); padding: 8px 20px; font-size: 13px;">
      Compras Recibidas (${txs.compras.length})
    </button>
  </div>

  <!-- Scoped Data Card -->
  <div class="card">
    <div class="card-body p-0" id="tx-list-container">
      <!-- Injected table -->
    </div>
  </div>
  `;
}

// Sub-renderers for clean tab switches
function renderTransactionsTable(transactions, type) {
  if (transactions.length === 0) {
    return `
    <div style="text-align: center; padding: 48px; color: var(--text-secondary);">
      <i data-lucide="info" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 12px;"></i>
      <h4>No hay comprobantes cargados en esta sección</h4>
      <p style="font-size: 13px; margin-top: 6px;">Cargá uno manualmente o importá un archivo de AFIP en la sección "Importación AFIP".</p>
    </div>
    `;
  }

  return `
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Número</th>
          <th>${type === 'ventas' ? 'Cliente' : 'Proveedor'}</th>
          <th>CUIT</th>
          <th class="text-right">Neto Gravado</th>
          <th class="text-right">IVA</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${transactions.map(t => `
          <tr>
            <td class="font-mono text-sm">${t.fecha.split('-').reverse().join('/')}</td>
            <td>
              <span class="badge-status ${type === 'ventas' ? 'active' : 'pending'}" style="font-size: 11.5px; font-weight: 600; padding: 2px 10px;">
                ${t.tipo_comprobante}
              </span>
            </td>
            <td class="font-mono text-sm" style="font-weight: 500;">${t.numero}</td>
            <td style="font-weight: 600; font-size: 13.5px;">
              <div>${t.cliente || t.proveedor}</div>
              ${type === 'compras' ? (t.es_activo ? `
                <div style="font-size: 10px; font-weight: 700; color: #818cf8; display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                  <i data-lucide="building" style="width: 10px; height: 10px;"></i> Bien de Uso / Activo
                </div>
              ` : `
                <div style="font-size: 10px; font-weight: 500; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                  <i data-lucide="tag" style="width: 10px; height: 10px;"></i> Gasto (${t.categoria || 'General'})
                </div>
              `) : ''}
            </td>
            <td class="font-mono" style="color: var(--text-secondary);">${t.cuit}</td>
            <td class="font-mono text-right">$ ${t.neto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
            <td class="font-mono text-right" style="color: var(--text-secondary);">$ ${t.iva.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
            <td class="font-mono text-right" style="font-weight: 700; color: ${type === 'ventas' ? 'var(--color-emerald-light)' : 'var(--text-primary)'}">
              $ ${t.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  `;
}

export function initVentas(mainApp) {
  if (window.lucide) window.lucide.createIcons();

  const activeCompany = getActiveCompany();
  let activeTab = "ventas"; // 'ventas' or 'compras'

  const container = document.getElementById('tx-list-container');
  const btnShowAdd = document.getElementById('btn-show-add-tx');
  const btnCancelAdd = document.getElementById('btn-cancel-add-tx');
  const btnFormCancel = document.getElementById('btn-tx-form-cancel');
  const formContainer = document.getElementById('add-tx-form-container');
  const form = document.getElementById('add-tx-form');
  
  const tabVentas = document.getElementById('btn-tab-ventas');
  const tabCompras = document.getElementById('btn-tab-compras');

  // Renders the active list
  const updateList = () => {
    const txs = getTransactions(activeCompany.id);
    container.innerHTML = renderTransactionsTable(txs[activeTab], activeTab);
    if (window.lucide) window.lucide.createIcons({ root: container });
  };

  updateList();

  // Tab switching
  tabVentas?.addEventListener('click', () => {
    activeTab = "ventas";
    tabVentas.classList.add('active');
    tabCompras.classList.remove('active');
    updateList();
  });

  tabCompras?.addEventListener('click', () => {
    activeTab = "compras";
    tabCompras.classList.add('active');
    tabVentas.classList.remove('active');
    updateList();
  });

  // Show/Hide Form
  btnShowAdd?.addEventListener('click', () => {
    formContainer.style.display = 'block';
    btnShowAdd.style.display = 'none';
    document.getElementById('tx-number').focus();
  });

  const hideForm = () => {
    formContainer.style.display = 'none';
    btnShowAdd.style.display = 'flex';
    form.reset();
  };

  btnCancelAdd?.addEventListener('click', hideForm);
  btnFormCancel?.addEventListener('click', hideForm);

  // Switch entity label dynamically on operation type change
  const opType = document.getElementById('tx-operation-type');
  const lblEntity = document.getElementById('lbl-entity');
  
  opType?.addEventListener('change', () => {
    if (opType.value === 'ventas') {
      lblEntity.textContent = 'Cliente *';
      document.getElementById('tx-entity').placeholder = 'Razón Social / Consumidor Final';
    } else {
      lblEntity.textContent = 'Proveedor *';
      document.getElementById('tx-entity').placeholder = 'Nombre del Proveedor';
    }
  });

  // Auto-calculator on net amount change or iva rate change
  const inputNet = document.getElementById('tx-net');
  const selectIva = document.getElementById('tx-iva-rate');
  const inputIva = document.getElementById('tx-iva');
  const inputTotal = document.getElementById('tx-total');

  const recalculateAmounts = () => {
    const net = parseFloat(inputNet.value) || 0;
    const rate = parseFloat(selectIva.value) || 0;
    const iva = (net * rate) / 100;
    const total = net + iva;

    inputIva.value = iva.toFixed(2);
    inputTotal.value = total.toFixed(2);
  };

  inputNet?.addEventListener('input', recalculateAmounts);
  selectIva?.addEventListener('change', recalculateAmounts);

  // Form submission
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const op = document.getElementById('tx-operation-type').value;
    const date = document.getElementById('tx-date').value;
    const voucher = document.getElementById('tx-voucher-type').value;
    const num = document.getElementById('tx-number').value;
    const entityName = document.getElementById('tx-entity').value;
    const cuit = document.getElementById('tx-cuit').value;
    const net = parseFloat(inputNet.value);
    const iva = parseFloat(inputIva.value);
    const total = parseFloat(inputTotal.value);

    const transaction = {
      fecha: date,
      tipo_comprobante: voucher,
      numero: num,
      cuit,
      neto: net,
      iva,
      total
    };

    if (op === 'ventas') {
      transaction.cliente = entityName;
    } else {
      transaction.proveedor = entityName;
    }

    addTransaction(activeCompany.id, op, transaction);
    mainApp.showToast('¡Comprobante guardado correctamente!', 'success');

    hideForm();
    
    // Switch active tab to match the entered transaction
    activeTab = op;
    if (op === 'ventas') {
      tabVentas.classList.add('active');
      tabCompras.classList.remove('active');
    } else {
      tabCompras.classList.add('active');
      tabVentas.classList.remove('active');
    }
    
    // Refresh main app statistics + local view table
    mainApp.router();
  });
}
