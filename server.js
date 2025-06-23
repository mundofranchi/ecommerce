// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Importa las clases del SDK 2.x
const { MercadoPagoConfig, Preference } = require('mercadopago');

// 1) Inicializa el cliente con tu access token
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 10000 }
});

// 2) Instancia el servicio de preferencias
const preferenceService = new Preference(client);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.post('/create_preference', async (req, res) => {
  console.log('Payload recibido:', req.body);
  try {
    const { items } = req.body;
    const pref = {
      items,
      back_urls: {
        success: `https://www.youtube.com/watch?v=ID-iJOw9rLo`,
        pending: `https://www.youtube.com/watch?v=ID-iJOw9rLo`,
        failure: `https://www.youtube.com/watch?v=ID-iJOw9rLo`
      },
      auto_return: 'approved'
    };
const response = await preferenceService.create({ body: pref });

if (!response || !response.id) {
  console.error('❌ Error: Preferencia no creada correctamente:', response);
  return res.status(500).json({ error: 'No se pudo crear la preferencia de pago', data: response });
}

console.log('Preferencia creada OK, id =', response.id);
res.json({
  id: response.id,
  init_point: response.init_point
});

  } catch (err) {
    console.error('🚨 Error en create_preference:', err);
    // Mandamos el mensaje completo al front para debug
    res.status(500).json({ error: err.toString(), stack: err.stack });
  }
});

// 4) Levanta el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
