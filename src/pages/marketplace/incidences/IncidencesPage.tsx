import { Users, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import MyIncidencesPage from "./MyIncidencesPage";
import PendingIncidencesPage from "./PendingIncidencesPage";
import { useIncidenceStats } from "@/hooks/useIncidenceStats";

export default function IncidencesPage() {
  const { stats, loading, error } = useIncidenceStats();

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      {/* Header */}
      <div className="bg-card p-6 rounded-lg shadow border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              Gestión de Incidencias
            </h1>
            <p className="text-muted-foreground">
              Administra y revisa las incidencias reportadas en el marketplace
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Incidences Card */}
        <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total
              </p>
              <p className="text-3xl font-bold mt-2">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-12 rounded"></div>
                ) : (
                  (stats?.total ?? 0)
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Incidencias registradas
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 p-4 rounded-xl">
              <AlertTriangle className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* In Review Card */}
        <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                En Revisión
              </p>
              <p className="text-3xl font-bold mt-2">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-12 rounded"></div>
                ) : (
                  (stats?.under_review ?? 0)
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Siendo evaluadas
              </p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 p-4 rounded-xl">
              <CheckCircle className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Appealed Card */}
        <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Apeladas
              </p>
              <p className="text-3xl font-bold mt-2">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-12 rounded"></div>
                ) : (
                  (stats?.appealed ?? 0)
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                En proceso de apelación
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 p-4 rounded-xl">
              <AlertCircle className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Resolved Card */}
        <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Resueltas
              </p>
              <p className="text-3xl font-bold mt-2">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-12 rounded"></div>
                ) : (
                  (stats?.resolved ?? 0)
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Procesadas</p>
            </div>
            <div className="bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 p-4 rounded-xl">
              <CheckCircle className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Content Sections */}
      <div className="space-y-8">
        <PendingIncidencesPage />
        <MyIncidencesPage />
      </div>
    </div>
  );
}
