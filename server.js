const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Para generar IDs únicos

const app = express();
app.use(express.json());
app.use(cookieParser());

const DB_MEMORIA = {};


app.use((req, res, next) => {
    if (!req.cookies.usuario_id) {
        res.cookie('usuario_id', Math.random().toString(36).substring(7), { maxAge: 900000, httpOnly: true });
    }
    next();
});

app.get('/api/alumnos', (req, res) => {
    const id = req.cookies.usuario_id;
    const misAlumnos = DB_MEMORIA[id] || [];
    res.json(misAlumnos);
});

app.post('/api/alumnos', (req, res) => {
    const id = req.cookies.usuario_id;
    if (!DB_MEMORIA[id]) DB_MEMORIA[id] = [];
    
    DB_MEMORIA[id].push(req.body);
    res.status(201).send();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor corriendo en http://localhost:3000');
    console.log('Accesible desde otras IPs en el puerto 3000');
});