import redis from "../services/redisClient";

// Función para obtener los usuarios
export const getUsuarios = async () => {
  try {
    const usuarios = await redis.get("usuarios");
    if (!usuarios && typeof usuarios === "object") {
      console.log("Usuarios no encontrados en Redis");
      // Llegó un valor null
      return [];
    } else if (typeof usuarios === "object") {
      console.log("Usuarios encontrados en Redis como objeto");
      return usuarios;
    } else if (typeof usuarios === "string") {
      console.log("Usuarios encontrados en Redis como cadena");
      return JSON.parse(usuarios); // Parseamos solo si es una cadena válida
    } else {
      throw new Error("El valor obtenido de Redis no es una cadena válida.");
    }
  } catch (error) {
    console.error("Error al obtener usuarios desde Redis:", error);
    throw new Error("No se pudo obtener la lista de usuarios");
  }
};

// Función para crear un nuevo usuario
export const crearUsuario = async (usuario) => {
  try {
    const usuarios = await getUsuarios();
    const nuevoUsuario = { id: Date.now(), ...usuario }; // Genera un ID único
    const actualizados = [...usuarios, nuevoUsuario];

    // Almacenar los usuarios actualizados en Redis
    const returned = await redis.set("usuarios", JSON.stringify(actualizados));
    console.log("Usuarios actualizados en Redis", { returned });
    return nuevoUsuario;
  } catch (error) {
    console.error("Error al crear usuario en Redis:", error);
    throw new Error("No se pudo crear el usuario");
  }
};

// Función para actualizar un usuario existente
export const actualizarUsuario = async (id, nuevosDatos) => {
  try {
    const usuarios = await getUsuarios();
    const indice = usuarios.findIndex((usuario) => usuario.id === id);

    if (indice === -1) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    usuarios[indice] = { ...usuarios[indice], ...nuevosDatos }; // Actualiza el usuario
    const returned = await redis.set("usuarios", JSON.stringify(usuarios));
    console.log("Usuarios actualizados en Redis", { returned });
    return usuarios[indice];
  } catch (error) {
    console.error("Error al actualizar usuario en Redis:", error);
    throw new Error("No se pudo actualizar el usuario");
  }
};

// Función para eliminar un usuario
export const eliminarUsuario = async (id) => {
  try {
    const usuarios = await getUsuarios();
    const actualizados = usuarios.filter((usuario) => usuario.id !== id);

    if (usuarios.length === actualizados.length) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    const returned = await redis.set("usuarios", JSON.stringify(actualizados));
    console.log("Usuarios actualizados en Redis", { returned });
    return { message: `Usuario con ID ${id} eliminado exitosamente` };
  } catch (error) {
    console.error("Error al eliminar usuario en Redis:", error);
    throw new Error("No se pudo eliminar el usuario");
  }
};
