import { Redis } from '@upstash/redis';

// Validamos que las variables de entorno necesarias estén presentes
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.error("❌ Falta configurar las variables de entorno UPSTASH_REDIS_REST_URL o UPSTASH_REDIS_REST_TOKEN");
  throw new Error("Configuración de Redis no válida");
}

// Inicializamos el cliente de Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Opcional: Logs de configuración (desactiva estos logs en producción)
if (process.env.NODE_ENV !== 'production') {
  console.log("🔗 Redis conectado con URL:", process.env.UPSTASH_REDIS_REST_URL);
}

export default redis;
