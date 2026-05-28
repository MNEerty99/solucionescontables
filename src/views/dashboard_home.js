/* -------------------------------------------------------------
   VMP Studio Contable - Dashboard Home View (Charts & KPI)
   ------------------------------------------------------------- */
import { getActiveCompany, getTransactions } from '../db/mockdb.js';

export function renderDashboardHome() {
  const activeCompany = getActiveCompany();
  const txs = getTransactions(activeCompany.id);
  const activePeriod = localStorage.getItem('vmp_active_period') || '2026-05';

  const periodNames = {
    '2026-05': 'Mayo 2026',
    '2026-04': 'Abril 2026',
    '2026-03': 'Marzo 2026',
    '2026-02': 'Febrero 2026',
    '2026-01': 'Enero 2026',
    '2025-12': 'Diciembre 2025'
  };

  // Filtrar transacciones por período fiscal activo
  const filteredVentas = txs.ventas.filter(v => v.fecha.startsWith(activePeriod));
  const filteredCompras = txs.compras.filter(c => c.fecha.startsWith(activePeriod));

  // Calcular KPIs
  const totalNetSales = filteredVentas.reduce((sum, v) => sum + v.neto, 0);
  const totalIvaSales = filteredVentas.reduce((sum, v) => sum + v.iva, 0);
  const totalSales = filteredVentas.reduce((sum, v) => sum + v.total, 0);

  const totalNetPurchases = filteredCompras.reduce((sum, c) => sum + c.neto, 0);
  const totalIvaPurchases = filteredCompras.reduce((sum, c) => sum + c.iva, 0);
  const totalPurchases = filteredCompras.reduce((sum, c) => sum + c.total, 0);

  const profit = totalSales - totalPurchases;
  
  // Impuesto estimado (Diferencia de IVA Débito - Crédito)
  const ivaDiferencia = totalIvaSales - totalIvaPurchases;

  // Combinar y ordenar transacciones recientes del período
  const allTxs = [
    ...filteredVentas.map(v => ({ ...v, tipo: 'Venta', sign: '+', colorClass: 'text-emerald' })),
    ...filteredCompras.map(c => ({ ...c, tipo: 'Compra', sign: '-', colorClass: 'text-red' }))
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);

  const isMonotributo = activeCompany.condicion_iva.includes('Monotributo');
  // Para demostración, si es Monotributista acumulado anual
  const accumMonotributoSales = activeCompany.id === 'co-2' ? 29800000 + totalSales : totalSales;
  const maxCategoryLimit = 35000000; // Cat H límite legal
  const consumptionPercent = Math.round((accumMonotributoSales / maxCategoryLimit) * 100);

  return `
  <div class="view-header">
    <div>
      <h1 class="view-title">Dashboard General</h1>
      <p class="view-subtitle">Resumen contable y fiscal para la empresa activa.</p>
    </div>
    <div style="background: rgba(13, 148, 136, 0.08); border: 1px solid rgba(13, 148, 136, 0.2); padding: 8px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600;">
      Régimen: <span style="color: var(--color-teal-light)">${activeCompany.condicion_iva}</span>
    </div>
  </div>

  <!-- Demo Mode Alert Banner -->
  <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(13, 148, 136, 0.05) 100%); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: var(--radius-md); padding: 16px 24px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
    <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 280px;">
      <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #818cf8; flex-shrink: 0;">
        <i data-lucide="info" style="width: 20px; height: 20px;"></i>
      </div>
      <div>
        <h4 style="font-size: 14px; font-weight: 800; color: var(--color-primary); margin: 0 0 3px 0;">Modo Demostración Activo</h4>
        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.4;">
          Estás navegando en una versión de prueba. Al contratar los servicios de abono del <strong>Estudio Contable Comahue</strong>, accederás al <strong>100% de las funciones completas</strong> de la plataforma.
        </p>
      </div>
    </div>
    <button class="btn btn-primary" onclick="alert('Estudio Contable Comahue\\n\\n📞 Teléfono: +54 299 448-1234\\n✉️ Email: contacto@estudiocomahue.com.ar\\n📍 Neuquén, Argentina')" style="background: #6366f1; border-color: #6366f1; font-weight: 700; font-size: 12px; padding: 8px 16px; border-radius: 6px; display: flex; align-items: center; gap: 6px; color: #fff; cursor: pointer;">
      <i data-lucide="phone" style="width: 14px; height: 14px;"></i> Solicitar Acceso Completo
    </button>
  </div>

  ${isMonotributo ? `
  <!-- Monotributo Exclusion Alert Card -->
  <div class="card" style="margin-bottom: 28px; border-color: ${consumptionPercent >= 80 ? '#fbbf24' : 'var(--border-color)'}; background: #fff;">
    <div class="card-body" style="padding: 20px 24px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge" style="background: rgba(99, 102, 241, 0.05); color: #6366f1; border-color: rgba(99, 102, 241, 0.15); font-weight: 700; margin: 0; padding: 4px 10px; font-size: 10.5px;">MONOTRIBUTO SAFE-GUARD</span>
          <h3 style="font-size: 15px; font-weight: 750; color: var(--color-primary); margin-top: 8px; margin-bottom: 4px;">Alerta de Control de Categoría H (Servicios)</h3>
          <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">Límite anual acumulado antes de la exclusión automática de oficio de ARCA.</p>
        </div>
        <div style="text-align: right;">
          <span class="font-mono" style="font-size: 17px; font-weight: 800; color: ${consumptionPercent >= 85 ? '#dc2626' : '#d97706'}">${consumptionPercent}% Consumido</span>
          <span style="font-size: 11px; color: var(--text-muted); display: block; margin-top: 2px;">Límite: $ ${maxCategoryLimit.toLocaleString('es-AR')}</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div style="background: var(--border-color); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
        <div style="width: ${consumptionPercent}%; height: 100%; background: ${consumptionPercent >= 85 ? '#dc2626' : '#fbbf24'}; border-radius: 4px; transition: width 0.4s ease;"></div>
      </div>

      <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: ${consumptionPercent >= 85 ? '#fef2f2' : '#fffbeb'}; border: 1px solid ${consumptionPercent >= 85 ? '#fee2e2' : '#fef3c7'}; border-radius: 4px; font-size: 12px; color: ${consumptionPercent >= 85 ? '#991b1b' : '#92400e'};">
        <i data-lucide="alert-triangle" style="width: 16px; height: 16px; flex-shrink: 0; display: inline-block; vertical-align: middle;"></i>
        <span>
          <strong>Riesgo Contable de Exclusióm:</strong> El cliente ha facturado acumulado <strong>$ ${accumMonotributoSales.toLocaleString('es-AR')}</strong> en los últimos 12 meses. Se sugiere fuertemente iniciar la planificación preventiva del pase al Régimen General (IVA/Ganancias) para evitar reclamos retroactivos.
        </span>
      </div>
    </div>
  </div>
  ` : ''}

  <!-- Interactive Onboarding Trial Guide -->
  <div class="card trial-guide-card" style="margin-bottom: 28px; background: linear-gradient(135deg, rgba(5, 150, 105, 0.02) 0%, rgba(99, 102, 241, 0.02) 100%); border-color: rgba(5, 150, 105, 0.12);">
    <div class="card-body" style="padding: 20px 24px;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span class="badge" style="background: rgba(5, 150, 105, 0.08); color: var(--color-accent); border-color: rgba(5, 150, 105, 0.2); font-weight: 700; margin: 0; padding: 4px 10px; font-size: 11px;">GUÍA DE PRUEBA INTERACTIVA</span>
          <h4 style="font-size: 13px; color: var(--text-secondary); font-weight: 600; margin: 0;">Probá las 4 funciones clave del SaaS o leé la</h4>
        </div>
        <a href="#/demo/ayuda" class="btn btn-primary btn-sm" style="font-size: 11px; padding: 6px 12px; background: #6366f1; border-color: #6366f1; display: flex; align-items: center; gap: 4px; box-shadow: var(--shadow-sm); text-decoration: none; color: white;">
          <i data-lucide="book-open" style="width: 12px; height: 12px;"></i> Guía de Onboarding Completa
        </a>
      </div>
      <div class="trial-actions-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
        
        <a href="#/demo/ventas" class="trial-action-btn">
          <div class="ta-btn-icon" style="background: rgba(99, 102, 241, 0.08); color: #6366f1;">
            <i data-lucide="file-text"></i>
          </div>
          <div class="ta-btn-content">
            <h5>1. Carga de Comprobantes</h5>
            <p>Cargar facturas y validar CUIT APOC</p>
          </div>
          <div class="ta-btn-arrow"><i data-lucide="chevron-right"></i></div>
        </a>

        <a href="#/demo/iva" class="trial-action-btn">
          <div class="ta-btn-icon" style="background: rgba(245, 158, 11, 0.08); color: #f59e0b;">
            <i data-lucide="book-open"></i>
          </div>
          <div class="ta-btn-content">
            <h5>2. Libro IVA Digital</h5>
            <p>Auditoría mensual y exportación Excel</p>
          </div>
          <div class="ta-btn-arrow"><i data-lucide="chevron-right"></i></div>
        </a>

        <a href="#/demo" class="trial-action-btn">
          <div class="ta-btn-icon" style="background: rgba(16, 185, 129, 0.08); color: #10b981;">
            <i data-lucide="alert-triangle"></i>
          </div>
          <div class="ta-btn-content">
            <h5>3. Control Monotributo</h5>
            <p>Alarma Safe-Guard contra exclusión</p>
          </div>
          <div class="ta-btn-arrow"><i data-lucide="chevron-right"></i></div>
        </a>

        <a href="#/demo/ayuda" class="trial-action-btn">
          <div class="ta-btn-icon" style="background: rgba(14, 165, 233, 0.08); color: #0ea5e9;">
            <i data-lucide="help-circle"></i>
          </div>
          <div class="ta-btn-content">
            <h5>4. Instructivo & Soporte</h5>
            <p>Guía de onboarding y claves ARCA</p>
          </div>
          <div class="ta-btn-arrow"><i data-lucide="chevron-right"></i></div>
        </a>

      </div>
    </div>
  </div>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card sales">
      <div class="kpi-header">
        <span>VENTAS TOTALES (NETO)</span>
        <div class="kpi-icon"><i data-lucide="trending-up"></i></div>
      </div>
      <div class="kpi-val">$ ${totalNetSales.toLocaleString('es-AR')}</div>
      <div class="kpi-trend up">
        <i data-lucide="arrow-up-right"></i> +14.2% <span style="color: var(--text-muted)">este mes</span>
      </div>
    </div>

    <div class="kpi-card purchases">
      <div class="kpi-header">
        <span>COMPRAS TOTALES (NETO)</span>
        <div class="kpi-icon"><i data-lucide="shopping-bag"></i></div>
      </div>
      <div class="kpi-val">$ ${totalNetPurchases.toLocaleString('es-AR')}</div>
      <div class="kpi-trend down">
        <i data-lucide="arrow-down-right"></i> -3.8% <span style="color: var(--text-muted)">este mes</span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-header">
        <span>RESULTADO NETO</span>
        <div class="kpi-icon"><i data-lucide="wallet"></i></div>
      </div>
      <div class="kpi-val" style="color: ${profit >= 0 ? 'var(--color-emerald-light)' : '#f87171'}">
        $ ${profit.toLocaleString('es-AR')}
      </div>
      <div class="kpi-trend neutral">
        <i data-lucide="minus"></i> Saldo Operativo
      </div>
    </div>

    <div class="kpi-card tax">
      <div class="kpi-header">
        <span>SALDO TÉCNICO IVA</span>
        <div class="kpi-icon"><i data-lucide="file-check"></i></div>
      </div>
      <div class="kpi-val" style="color: ${ivaDiferencia >= 0 ? '#fbbf24' : 'var(--color-teal-light)'}">
        $ ${Math.abs(ivaDiferencia).toLocaleString('es-AR')}
      </div>
      <div class="kpi-trend ${ivaDiferencia >= 0 ? 'up' : 'down'}" style="color: ${ivaDiferencia >= 0 ? '#fbbf24' : 'var(--color-emerald-light)'}">
        <i data-lucide="${ivaDiferencia >= 0 ? 'arrow-up-right' : 'arrow-down-right'}"></i>
        ${ivaDiferencia >= 0 ? 'A Pagar (Saldo a Favor Fisco)' : 'Saldo Técnico a Favor'}
      </div>
    </div>
  </div>

  <!-- Analytics Grid -->
  <div class="analytics-grid">
    <div class="card">
      <div class="card-header">
        <h3><i data-lucide="bar-chart-3"></i> Evolución de Ventas vs Compras</h3>
        <span class="badge" style="margin: 0; font-size: 11px;">${periodNames[activePeriod]}</span>
      </div>
      <div class="card-body" style="height: 320px; display: flex; align-items: center; justify-content: center; position: relative;">
        <canvas id="dashboard-main-chart" style="max-height: 100%; max-width: 100%;"></canvas>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3><i data-lucide="clock"></i> Actividad Reciente</h3>
        <a href="#/demo/ventas" class="btn btn-outline" style="padding: 6px 12px; font-size: 12px; border-radius: var(--radius-sm);">Ver Todo</a>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cliente/Prov.</th>
                <th class="text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              ${allTxs.length === 0 ? `
                <tr>
                  <td colspan="4" class="text-center text-muted" style="padding: 24px;">No hay movimientos recientes en esta empresa.</td>
                </tr>
              ` : allTxs.map(tx => `
                <tr>
                  <td class="font-mono text-sm">${tx.fecha.split('-').reverse().join('/')}</td>
                  <td>
                    <span class="badge-status ${tx.tipo === 'Venta' ? 'active' : 'pending'}" style="font-size: 11px; padding: 2px 8px;">
                      ${tx.tipo}
                    </span>
                  </td>
                  <td style="font-weight: 500; font-size: 13px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${tx.cliente || tx.proveedor}
                  </td>
                  <td class="font-mono text-right ${tx.colorClass}" style="font-weight: 600;">
                    ${tx.sign} $ ${tx.total.toLocaleString('es-AR')}
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

export function initDashboardHome(mainApp) {
  // Inicializar Lucide Icons
  if (window.lucide) window.lucide.createIcons();

  // Inicializar Gráficos dinámicos con Chart.js
  const canvas = document.getElementById('dashboard-main-chart');
  if (!canvas) return;

  const activeCompany = getActiveCompany();
  const txs = getTransactions(activeCompany.id);

  // Agrupar Ventas y Compras de los últimos meses o por días
  // Como demo estática pero reactiva, mapeamos días ficticios de Mayo
  const dates = ["05 May", "10 May", "15 May", "20 May", "25 May"];
  
  // Distribuir el total neto aproximado para hacerlo ver realista
  const totalSales = txs.ventas.reduce((sum, v) => sum + v.neto, 0);
  const totalPurchases = txs.compras.reduce((sum, c) => sum + c.neto, 0);

  const salesData = [totalSales * 0.1, totalSales * 0.2, totalSales * 0.35, totalSales * 0.2, totalSales * 0.15];
  const purchasesData = [totalPurchases * 0.15, totalPurchases * 0.3, totalPurchases * 0.25, totalPurchases * 0.1, totalPurchases * 0.2];

  // Si Chart está cargado de forma global en window.Chart
  if (window.Chart) {
    // Destruir gráfico previo si existe para evitar superposiciones
    if (mainApp.activeChart) {
      mainApp.activeChart.destroy();
    }

    mainApp.activeChart = new window.Chart(canvas, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Ventas (Neto)',
            data: salesData,
            backgroundColor: '#10b981',
            borderRadius: 6,
            borderWidth: 0
          },
          {
            label: 'Compras (Neto)',
            data: purchasesData,
            backgroundColor: '#6366f1',
            borderRadius: 6,
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#9ca3af',
              font: { family: 'Plus Jakarta Sans', weight: '600' }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#9ca3af',
              font: { family: 'JetBrains Mono' },
              callback: function(value) {
                return '$' + value.toLocaleString('es-AR');
              }
            }
          }
        }
      }
    });
  } else {
    // Fallback si Chart.js no se ha cargado todavía
    console.log("Chart.js no disponible.");
  }
}
