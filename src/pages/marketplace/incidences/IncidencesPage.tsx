import { Users, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import MyIncidencesPage from "./MyIncidencesPage";
import PendingIncidencesPage from "./PendingIncidencesPage";
import { useIncidenceStats } from "@/hooks/useIncidenceStats";

export default function IncidencesPage() {
  const { stats, loading, error } = useIncidenceStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Incidencias
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Administra y revisa las incidencias reportadas en el marketplace
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Incidences Card */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                TOTAL
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-1">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-16 rounded"></div>
                ) : (
                  (stats?.total ?? 0)
                )}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Incidencias registradas
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* In Review Card */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                EN REVISIÓN
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-1">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-16 rounded"></div>
                ) : (
                  (stats?.under_review ?? 0)
                )}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Siendo evaluadas
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Appealed Card */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                APELADAS
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-1">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-16 rounded"></div>
                ) : (
                  (stats?.appealed ?? 0)
                )}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En proceso de apelación
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <AlertCircle className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Resolved Card */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                RESUELTAS
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-1">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-16 rounded"></div>
                ) : (
                  (stats?.resolved ?? 0)
                )}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Procesadas
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
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
