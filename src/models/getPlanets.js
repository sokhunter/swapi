import { connection } from "../conection/mysql.js";

const getPlanets = function(){
    return new Promise(function(resolve, reject){
      connection.query(
          "select * from planetas", 
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              }else{
                  resolve(rows);
              }
          }
      )}
  )}

export default getPlanets;