/* -------------------------------------------------------------
   VMP Studio Contable — IVA Simple / F.2051
   Circuito completo de liquidación IVA según ARCA 2026
   ------------------------------------------------------------- */
import { getActiveCompany, getTransactions } from '../db/mockdb.js';
import { fmt, fmtDate, getVencimientos, downloadFile, renderPremiumTeaser } from '../utils.js';

// ── Actividades económicas CLAE simplificadas por sector ────────
function getActividadesPorEmpresa(company) {
  // En producción: vendría del perfil de la empresa en Supabase/ARCA
  // Demo: asignar según tipo de actividad declarada
  const act = company.actividad?.toLowerCase() || '';
  if (act.includes('logísti') || act.includes('transport')) {
    return [
      { codigo: '494000', descripcion: 'Transporte automotor de carga', pct: 0.85, alicuota: 21 },
      { codigo: '522900', descripcion: 'Servicios auxiliares de transporte', pct: 0.15, alicuota: 21 },
    ];
  }
  if (act.includes('software') || act.includes('tecnolog') || act.includes('consult')) {
    return [
      { codigo: '620100', descripcion: 'Actividades de programación informática', pct: 0.70, alicuota: 21 },
      { codigo: '631100', descripcion: 'Procesamiento y hosting de datos', pct: 0.30, alicuota: 21 },
    ];
  }
  // Default: comercio mayorista
  return [
    { codigo: '464100', descripcion: 'Venta al por mayor de alimentos', pct: 0.70, alicuota: 21 },
    { codigo: '479900', descripcion: 'Venta al por menor s/especificación', pct: 0.30, alicuota: 21 },
  ];
}

// ── Render ────────────────────────────────────────────────────────
export function renderIVASimple() {
  const company = getActiveCompany();
  const txs = getTransactions(company.id);

  const debFiscal    = txs.ventas.reduce((s, v) => s + v.iva, 0);
  const credFiscal   = txs.compras.reduce((s, c) => s + c.iva, 0);
  const retPercSaldo = parseFloat(localStorage.getItem(`vmp_ret_perc_saldo_${company.id}`) || '0');
  const saldoFavor   = parseFloat(localStorage.getItem(`vmp_saldo_favor_${company.id}`) || '0');
  const saldoNeto    = debFiscal - credFiscal - retPercSaldo - saldoFavor;

  const consistenciaOk = localStorage.getItem(`vmp_consist_ok_${company.id}`) === 'true';
  const libroImportado = localStorage.getItem(`vmp_libro_importado_${company.id}`) === 'true';

  const venc      = getVencimientos(company.cuit);
  const mesActual = new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' });

  // Distribución por actividad — toma datos REALES del libro de ventas
  const actividades = getActividadesPorEmpresa(company);
  const totalNetVentas = txs.ventas.reduce((s, v) => s + v.neto, 0);

  const actividadRows = actividades.map(a => ({
    ...a,
    neto: totalNetVentas * a.pct,
    df:   totalNetVentas * a.pct * a.alicuota / 100,
  }));
  const totalActividadDF = actividadRows.reduce((s, r) => s + r.df, 0);
  const consistDiff = Math.abs(totalActividadDF - debFiscal);
  const consistOkCalc = consistDiff < 1; // menos de $1 de diferencia = OK

  const pasos = [
    { n:1, label:'Libros importados', icon:'upload',        done: libroImportado },
    { n:2, label:'Consistencia validada', icon:'check-circle', done: consistenciaOk },
    { n:3, label:'Ret./Perc. cargadas', icon:'percent',     done: retPercSaldo > 0 || saldoFavor > 0 },
    { n:4, label:'Presentación F.2051',  icon:'send',        done: false },
  ];

  return renderPremiumTeaser(`
  <div class="view-header">
    <div>
      <h1 class="view-title">IVA Simple — F.2051</h1>
      <p class="view-subtitle">Circuito de liquidación mensual · ${mesActual}</p>
    </div>
    <div style="display:flex;gap:10px;align-items:center;">
      <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);padding:7px 14px;border-radius:var(--radius-sm);font-size:12px;font-weight:600;color:#818cf8;">
        CUIT: ${company.cuit}
      </div>
      <button class="btn btn-primary" id="btn-presentar-f2051" ${!consistenciaOk ? 'disabled' : ''} style="${!consistenciaOk ? 'opacity:.45;cursor:not-allowed;' : ''}">
        <i data-lucide="send"></i> Presentar F.2051
      </button>
    </div>
  </div>

  <!-- ── Flujo de 4 pasos ──────────────────────────────────────── -->
  <div style="display:flex;gap:0;margin-bottom:32px;">
    ${pasos.map((s, i) => `
      <div style="flex:1;display:flex;align-items:center;gap:0;">
        <div style="flex:1;text-align:center;position:relative;z-index:1;">
          <div style="width:40px;height:40px;border-radius:50%;border:2px solid ${s.done ? 'var(--color-accent)' : 'var(--border-color)'};background:${s.done ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)'};display:flex;align-items:center;justify-content:center;margin:0 auto 8px;color:${s.done ? 'var(--color-accent)' : 'var(--text-secondary)'};">
            <i data-lucide="${s.icon}" style="width:18px;height:18px;"></i>
          </div>
          <p style="font-size:11px;font-weight:600;color:${s.done ? 'var(--color-accent)' : 'var(--text-secondary)'};">${s.label}</p>
        </div>
        ${i < pasos.length - 1 ? `<div style="height:2px;width:100%;background:${s.done ? 'var(--color-accent)' : 'var(--border-color)'};flex:0.5;margin-bottom:20px;"></div>` : ''}
      </div>
    `).join('')}
  </div>

  <div style="display:grid;grid-template-columns:1.3fr 0.7fr;gap:24px;align-items:start;">

    <!-- ── Columna principal ──────────────────────────────────── -->
    <div style="display:flex;flex-direction:column;gap:24px;">

      <!-- Importador de Libros -->
      <div class="card" id="card-import-libros">
        <div class="card-header">
          <h3><i data-lucide="upload-cloud" style="color:#6366f1;"></i> Importación de Libros IVA Digital</h3>
          ${libroImportado ? `<span style="font-size:10px;font-weight:700;color:var(--color-accent);display:flex;align-items:center;gap:4px;"><i data-lucide="check-circle-2" style="width:12px;height:12px;"></i> Importado</span>` : ''}
        </div>
        <div class="card-body">
          <p class="text-secondary" style="font-size:13px;margin-bottom:20px;">
            Importá los archivos <code>.txt</code> del Libro de Compras exportados por tu ERP (Sistar, SOS Contador, Holistor).
            Las <strong>ventas con CAE se precargan automáticamente</strong> desde ARCA.
          </p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
            <div class="import-area" id="drop-compras-cbte" style="padding:18px;margin:0;cursor:pointer;border-color:${libroImportado ? 'var(--color-accent)' : 'var(--border-color)'};background:${libroImportado ? 'rgba(16,185,129,0.02)' : 'rgba(255,255,255,0.01)'};">
              <i data-lucide="file-text" style="width:28px;height:28px;color:#6366f1;margin-bottom:8px;"></i>
              <h5 style="font-size:12px;font-weight:700;">LIBRO_IVA_COMPRAS_CBTE.txt</h5>
              <p style="font-size:9.5px;color:var(--text-secondary);margin-top:4px;">Comprobantes del Libro de Compras</p>
              <input type="file" id="file-compras-cbte" style="display:none;" accept=".txt,.zip">
            </div>
            <div class="import-area" id="drop-compras-ali" style="padding:18px;margin:0;cursor:pointer;border-color:${libroImportado ? 'var(--color-accent)' : 'var(--border-color)'};background:${libroImportado ? 'rgba(16,185,129,0.02)' : 'rgba(255,255,255,0.01)'};">
              <i data-lucide="percent" style="width:28px;height:28px;color:#6366f1;margin-bottom:8px;"></i>
              <h5 style="font-size:12px;font-weight:700;">LIBRO_IVA_COMPRAS_ALICUOTAS.txt</h5>
              <p style="font-size:9.5px;color:var(--text-secondary);margin-top:4px;">Alícuotas del Libro de Compras</p>
              <input type="file" id="file-compras-ali" style="display:none;" accept=".txt,.zip">
            </div>
          </div>
          <div style="display:flex;gap:10px;align-items:center;">
            <button class="btn btn-outline" id="btn-simular-import-libro" style="flex:1;">
              <i data-lucide="sparkles"></i> Simular Importación Demo
            </button>
            ${libroImportado ? `
            <button class="btn btn-outline" id="btn-reset-libro" style="font-size:12px;padding:8px 12px;color:#f87171;border-color:rgba(239,68,68,0.2);">
              <i data-lucide="trash-2"></i>
            </button>` : ''}
          </div>
        </div>
      </div>

      <!-- Cuadrante de Consistencia -->
      <div class="card" style="border-color:${consistenciaOk ? 'rgba(16,185,129,0.3)' : consistOkCalc ? 'rgba(99,102,241,0.2)' : 'rgba(239,68,68,0.3)'};">
        <div class="card-header" style="background:${consistenciaOk ? 'rgba(16,185,129,0.02)' : consistOkCalc ? 'rgba(99,102,241,0.01)' : 'rgba(239,68,68,0.02)'};">
          <h3>
            <i data-lucide="${consistenciaOk ? 'check-circle-2' : 'bar-chart-2'}" style="color:${consistenciaOk ? 'var(--color-accent)' : '#818cf8'};"></i>
            Cuadrante de Consistencia de Débito Fiscal
          </h3>
          <span style="font-size:11px;font-weight:800;padding:3px 10px;border-radius:20px;background:${consistenciaOk ? 'rgba(16,185,129,0.1)' : consistOkCalc ? 'rgba(99,102,241,0.08)' : 'rgba(239,68,68,0.1)'};color:${consistenciaOk ? 'var(--color-accent)' : consistOkCalc ? '#818cf8' : '#f87171'};border:1px solid ${consistenciaOk ? 'rgba(16,185,129,0.3)' : consistOkCalc ? 'rgba(99,102,241,0.2)' : 'rgba(239,68,68,0.3)'};">
            ${consistenciaOk ? '● VERDE — Validado' : consistOkCalc ? '○ Sin validar — Puede confirmar' : '● ROJO — Diferencia detectada'}
          </span>
        </div>
        <div class="card-body">
          <p class="text-secondary" style="font-size:12.5px;margin-bottom:8px;">
            Distribución de ventas por actividad económica (CLAE). El débito fiscal calculado debe coincidir exactamente con el total del Libro de Ventas.
            <strong style="color:#818cf8;"> Sin validación verde, ARCA bloquea la presentación.</strong>
          </p>
          ${totalNetVentas === 0 ? `
          <div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:12.5px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);margin-bottom:16px;">
            Sin ventas registradas en el período. Importá comprobantes para habilitar el cuadrante.
          </div>
          ` : ''}
          <div class="table-responsive">
            <table class="table table-sm" style="margin-bottom:16px;">
              <thead>
                <tr>
                  <th>Código CLAE</th>
                  <th>Descripción</th>
                  <th class="text-right">Neto Gravado</th>
                  <th class="text-right">Alíc.</th>
                  <th class="text-right">DF Calculado</th>
                </tr>
              </thead>
              <tbody>
                ${actividadRows.map(r => `
                <tr>
                  <td class="font-mono text-xs">${r.codigo}</td>
                  <td style="font-size:12.5px;">${r.descripcion} <span style="font-size:10px;color:var(--text-muted);">(${(r.pct*100).toFixed(0)}%)</span></td>
                  <td class="font-mono text-right">$ ${fmt(r.neto)}</td>
                  <td class="font-mono text-right">${r.alicuota}%</td>
                  <td class="font-mono text-right text-emerald">$ ${fmt(r.df)}</td>
                </tr>
                `).join('')}
                <tr style="background:rgba(255,255,255,0.02);font-weight:700;">
                  <td colspan="4" style="text-align:right;font-size:13px;">Total DF por Actividad:</td>
                  <td class="font-mono text-right text-emerald">$ ${fmt(totalActividadDF)}</td>
                </tr>
                <tr style="background:rgba(255,255,255,0.02);font-weight:700;">
                  <td colspan="4" style="text-align:right;font-size:13px;">DF Libro Ventas ARCA:</td>
                  <td class="font-mono text-right" style="color:#fbbf24;">$ ${fmt(debFiscal)}</td>
                </tr>
                <tr>
                  <td colspan="4" style="text-align:right;font-size:13px;font-weight:700;">Diferencia:</td>
                  <td class="font-mono text-right" style="font-weight:800;color:${consistDiff < 1 ? 'var(--color-accent)' : '#f87171'};">
                    ${consistDiff < 1 ? '$ 0,00 ✓' : `$ ${fmt(consistDiff)}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-outline" id="btn-recalc-consist" style="flex:1;">
              <i data-lucide="refresh-cw"></i> Recalcular
            </button>
            <button class="btn btn-primary" id="btn-validar-consist" style="flex:1;background:#6366f1;border-color:#6366f1;" ${consistenciaOk ? 'disabled style="opacity:.45;"' : ''}>
              <i data-lucide="check-circle-2"></i> ${consistenciaOk ? 'Ya validado ✓' : 'Validar Consistencia'}
            </button>
          </div>
          ${!consistOkCalc && !consistenciaOk ? `
          <p style="font-size:11.5px;color:#f87171;margin-top:12px;text-align:center;">
            Ajustá los porcentajes de distribución por actividad hasta que la diferencia sea $ 0,00 antes de validar.
          </p>` : ''}
        </div>
      </div>

      <!-- Retenciones y Percepciones -->
      <div class="card">
        <div class="card-header">
          <h3><i data-lucide="percent" style="color:#f59e0b;"></i> Retenciones y Percepciones</h3>
          <span class="badge" style="margin:0;font-size:10px;">SIRE / SICORE</span>
        </div>
        <div class="card-body">
          <div style="background:rgba(245,158,11,0.03);border:1px solid rgba(245,158,11,0.15);border-radius:var(--radius-md);padding:14px 16px;margin-bottom:18px;font-size:12px;color:var(--text-secondary);">
            <strong style="color:#fbbf24;display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <i data-lucide="alert-triangle" style="width:14px;height:14px;"></i> Requisitos técnicos para CSV de percepciones (ARCA):
            </strong>
            <ul style="list-style:disc;padding-left:16px;display:flex;flex-direction:column;gap:4px;">
              <li>Asignar formato <strong>Texto</strong> a toda la planilla antes de ingresar datos.</li>
              <li>Orden de Pago: exactamente <strong>16 caracteres</strong>. Factura de Compra: entre <strong>5 y 8</strong>. Otro: exactamente <strong>16</strong>.</li>
              <li>Exportar como <strong>CSV UTF-8</strong> y NO volver a abrir con Excel.</li>
            </ul>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
            <div>
              <label style="font-size:12px;font-weight:600;display:block;margin-bottom:8px;">Retenciones sufridas ($)</label>
              <input type="number" id="inp-ret-valor" placeholder="0.00" min="0" style="width:100%;padding:10px 12px;background:rgba(255,255,255,0.03);border:1px solid var(--border-color);border-radius:var(--radius-sm);color:var(--color-primary);font-size:13px;" value="${retPercSaldo}">
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;display:block;margin-bottom:8px;">Saldo técnico a favor ($)</label>
              <input type="number" id="inp-saldo-favor" placeholder="0.00" min="0" style="width:100%;padding:10px 12px;background:rgba(255,255,255,0.03);border:1px solid var(--border-color);border-radius:var(--radius-sm);color:var(--color-primary);font-size:13px;" value="${saldoFavor}">
            </div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-outline" id="btn-generar-csv-ret" style="flex:1;">
              <i data-lucide="download"></i> Generar CSV Percepciones
            </button>
            <button class="btn btn-outline" id="btn-guardar-ret" style="flex:1;">
              <i data-lucide="save"></i> Guardar Valores
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- ── Columna lateral ────────────────────────────────────── -->
    <div style="display:flex;flex-direction:column;gap:24px;">

      <!-- Resumen Determinación F.2051 -->
      <div class="card" style="border-color:rgba(99,102,241,0.2);background:rgba(99,102,241,0.01);">
        <div class="card-header" style="border-bottom-color:rgba(99,102,241,0.1);">
          <h3 style="color:#818cf8;"><i data-lucide="calculator"></i> Determinación F.2051</h3>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
          ${[
            { label:'Débito Fiscal (Ventas)',      val: debFiscal,    sign:'+', color:'#4ade80' },
            { label:'Crédito Fiscal (Compras)',    val: credFiscal,   sign:'−', color:'#f87171' },
            { label:'Ret. y Percepciones sufridas', val: retPercSaldo, sign:'−', color:'#f87171' },
            { label:'Saldo técnico a favor',       val: saldoFavor,  sign:'−', color:'#f87171' },
          ].map(r => `
          <div style="display:flex;justify-content:space-between;font-size:13px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.03);">
            <span class="text-secondary">${r.label}</span>
            <span class="font-mono" style="font-weight:700;color:${r.color};">${r.sign} $ ${fmt(r.val)}</span>
          </div>
          `).join('')}
          <div style="border-top:2px solid rgba(99,102,241,0.25);padding-top:12px;display:flex;justify-content:space-between;font-size:17px;font-weight:800;">
            <span>${saldoNeto >= 0 ? 'SALDO A PAGAR' : 'SALDO A FAVOR'}</span>
            <span class="font-mono" style="color:${saldoNeto >= 0 ? '#fbbf24' : 'var(--color-accent)'};">
              $ ${fmt(Math.abs(saldoNeto))}
            </span>
          </div>
          ${saldoNeto > 0 ? `
          <button class="btn btn-primary" id="btn-generar-vep" style="background:#6366f1;border-color:#6366f1;margin-top:4px;">
            <i data-lucide="credit-card"></i> Generar VEP
          </button>
          ` : `
          <div style="background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.15);border-radius:var(--radius-sm);padding:10px;font-size:11.5px;color:var(--color-accent);text-align:center;margin-top:4px;">
            <i data-lucide="check-circle-2" style="width:14px;height:14px;"></i> Saldo acumulado para próximo período
          </div>
          `}
        </div>
      </div>

      <!-- Calendario de Vencimientos -->
      <div class="card">
        <div class="card-header">
          <h3><i data-lucide="calendar" style="color:#f59e0b;"></i> Vencimientos ARCA</h3>
          <span style="font-size:10px;font-weight:600;color:var(--text-secondary);">CUIT termina en ${company.cuit.slice(-1)}</span>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:8px;">
          ${[
            { label:'Autónomos',       dias: `${venc.autonomos.dia}`,                    color:'#6366f1', icon:'user',      highlight:false },
            { label:'SUSS / F.931',    dias: `${venc.suss.dia}`,                         color:'#8b5cf6', icon:'users',     highlight:false },
            { label:'Casas Part.',     dias: `${venc.casasParticulares.dia}-${venc.casasParticulares.dia+1}`, color:'#ec4899', icon:'home', highlight:false },
            { label:'Monotributo',     dias: `${venc.monotributo.dia}`,                  color:'#06b6d4', icon:'zap',       highlight:false },
            { label:'IVA Simple F.2051', dias: `${venc.iva.dia}-${venc.iva.alt}`,       color:'#f59e0b', icon:'book-open', highlight:true  },
          ].map(v => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px;border-radius:var(--radius-sm);border:1px solid ${v.highlight ? 'rgba(245,158,11,0.3)' : 'var(--border-color)'};background:${v.highlight ? 'rgba(245,158,11,0.03)' : 'transparent'};">
              <div style="width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid var(--border-color);display:flex;align-items:center;justify-content:center;color:${v.color};flex-shrink:0;">
                <i data-lucide="${v.icon}" style="width:15px;height:15px;"></i>
              </div>
              <div style="flex:1;">
                <div style="font-size:12px;font-weight:${v.highlight ? '700' : '600'};color:${v.highlight ? '#fbbf24' : 'var(--color-primary)'};">${v.label}</div>
                <div style="font-size:10.5px;color:var(--text-secondary);">Día ${v.dias} del mes siguiente</div>
              </div>
              ${v.highlight ? `<span style="font-size:9px;font-weight:800;color:#fbbf24;background:rgba(245,158,11,0.1);padding:2px 6px;border-radius:4px;">PRÓXIMO</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Controladores Fiscales B -->
      <div class="card" style="border-color:rgba(99,102,241,0.15);">
        <div class="card-header" style="background:rgba(99,102,241,0.01);">
          <h3 style="font-size:13px;color:#818cf8;"><i data-lucide="monitor"></i> Controladores Fiscales B</h3>
        </div>
        <div class="card-body">
          <p class="text-secondary" style="font-size:12px;line-height:1.5;">
            Las ventas por controladores fiscales tipo B <strong>no se importan automáticamente</strong> en ARCA. Debés subirlas mediante lote externo o carga manual en Comprobantes.
          </p>
          <button class="btn btn-outline btn-sm" id="btn-goto-controladores" style="margin-top:12px;width:100%;font-size:12px;">
            <i data-lucide="upload"></i> Cargar Tickets Controlador B
          </button>
        </div>
      </div>

    </div>
  </div>
  `, "IVA Simple — F.2051", "Gestioná y presentá el formulario F.2051 simplificado para pequeñas y medianas entidades. Automatizá los cálculos de débito y crédito fiscal con cruce de consistencia en tiempo real.");
}

// ── Init ──────────────────────────────────────────────────────────
export function initIVASimple(mainApp) {
  if (window.lucide) window.lucide.createIcons();

  const company = getActiveCompany();
  const txs = getTransactions(company.id);

  // Simular importación de libros
  document.getElementById('btn-simular-import-libro')?.addEventListener('click', () => {
    mainApp.showToast('Leyendo LIBRO_IVA_COMPRAS_CBTE.txt...', 'info');
    setTimeout(() => {
      mainApp.showToast('Validando estructura de alícuotas...', 'info');
      setTimeout(() => {
        localStorage.setItem(`vmp_libro_importado_${company.id}`, 'true');
        mainApp.showToast('¡Libros IVA importados correctamente!', 'success');
        mainApp.router();
      }, 1200);
    }, 900);
  });

  // Reset libro importado
  document.getElementById('btn-reset-libro')?.addEventListener('click', () => {
    localStorage.removeItem(`vmp_libro_importado_${company.id}`);
    mainApp.router();
  });

  // Dropzone clicks
  document.getElementById('drop-compras-cbte')?.addEventListener('click', () => {
    document.getElementById('file-compras-cbte')?.click();
  });
  document.getElementById('drop-compras-ali')?.addEventListener('click', () => {
    document.getElementById('file-compras-ali')?.click();
  });

  // Validar consistencia — solo habilitar si la diferencia es < $1
  document.getElementById('btn-validar-consist')?.addEventListener('click', () => {
    const totalNetVentas = txs.ventas.reduce((s, v) => s + v.neto, 0);
    const debFiscal = txs.ventas.reduce((s, v) => s + v.iva, 0);
    const actividades = getActividadesPorEmpresa(company);
    const totalActividadDF = actividades.reduce((s, a) => s + totalNetVentas * a.pct * a.alicuota / 100, 0);
    const diff = Math.abs(totalActividadDF - debFiscal);

    if (diff >= 1 && totalNetVentas > 0) {
      mainApp.showToast(`⚠ Diferencia de $ ${diff.toFixed(2)} — Ajustá la distribución antes de validar.`, 'error');
      return;
    }
    mainApp.showToast('Ejecutando control de consistencia en ARCA...', 'info');
    setTimeout(() => {
      localStorage.setItem(`vmp_consist_ok_${company.id}`, 'true');
      mainApp.showToast('✓ Consistencia validada. Indicador en VERDE.', 'success');
      mainApp.router();
    }, 1400);
  });

  document.getElementById('btn-recalc-consist')?.addEventListener('click', () => {
    mainApp.showToast('Recalculando distribución por actividad...', 'info');
    setTimeout(() => mainApp.router(), 600);
  });

  // Guardar retenciones
  document.getElementById('btn-guardar-ret')?.addEventListener('click', () => {
    const retVal   = parseFloat(document.getElementById('inp-ret-valor')?.value  || '0');
    const saldoVal = parseFloat(document.getElementById('inp-saldo-favor')?.value || '0');
    if (isNaN(retVal) || isNaN(saldoVal)) {
      mainApp.showToast('Ingresá valores numéricos válidos.', 'error');
      return;
    }
    localStorage.setItem(`vmp_ret_perc_saldo_${company.id}`, retVal.toString());
    localStorage.setItem(`vmp_saldo_favor_${company.id}`, saldoVal.toString());
    mainApp.showToast('Retenciones y saldo técnico guardados.', 'success');
    mainApp.router();
  });

  // Generar CSV de percepciones con formato ARCA correcto
  document.getElementById('btn-generar-csv-ret')?.addEventListener('click', () => {
    if (txs.compras.length === 0) {
      mainApp.showToast('No hay compras registradas para generar percepciones.', 'error');
      return;
    }
    const now = new Date();
    const fechaStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()}`;

    const bom = '\uFEFF'; // UTF-8 BOM — imprescindible para ARCA
    let csv = 'Fecha;CUIT Agente;Tipo Comprobante;Numero Comprobante;Importe;Codigo Impuesto\n';

    txs.compras.forEach((c, i) => {
      const cuit   = c.cuit.replace(/-/g, '').padEnd(11, '0');
      const numDoc = (i + 1).toString().padStart(7, '0'); // Factura de Compra: 7 chars (entre 5 y 8)
      const imp    = (c.iva * 0.1).toFixed(2).replace('.', ',');
      csv += `${fechaStr};${cuit};FACTURA DE COMPRA;${numDoc};${imp};767\n`;
    });

    const cuitLimpio = company.cuit.replace(/-/g, '');
    const periodo    = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}`;
    downloadFile(`percepciones-arca-${cuitLimpio}-${periodo}.csv`, bom + csv, 'text/csv;charset=utf-8');
    mainApp.showToast('CSV generado en UTF-8 con BOM. ¡No volver a abrir con Excel!', 'success');
  });

  // VEP simulado
  document.getElementById('btn-generar-vep')?.addEventListener('click', () => {
    mainApp.showToast('Generando VEP en portal ARCA...', 'info');
    setTimeout(() => {
      mainApp.showToast('VEP generado: código 123-2026-06. Vence en 48hs hábiles.', 'success');
    }, 1500);
  });

  // Presentar F.2051
  document.getElementById('btn-presentar-f2051')?.addEventListener('click', () => {
    const ok = localStorage.getItem(`vmp_consist_ok_${company.id}`) === 'true';
    if (!ok) {
      mainApp.showToast('Debés validar la consistencia antes de presentar.', 'error');
      return;
    }
    mainApp.showToast('Conectando con portal IVA Simple de ARCA...', 'info');
    setTimeout(() => {
      mainApp.showToast('✓ Formulario F.2051 presentado con éxito. Constancia generada.', 'success');
    }, 2000);
  });

  // Ir a comprobantes
  document.getElementById('btn-goto-controladores')?.addEventListener('click', () => {
    window.location.hash = '#/demo/ventas';
  });
}
