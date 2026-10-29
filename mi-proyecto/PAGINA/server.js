const express = require('express');
const path = require('path');
const connection = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname,"PAGINA")));

app.post('/guardar-envio', (req, res) => {
    const { nombre, direccion, numero } = req.body;

    const query = 'INSERT INTO envios (nombre, direccion, numero) VALUES (?, ?, ?)';
    
    connection.query(query, [nombre, direccion, numero], (err, result) => {
        if (err) {
            console.error('Error al insertar datos:', err);
            return res.status(500).send('Error al guardar la información.');
        }
        console.log('Envío registrado con éxito ID:', result.insertId);
        res.send('¡Datos registrados correctamente!');
        
    });
});

app.listen(PORT, () => {
    console.log("Servidor ejecutándose en http://localhost:${PORT}");
})