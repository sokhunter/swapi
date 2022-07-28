import { connection } from "../conection/mysql.js";

const savePlanet = function(data){
    return new Promise(function(resolve, reject){
        const sql = `insert into planetas (nombre, periodo_rotacion, periodo_orbita, diametro, clima, gravedad, terreno, superficie_agua, poblacion, url, f_creacion, f_edicion) 
        values('${data.nombre}', '${data.periodo_rotacion}', '${data.periodo_orbita}', '${data.diametro}', '${data.clima}', '${data.gravedad}', '${data.terreno}', '${data.superficie_agua}', '${data.poblacion}', '${data.url}', '${data.f_creacion}', '${data.f_edicion}')`;
        connection.query(sql, 
            function(err, result){   
                if(err) throw err;
                data.id = result.insertId;
                resolve(data);
            }
        )}
  )}

export default savePlanet;