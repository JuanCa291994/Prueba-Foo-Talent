"use client";
import { useState, useEffect } from "react";

export default function GestionUsuarios() {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    telefono: "",
    correo: "",
  });
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Usuario seleccionado para editar o eliminar
  const [modalAbierto, setModalAbierto] = useState(false); // Control del modal de creación/edición
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false); // Modal de confirmación para eliminar
  const [esEdicion, setEsEdicion] = useState(false); // Controla si es edición o creación

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const respuesta = await fetch("/api/usuarios");
        if (!respuesta.ok) throw new Error("Error al obtener los usuarios");
        const datos = await respuesta.json();
        console.log({ datos });
        setUsuarios(datos); // Solo actualizamos el estado cuando los datos están listos
      } catch (error) {
        console.error(error);
        alert("Error al cargar los usuarios");
      }
    };
    cargarUsuarios();
  }, []); // Este useEffect solo se ejecuta una vez cuando el componente se monta

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    console.log("Entró un cambio", { name, value }); // Recibí el valor del input
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const metodo = esEdicion ? "PUT" : "POST";
      const url = esEdicion
        ? `/api/usuarios/${usuarioSeleccionado.id}`
        : "/api/usuarios";

      const respuesta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosFormulario),
      });

      if (!respuesta.ok) throw new Error("Error en la solicitud");

      const datos = await respuesta.json();

      // Actualización del estado de forma segura, fuera del renderizado.
      if (esEdicion) {
        setUsuarios((prev) =>
          prev.map((usuario) =>
            usuario.id === usuarioSeleccionado.id ? datos : usuario
          )
        );
      } else {
        // Aquí agregamos el nuevo usuario al estado inmediatamente
        setUsuarios((prev) => [...prev, datos]);
      }

      setModalAbierto(false);
      setDatosFormulario({
        nombre: "",
        apellido: "",
        edad: "",
        telefono: "",
        correo: "",
      });
      setUsuarioSeleccionado(null);
      setEsEdicion(false);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar el usuario");
    }
  };

  const manejarEliminacion = async () => {
    try {
      const respuesta = await fetch(`/api/usuarios/${usuarioSeleccionado.id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) throw new Error("Error eliminando el usuario");

      setUsuarios((prev) =>
        prev.filter((usuario) => usuario.id !== usuarioSeleccionado.id)
      );
      setModalEliminarAbierto(false);
      setUsuarioSeleccionado(null);
    } catch (error) {
      console.error(error);
      alert("Error eliminando el usuario");
    }
  };

  const abrirModalEdicion = (usuario) => {
    setDatosFormulario(usuario); // Cargamos los datos del usuario en el formulario
    setUsuarioSeleccionado(usuario);
    setEsEdicion(true);
    setModalAbierto(true); // Abrimos el modal en modo edición
  };

  const abrirModalEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminarAbierto(true);
  };

  return (
    <div className="p-6">
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4"
        onClick={() => {
          setModalAbierto(true);
          setEsEdicion(false);
          setDatosFormulario({
            nombre: "",
            apellido: "",
            edad: "",
            telefono: "",
            correo: "",
          }); // Limpiamos los datos para crear un nuevo usuario
        }}
      >
        Crear Usuario
      </button>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Apellido</th>
              <th className="px-4 py-2 border">Edad</th>
              <th className="px-4 py-2 border">Teléfono</th>
              <th className="px-4 py-2 border">Correo</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className="bg-gray-800 hover:bg-gray-600">
                  <td className="px-4 py-2 border">{usuario.nombre}</td>
                  <td className="px-4 py-2 border">{usuario.apellido}</td>
                  <td className="px-4 py-2 border">{usuario.edad}</td>
                  <td className="px-4 py-2 border">{usuario.telefono}</td>
                  <td className="px-4 py-2 border">{usuario.correo}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="text-blue-400 hover:underline mr-2"
                      onClick={() => abrirModalEdicion(usuario)} // Al hacer clic, cargamos los datos del usuario al modal
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => abrirModalEliminar(usuario)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 border text-center">
                  No hay usuarios disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Crear/Editar */}
      {modalAbierto && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 p-4">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full sm:w-[400px] md:w-[500px]">
            <h2 className="text-lg font-bold mb-4">
              {esEdicion ? "Editar Usuario" : "Crear Usuario"}
            </h2>
            <form
              onSubmit={manejarEnvio}
              className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full sm:w-[400px] md:w-[500px]"
            >
              <input
                type="text"
                name="nombre"
                value={datosFormulario.nombre}
                onChange={manejarCambio}
                className="bg-gray-700 text-white border rounded-lg p-2 w-full"
                placeholder="Nombre"
                required
              />
              <input
                type="text"
                name="apellido"
                value={datosFormulario.apellido}
                onChange={manejarCambio}
                className="bg-gray-700 text-white border rounded-lg p-2 w-full mt-4"
                placeholder="Apellido"
                required
              />
              <input
                type="number"
                name="edad"
                value={datosFormulario.edad}
                onChange={manejarCambio}
                className="bg-gray-700 text-white border rounded-lg p-2 w-full mt-4"
                placeholder="Edad"
                required
              />
              <input
                type="tel"
                name="telefono"
                value={datosFormulario.telefono}
                onChange={manejarCambio}
                className="bg-gray-700 text-white border rounded-lg p-2 w-full mt-4"
                placeholder="Teléfono"
                required
              />
              <input
                type="email"
                name="correo"
                value={datosFormulario.correo}
                onChange={manejarCambio}
                className="bg-gray-700 text-white border rounded-lg p-2 w-full mt-4"
                placeholder="Correo electrónico"
                required
              />
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="text-gray-500"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                  {esEdicion ? "Guardar cambios" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de eliminación */}
      {modalEliminarAbierto && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 p-4">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">
              ¿Estás seguro de eliminar este usuario?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white rounded-lg px-4 py-2"
                onClick={() => setModalEliminarAbierto(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white rounded-lg px-4 py-2"
                onClick={manejarEliminacion}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

