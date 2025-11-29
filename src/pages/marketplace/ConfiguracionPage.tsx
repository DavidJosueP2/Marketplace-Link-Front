import { Settings, Bell, Shield, Globe, Mail, Database } from "lucide-react";

/**
 * ConfiguracionPage - Página de configuración del sistema
 */
const ConfiguracionPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona la configuración del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Settings
                className="text-blue-600 dark:text-blue-400"
                size={20}
              />
            </div>
            <h2 className="text-xl font-semibold">Configuración General</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ajusta los parámetros básicos del marketplace
          </p>
          <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 rounded-lg transition-colors">
            Configurar
          </button>
        </div>

        {/* Notificaciones */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Bell
                className="text-purple-600 dark:text-purple-400"
                size={20}
              />
            </div>
            <h2 className="text-xl font-semibold">Notificaciones</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Gestiona las notificaciones del sistema
          </p>
          <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 rounded-lg transition-colors">
            Configurar
          </button>
        </div>

        {/* Seguridad */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <Shield className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <h2 className="text-xl font-semibold">Seguridad</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Configura las políticas de seguridad
          </p>
          <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 rounded-lg transition-colors">
            Configurar
          </button>
        </div>

        {/* Internacionalización */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Globe className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <h2 className="text-xl font-semibold">Idioma y Región</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Configura idioma, moneda y zona horaria
          </p>
          <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 rounded-lg transition-colors">
            Configurar
          </button>
        </div>

        {/* Correo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Mail
                className="text-yellow-600 dark:text-yellow-400"
                size={20}
              />
            </div>
            <h2 className="text-xl font-semibold">Correo Electrónico</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Configura el servidor de correo SMTP
          </p>
          <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 rounded-lg transition-colors">
            Configurar
          </button>
        </div>

        {/* Base de Datos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
              <Database
                className="text-indigo-600 dark:text-indigo-400"
                size={20}
              />
            </div>
            <h2 className="text-xl font-semibold">Base de Datos</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Gestiona backups y mantenimiento
          </p>
          <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 rounded-lg transition-colors">
            Configurar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionPage;
