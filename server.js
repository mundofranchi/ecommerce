// server.js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
console.log('🔐 MP_ACCESS_TOKEN desde entorno:', process.env.MP_ACCESS_TOKEN?.slice(0, 25) + '...');
app.use(cors({
  origin: 'https://casafranchionline.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(express.json());

// ✅ Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// ✅ Ruta principal (muestra index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🔐 Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 10000 }
});
const preferenceService = new Preference(client);

// ✅ Endpoint para crear preferencia
app.post('/create_preference', async (req, res) => {
  console.log('Payload recibido:', req.body);
  try {
    const { items } = req.body;
    const pref = {
      items,
      back_urls: {
        success: `https://casafranchionline.com/`,
        pending: `https://casafranchionline.com/`,
        failure: `https://casafranchionline.com/`
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
  return res.status(500).json({
    error: err.message || 'Error desconocido',
    detalles: err,
  });
}
});

// 🚀 Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
