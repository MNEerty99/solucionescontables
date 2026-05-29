/* -------------------------------------------------------------
   Soluciones Contables - Landing Page View Component
   ------------------------------------------------------------- */

export function renderLanding() {
  return `
  <div class="lp-wrapper">
    <!-- Dynamic Slide Backgrounds (Parallax Fixed Slideshow) -->
    <div class="lp-bg-slideshow">
      <div class="lp-bg-slide active" style="background-image: url('/corporate_bg.jpg');"></div>
      <div class="lp-bg-slide" style="background-image: url('/corporate_bg_2.jpg');"></div>
      <div class="lp-bg-slide" style="background-image: url('/corporate_bg_3.jpg');"></div>
      <div class="lp-bg-overlay"></div>
    </div>
    
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
        <button class="lp-menu-toggle" id="lp-menu-toggle-btn" aria-label="Abrir menú">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
        <nav class="lp-menu" id="lp-menu-nav">
          <a href="#features" class="lp-menu-link">Beneficios</a>
          <a href="#pricing" class="lp-menu-link">Inversión</a>
          <a href="#partners" class="lp-menu-link">Partners</a>
          <a href="#contact" class="lp-menu-link">Contacto</a>
          <a href="#/demo" class="btn btn-outline btn-sm">Demo Interactiva</a>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          <span class="badge"><i data-lucide="shield-check" style="width:12px; height:12px;"></i> Infraestructura B2B Multi-Empresa &middot; Desarrollado por VMP</span>
          <h1 class="hero-title">El puente impositivo y contable definitivo para tu <span class="gradient-text">Estudio Contable</span>.</h1>
          <p class="hero-subtitle">Dejá de perseguir carpetas físicas, renegar con capturas borrosas o procesar planillas inconexas. Soluciones Contables centraliza tus empresas cliente, automatiza la liquidación mensual de IVA, genera exportaciones oficiales y provee un portal móvil intuitivo para la carga de comprobantes al instante.</p>
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
          <h2>Ingeniería fiscal y contable adaptada a tu Estudio</h2>
          <p>Optimizá la relación operativa y de recolección de datos con todas tus empresas clientes en un solo canal.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i data-lucide="smartphone"></i>
            </div>
            <h3>Portal de Clientes Simplificado</h3>
            <p>Tus clientes ingresan desde su celular y cargan fotos de tickets o arrastran PDFs de facturas. El portal realiza la pre-lectura y clasifica la información de compras al instante para tu revisión.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i data-lucide="upload-cloud"></i>
            </div>
            <h3>Sincronización y Parser ARCA</h3>
            <p>Cargá archivos Excel/TXT de ARCA (Mis Comprobantes). Nuestro motor interpreta alícuotas, neto y percepciones de cientos de facturas en menos de 10 segundos, eliminando errores de tipeo.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i data-lucide="file-spreadsheet"></i>
            </div>
            <h3>Consolidación de Libro IVA Digital</h3>
            <p>Visualizá tus libros mensuales de compras y ventas consolidados. Generá los archivos de texto delimitados oficiales listos para importar directamente en el portal de ARCA de forma regulada.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Institutional Prestige Section -->
    <section id="prestige" class="prestige-section" style="padding: 100px 0; border-top: 1px solid rgba(226, 232, 240, 0.4); background: transparent; position: relative; overflow: hidden;">
      <div class="container">
        <div class="prestige-grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;">
          
          <!-- Left side: Premium Image Card -->
          <div class="prestige-image-container" style="position: relative; border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.12); border: 1px solid rgba(15, 23, 42, 0.08); transition: var(--transition-normal);">
            <img src="/accounting_firm.png" alt="Estudio Contable de Elite" style="width: 100%; height: auto; display: block; object-fit: cover;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0) 100%); padding: 32px 24px; color: #ffffff;">
              <span style="font-family: var(--font-heading); font-size: 11px; font-weight: 750; color: #34d399; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px;">Socio Tecnológico Impositivo</span>
              <h4 style="font-size: 18px; font-weight: 700; color: #ffffff; margin: 0;">Estudio Contable Comahue</h4>
              <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0 0;">Neuquén, Argentina — Infraestructura en la Nube</p>
            </div>
          </div>
          
          <!-- Right side: Elite Corporate Copy -->
          <div class="prestige-info">
            <span class="badge" style="background: rgba(5, 150, 105, 0.06); color: #047857; border-color: rgba(5, 150, 105, 0.15); font-weight: 700;">PRESTIGIO Y SEGURIDAD LEGAL</span>
            <h2 style="font-size: 34px; font-weight: 800; margin-top: 10px; margin-bottom: 16px; line-height: 1.15; color: var(--color-primary);">Un estándar de excelencia institucional para tu firma</h2>
            <p style="color: var(--text-secondary); margin-bottom: 32px; font-size: 14.5px; line-height: 1.6;">
              Soluciones Contables no es un simple software de planillas; es una infraestructura diseñada para estudios contables que buscan automatizar la operatividad del día a día impositivo y brindar un asesoramiento de altísimo valor a sus empresas clientes.
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="display: flex; gap: 16px;">
                <div class="prestige-icon-bullet" style="background: rgba(5, 150, 105, 0.08); color: var(--color-accent); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i data-lucide="shield-check" style="width: 20px; height: 20px;"></i></div>
                <div>
                  <h4 style="font-size: 15px; font-weight: 700; color: var(--color-primary); margin-bottom: 4px;">Cifrado de Credenciales y Delegación Segura</h4>
                  <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; margin: 0;">Las claves fiscales y certificados de delegación ARCA (ex-AFIP) se resguardan bajo estrictas normas de encriptación para resguardo confidencial.</p>
                </div>
              </div>
              <div style="display: flex; gap: 16px;">
                <div class="prestige-icon-bullet" style="background: rgba(99, 102, 241, 0.08); color: #6366f1; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i data-lucide="check-square" style="width: 20px; height: 20px;"></i></div>
                <div>
                  <h4 style="font-size: 15px; font-weight: 700; color: var(--color-primary); margin-bottom: 4px;">Auditoría Contra Facturación Apócrifa (APOC)</h4>
                  <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; margin: 0;">Validación cruzada de CUITs en bases de datos AFIP APOC, mitigando de forma preventiva riesgos tributarios en los libros de tus clientes.</p>
                </div>
              </div>
              <div style="display: flex; gap: 16px;">
                <div class="prestige-icon-bullet" style="background: rgba(5, 150, 105, 0.08); color: var(--color-accent); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i data-lucide="scale" style="width: 20px; height: 20px;"></i></div>
                <div>
                  <h4 style="font-size: 15px; font-weight: 700; color: var(--color-primary); margin-bottom: 4px;">Cumplimiento Normativo FACPCE y RT 54</h4>
                  <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; margin: 0;">Toda la categorización de rubros, costos e IVA se procesa siguiendo estrictamente la normativa vigente para su fácil volcado en balances oficiales.</p>
                </div>
              </div>
            </div>
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
        <div class="pricing-grid">
          
          <!-- Upfront license -->
          <div class="price-card featured" style="text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="featured-badge">Promoción Especial</div>
              <div class="price-header" style="margin-top: 12px;">
                <h3>Licencia de Adquisición</h3>
                <p>Instalación, configuración y alta de tu estudio.</p>
              </div>

              <!-- Price displaying original and promo -->
              <div class="price-amount" style="margin: 16px 0 24px;">
                <div style="font-size: 13px; color: var(--text-secondary); text-decoration: line-through; margin-bottom: 6px; font-weight: 500; opacity: 0.75;">
                  Original: USD 480
                </div>
                <span class="currency">USD</span>
                <span class="val">380</span>
                <span style="font-size: 10px; font-weight: 800; color: #14b8a6; background: rgba(20,184,166,0.06); padding: 3px 8px; border-radius: 12px; border: 1px solid rgba(20,184,166,0.15); margin-left: 8px; vertical-align: middle; display: inline-block;">
                  ¡Ahorrás USD 100!
                </span>
              </div>

              <ul class="price-features" style="text-align: left; margin-bottom: 24px;">
                <li><i data-lucide="check"></i> Entorno exclusivo en la nube</li>
                <li><i data-lucide="check"></i> Carga y configuración de hasta 100 empresas</li>
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

    <!-- Partners / Affiliate Program Section -->
    <section id="partners" class="partners-section" style="padding: 80px 0; border-top: 1px solid var(--border-color); background: #ffffff;">
      <div class="container">
        <div class="partners-card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(5, 150, 105, 0.03) 100%); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 48px; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center;">
          <div class="partners-info">
            <span class="badge" style="background: rgba(99,102,241,0.08); color: #6366f1; border-color: rgba(99,102,241,0.15); font-weight: 700;">PLAN DE AFILIADOS / SOCIOS COMERCIALES</span>
            <h2 style="font-size: 32px; font-weight: 700; margin-top: 10px; margin-bottom: 12px;">Ganá <span class="gradient-text">USD 80</span> por cada licencia recomendada</h2>
            <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14.5px; line-height: 1.6;">
              ¿Tenés contactos en el sector contable? ¿Sos contador o estudiante y querés generar un ingreso extra? Te invitamos a sumarte a nuestro **Programa de Partners Asociados**. 
              <br><br>
              Por cada Licencia de Adquisición de Soluciones Contables que se venda bajo tu recomendación directa (valor de oferta de la licencia: USD 380), **te quedás con USD 80 de comisión en el acto**, sin topes ni demoras operativas.
            </p>
            
            <!-- Interactive Earnings Calculator -->
            <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; box-shadow: var(--shadow-sm);">
              <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                <i data-lucide="calculator" style="color: #6366f1; width: 18px; height: 18px;"></i>
                Simulador de Comisiones Proyectadas
              </h4>
              
              <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 12.5px; color: var(--text-secondary); font-weight: 600;">Licencias vendidas al mes:</span>
                  <span id="partner-qty-label" style="font-family: var(--font-heading); font-size: 16px; font-weight: 800; color: var(--color-primary); background: var(--bg-secondary); padding: 2px 10px; border-radius: 12px; border: 1px solid var(--border-color);">5</span>
                </div>
                <input type="range" id="partner-slider" min="1" max="30" value="5" style="width: 100%; accent-color: #6366f1; cursor: pointer; height: 6px; border-radius: 3px; background: var(--border-color); -webkit-appearance: none; outline: none;">
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px dashed var(--border-color);">
                <span style="font-size: 13px; font-weight: 700; color: var(--text-secondary);">Tu ganancia en comisiones:</span>
                <div style="text-align: right;">
                  <span style="font-family: var(--font-heading); font-size: 26px; font-weight: 800; color: #10b981; display: block; line-height: 1;">
                    USD <span id="partner-commission-val">400</span>
                  </span>
                  <span style="font-size: 10px; color: var(--text-muted); font-weight: 500;">Comisión inmediata pagada al instante</span>
                </div>
              </div>
            </div>
          </div>

          <div class="partners-form" style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 28px; box-shadow: var(--shadow-sm);">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">Sumarse como Vendedor</h3>
            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 20px;">Registrate y un ejecutivo comercial se contactará para darte de alta como Partner.</p>
            <form id="partner-form">
              <div class="form-group" style="margin-bottom: 14px;">
                <label class="form-label">Nombre Completo</label>
                <input type="text" class="form-input" id="partner-name" placeholder="Tu Nombre y Apellido" required>
              </div>
              <div class="form-group" style="margin-bottom: 14px;">
                <label class="form-label">Teléfono de Contacto (WhatsApp)</label>
                <input type="tel" class="form-input" id="partner-phone" placeholder="+54 9 299 123-4567" required>
              </div>
              <div class="form-group" style="margin-bottom: 20px;">
                <label class="form-label">Email de Contacto</label>
                <input type="email" class="form-input" id="partner-email" placeholder="tuemail@correo.com" required>
              </div>
              <button type="submit" class="btn btn-primary w-full" style="background: #6366f1; border-color: #6366f1; color: white;">
                Postularme y Recibir Kit de Ventas
              </button>
            </form>
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
                <div class="cd-icon" style="color: #25d366; background: rgba(37, 211, 102, 0.05); border: 1px solid rgba(37, 211, 102, 0.15); display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 8px;"><i data-lucide="phone"></i></div>
                <div class="cd-text">
                  <h4>Solicitar Licencia (WhatsApp)</h4>
                  <a href="https://wa.me/5492996731487?text=Hola!%20Me%20interesa%20solicitar%20la%20licencia%20de%20SolucionesContables" target="_blank" style="font-size: 15px; font-weight: 800; color: #25d366; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; margin-top: 2px;">
                    +54 299 673-1487 <span style="font-size: 10px; font-weight: 700; background: rgba(37,211,102,0.08); padding: 2px 8px; border-radius: 12px;">Chat Directo</span>
                  </a>
                </div>
              </div>
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
  // Dynamic Background Slide Toggler
  let currentSlide = 0;
  const slides = document.querySelectorAll('.lp-bg-slide');
  if (slides.length > 0) {
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 7000); // Changes background slide every 7 seconds!
  }

  // Mobile Menu Toggler
  const toggleBtn = document.getElementById('lp-menu-toggle-btn');
  const menuNav = document.getElementById('lp-menu-nav');

  if (toggleBtn && menuNav) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBtn.classList.toggle('active');
      menuNav.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuNav.contains(e.target) && e.target !== toggleBtn) {
        toggleBtn.classList.remove('active');
        menuNav.classList.remove('active');
      }
    });

    // Close menu when clicking on a link
    menuNav.querySelectorAll('.lp-menu-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('active');
        menuNav.classList.remove('active');
      });
    });
  }

  // Partner Calculator slider
  const slider = document.getElementById('partner-slider');
  const qtyLabel = document.getElementById('partner-qty-label');
  const commVal = document.getElementById('partner-commission-val');

  if (slider && qtyLabel && commVal) {
    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      qtyLabel.textContent = val;
      commVal.textContent = val * 80; // USD 80 commission per sale!
    });
  }

  // Partner Lead Form Submission
  document.getElementById('partner-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('partner-name').value;
    const phone = document.getElementById('partner-phone').value;
    const email = document.getElementById('partner-email').value;

    mainApp.showToast(`¡Postulación enviada, ${name}! Nos contactaremos por WhatsApp.`, 'success');

    // Register lead in Supabase in background
    if (isSupabaseConfigured && supabase) {
      console.log("Supabase CRM: Registering Sales Partner lead...", name);
      supabase.from('leads').insert([{ 
        name, 
        studio: `PARTNER VENDEDOR: (${phone})`, 
        email
      }]).then(({ error }) => {
        if (error) console.error("Supabase CRM partner lead error:", error);
      }).catch(err => {
        console.error("Supabase CRM partner lead exception:", err);
      });
    }

    // Reset Form
    document.getElementById('partner-form').reset();
  });

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
