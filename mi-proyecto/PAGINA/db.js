const mysql = require('mysql2');

// Configura la conexión a tu base de datos
const connection = mysql.createConnection({
  host: 'localhost',      // O la dirección IP de tu servidor
  user: 'root',           // Tu usuario de MySQL
  password: 'root',           // Tu contraseña de MySQL
  database: 'Arepas' // El nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('¡Conexión exitosa a la base de datos MySQL!');
});

module.exports = connection;