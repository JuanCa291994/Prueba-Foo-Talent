import {
  actualizarUsuario,
  eliminarUsuario,
} from "../services/usuariosService";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID del usuario es requerido" });
  }

  try {
    if (req.method === "PUT") {
      // Actualiza un usuario por su ID
      const nuevosDatos = req.body;
      const usuarioActualizado = await actualizarUsuario(
        parseInt(id, 10),
        nuevosDatos
      );
      if (!usuarioActualizado) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res.status(200).json(usuarioActualizado);
    }

    if (req.method === "DELETE") {
      // Elimina un usuario por su ID
      const resultado = await eliminarUsuario(parseInt(id, 10));
      if (!resultado) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res
        .status(200)
        .json({ message: "Usuario eliminado correctamente" });
    }

    // Manejo de métodos no permitidos
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res
      .status(405)
      .json({ message: `Método ${req.method} no permitido` });
  } catch (error) {
    console.error(`Error manejando el usuario con ID ${id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
