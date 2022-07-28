import express, { application } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";
import {fileURLToPath} from "url";
import getPlanets from "../models/getPlanets.js";
import savePlanet from "../models/savePlanet.js";
import getPlanetAPI from "./swapiApi.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Node MySQL API with swapi",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:3000",
            }
        ]
    },
    apis: [`${path.join(__dirname, "./*.js")}`],
}
const app = express();

// middlewares
app.use(express.json());
app.use("/documentation", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

// routes
app.get("/", (req, res) => {
    res.send("API");
});

/**
 * @swagger
 * components:
 *  schemas:
 *    Planeta:
 *        type: object
 *        properties:
 *          nombre:
 *            type: string
 *            description: Nombre del planeta
 *          diametro:
 *            type: string
 *            description: Diametro del planeta en kilometros
 *          periodo_rotacion:
 *            type: string
 *            description: Cantidad de horas que le toma al planeta rotar sobre su eje
 *          periodo_orbita:
 *            type: string
 *            description: Cantidad de días que le toma al planeta rotar al rededor de su estrella local
 *          clima:
 *            type: string
 *            description: El clima del planeta separado por comas de tener mas de uno
 *          gravedad:
 *            type: string
 *            description: Un número que indica la gravedad del planeta, donde "1" es normal o 1 G estándar. "2" es dos veces o 2 G estándar. "0,5" es la mitad o 0,5 G estándar.
 *          terreno:
 *            type: string
 *            description: El terreno del planeta separado por comas de tener mas de uno
 *          superficie_agua:
 *            type: string
 *            description: Porcentaje del planeta que esta cubierta de agua
 *          poblacion:
 *            type: string
 *            description: Poblacion de seres concientes que habitan el planeta
 *          url:
 *            type: string
 *            description: La URL del recurso
 *          created:
 *            type: string
 *            description: La fecha y hora en que se creó el recurso en formato ISO 8601
 *          edited:
 *            type: string
 *            description: La fecha y hora de la ultima modificación del recurso en formato ISO 8601
 *        required:
 *          - nombre
 *        example:
 *          nombre: Tierra
 *          diametro: 12742
 *          periodo_rotacion: 34
 *          periodo_orbita: 365
 *          clima: temperate
 *          gravedad: 1
 *          terreno: grasslands, mountains
 *          superficie_agua: 70
 *          poblacion: 7753000
 *          url: https://es.wikipedia.org/wiki/Tierra
 */


/**
 * @swagger
 * /get-planet-from-swapi/{id}:
 *   get:
 *     summary: Obtener un registro de planeta de swapi
 *     tag: [Planeta]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id del planeta de swapi
 *     responses:
 *       200:
 *         description: El planeta con el ID indicado de swapi 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Planeta'
 *       400: 
 *         description: El ID debe ser un número
 */
app.get("/get-planet-from-swapi/:id", (req, res) => {
    let id = parseInt(req.params.id);
    if(isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número"});
    
    getPlanetAPI(req.params.id)
        .then(response => {
            res.json(response);
        }
    );
});

/**
 * @swagger
 * /save-planet-awapi-data/{id}:
 *   get:
 *     summary: Obtener un registro de planeta de swapi y guardarlo en la base de datos
 *     tag: [Planeta]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id del planeta de swapi
 *     responses:
 *       200:
 *         description: Se guardó el planeta obtenido de swapi 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Planeta'
 *       400: 
 *         description: El ID debe ser un número
 */
app.get("/save-planet-awapi-data/:id", (req, res) => {
    let id = parseInt(req.params.id);
    if(isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número"});
    
    getPlanetAPI(req.params.id)
        .then(response => {
            savePlanet(response)
            .then(rps => {
                res.json(rps);
            })

        }
    );
})

/**
 * @swagger
 * /get-planet-from-database:
 *   get:
 *     summary: Obtener un registro de planeta de awapi
 *     tag: [Planeta]
 *     responses:
 *       200:
 *         description: Todos los planetas de la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Planeta'
 */
app.get("/get-planet-from-database/", (req, res) => {
    getPlanets()
    .then(response => {
        res.json(response);
    });
})

/**
 * @swagger
 * /save-planet-to-database:
 *   post:
 *     summary: Crea un nuevo planeta
 *     tag: [Planeta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Planeta'
 *     responses:
 *       200:
 *         description: Nuevo planeta creado
 *       400:
 *         description: El campo nombre es requerido
 */
app.post("/save-planet-to-database/", (req, res) => {
    if(!req.body.hasOwnProperty('nombre')) return res.status(400).json({ error: "El campo nombre es requerido"});
    if(req.body.nombre == '') return res.status(400).json({ error: "El campo nombre es requerido"});
    
    req.body.f_creacion = new Date().toISOString();
    req.body.f_edicion = new Date().toISOString();
    savePlanet(req.body)
    .then(response => {
        res.json(response);
    })
})

export default app;