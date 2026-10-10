// Back-end/server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
    credentials: true
}));
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'nova_db',
    password: 'Ricordova23',
    port: 5432,
});

// Probar conexión
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL:', err.message);
        return;
    }
    console.log('✅ Conectado a PostgreSQL correctamente');
    release();
});

// ✅ TODAS LAS RUTAS CON /api
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true,
        message: 'Backend funcionando 🚀',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/auth/register', async (req, res) => {
    console.log('📝 Datos recibidos:', req.body);
    const { nombre, email, password } = req.body;
    
    try {
        const result = await pool.query(
            `INSERT INTO users (name, email, password, created_at) 
             VALUES ($1, $2, $3, NOW()) 
             RETURNING id, name, email, created_at`,
            [nombre, email, password]
        );
        
        res.json({ 
            success: true, 
            message: 'Usuario registrado exitosamente',
            token: 'token_' + Date.now(),
            user: result.rows[0]
        });
    } catch (err) {
        console.error('❌ Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
        
        res.json({ 
            success: true, 
            message: 'Login exitoso',
            token: 'token_' + Date.now(),
            user: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, created_at FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Servidor en http://localhost:${PORT}`);
    console.log(`📌 Endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/api/test`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   GET  http://localhost:${PORT}/api/usuarios`);
});