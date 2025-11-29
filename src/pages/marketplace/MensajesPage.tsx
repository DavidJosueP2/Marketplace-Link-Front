import { useState, useMemo } from "react";
import {
  MessageCircle,
  Search,
  Send,
  User,
  Clock,
  CheckCheck,
} from "lucide-react";

const MensajesPage = ({
  conversaciones = [],
  mensajes = [],
  currentUser,
  onSelectConversacion,
  onSendMensaje,
  selectedConversacionId,
  isLoading = false,
}) => {
  const [mensaje, setMensaje] = useState("");
  const [searchConversacion, setSearchConversacion] = useState("");

  // Filtrar conversaciones
  const conversacionesFiltradas = useMemo(() => {
    if (!searchConversacion) return conversaciones;
    return conversaciones.filter((conv) =>
      conv.nombre.toLowerCase().includes(searchConversacion.toLowerCase()),
    );
  }, [conversaciones, searchConversacion]);

  // Obtener mensajes de la conversación seleccionada
  const mensajesActuales = useMemo(() => {
    if (!selectedConversacionId) return [];
    return mensajes.filter((m) => m.conversacionId === selectedConversacionId);
  }, [mensajes, selectedConversacionId]);

  // Conversación seleccionada
  const conversacionSeleccionada = conversaciones.find(
    (c) => c.id === selectedConversacionId,
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (mensaje.trim() && selectedConversacionId) {
      onSendMensaje({
        conversacionId: selectedConversacionId,
        mensaje: mensaje.trim(),
        remitenteId: currentUser.id,
        timestamp: new Date().toISOString(),
      });
      setMensaje("");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse">
        <div className="h-full flex">
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="mb-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex-1 p-4">
            <div className="h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-blue-500" />
          Mensajes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comunícate con compradores y vendedores
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden h-[calc(100vh-16rem)]">
        <div className="flex h-full">
          {/* Lista de Conversaciones */}
          <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar conversación..."
                  value={searchConversacion}
                  onChange={(e) => setSearchConversacion(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto">
              {conversacionesFiltradas.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchConversacion
                      ? "No se encontraron conversaciones"
                      : "No tienes conversaciones"}
                  </p>
                </div>
              ) : (
                conversacionesFiltradas.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => onSelectConversacion(conv.id)}
                    className={`w-full p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                      selectedConversacionId === conv.id
                        ? "bg-blue-50 dark:bg-gray-700"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {conv.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold truncate">
                            {conv.nombre}
                          </h3>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatTime(conv.ultimoMensaje.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex items-center gap-1">
                          {conv.ultimoMensaje.leido && (
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          )}
                          {conv.ultimoMensaje.texto}
                        </p>
                      </div>
                      {conv.noLeidos > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.noLeidos}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Área de Chat */}
          <div className="flex-1 flex flex-col">
            {!selectedConversacionId ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Selecciona una conversación para comenzar
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Header del Chat */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {conversacionSeleccionada?.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold">
                      {conversacionSeleccionada?.nombre}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {conversacionSeleccionada?.activo
                        ? "En línea"
                        : "Desconectado"}
                    </p>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mensajesActuales.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        No hay mensajes aún. ¡Envía el primero!
                      </p>
                    </div>
                  ) : (
                    mensajesActuales.map((msg) => {
                      const isMine = msg.remitenteId === currentUser.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md ${isMine ? "order-2" : "order-1"}`}
                          >
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                isMine
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                              }`}
                            >
                              <p>{msg.texto}</p>
                            </div>
                            <div
                              className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                                isMine ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span>{formatTime(msg.timestamp)}</span>
                              {isMine && msg.leido && (
                                <CheckCheck className="w-3 h-3 text-blue-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input de Mensaje */}
                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    />
                    <button
                      type="submit"
                      disabled={!mensaje.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Enviar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MensajesPage;
