import mysql from 'mysql';

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'retoTata'
});

// Check connection
connection.connect(error => {
    if(error) throw error;
    console.log(`Database connection`);
})

// MySQL Table planets
// nombre: "Tierra",
// periodo_rotacion: "34",
// periodo_orbita: "365",
// diametro: "12742",
// clima: "temperate",
// gravedad: "1",
// terreno: "grasslands, mountains",
// superficie_agua: "70",
// poblacion: "7753000",
// url: "https://es.wikipedia.org/wiki/Tierra"

export {connection}