import {
  TrendingUp,
  ShoppingBag,
  AlertCircle,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

const DashboardView = ({
  totalProductos = 0,
  totalIncidencias = 0,
  totalUsuarios = 0,
  incidenciasPendientes = 0,
}) => {
  const stats = [
    {
      title: "Productos",
      value: totalProductos,
      icon: ShoppingBag,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Incidencias",
      value: totalIncidencias,
      icon: AlertCircle,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      trend: totalIncidencias > 5 ? "+8%" : "-3%",
      trendUp: totalIncidencias > 5,
    },
    {
      title: "Usuarios",
      value: totalUsuarios,
      icon: Users,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Pendientes",
      value: incidenciasPendientes,
      icon: Clock,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      trend: incidenciasPendientes > 2 ? "⚠️" : "✓",
      trendUp: incidenciasPendientes <= 2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido de vuelta. Aquí está tu resumen de actividad.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span
                  className={`text-sm font-semibold ${
                    stat.trendUp
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {stat.trend}
                </span>
              </div>

              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-lg hover:shadow-md transition-all text-left group">
            <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Crear Producto
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Agregar nuevo producto
            </p>
          </button>

          <button className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/40 rounded-lg hover:shadow-md transition-all text-left group">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Ver Incidencias
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Revisar reportes
            </p>
          </button>

          <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 rounded-lg hover:shadow-md transition-all text-left group">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Usuarios
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Gestionar usuarios
            </p>
          </button>

          <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 rounded-lg hover:shadow-md transition-all text-left group">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Reportes
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Ver análisis
            </p>
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Actividad Reciente
            </h3>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Los últimos productos agregados han tenido excelente recepción con
            más de 150 visualizaciones.
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/40 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pendientes
            </h3>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Tienes {incidenciasPendientes} incidencias pendientes de revisión.
            Revísalas pronto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
