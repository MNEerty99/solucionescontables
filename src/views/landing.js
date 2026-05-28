/* -------------------------------------------------------------
   Soluciones Contables - Landing Page View Component
   ------------------------------------------------------------- */

export function renderLanding() {
  return `
  <div class="lp-wrapper">
    <!-- Navigation -->
    <header class="lp-header">
      <div class="container lp-nav">
        <a href="#/" class="lp-logo">
          <div class="lp-logo-icon">
            <i data-lucide="calculator"></i>
          </div>
          <div class="lp-logo-text">
            SOLUCIONES <span>CONTABLES</span>
          </div>
        </a>
        <nav class="lp-menu">
          <a href="#features" class="lp-menu-link">Beneficios</a>
          <a href="#pricing" class="lp-menu-link">Inversión</a>
          <a href="#contact" class="lp-menu-link">Contacto</a>
          <a href="#/demo" class="btn btn-outline btn-sm">Demo Interactiva</a>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          <span class="badge">SaaS Multi-Empresa &middot; Desarrollado por VMP S.A.S.</span>
          <h1 class="hero-title">El puente definitivo entre <span class="gradient-text">tu estudio y tus clientes</span>.</h1>
          <p class="hero-subtitle">Dejá de perseguir carpetas físicas o recibir fotos borrosas. Soluciones Contables centraliza tus empresas cliente, automatiza la carga de facturas de ARCA y brinda un portal móvil para que tus clientes suban comprobantes al instante.</p>
          <div class="hero-actions">
            <a href="#/demo" class="btn btn-primary">
              Probar Demo de la Plataforma <i data-lucide="arrow-right"></i>
            </a>
            <a href="#contact" class="btn btn-outline">Solicitar Asesoramiento</a>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-val">10x</span>
              <span class="stat-label">Menos carga manual</span>
            </div>
            <div class="stat-item">
              <span class="stat-val">100%</span>
              <span class="stat-label">Resguardo en la nube</span>
            </div>
            <div class="stat-item">
              <span class="stat-val">0%</span>
              <span class="stat-label">Complicaciones de ARCA</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="mockup-container">
            <div class="mockup-header">
              <div class="mockup-dots">
                <span class="mockup-dot"></span>
                <span class="mockup-dot"></span>
                <span class="mockup-dot"></span>
              </div>
              <div class="mockup-search"></div>
            </div>
            <div class="mockup-body">
              <div class="mockup-row">
                <div class="mockup-widget">
                  <div class="mockup-w-title">Empresa Activa</div>
                  <div class="mockup-w-val text-teal" style="color: var(--color-accent)">Logística Patagonia</div>
                </div>
                <div class="mockup-widget">
                  <div class="mockup-w-title">IVA Débito (Mayo)</div>
                  <div class="mockup-w-val">$ 153.300</div>
                </div>
                <div class="mockup-widget">
                  <div class="mockup-w-title">Clientes Activos</div>
                  <div class="mockup-w-val">20 Empresas</div>
                </div>
              </div>
              <div class="mockup-chart">
                <div class="mockup-bar"></div>
                <div class="mockup-bar"></div>
                <div class="mockup-bar"></div>
                <div class="mockup-bar"></div>
              </div>
            </div>
            <div class="mockup-floating-card">
              <div class="mfc-icon">
                <i data-lucide="check-circle-2"></i>
              </div>
              <div class="mfc-text">
                <h4>Portal de Clientes</h4>
                <p>Novedad: fotos de tickets integradas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2>Diseñado exclusivamente para el contador moderno</h2>
          <p>Dejá atrás las planillas manuales y optimizá la relación operativa con tus empresas clientes.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i data-lucide="smartphone"></i>
            </div>
            <h3>Portal de Clientes Simplificado</h3>
            <p>Tus clientes entran desde su celular y suben fotos de tickets de compras o arrastran PDFs de facturas. Recibís todo digitalizado de inmediato en tu estudio.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i data-lucide="upload-cloud"></i>
            </div>
            <h3>Importación Rápida ARCA</h3>
            <p>Subí archivos Excel/TXT de ARCA (Mis Comprobantes). El parser inteligente procesa cientos de facturas y calcula alícuotas en menos de 10 segundos.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i data-lucide="file-spreadsheet"></i>
            </div>
            <h3>Libro IVA Digital Automático</h3>
            <p>Visualizá tu Libro de IVA Compras y Ventas consolidado mes a mes. Generá los archivos de texto delimitados oficiales listos para importar a ARCA.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section (Updated to License + Maintenance Model) -->
    <section id="pricing" class="pricing-section">
      <div class="container">
        <div class="section-header">
          <h2>Un modelo de licenciamiento transparente y profesional</h2>
          <p>Sin sorpresas mensuales ni cuotas variables por colaboradores del estudio.</p>
        </div>
        <div class="pricing-grid" style="grid-template-columns: 1fr 1fr; max-width: 800px; margin: 0 auto; gap: 32px;">
          
          <!-- Upfront license -->
          <div class="price-card featured" style="text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="featured-badge">Promoción Especial</div>
              <div class="price-header" style="margin-top: 12px;">
                <h3>Licencia de Adquisición</h3>
                <p>Instalación, configuración y alta de tu estudio.</p>
              </div>

              <!-- Slider for configuring companies -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 12px 14px; margin: 16px 0; text-align: left;">
                <label for="company-slider" style="font-size: 10.5px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Empresas a gestionar:</label>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <input type="range" id="company-slider" min="20" max="100" step="10" value="20" style="flex: 1; accent-color: #6366f1; cursor: pointer; height: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; outline: none;">
                  <span id="company-count-display" style="font-family: var(--font-mono); font-size: 15px; font-weight: 800; color: #818cf8; min-width: 35px; text-align: right;">20</span>
                </div>
              </div>

              <!-- Price displaying original and promo -->
              <div style="margin: 16px 0 20px;">
                <div style="font-size: 11.5px; color: var(--text-secondary); text-decoration: line-through; margin-bottom: 2px; opacity: 0.7;">
                  Original: USD <span id="original-price-val">480</span>
                </div>
                <div style="display: flex; align-items: baseline; justify-content: center; gap: 4px;">
                  <span style="font-size: 14px; font-weight: 700; color: var(--color-accent); font-family: var(--font-mono);">USD</span>
                  <span id="promo-price-val" style="font-size: 42px; font-weight: 800; color: #fff; line-height: 1; font-family: var(--font-mono);">380</span>
                  <span style="font-size: 9.5px; font-weight: 800; color: #14b8a6; background: rgba(20,184,166,0.08); padding: 2px 6px; border-radius: 12px; border: 1px solid rgba(20,184,166,0.2); margin-left: 6px; white-space: nowrap;">
                    ¡Ahorrás USD 100!
                  </span>
                </div>
              </div>

              <ul class="price-features" style="text-align: left; margin-bottom: 24px;">
                <li><i data-lucide="check"></i> Entorno exclusivo en la nube</li>
                <li><i data-lucide="check"></i> Carga y configuración de hasta <strong id="company-bullet-val" style="color: #818cf8;">20</strong> empresas</li>
                <li><i data-lucide="check"></i> Colaboradores del estudio ilimitados</li>
                <li><i data-lucide="check"></i> Capacitación inicial para el equipo</li>
              </ul>
            </div>
            <a href="#/demo" class="btn btn-primary w-full">Ingresar a la Demo</a>
          </div>

          <!-- Monthly maintenance -->
          <div class="price-card" style="text-align: center; border-color: var(--border-color);">
            <div class="price-header" style="margin-top: 12px;">
              <h3>Mantenimiento y Soporte</h3>
              <p>Hosting, backups y actualizaciones continuas.</p>
            </div>
            <div class="price-amount" style="margin: 16px 0 24px;">
              <span class="currency">USD</span>
              <span class="val">150</span>
              <span class="period">/ mes</span>
            </div>
            <ul class="price-features" style="text-align: left; margin-bottom: 24px;">
              <li><i data-lucide="check"></i> Soporte prioritario vía WhatsApp</li>
              <li><i data-lucide="check"></i> Copias de seguridad automáticas diarias</li>
              <li><i data-lucide="check"></i> Portal de Clientes móvil ilimitado</li>
              <li><i data-lucide="check"></i> Actualización legal ARCA bonificada</li>
            </ul>
            <a href="#contact" class="btn btn-outline w-full">Comenzar Implementación</a>
          </div>

        </div>
      </div>
    </section>

    <!-- Contact & Lead Form -->
    <section id="contact" class="contact-section">
      <div class="container">
        <div class="contact-card">
          <div class="contact-info">
            <h2>Hablemos sobre <span class="gradient-text">tu estudio contable</span></h2>
            <p>Agendá una llamada con nuestro equipo técnico para configurar tus primeras empresas o consultanos tus inquietudes.</p>
            <div class="contact-details">
              <div class="cd-item">
                <div class="cd-icon"><i data-lucide="mail"></i></div>
                <div class="cd-text">
                  <h4>Email de Consultas</h4>
                  <p>administracion@vmp-edtech.com</p>
                </div>
              </div>
              <div class="cd-item">
                <div class="cd-icon"><i data-lucide="map-pin"></i></div>
                <div class="cd-text">
                  <h4>Desarrollado y Respaldado por</h4>
                  <p>VMP S.A.S. — Argentina</p>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-form">
            <h3 class="form-title">Solicitar Licencia o Demostración</h3>
            <form id="lead-form">
              <div class="form-group">
                <label class="form-label">Nombre y Apellido</label>
                <input type="text" class="form-input" id="lead-name" placeholder="Juan Perez" required>
              </div>
              <div class="form-group">
                <label class="form-label">Nombre del Estudio Contable</label>
                <input type="text" class="form-input" id="lead-studio" placeholder="Estudio Perez & Asociados" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email de Contacto</label>
                <input type="email" class="form-input" id="lead-email" placeholder="juan@estudioperez.com.ar" required>
              </div>
              <button type="submit" class="btn btn-primary w-full">
                Enviar y Entrar a la Demo
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="lp-footer">
      <div class="container">
        <p>&copy; 2026 Soluciones Contables. Todos los derechos reservados. Desarrollado y administrado por VMP S.A.S.</p>
      </div>
    </footer>
  </div>
  `;
}

import { supabase, isSupabaseConfigured } from '../db/supabase.js';

export function initLanding(mainApp) {
  // Configuración interactiva del selector de empresas y precios
  const slider = document.getElementById('company-slider');
  const countDisplay = document.getElementById('company-count-display');
  const bulletVal = document.getElementById('company-bullet-val');
  const origPriceVal = document.getElementById('original-price-val');
  const promoPriceVal = document.getElementById('promo-price-val');

  if (slider) {
    slider.addEventListener('input', (e) => {
      const companies = parseInt(e.target.value);
      if (countDisplay) countDisplay.textContent = companies;
      if (bulletVal) bulletVal.textContent = companies;

      // Tarificación dinámica con descuento promocional de USD 100
      // Base (20 empresas): Original 480, Promo 380
      // Incremento: +30 Original, +25 Promo por cada 10 empresas adicionales
      const multiplier = (companies - 20) / 10;
      const originalPrice = 480 + (multiplier * 30);
      const promoPrice = 380 + (multiplier * 25);

      if (origPriceVal) origPriceVal.textContent = originalPrice;
      if (promoPriceVal) promoPriceVal.textContent = promoPrice;
    });
  }

  // Manejo de envío de formulario de lead
  document.getElementById('lead-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('lead-name').value;
    const studio = document.getElementById('lead-studio').value;
    const email = document.getElementById('lead-email').value;

    mainApp.showToast(`¡Gracias ${name}! Tu solicitud fue registrada. Entrando a la Demo...`, 'success');

    // Register lead in Supabase asynchronously in background
    if (isSupabaseConfigured && supabase) {
      console.log("Supabase CRM: Registering B2B sales lead...", name);
      supabase.from('leads').insert([{ 
        name, 
        studio, 
        email
      }]).then(({ error }) => {
        if (error) console.error("Supabase CRM lead error:", error);
      }).catch(err => {
        console.error("Supabase CRM lead exception:", err);
      });
    }
    
    // Redirigir a la demo después de 1.5s
    setTimeout(() => {
      window.location.hash = '#/demo';
    }, 1500);
  });
}
