/* -------------------------------------------------------------
   VMP Studio Contable - Mock Database & Supabase Adapter
   ------------------------------------------------------------- */
import { supabase, isSupabaseConfigured } from './supabase.js';

const DEFAULT_COMPANIES = [
  {
    id: "co-1",
    razon_social: "Transportes Patagónicos S.A.",
    cuit: "30-58472910-9",
    condicion_iva: "Responsable Inscripto",
    tipo: "SRL",
    actividad: "Servicios de Logística y Distribución",
    inicio_actividades: "2018-03-10",
    color: "#0d9488"
  },
  {
    id: "co-2",
    razon_social: "TecnoDesarrollos Sur",
    cuit: "20-35849201-4",
    condicion_iva: "Monotributo - Cat H",
    tipo: "Unipersonal",
    actividad: "Desarrollo de Software y Consultoría",
    inicio_actividades: "2021-06-01",
    color: "#6366f1"
  },
  {
    id: "co-3",
    razon_social: "Alimentos del Valle S.R.L.",
    cuit: "30-71938495-2",
    condicion_iva: "Responsable Inscripto",
    tipo: "SRL",
    actividad: "Venta Mayorista de Alimentos",
    inicio_actividades: "2015-11-15",
    color: "#10b981"
  }
];

const DEFAULT_TRANSACTIONS = {
  "co-1": {
    ventas: [
      { id: "v-1", fecha: "2026-05-20", cliente: "Cervecería Austral", cuit: "30-77443322-9", tipo_comprobante: "Factura A", numero: "0003-00000845", neto: 250000, iva: 52500, total: 302500 },
      { id: "v-2", fecha: "2026-05-18", cliente: "Distribuidora del Neuquén", cuit: "30-55998877-1", tipo_comprobante: "Factura A", numero: "0003-00000846", neto: 480000, iva: 100800, total: 580800 },
      { id: "v-3", fecha: "2026-05-15", cliente: "Consumidor Final", cuit: "00-00000000-0", tipo_comprobante: "Factura B", numero: "0003-00000102", neto: 45000, iva: 9450, total: 54450 }
    ],
    compras: [
      { id: "c-1", fecha: "2026-05-22", proveedor: "Combustibles YPF", cuit: "30-50001234-9", tipo_comprobante: "Factura A", numero: "4820-00239481", neto: 180000, iva: 37800, total: 217800, es_activo: false, categoria: "Combustibles" },
      { id: "c-2", fecha: "2026-05-14", proveedor: "Repuestos Comahue", cuit: "30-61928374-2", tipo_comprobante: "Factura A", numero: "0002-00001294", neto: 95000, iva: 19950, total: 114950, es_activo: false, categoria: "Mantenimiento" }
    ]
  },
  "co-2": {
    ventas: [
      { id: "v-4", fecha: "2026-05-24", cliente: "Sinergia Group LLC", cuit: "00-00000000-0", tipo_comprobante: "Factura E (Export.)", numero: "0001-00000012", neto: 1200000, iva: 0, total: 1200000 },
      { id: "v-5", fecha: "2026-05-10", cliente: "Empresa Local S.A.", cuit: "30-11223344-5", tipo_comprobante: "Factura C", numero: "0001-00000045", neto: 350000, iva: 0, total: 350000 }
    ],
    compras: [
      { id: "c-3", fecha: "2026-05-19", proveedor: "Servicios Cloud AWS", cuit: "30-88998899-2", tipo_comprobante: "Factura B", numero: "0934-09827361", neto: 85000, iva: 17850, total: 102850, es_activo: false, categoria: "Tecnología" }
    ]
  },
  "co-3": {
    ventas: [
      { id: "v-6", fecha: "2026-05-25", cliente: "Supermercados Todo", cuit: "30-44556677-2", tipo_comprobante: "Factura A", numero: "0001-00004829", neto: 890000, iva: 186900, total: 1076900 },
      { id: "v-7", fecha: "2026-05-22", cliente: "Despensa El Sol", cuit: "20-22119988-3", tipo_comprobante: "Factura B", numero: "0001-00002194", neto: 120000, iva: 25200, total: 145200 }
    ],
    compras: [
      { id: "c-4", fecha: "2026-05-18", proveedor: "Molinos Rio de la Plata", cuit: "30-50000543-1", tipo_comprobante: "Factura A", numero: "0104-00092834", neto: 540000, iva: 113400, total: 653400, es_activo: false, categoria: "Materia Prima" }
    ]
  }
};

export function initMockDB() {
  if (!localStorage.getItem("vmp_studio_companies")) {
    localStorage.setItem("vmp_studio_companies", JSON.stringify(DEFAULT_COMPANIES));
  }
  if (!localStorage.getItem("vmp_studio_transactions")) {
    localStorage.setItem("vmp_studio_transactions", JSON.stringify(DEFAULT_TRANSACTIONS));
  }
  if (!localStorage.getItem("vmp_studio_active_co")) {
    localStorage.setItem("vmp_studio_active_co", "co-1");
  }

  // If Supabase is active, trigger background offline-first pull
  if (isSupabaseConfigured) {
    pullFromSupabase();
  }
}

// Background pull function to sync local state with Supabase cloud database
async function pullFromSupabase() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // No logged in user

    console.log("Background Sync: Pulling fresh data from Supabase for studio:", user.id);

    // 1. Pull companies
    const { data: dbCompanies, error: coError } = await supabase
      .from('empresas')
      .select('*')
      .eq('estudio_id', user.id);

    if (coError) throw coError;

    if (dbCompanies && dbCompanies.length > 0) {
      localStorage.setItem("vmp_studio_companies", JSON.stringify(dbCompanies));
      
      // 2. Pull transactions for these companies
      const coIds = dbCompanies.map(c => c.id);
      const { data: dbTxs, error: txError } = await supabase
        .from('transacciones')
        .select('*')
        .in('empresa_id', coIds);

      if (txError) throw txError;

      // Group transactions by company ID
      const transactionsMap = {};
      coIds.forEach(id => {
        transactionsMap[id] = { ventas: [], compras: [] };
      });

      if (dbTxs) {
        dbTxs.forEach(t => {
          const typeKey = t.tipo; // 'ventas' or 'compras'
          if (transactionsMap[t.empresa_id]) {
            transactionsMap[t.empresa_id][typeKey].push({
              id: t.id,
              fecha: t.fecha,
              tipo_comprobante: t.tipo_comprobante,
              numero: t.numero,
              proveedor: t.proveedor,
              cliente: t.cliente,
              cuit: t.cuit,
              neto: Number(t.neto),
              iva: Number(t.iva),
              total: Number(t.total),
              es_activo: t.es_activo,
              categoria: t.categoria
            });
          }
        });
      }

      localStorage.setItem("vmp_studio_transactions", JSON.stringify(transactionsMap));
      console.log("Background Sync completed successfully!");
    }
  } catch (err) {
    console.error("Supabase pull sync error:", err);
  }
}

// -------------------------------------------------------------
// CRUD Operations with Background Supabase Sinks
// -------------------------------------------------------------
export function getCompanies() {
  initMockDB();
  return JSON.parse(localStorage.getItem("vmp_studio_companies"));
}

export function saveCompany(company) {
  const cos = getCompanies();
  let isNew = false;
  
  if (company.id) {
    const idx = cos.findIndex(c => c.id === company.id);
    if (idx !== -1) cos[idx] = company;
  } else {
    isNew = true;
    company.id = "co-" + Date.now();
    cos.push(company);
    
    // Initialize empty transactions map locally
    const txs = JSON.parse(localStorage.getItem("vmp_studio_transactions")) || {};
    txs[company.id] = { ventas: [], compras: [] };
    localStorage.setItem("vmp_studio_transactions", JSON.stringify(txs));
  }
  
  localStorage.setItem("vmp_studio_companies", JSON.stringify(cos));

  // Push to Supabase asynchronously in background
  if (isSupabaseConfigured) {
    pushCompanyToSupabase(company, isNew);
  }

  return company;
}

async function pushCompanyToSupabase(company, isNew) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const studioId = user ? user.id : '00000000-0000-0000-0000-000000000000'; // Fallback uuid for anonymous sessions

    const payload = {
      id: company.id,
      estudio_id: studioId,
      razon_social: company.razon_social,
      cuit: company.cuit,
      tipo: company.tipo,
      condicion_iva: company.condicion_iva,
      actividad: company.actividad || '',
      inicio_actividades: company.inicio_actividades,
      color: company.color,
      delegation_active: company.delegation_active || false
    };

    console.log("Background Sync: Pushing company to Supabase:", company.id);
    const { error } = await supabase.from('empresas').upsert(payload);
    if (error) throw error;
  } catch (err) {
    console.error("Supabase push company error:", err);
  }
}

export function getActiveCompanyId() {
  initMockDB();
  return localStorage.getItem("vmp_studio_active_co");
}

export function getActiveCompany() {
  const id = getActiveCompanyId();
  const cos = getCompanies();
  return cos.find(c => c.id === id) || cos[0];
}

export function setActiveCompanyId(id) {
  localStorage.setItem("vmp_studio_active_co", id);
}

export function getTransactions(companyId) {
  initMockDB();
  const txs = JSON.parse(localStorage.getItem("vmp_studio_transactions"));
  return txs[companyId] || { ventas: [], compras: [] };
}

export function addTransaction(companyId, type, item) {
  const txs = JSON.parse(localStorage.getItem("vmp_studio_transactions"));
  if (!txs[companyId]) txs[companyId] = { ventas: [], compras: [] };
  
  item.id = (type === "ventas" ? "v-" : "c-") + Date.now();
  txs[companyId][type].unshift(item);
  localStorage.setItem("vmp_studio_transactions", JSON.stringify(txs));

  // Push to Supabase asynchronously in background
  if (isSupabaseConfigured) {
    pushTransactionToSupabase(companyId, type, item);
  }

  return item;
}

async function pushTransactionToSupabase(companyId, type, item) {
  try {
    const payload = {
      id: item.id,
      empresa_id: companyId,
      tipo: type, // 'ventas' or 'compras'
      fecha: item.fecha,
      tipo_comprobante: item.tipo_comprobante,
      numero: item.numero,
      proveedor: item.proveedor || null,
      cliente: item.cliente || null,
      cuit: item.cuit,
      neto: item.neto,
      iva: item.iva,
      total: item.total,
      es_activo: item.es_activo || false,
      categoria: item.categoria || 'General'
    };

    console.log("Background Sync: Pushing transaction to Supabase:", item.id);
    const { error } = await supabase.from('transacciones').insert(payload);
    if (error) throw error;
  } catch (err) {
    console.error("Supabase push transaction error:", err);
  }
}
