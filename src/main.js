/* -------------------------------------------------------------
   VMP Studio Contable - Front Controller & Routing Orchestrator
   ------------------------------------------------------------- */
import { initMockDB, getActiveCompany, setActiveCompanyId } from './db/mockdb.js';

// Import Views
import { renderLanding, initLanding } from './views/landing.js';
import { renderDashboardLayout, initDashboardLayout } from './views/layout.js';
import { renderDashboardHome, initDashboardHome } from './views/dashboard_home.js';
import { renderEmpresas, initEmpresas } from './views/empresas.js';
import { renderVentas, initVentas } from './views/ventas.js';
import { renderImportacion, initImportacion } from './views/importacion.js';
import { renderIVA, initIVA } from './views/iva.js';
import { renderPortalCliente, initPortalCliente } from './views/portal_cliente.js';
import { renderConfiguracion, initConfiguracion } from './views/configuracion.js';
import { renderIVASimple, initIVASimple } from './views/iva_simple.js';
import { renderRetenciones, initRetenciones } from './views/retenciones.js';
import { renderRT54, initRT54 } from './views/rt54.js';
import { renderAyuda, initAyuda } from './views/ayuda.js';

class Application {
  constructor() {
    this.activeChart = null;
    this.init();
  }

  async init() {
    console.log("Initializing VMP Studio Contable App...");
    
    // 1. Initialize Mock Database (localStorage)
    initMockDB();

    // 2. Setup Hash Routing Listener
    window.addEventListener('hashchange', () => this.router());

    // 3. Trigger initial routing
    await this.router();
  }

  async router() {
    const hash = window.location.hash || '#/';
    console.log("Routing to:", hash);

    const rootEl = document.getElementById('view-root');
    if (!rootEl) return;

    // Clean up active chart if present to avoid memory leak
    if (this.activeChart) {
      this.activeChart.destroy();
      this.activeChart = null;
    }

    // Landing Page Route
    if (hash === '#/' || hash === '#' || hash === '') {
      rootEl.innerHTML = renderLanding();
      initLanding(this);
      
      // Update breadcrumb or titles if applicable
      document.title = "Soluciones Contables — El SaaS para Estudios Contables Modernos";
    } 
    // Demo Studio Routes
    else if (hash.startsWith('#/demo')) {
      const activeCompany = getActiveCompany();
      document.title = `Dashboard — ${activeCompany.razon_social} | Soluciones Contables`;

      const subRoute = hash.substring(6); // View route after '#/demo'

      if (subRoute === '' || subRoute === '/') {
        rootEl.innerHTML = renderDashboardLayout(renderDashboardHome(), 'demo');
        initDashboardLayout(this);
        initDashboardHome(this);
        this.updateBreadcrumb("Dashboard General");
      } 
      else if (subRoute === '/empresas') {
        rootEl.innerHTML = renderDashboardLayout(renderEmpresas(), 'empresas');
        initDashboardLayout(this);
        initEmpresas(this);
        this.updateBreadcrumb("Gestión de Empresas Clientes");
      }
      else if (subRoute === '/ventas') {
        rootEl.innerHTML = renderDashboardLayout(renderVentas(), 'ventas');
        initDashboardLayout(this);
        initVentas(this);
        this.updateBreadcrumb("Libro de Comprobantes");
      }
      else if (subRoute === '/importacion') {
        rootEl.innerHTML = renderDashboardLayout(renderImportacion(), 'importacion');
        initDashboardLayout(this);
        initImportacion(this);
        this.updateBreadcrumb("Importación ARCA");
      }
      else if (subRoute === '/iva') {
        rootEl.innerHTML = renderDashboardLayout(renderIVA(), 'iva');
        initDashboardLayout(this);
        initIVA(this);
        this.updateBreadcrumb("Libro IVA Digital Digitalizado");
      }
      else if (subRoute === '/portal') {
        rootEl.innerHTML = renderDashboardLayout(renderPortalCliente(), 'portal');
        initDashboardLayout(this);
        initPortalCliente(this);
        this.updateBreadcrumb("Portal del Cliente");
      }
      else if (subRoute === '/configuracion') {
        rootEl.innerHTML = renderDashboardLayout(renderConfiguracion(), 'configuracion');
        initDashboardLayout(this);
        initConfiguracion(this);
        this.updateBreadcrumb("Configuración de Enlace ARCA");
      }
      else if (subRoute === '/iva-simple') {
        rootEl.innerHTML = renderDashboardLayout(renderIVASimple(), 'iva-simple');
        initDashboardLayout(this);
        initIVASimple(this);
        this.updateBreadcrumb("IVA Simple — F.2051");
      }
      else if (subRoute === '/retenciones') {
        rootEl.innerHTML = renderDashboardLayout(renderRetenciones(), 'retenciones');
        initDashboardLayout(this);
        initRetenciones(this);
        this.updateBreadcrumb("Retenciones y Percepciones");
      }
      else if (subRoute === '/rt54') {
        rootEl.innerHTML = renderDashboardLayout(renderRT54(), 'rt54');
        initDashboardLayout(this);
        initRT54(this);
        this.updateBreadcrumb("RT 54 · Panel Contable");
      }
      else if (subRoute === '/ayuda') {
        try {
          rootEl.innerHTML = renderDashboardLayout(renderAyuda(), 'ayuda');
          initDashboardLayout(this);
          initAyuda(this);
          this.updateBreadcrumb("Instructivo & Onboarding");
        } catch (err) {
          console.error("Error loading Ayuda view:", err);
          if (this.showToast) {
            this.showToast("Error al cargar la sección de ayuda: " + err.message, "error");
          }
        }
      }
      else {
        // Fallback to demo home
        window.location.hash = '#/demo';
      }
    } 
    // Fallback to Landing
    else {
      window.location.hash = '#/';
    }

    // Re-create icons for any newly injected html
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  updateBreadcrumb(title) {
    const el = document.getElementById('db-breadcrumb-title');
    if (el) el.textContent = title;
  }

  setActiveCompany(companyId) {
    setActiveCompanyId(companyId);
    // Reload active dashboard route instantly
    this.router();
  }

  // -------------------------------------------------------------
  // Toast System Implementation
  // -------------------------------------------------------------
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconMap = { 
      success: 'check-circle-2', 
      error: 'alert-circle', 
      info: 'info' 
    };
    
    toast.innerHTML = `
      <i data-lucide="${iconMap[type] || 'info'}" style="width: 20px; height: 20px;"></i>
      <span style="font-weight: 500;">${message}</span>
    `;
    
    container.appendChild(toast);

    if (window.lucide) {
      window.lucide.createIcons({ root: toast });
    }

    // Smooth entry
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });

    // Auto removal
    setTimeout(() => {
      toast.classList.remove('toast-show');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, 3500);
  }
}

// Bootstrap the app
const mainApp = new Application();
export default mainApp;
