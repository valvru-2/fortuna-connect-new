import React, { useState, useEffect } from "react";
import {
  Table2,
  Kanban,
  Search,
  RefreshCw,
  Briefcase,
  Users,
  Building2,
  FileText,
  X,
  FileDown,
  LogOut,
  Save,
  Trash2,
  Plus,
  Check,
  AlertCircle
} from "lucide-react";

type TableType = "applications" | "applicants" | "jobs" | "inquiries";
type ViewMode = "table" | "kanban";

const APPLICATION_STATUSES = [
  { value: "recibido", label: "Recibido", color: "bg-slate-700/60 text-slate-200 border-slate-600" },
  { value: "en_revision", label: "En Revisión", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { value: "entrevista", label: "Entrevista", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { value: "oferta", label: "Oferta", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { value: "descartado", label: "Descartado", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
];

const INQUIRY_STATUSES = [
  { value: "nueva", label: "Nueva", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
  { value: "contactado", label: "Contactado", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { value: "en_reunion", label: "En Reunión", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { value: "cerrado", label: "Cerrado", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { value: "descartado", label: "Descartado", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
];

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("fc_admin_token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("fc_admin_token"));
  const [loginError, setLoginError] = useState("");

  const [currentTable, setCurrentTable] = useState<TableType>("applications");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ totalApplications: 0, totalJobs: 0, totalInquiries: 0, inReview: 0 });

  const [showCreateJob, setShowCreateJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", department: "", location: "Remoto", description: "" });

  const fetchData = async () => {
    setLoading(true);
    setLoginError("");
    try {
      const [resData, resMetrics] = await Promise.all([
        fetch(`/api/admin/${currentTable}`, {
          headers: { "x-admin-token": token },
        }),
        fetch("/api/admin/metrics", {
          headers: { "x-admin-token": token },
        }),
      ]);

      if (resData.status === 401 || resMetrics.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem("fc_admin_token");
        setLoginError("Token incorrecto o no autorizado.");
        setLoading(false);
        return;
      }

      const json = await resData.json();
      const mJson = await resMetrics.json();
      setData(Array.isArray(json) ? json : []);
      setMetrics(mJson);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      setSelectedRecord(null);
    }
  }, [currentTable, isAuthenticated]);

  // Sincronizar formulario editable cada vez que se selecciona una fila
  useEffect(() => {
    if (selectedRecord) {
      setEditForm({ ...selectedRecord });
      setSaveSuccess(false);
    }
  }, [selectedRecord]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setLoginError("Debes ingresar el token de acceso.");
      return;
    }
    localStorage.setItem("fc_admin_token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("fc_admin_token");
    setIsAuthenticated(false);
    setData([]);
    setSelectedRecord(null);
  };

  // Guardar cambios del formulario en la base de datos
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/admin/${currentTable}/${editForm.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Error al guardar en el servidor");

      setData((prev) =>
        prev.map((item) => (item.id === editForm.id ? { ...item, ...editForm } : item))
      );
      setSelectedRecord({ ...editForm });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      fetchData();
    } catch (err: any) {
      alert(err.message || "No se pudo actualizar el registro");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro permanentemente?")) return;
    try {
      const res = await fetch(`/api/admin/${currentTable}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== id));
        setSelectedRecord(null);
        fetchData();
      }
    } catch (err) {
      console.error("Error al eliminar registro:", err);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(newJob),
      });
      if (res.ok) {
        setShowCreateJob(false);
        setNewJob({ title: "", department: "", location: "Remoto", description: "" });
        fetchData();
      }
    } catch (err) {
      console.error("Error al crear vacante:", err);
    }
  };

  const filteredData = data.filter((item) => {
    const q = search.toLowerCase();
    return Object.values(item).some(
      (val) => val && String(val).toLowerCase().includes(q)
    );
  });

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white p-4">
        <div className="p-8 border border-slate-800 rounded-xl bg-slate-900 w-full max-w-sm shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-xl shadow-indigo-500/20 shadow-lg">
              F
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">Fortuna Admin</h2>
          <p className="text-slate-400 text-xs text-center mb-6">
            Ingresa tu clave maestra configurada en <code className="text-indigo-400 font-mono">.env</code>
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Clave de administrador"
              className="w-full mb-4 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 focus:outline-none"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            {loginError && (
              <p className="text-rose-400 text-xs mb-4 flex items-center gap-1.5">
                <AlertCircle size={14} /> {loginError}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-colors"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-950 text-slate-200">
      {/* 1. Header */}
      <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-indigo-500/20 shadow-md">
            F
          </div>
          <span className="font-semibold tracking-tight text-white text-base">Fortuna Admin</span>
          <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400 font-medium border border-indigo-500/20">
            Control Operativo
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
          <div>Postulaciones: <strong className="text-white">{metrics.totalApplications}</strong></div>
          <div>En Proceso: <strong className="text-amber-400">{metrics.inReview}</strong></div>
          <div>Leads B2B: <strong className="text-cyan-400">{metrics.totalInquiries}</strong></div>
          <div>Vacantes: <strong className="text-emerald-400">{metrics.totalJobs}</strong></div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Sincronizar
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/20 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Salir
          </button>
        </div>
      </header>

      {/* 2. Pestañas */}
      <div className="flex h-10 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
        <div className="flex items-center gap-1">
          {[
            { id: "applications", label: "Postulaciones", icon: FileText },
            { id: "applicants", label: "Candidatos", icon: Users },
            { id: "jobs", label: "Vacantes", icon: Briefcase },
            { id: "inquiries", label: "Consultas B2B", icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTable === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTable(tab.id as TableType)}
                className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? "border-indigo-500 bg-slate-800/60 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400">
                  {currentTable === tab.id ? data.length : ""}
                </span>
              </button>
            );
          })}
        </div>

        {currentTable === "jobs" && (
          <button
            onClick={() => setShowCreateJob(true)}
            className="flex items-center gap-1 rounded bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-sm"
          >
            <Plus size={14} /> Nueva Vacante
          </button>
        )}
      </div>

      {/* 3. Filtros */}
      <div className="flex h-12 items-center justify-between border-b border-slate-800/80 bg-slate-950/60 px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Buscar en ${currentTable}...`}
              className="h-8 w-64 rounded-md border border-slate-800 bg-slate-900 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex rounded-md border border-slate-800 bg-slate-900 p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs transition ${
                viewMode === "table" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Table2 className="h-3.5 w-3.5" /> Tabla
            </button>
            {(currentTable === "applications" || currentTable === "inquiries") && (
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs transition ${
                  viewMode === "kanban" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Kanban className="h-3.5 w-3.5" /> Pipeline
              </button>
            )}
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          {filteredData.length} registros (Haz clic para editar)
        </span>
      </div>

      {/* 4. Tablas y Kanban */}
      <div className="relative flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto bg-slate-950">
          {viewMode === "table" ? (
            <div className="min-w-full">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 text-slate-400 backdrop-blur">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">#</th>
                    {currentTable === "applications" && (
                      <>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Candidato</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Rol / Vacante</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Estado</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">CV</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Fecha</th>
                      </>
                    )}
                    {currentTable === "applicants" && (
                      <>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Nombre</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Email</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">LinkedIn</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Registrado</th>
                      </>
                    )}
                    {currentTable === "jobs" && (
                      <>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Título</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Departamento</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Ubicación</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Fecha</th>
                      </>
                    )}
                    {currentTable === "inquiries" && (
                      <>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Empresa</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Contacto</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Servicio</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Vacantes</th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Estado</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredData.map((row, idx) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedRecord(row)}
                      className={`cursor-pointer transition-colors hover:bg-slate-900/60 ${
                        selectedRecord?.id === row.id ? "bg-slate-900/90" : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 text-slate-500 font-mono">{idx + 1}</td>

                      {currentTable === "applications" && (
                        <>
                          <td className="py-2.5 px-3 font-medium text-slate-200">
                            <div>{row.firstName ? `${row.firstName} ${row.lastName || ""}` : row.email}</div>
                            <div className="text-[11px] text-slate-500">{row.email}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">
                            {row.jobTitle || row.roleApplied || "General"}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`rounded border px-2 py-0.5 text-[11px] font-medium ${
                                APPLICATION_STATUSES.find((s) => s.value === row.status)?.color
                              }`}
                            >
                              {APPLICATION_STATUSES.find((s) => s.value === row.status)?.label || row.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            {row.resumeUrl ? (
                              <a
                                href={row.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline"
                              >
                                <FileDown className="h-3.5 w-3.5" /> CV
                              </a>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </td>
                        </>
                      )}

                      {currentTable === "applicants" && (
                        <>
                          <td className="py-2.5 px-3 font-medium text-slate-200">
                            {row.firstName ? `${row.firstName} ${row.lastName || ""}` : "Sin nombre"}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">{row.email || "—"}</td>
                          <td className="py-2.5 px-3 text-slate-400">{row.linkedinId ? "LinkedIn" : "Manual"}</td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </td>
                        </>
                      )}

                      {currentTable === "jobs" && (
                        <>
                          <td className="py-2.5 px-3 font-medium text-slate-200">{row.title}</td>
                          <td className="py-2.5 px-3 text-slate-300">{row.department || "—"}</td>
                          <td className="py-2.5 px-3 text-slate-400">{row.location || "Remoto"}</td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </td>
                        </>
                      )}

                      {currentTable === "inquiries" && (
                        <>
                          <td className="py-2.5 px-3 font-semibold text-white">{row.company}</td>
                          <td className="py-2.5 px-3 text-slate-300">
                            <div>{row.contact}</div>
                            <div className="text-[11px] text-slate-500">{row.email}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">{row.service}</td>
                          <td className="py-2.5 px-3 text-slate-300">{row.vacancies}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`rounded border px-2 py-0.5 text-[11px] font-medium ${
                                INQUIRY_STATUSES.find((s) => s.value === row.status)?.color
                              }`}
                            >
                              {INQUIRY_STATUSES.find((s) => s.value === row.status)?.label || row.status}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-full gap-4 overflow-x-auto p-4">
              {(currentTable === "applications" ? APPLICATION_STATUSES : INQUIRY_STATUSES).map((col) => {
                const colItems = filteredData.filter((item) => item.status === col.value);
                return (
                  <div
                    key={col.value}
                    className="flex w-72 flex-shrink-0 flex-col rounded-lg border border-slate-800 bg-slate-900/50 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${col.color}`}>
                        {col.label}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{colItems.length}</span>
                    </div>

                    <div className="flex-1 space-y-2.5 overflow-y-auto">
                      {colItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedRecord(item)}
                          className="cursor-pointer rounded-md border border-slate-800 bg-slate-900 p-3 transition hover:border-slate-700 hover:bg-slate-800/60 shadow-sm"
                        >
                          <div className="font-medium text-slate-100 text-sm">
                            {item.firstName ? `${item.firstName} ${item.lastName || ""}` : item.company || item.email}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {item.jobTitle || item.roleApplied || item.service}
                          </div>
                          <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center">
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            {item.resumeUrl && <FileDown className="h-3.5 w-3.5 text-indigo-400" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* 5. Panel Lateral con inputs 100% editables */}
        {selectedRecord && (
          <aside className="w-[420px] border-l border-slate-800 bg-slate-900/95 p-5 shadow-2xl overflow-y-auto backdrop-blur flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-semibold text-white text-base">Modificar Datos</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {saveSuccess && (
                <div className="my-3 flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-400 font-medium">
                  <Check size={14} /> ¡Datos actualizados en PostgreSQL correctamente!
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="mt-5 space-y-3.5 text-xs">
                {/* 1. Postulaciones */}
                {currentTable === "applications" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-medium">Nombre</label>
                        <input
                          type="text"
                          value={editForm.firstName || ""}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-300 font-medium">Apellido</label>
                        <input
                          type="text"
                          value={editForm.lastName || ""}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Email del Candidato</label>
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Puesto o Rol Aplicado</label>
                      <input
                        type="text"
                        value={editForm.roleApplied || ""}
                        onChange={(e) => setEditForm({ ...editForm, roleApplied: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Estado del Proceso</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Notas / Carta de Presentación</label>
                      <textarea
                        rows={4}
                        value={editForm.coverLetter || ""}
                        onChange={(e) => setEditForm({ ...editForm, coverLetter: e.target.value })}
                        placeholder="Comentarios de entrevista, expectativas salariales..."
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none resize-none"
                      />
                    </div>

                    {editForm.resumeUrl && (
                      <div className="pt-2">
                        <a
                          href={editForm.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 hover:underline"
                        >
                          <FileDown size={15} /> Ver archivo adjunto (CV en Storage)
                        </a>
                      </div>
                    )}
                  </>
                )}

                {/* 2. Candidatos */}
                {currentTable === "applicants" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Nombre</label>
                      <input
                        type="text"
                        value={editForm.firstName || ""}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Apellido</label>
                      <input
                        type="text"
                        value={editForm.lastName || ""}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Correo Electrónico</label>
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* 3. Vacantes */}
                {currentTable === "jobs" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Título del Puesto</label>
                      <input
                        type="text"
                        value={editForm.title || ""}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Departamento / Especialidad</label>
                      <input
                        type="text"
                        value={editForm.department || ""}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Ubicación</label>
                      <input
                        type="text"
                        value={editForm.location || ""}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Descripción y Requisitos</label>
                      <textarea
                        rows={6}
                        value={editForm.description || ""}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none resize-none"
                      />
                    </div>
                  </>
                )}

                {/* 4. Consultas B2B */}
                {currentTable === "inquiries" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Empresa</label>
                      <input
                        type="text"
                        value={editForm.company || ""}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Contacto</label>
                      <input
                        type="text"
                        value={editForm.contact || ""}
                        onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Email Corporativo</label>
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-medium">Servicio</label>
                        <input
                          type="text"
                          value={editForm.service || ""}
                          onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}
                          className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-300 font-medium">Vacantes</label>
                        <input
                          type="number"
                          min="1"
                          value={editForm.vacancies || 1}
                          onChange={(e) => setEditForm({ ...editForm, vacancies: parseInt(e.target.value, 10) || 1 })}
                          className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Estado Comercial</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                      >
                        {INQUIRY_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Notas de Seguimiento Comercial</label>
                      <textarea
                        rows={4}
                        value={editForm.notes || ""}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        placeholder="Reunión agendada para el lunes, perfiles requeridos..."
                        className="w-full rounded bg-slate-950 p-2 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none resize-none"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
                  >
                    <Save size={15} /> {isSaving ? "Guardando..." : "Guardar Cambios"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteRecord(editForm.id)}
                    className="flex items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20 transition"
                    title="Eliminar este registro"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </form>
            </div>
          </aside>
        )}
      </div>

      {/* Modal para Crear Nueva Vacante */}
      {showCreateJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Crear Nueva Vacante</h3>
              <button
                onClick={() => setShowCreateJob(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Título de la posición</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Senior Data Engineer"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full rounded bg-slate-950 p-2.5 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Departamento / Especialidad</label>
                <input
                  type="text"
                  placeholder="Ej: Tecnología, Finanzas, Producto"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                  className="w-full rounded bg-slate-950 p-2.5 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Ubicación</label>
                <input
                  type="text"
                  placeholder="Ej: Remoto, Madrid, Híbrido"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="w-full rounded bg-slate-950 p-2.5 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Descripción y Requisitos</label>
                <textarea
                  rows={4}
                  placeholder="Detalles sobre el rol..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full rounded bg-slate-950 p-2.5 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateJob(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 transition"
                >
                  Guardar Vacante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}