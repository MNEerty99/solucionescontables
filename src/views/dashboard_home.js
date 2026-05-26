/* -------------------------------------------------------------
   VMP Studio Contable - Dashboard Home View (Charts & KPI)
   ------------------------------------------------------------- */
import { getActiveCompany, getTransactions } from '../db/mockdb.js';

export function renderDashboardHome() {
  const activeCompany = getActiveCompany();
  const txs = getTransactions(activeCompany.id);

  // Calcular KPIs
  const totalNetSales = txs.ventas.reduce((sum, v) => sum + v.neto, 0);
  const totalIvaSales = txs.ventas.reduce((sum, v) => sum + v.iva, 0);
  const totalSales = txs.ventas.reduce((sum, v) => sum + v.total, 0);

  const totalNetPurchases = txs.compras.reduce((sum, c) => sum + c.neto, 0);
  const totalIvaPurchases = txs.compras.reduce((sum, c) => sum + c.iva, 0);
  const totalPurchases = txs.compras.reduce((sum, c) => sum + c.total, 0);

  const profit = totalSales - totalPurchases;
  
  // Impuesto estimado (Diferencia de IVA Débito - Crédito)
  const ivaDiferencia = totalIvaSales - totalIvaPurchases;

  // Combinar y ordenar transacciones recientes
  const allTxs = [
    ...txs.ventas.map(v => ({ ...v, tipo: 'Venta', sign: '+', colorClass: 'text-emerald' })),
    ...txs.compras.map(c => ({ ...c, tipo: 'Compra', sign: '-', colorClass: 'text-red' }))
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);

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

  <!-- Interactive Onboarding Trial Guide -->
  <div class="card trial-guide-card" style="margin-bottom: 28px; background: linear-gradient(135deg, rgba(5, 150, 105, 0.02) 0%, rgba(99, 102, 241, 0.02) 100%); border-color: rgba(5, 150, 105, 0.12);">
    <div class="card-body" style="padding: 20px 24px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
        <span class="badge" style="background: rgba(5, 150, 105, 0.08); color: var(--color-accent); border-color: rgba(5, 150, 105, 0.2); font-weight: 700; margin: 0; padding: 4px 10px; font-size: 11px;">GUÍA DE PRUEBA INTERACTIVA</span>
        <h4 style="font-size: 13px; color: var(--text-secondary); font-weight: 600; margin: 0;">Probá las 4 funciones clave del SaaS haciendo clic en los accesos rápidos:</h4>
      </div>
      <div class="trial-actions-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
        
        <a href="#/demo/importacion" class="trial-action-btn">
          <div class="ta-btn-icon" style="background: rgba(16, 185, 129, 0.08); color: #10b981;">
            <i data-lucide="upload-cloud"></i>
          </div>
          <div class="ta-btn-content">
            <h5>1. Importar AFIP</h5>
            <p>Subir Excel / Simular carga masiva</p>
          </div>
          <div class="ta-btn-arrow"><i data-lucide="chevron-right"></i></div>
        </a>

        <a href="#/demo/portal" class="trial-action-btn">
          <div class="ta-btn-icon" style="background: rgba(99, 102, 241, 0.08); color: #6366f1;">
            <i data-lucide="camera"></i>
          </div>
          <div class="ta-btn-content">
            <h5>2. Portal de Clientes</h5>
            <p>Simular carga de ticket por celular</p>
          </div>
          <div class="ta-btn-arrow"><i data-lucide="chevron-right"></i></div>
        </a>

        <a href="#/demo/iva" class="trial-action-btn">
          <div class="ta-btn-icon" style="background: rgba(245, 158, 11, 0.08); color: #f59e0b;">
            <i data-lucide="book-open"></i>
          </div>
          <div class="ta-btn-content">
            <h5>3. Libro IVA Digital</h5>
            <p>Generar TXT y exportar a AFIP</p>
          </div>
          <div class="ta-btn-arrow"><i data-lucide="chevron-right"></i></div>
        </a>

        <a href="#/demo/empresas" class="trial-action-btn">
          <div class="ta-btn-icon" style="background: rgba(14, 165, 233, 0.08); color: #0ea5e9;">
            <i data-lucide="building-2"></i>
          </div>
          <div class="ta-btn-content">
            <h5>4. Gestionar Empresas</h5>
            <p>Crear y editar razones sociales</p>
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
        <span class="badge" style="margin: 0; font-size: 11px;">Mayo 2026</span>
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
