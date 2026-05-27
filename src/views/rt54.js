/* -------------------------------------------------------------
   VMP Studio Contable — RT 54 / Panel Contable
   Categorización de entidades y valuación bajo RT 54 FACPCE
   Incluye: Facturas Clase A 2026, Granos (Tipo 033), 
            Importación de Servicios, RG 5824/2026
   ------------------------------------------------------------- */
import { getActiveCompany, getTransactions } from '../db/mockdb.js';
import { fmt, categorizarRT54, RT54_COEF, RT54_BASE_MEDIANA, RT54_BASE_RESTANTE } from '../utils.js';

// Existencia inicial estimada = stock final + unidades vendidas en el período.
// En demo, asumimos que las ventas del período representaron ~20% del stock inicial.
// En producción, este valor viene del inventario permanente del ERP.
const EI_FACTOR = 1.2; // EI = stockFinal * EI_FACTOR

export function renderRT54() {
  const company = getActiveCompany();
  const txs = getTransactions(company.id);

  const ingresosGuardados = parseFloat(localStorage.getItem(`vmp_rt54_ingresos_${company.id}`) || '0');
  const categoria = ingresosGuardados > 0 ? categorizarRT54(ingresosGuardados) : null;
  const umbralMediana  = RT54_BASE_MEDIANA  * RT54_COEF;
  const umbralRestante = RT54_BASE_RESTANTE * RT54_COEF;

  const catConfig = {
    pequena: {
      label: 'Entidad Pequeña',
      color: '#4ade80',
      bg: 'rgba(74,222,128,0.05)',
      border: 'rgba(74,222,128,0.25)',
      simplificaciones: [
        'No segregar Componentes Financieros Implícitos (CFI) en transacciones normales.',
        'Exención total de Impuesto Diferido — solo registrar impuesto corriente.',
        'Valuación de inventarios al costo de la última compra (método simplificado).',
        'Costo de ventas por diferencia de inventarios: CV = EI + C − EF.',
      ]
    },
    mediana: {
      label: 'Entidad Mediana',
      color: '#fbbf24',
      bg: 'rgba(251,191,36,0.05)',
      border: 'rgba(251,191,36,0.25)',
      simplificaciones: [
        'Exención de evaluar desvalorizaciones de bienes de uso o intangibles si la entidad obtuvo resultados positivos netos en alguno de los últimos 3 ejercicios.',
        'Segregación de CFI obligatoria en transacciones financieras.',
        'Valuación de inventarios al costo de la última compra si aplica.',
      ]
    },
    restante: {
      label: 'Restante / Interés Público',
      color: '#f87171',
      bg: 'rgba(248,113,113,0.05)',
      border: 'rgba(248,113,113,0.25)',
      simplificaciones: [
        'Sin simplificaciones. Aplicación del modelo retroactivo integral.',
        'Segregación rigurosa de Componentes Financieros Implícitos (CFI).',
        'Valuación de pasivos al costo de cancelación.',
        'Reconocimiento de Impuesto Diferido obligatorio.',
      ]
    }
  };

  const cat = categoria ? catConfig[categoria] : null;

  // Valuación inventario: última compra
  const comprasOrdenadas = [...txs.compras].sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
  const ultimaCompra = comprasOrdenadas[0];
  const stockUnidades = parseInt(localStorage.getItem(`vmp_rt54_stock_${company.id}`) || '100');
  const costoUltimaCompra = ultimaCompra ? ultimaCompra.neto / 10 : 0; // precio unitario simulado (neto / unidades estimadas)
  const existenciaInicial  = Math.round(stockUnidades * EI_FACTOR);     // EI = EF × EI_FACTOR (ver constante al inicio)
  const valuacionStock     = costoUltimaCompra * stockUnidades;          // EF × costo última compra (RT 54)

  // Total ventas = ingresos del período
  const ingresoPeriodo = txs.ventas.reduce((s,v) => s + v.total, 0);

  return `
  <div class="view-header">
    <div>
      <h1 class="view-title">Panel Contable · RT 54 FACPCE</h1>
      <p class="view-subtitle">Categorización de entidades, valuación de inventarios y comprobantes especiales 2026.</p>
    </div>
    <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);padding:7px 14px;border-radius:var(--radius-sm);font-size:12px;font-weight:600;color:#818cf8;">
      Norma vigente: Obligatoria 2026
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px;">

    <!-- ── Categorizador ──────────────────────────────────────── -->
    <div class="card" style="${cat ? `border-color:${cat.border};background:${cat.bg};` : ''}">
      <div class="card-header">
        <h3><i data-lucide="layers" style="color:#6366f1;"></i> Categorización RT 54 — Ejercicio 2025</h3>
      </div>
      <div class="card-body">
        <p class="text-secondary" style="font-size:12.5px;margin-bottom:16px;">
          Ingresá los ingresos del ejercicio anterior (en <strong>moneda homogénea</strong>, ya reexpresados con el índice de inflación).
          La norma actualiza los umbrales con coeficiente inflacionario (base octubre 2022).
        </p>
        <div style="display:flex;gap:12px;margin-bottom:16px;align-items:flex-end;">
          <div style="flex:1;">
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:8px;">Ingresos anuales reexpresados ($)</label>
            <input type="number" id="inp-ingresos-rt54" class="form-input" placeholder="Ej: 12.000.000" style="width:100%;padding:10px 12px;" value="${ingresosGuardados || ''}">
          </div>
          <button class="btn btn-primary" id="btn-categorizar" style="background:#6366f1;border-color:#6366f1;white-space:nowrap;">
            <i data-lucide="calculator"></i> Categorizar
          </button>
        </div>

        <!-- Umbrales de referencia -->
        <div style="background:rgba(255,255,255,0.02);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:12px;margin-bottom:16px;">
          <p style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:8px;">UMBRALES 2026 (Base oct/22 × ${COEF_ACTUALIZACION}×)</p>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;font-size:11.5px;">
              <span style="color:#4ade80;font-weight:600;">Pequeña (hasta)</span>
              <span class="font-mono">$ ${fmt(umbralMediana)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11.5px;">
              <span style="color:#fbbf24;font-weight:600;">Mediana (hasta)</span>
              <span class="font-mono">$ ${fmt(umbralRestante)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11.5px;">
              <span style="color:#f87171;font-weight:600;">Restante/Interés Público</span>
              <span class="font-mono">Superior</span>
            </div>
          </div>
        </div>

        ${cat ? `
        <div style="border:1px solid ${cat.border};background:${cat.bg};border-radius:var(--radius-md);padding:16px;">
          <h4 style="font-size:14px;font-weight:800;color:${cat.color};margin-bottom:10px;display:flex;align-items:center;gap:8px;">
            <i data-lucide="check-circle-2" style="width:16px;height:16px;"></i>
            ${cat.label}
          </h4>
          <ul style="list-style:disc;padding-left:16px;display:flex;flex-direction:column;gap:6px;">
            ${cat.simplificaciones.map(s => `<li style="font-size:12px;color:var(--text-secondary);line-height:1.4;">${s}</li>`).join('')}
          </ul>
        </div>
        ` : `
        <div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:13px;">
          <i data-lucide="arrow-up-circle" style="width:32px;height:32px;margin-bottom:8px;opacity:.4;display:block;margin-inline:auto;"></i>
          Ingresá los ingresos para determinar la categoría y simplificaciones disponibles.
        </div>
        `}
      </div>
    </div>

    <!-- ── Valuación Inventarios ──────────────────────────────── -->
    <div class="card">
      <div class="card-header">
        <h3><i data-lucide="package" style="color:var(--color-accent);"></i> Valuación de Bienes de Cambio</h3>
        <span class="badge" style="margin:0;font-size:10px;">Costo Última Compra</span>
      </div>
      <div class="card-body">
        <p class="text-secondary" style="font-size:12.5px;margin-bottom:16px;">
          RT 54 permite medir inventarios al <strong>costo de la última compra</strong> realizada antes del cierre. Especialmente conveniente en contextos inflacionarios.
        </p>

        ${ultimaCompra ? `
        <div style="background:rgba(16,185,129,0.03);border:1px solid rgba(16,185,129,0.15);border-radius:var(--radius-md);padding:14px;margin-bottom:16px;">
          <p style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:6px;">ÚLTIMA COMPRA REGISTRADA</p>
          <div style="font-size:13px;font-weight:700;">${ultimaCompra.proveedor}</div>
          <div class="font-mono" style="font-size:11.5px;color:var(--text-secondary);">${ultimaCompra.fecha.split('-').reverse().join('/')} · Factura ${ultimaCompra.numero}</div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:13px;">
            <span class="text-secondary">Total Factura:</span>
            <span class="font-mono font-bold">$ ${fmt(ultimaCompra.total)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13px;">
            <span class="text-secondary">Costo unitario estimado:</span>
            <span class="font-mono font-bold text-emerald">$ ${fmt(costoUltimaCompra)}</span>
          </div>
        </div>
        ` : `
        <div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:12px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);margin-bottom:16px;">
          Sin compras registradas. Importá facturas de compra para activar la valuación.
        </div>
        `}

        <div style="display:flex;gap:12px;margin-bottom:16px;align-items:flex-end;">
          <div style="flex:1;">
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:8px;">Unidades en stock final</label>
            <input type="number" id="inp-stock-final" class="form-input" placeholder="Ej: 100" style="width:100%;padding:10px 12px;" value="${stockUnidades}">
          </div>
          <button class="btn btn-outline" id="btn-calcular-inventario" style="white-space:nowrap;">
            <i data-lucide="calculator"></i> Calcular
          </button>
        </div>

        <div style="border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;display:flex;flex-direction:column;gap:8px;">
          <p style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:4px;">FÓRMULA RT 54: CV = EI + C − EF</p>
          <div style="display:flex;justify-content:space-between;font-size:13px;">
            <span class="text-secondary">Existencia Inicial (EI <span style="font-size:10px;">= EF × ${EI_FACTOR})</span></span>
            <span class="font-mono">$ ${fmt(costoUltimaCompra * existenciaInicial)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13px;">
            <span class="text-secondary">+ Compras del período (C)</span>
            <span class="font-mono">$ ${fmt(txs.compras.reduce((s,c) => s+c.total, 0))}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13px;">
            <span class="text-secondary">− Existencia Final (EF · Costo últ. compra)</span>
            <span class="font-mono" id="val-ef">$ ${fmt(valuacionStock)}</span>
          </div>
          <div style="border-top:2px solid var(--border-color);padding-top:8px;display:flex;justify-content:space-between;font-size:15px;font-weight:800;">
            <span>Costo de Ventas <span style="font-size:10px;font-weight:400;color:var(--text-secondary);">(EI + C − EF)</span></span>
            <span class="font-mono text-emerald" id="val-cv">$ ${fmt((costoUltimaCompra * existenciaInicial) + txs.compras.reduce((s,c) => s+c.total, 0) - valuacionStock)}</span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- ── Comprobantes Especiales 2026 ───────────────────────── -->
  <div class="card">
    <div class="card-header">
      <h3><i data-lucide="shield-alert" style="color:#f59e0b;"></i> Parámetros Especiales de Comprobantes — ARCA 2026</h3>
      <span class="badge" style="margin:0;font-size:10px;color:#fbbf24;background:rgba(245,158,11,0.08);border-color:rgba(245,158,11,0.3);">Normativa vigente</span>
    </div>
    <div class="card-body p-0">
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0;border-radius:var(--radius-md);overflow:hidden;">

        <!-- Factura A con Retención -->
        <div style="padding:24px;border-right:1px solid var(--border-color);border-bottom:1px solid var(--border-color);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div style="width:36px;height:36px;border-radius:8px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);display:flex;align-items:center;justify-content:center;color:#f87171;flex-shrink:0;">
              <i data-lucide="percent" style="width:17px;height:17px;"></i>
            </div>
            <h4 style="font-size:13.5px;font-weight:700;">Factura A — Operación Sujeta a Retención</h4>
          </div>
          <p class="text-secondary" style="font-size:12px;line-height:1.5;margin-bottom:12px;">
            Habilitada tras evaluación patrimonial desfavorable (evaluación cuatrimestral: feb / jun / oct).
          </p>
          <div style="background:rgba(239,68,68,0.03);border:1px solid rgba(239,68,68,0.15);border-radius:var(--radius-sm);padding:12px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Retención IVA:</span>
              <span style="font-weight:800;color:#f87171;">100% del IVA facturado</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Retención Ganancias:</span>
              <span style="font-weight:800;color:#f87171;">6% del monto neto</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Quién retiene:</span>
              <span style="font-weight:600;">El adquirente (obligatorio)</span>
            </div>
          </div>
        </div>

        <!-- Factura A con CBU -->
        <div style="padding:24px;border-bottom:1px solid var(--border-color);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div style="width:36px;height:36px;border-radius:8px;background:rgba(6,182,212,0.08);border:1px solid rgba(6,182,212,0.2);display:flex;align-items:center;justify-content:center;color:#22d3ee;flex-shrink:0;">
              <i data-lucide="landmark" style="width:17px;height:17px;"></i>
            </div>
            <h4 style="font-size:13.5px;font-weight:700;">Factura A — Pago en CBU Informada</h4>
          </div>
          <p class="text-secondary" style="font-size:12px;line-height:1.5;margin-bottom:12px;">
            Opción alternativa para emisores con solvencia no acreditada. Reemplaza la histórica Factura M (derogada a fines de 2025).
          </p>
          <div style="background:rgba(6,182,212,0.03);border:1px solid rgba(6,182,212,0.15);border-radius:var(--radius-sm);padding:12px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Método de pago:</span>
              <span style="font-weight:800;color:#22d3ee;">Transferencia a CBU declarada</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Monto transferido:</span>
              <span style="font-weight:600;">Neto de retenciones de ley</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Factura M:</span>
              <span style="font-weight:700;color:#f87171;">❌ Derogada definitivamente</span>
            </div>
          </div>
        </div>

        <!-- Granos - Tipo 033 -->
        <div style="padding:24px;border-right:1px solid var(--border-color);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div style="width:36px;height:36px;border-radius:8px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);display:flex;align-items:center;justify-content:center;color:#fbbf24;flex-shrink:0;">
              <i data-lucide="wheat" style="width:17px;height:17px;"></i>
            </div>
            <h4 style="font-size:13.5px;font-weight:700;">Liquidaciones Primarias de Granos (Tipo 033)</h4>
          </div>
          <p class="text-secondary" style="font-size:12px;line-height:1.5;margin-bottom:12px;">
            Registración obligatoria con parámetros específicos de ARCA para evitar rechazo del validador.
          </p>
          <div style="background:rgba(245,158,11,0.03);border:1px solid rgba(245,158,11,0.15);border-radius:var(--radius-sm);padding:12px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Tipo de comprobante:</span>
              <span class="font-mono" style="font-weight:800;color:#fbbf24;">033</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Punto de venta:</span>
              <span class="font-mono" style="font-weight:800;color:#fbbf24;">00000 (cero)</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Número comprobante:</span>
              <span style="font-weight:600;">Últimos 8 dígitos del COE</span>
            </div>
          </div>
        </div>

        <!-- Importación de Servicios -->
        <div style="padding:24px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div style="width:36px;height:36px;border-radius:8px;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:center;color:#a78bfa;flex-shrink:0;">
              <i data-lucide="globe" style="width:17px;height:17px;"></i>
            </div>
            <h4 style="font-size:13.5px;font-weight:700;">Importación de Servicios</h4>
          </div>
          <p class="text-secondary" style="font-size:12px;line-height:1.5;margin-bottom:12px;">
            Tratamiento diferente a importación de bienes. Solo se registra el crédito fiscal depositado, no el neto gravado.
          </p>
          <div style="background:rgba(139,92,246,0.03);border:1px solid rgba(139,92,246,0.15);border-radius:var(--radius-sm);padding:12px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Registrar en archivo .txt:</span>
              <span style="font-weight:800;color:#a78bfa;">Solo crédito fiscal IVA</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Neto en archivo .txt:</span>
              <span style="font-weight:700;color:#f87171;">❌ Excluir / anular</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;">
              <span class="text-secondary">Carga manual en:</span>
              <span style="font-weight:600;">Portal aduanero ARCA</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- RG 5824/2026 -->
  <div class="card" style="margin-top:24px;border-color:rgba(16,185,129,0.2);background:rgba(16,185,129,0.01);">
    <div class="card-header">
      <h3><i data-lucide="layers-2" style="color:var(--color-accent);"></i> RG 5824/2026 — Facturación Consolidada Mensual</h3>
      <span style="font-size:10px;font-weight:700;color:var(--color-accent);background:rgba(16,185,129,0.08);padding:3px 10px;border-radius:20px;border:1px solid rgba(16,185,129,0.25);">Vigente desde 1° Julio 2026</span>
    </div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <div>
          <p class="text-secondary" style="font-size:13px;line-height:1.5;">
            Los <strong>prestadores de servicios masivos</strong> (empresas de medicina prepaga, servicios de abonos mensuales, etc.) pueden emitir 
            <strong>un único comprobante consolidado al mes por cliente</strong>, eliminando la generación y carga de miles de facturas individuales.
          </p>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;gap:10px;align-items:center;padding:10px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);border:1px solid var(--border-color);">
            <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--color-accent);flex-shrink:0;"></i>
            <span style="font-size:12.5px;">Medicina prepaga y seguros</span>
          </div>
          <div style="display:flex;gap:10px;align-items:center;padding:10px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);border:1px solid var(--border-color);">
            <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--color-accent);flex-shrink:0;"></i>
            <span style="font-size:12.5px;">Servicios de abono mensual (telefonía, internet)</span>
          </div>
          <div style="display:flex;gap:10px;align-items:center;padding:10px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);border:1px solid var(--border-color);">
            <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--color-accent);flex-shrink:0;"></i>
            <span style="font-size:12.5px;">Reduce carga masiva de facturas en estudios</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

export function initRT54(mainApp) {
  if (window.lucide) window.lucide.createIcons();

  const company = getActiveCompany();
  const txs = getTransactions(company.id);

  document.getElementById('btn-categorizar')?.addEventListener('click', () => {
    const val = parseFloat(document.getElementById('inp-ingresos-rt54')?.value || '0');
    if (!val || val <= 0) {
      mainApp.showToast('Ingresá un valor de ingresos válido.', 'error');
      return;
    }
    localStorage.setItem(`vmp_rt54_ingresos_${company.id}`, val.toString());
    const cat = categorizarRT54(val);
    const labels = { pequena: 'Pequeña', mediana: 'Mediana', restante: 'Restante / Interés Público' };
    mainApp.showToast(`Entidad categorizada como: ${labels[cat]}`, 'success');
    mainApp.router();
  });

  document.getElementById('btn-calcular-inventario')?.addEventListener('click', () => {
    const unidades = parseInt(document.getElementById('inp-stock-final')?.value || '0');
    localStorage.setItem(`vmp_rt54_stock_${company.id}`, unidades.toString());

    const comprasOrdenadas = [...txs.compras].sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
    const ultimaCompra = comprasOrdenadas[0];
    const costoUnit = ultimaCompra ? ultimaCompra.neto / 10 : 0;
    const ei          = Math.round(unidades * EI_FACTOR) * costoUnit;
    const ef          = costoUnit * unidades;
    const totalCompras = txs.compras.reduce((s,c) => s+c.total, 0);
    const cv           = ei + totalCompras - ef;

    const elEF = document.getElementById('val-ef');
    const elCV = document.getElementById('val-cv');
    if (elEF) elEF.textContent = `$ ${ef.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    if (elCV) elCV.textContent = `$ ${cv.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

    mainApp.showToast('Valuación de inventario recalculada con RT 54.', 'success');
  });
}
