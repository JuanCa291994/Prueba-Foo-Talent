// pages/api/usuarios/index.js
import { getUsuarios, crearUsuario } from '../api/services/usuariosService';  // Llama al servicio para la lógica de negocio

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const usuarios = await getUsuarios();  // Obtiene todos los usuarios
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  } else if (req.method === 'POST') {
    try {
      const nuevoUsuario = await crearUsuario(req.body);  // Crea un nuevo usuario
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });  // Maneja otros métodos HTTP
  }
}
