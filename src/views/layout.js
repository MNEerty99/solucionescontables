/* -------------------------------------------------------------
   VMP Studio Contable - Dashboard Layout Component
   ------------------------------------------------------------- */
import { getCompanies, getActiveCompany } from '../db/mockdb.js';

export function renderDashboardLayout(childHTML, activeRoute) {
  const activeCompany = getActiveCompany();
  const companies = getCompanies();

  return `
  <div class="db-wrapper" id="db-wrapper-root">
    <!-- Sidebar -->
    <aside class="db-sidebar">
      <div class="db-sidebar-header">
        <a href="#/demo" class="db-sidebar-logo">
          <div class="lp-logo-icon">
            <i data-lucide="calculator"></i>
          </div>
          <div class="db-sidebar-logo-text">
            SOLUCIONES <span>CONTABLES</span>
          </div>
        </a>
        <button class="btn-icon-sm" id="sidebar-collapse-btn" title="Colapsar menú">
          <i data-lucide="chevrons-left"></i>
        </button>
      </div>

      <div class="db-sidebar-nav">
        <!-- Active Client Scoping Context Card -->
        <div class="sidebar-active-client-card" style="background: rgba(13, 148, 136, 0.04); border: 1px solid rgba(13, 148, 136, 0.15); border-radius: var(--radius-md); padding: 12px; margin: 4px 8px 16px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="background: ${activeCompany.color}; width: 8px; height: 8px; border-radius: 50%;"></div>
            <span style="font-size: 9.5px; font-weight: 700; color: var(--color-teal-light); text-transform: uppercase; letter-spacing: 0.05em;">Cliente Seleccionado</span>
          </div>
          <div>
            <div style="font-size: 13.5px; font-weight: 700; color: var(--color-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 190px;" title="${activeCompany.razon_social}">
              ${activeCompany.razon_social}
            </div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-secondary); margin-top: 2px;">
              CUIT: ${activeCompany.cuit}
            </div>
          </div>
        </div>

        <div class="db-nav-label">Estudio</div>
        <a href="#/demo" class="db-nav-item ${activeRoute === 'demo' ? 'active' : ''}" data-route="demo">
          <i data-lucide="layout-dashboard"></i>
          <span>Dashboard</span>
        </a>
        <a href="#/demo/empresas" class="db-nav-item ${activeRoute === 'empresas' ? 'active' : ''}" data-route="empresas">
          <i data-lucide="building-2"></i>
          <span>Empresas Clientes</span>
        </a>

        <div class="db-nav-label">Operaciones</div>
        <a href="#/demo/ventas" class="db-nav-item ${activeRoute === 'ventas' ? 'active' : ''}" data-route="ventas">
          <i data-lucide="file-text"></i>
          <span>Comprobantes</span>
        </a>
        <a href="#/demo/importacion" class="db-nav-item ${activeRoute === 'importacion' ? 'active' : ''}" data-route="importacion">
          <i data-lucide="upload-cloud"></i>
          <span>Importación AFIP</span>
        </a>

        <div class="db-nav-label">Fiscal</div>
        <a href="#/demo/iva" class="db-nav-item ${activeRoute === 'iva' ? 'active' : ''}" data-route="iva">
          <i data-lucide="book-open"></i>
          <span>Libro IVA Digital</span>
        </a>
        <a href="#/demo/iva-simple" class="db-nav-item ${activeRoute === 'iva-simple' ? 'active' : ''}" data-route="iva-simple">
          <i data-lucide="file-check-2"></i>
          <span>IVA Simple F.2051</span>
        </a>
        <a href="#/demo/retenciones" class="db-nav-item ${activeRoute === 'retenciones' ? 'active' : ''}" data-route="retenciones">
          <i data-lucide="percent"></i>
          <span>Retenciones y Percepciones</span>
        </a>

        <div class="db-nav-label">Contabilidad</div>
        <a href="#/demo/rt54" class="db-nav-item ${activeRoute === 'rt54' ? 'active' : ''}" data-route="rt54">
          <i data-lucide="layers"></i>
          <span>RT 54 · Panel Contable</span>
        </a>

        <div class="db-nav-label">Portal de Clientes</div>
        <a href="#/demo/portal" class="db-nav-item ${activeRoute === 'portal' ? 'active' : ''}" data-route="portal">
          <i data-lucide="smartphone"></i>
          <span>Portal Cliente (Demo)</span>
        </a>

        <div class="db-nav-label">Configuración</div>
        <a href="#/demo/configuracion" class="db-nav-item ${activeRoute === 'configuracion' ? 'active' : ''}" data-route="configuracion">
          <i data-lucide="settings"></i>
          <span>Configuración ARCA</span>
        </a>

        <div class="db-nav-label">Ayuda & Soporte</div>
        <a href="#/demo/ayuda" class="db-nav-item ${activeRoute === 'ayuda' ? 'active' : ''}" data-route="ayuda">
          <i data-lucide="help-circle"></i>
          <span>Instructivo & Onboarding</span>
        </a>

        <div class="db-nav-label">Salida</div>
        <a href="#/" class="db-nav-item">
          <i data-lucide="arrow-left-circle"></i>
          <span>Volver a la Web</span>
        </a>
      </div>

      <div class="db-sidebar-footer">
        <div class="user-info">
          <span class="user-name">Estudio Contable Comahue</span>
          <span class="user-role">Administrador</span>
        </div>
        <button class="btn-icon-sm" id="logout-demo-btn" title="Cerrar sesión">
          <i data-lucide="log-out"></i>
        </button>
      </div>
    </aside>

    <!-- Main Section -->
    <div class="db-main">
      <header class="db-topbar">
        <div class="topbar-left">
          <div class="db-breadcrumb" id="db-breadcrumb-title">Cargando...</div>
        </div>

        <div style="display: flex; align-items: center; gap: 16px;">
          <!-- Global Fiscal Period Selector -->
          <div style="display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 6px 12px; box-shadow: var(--shadow-sm);">
            <i data-lucide="calendar" style="width: 14px; height: 14px; color: var(--text-secondary);"></i>
            <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Período Fiscal:</span>
            <select id="global-fiscal-period" style="border: none; background: transparent; font-size: 13px; font-weight: 700; color: var(--text-primary); cursor: pointer; outline: none; padding: 0 4px; font-family: inherit;">
              <option value="2026-05" ${localStorage.getItem('vmp_active_period') === '2026-05' || !localStorage.getItem('vmp_active_period') ? 'selected' : ''}>Mayo 2026</option>
              <option value="2026-04" ${localStorage.getItem('vmp_active_period') === '2026-04' ? 'selected' : ''}>Abril 2026</option>
              <option value="2026-03" ${localStorage.getItem('vmp_active_period') === '2026-03' ? 'selected' : ''}>Marzo 2026</option>
              <option value="2026-02" ${localStorage.getItem('vmp_active_period') === '2026-02' ? 'selected' : ''}>Febrero 2026</option>
              <option value="2026-01" ${localStorage.getItem('vmp_active_period') === '2026-01' ? 'selected' : ''}>Enero 2026</option>
              <option value="2025-12" ${localStorage.getItem('vmp_active_period') === '2025-12' ? 'selected' : ''}>Diciembre 2025</option>
            </select>
          </div>

          <!-- Dynamic Company Selector Pill -->
          <div style="position: relative;">
            <div class="company-selector-container" id="topbar-company-selector">
              <div class="company-avatar" style="background: ${activeCompany.color}">
                ${activeCompany.razon_social[0]}
              </div>
              <div class="company-select-text">
                <span class="c-sel-name">${activeCompany.razon_social}</span>
                <span class="c-sel-cuit">CUIT: ${activeCompany.cuit}</span>
              </div>
              <i data-lucide="chevron-down" style="width: 14px; height: 14px; margin-left: 8px;"></i>
            </div>

            <!-- Selector Dropdown -->
            <div class="company-dropdown" id="company-selector-dropdown">
              <div style="padding: 6px 12px; font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Cambiar Empresa</div>
              ${companies.map(c => `
                <div class="dropdown-item ${c.id === activeCompany.id ? 'active' : ''}" data-id="${c.id}">
                  <div class="company-avatar" style="background: ${c.color}; width: 24px; height: 24px; font-size: 11px;">
                    ${c.razon_social[0]}
                  </div>
                  <div class="company-select-text">
                    <span class="c-sel-name" style="font-size: 12px; font-weight: 600; max-width: 180px;">${c.razon_social}</span>
                    <span class="c-sel-cuit" style="font-size: 10px;">${c.cuit}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </header>

      <div class="db-view-container">
        ${childHTML}
      </div>

      <!-- Mobile Bottom Navigation Bar -->
      <nav class="mobile-bottom-nav">
        <a href="#/demo" class="mb-nav-item ${activeRoute === 'demo' ? 'active' : ''}">
          <i data-lucide="layout-dashboard"></i>
          <span>Inicio</span>
        </a>
        <a href="#/demo/empresas" class="mb-nav-item ${activeRoute === 'empresas' ? 'active' : ''}">
          <i data-lucide="building-2"></i>
          <span>Empresas</span>
        </a>
        <a href="#/demo/importacion" class="mb-nav-item ${activeRoute === 'importacion' ? 'active' : ''}">
          <i data-lucide="upload-cloud"></i>
          <span>AFIP</span>
        </a>
        <a href="#/demo/portal" class="mb-nav-item ${activeRoute === 'portal' ? 'active' : ''}">
          <i data-lucide="smartphone"></i>
          <span>Portal Cel</span>
        </a>
      </nav>
    </div>
  </div>
  `;
}

export function initDashboardLayout(mainApp) {
  // Toggle sidebar collapse
  document.getElementById('sidebar-collapse-btn')?.addEventListener('click', () => {
    document.getElementById('db-wrapper-root').classList.toggle('sidebar-collapsed');
    const icon = document.querySelector('#sidebar-collapse-btn i');
    if (icon) {
      const isCollapsed = document.getElementById('db-wrapper-root').classList.contains('sidebar-collapsed');
      icon.setAttribute('data-lucide', isCollapsed ? 'chevrons-right' : 'chevrons-left');
      if (window.lucide) window.lucide.createIcons();
    }
  });

  // Toggle company selector dropdown
  const selector = document.getElementById('topbar-company-selector');
  const dropdown = document.getElementById('company-selector-dropdown');
  
  selector?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    dropdown?.classList.remove('show');
  });

  // Handle active company change
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const coId = item.dataset.id;
      mainApp.setActiveCompany(coId);
      dropdown.classList.remove('show');
      mainApp.showToast(`Cambiando a: ${item.querySelector('.c-sel-name').textContent}`, 'info');
    });
  });

  // Global Fiscal Period Selector listener
  const periodSelector = document.getElementById('global-fiscal-period');
  periodSelector?.addEventListener('change', (e) => {
    const newPeriod = e.target.value;
    localStorage.setItem('vmp_active_period', newPeriod);
    
    const periodNames = {
      '2026-05': 'Mayo 2026',
      '2026-04': 'Abril 2026',
      '2026-03': 'Marzo 2026',
      '2026-02': 'Febrero 2026',
      '2026-01': 'Enero 2026',
      '2025-12': 'Diciembre 2025'
    };
    
    mainApp.showToast(`Cambiando período fiscal a: ${periodNames[newPeriod] || newPeriod}`, 'success');
    mainApp.router(); // Refresh current page instantly to filter by new period!
  });

  // Logout demo
  document.getElementById('logout-demo-btn')?.addEventListener('click', () => {
    window.location.hash = '#/';
  });
}
