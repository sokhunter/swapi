import app from '../src/app/index.js';
import request from 'supertest';

describe('swapi planets data - GET/get-planet-from-swapi/:id ', () => {
    describe('given an invalid id', () => {
        test('should respond with a 400 status code', async () => {
            const response = await request(app).get(`/get-planet-from-swapi/stringID`);
            expect(response.statusCode).toBe(400);
        });
    })
    describe('given a valid id', () => {
        test('should respond with a 200 status code', async () => {
            const response = await request(app).get('/get-planet-from-swapi/1').send();
            expect(response.statusCode).toBe(200);
        });

        test('should respond with an array', async () => {
            const response = await request(app).get('/get-planet-from-swapi/1').send();
            expect(response.body).toBeInstanceOf(Object);
        });
    })
})

describe('database planets data - GET/get-planet-from-database', () => {
    test('should respond with a 200 status code', async () => {
        const response = await request(app).get('/get-planet-from-database').send();
        expect(response.statusCode).toBe(200);
    });

    test('should respond with an array', async () => {
        const response = await request(app).get('/get-planet-from-database').send();
        expect(response.body).toBeInstanceOf(Array);
    });
})

describe('save spesific item from swapi planet data - GET/save-planet-awapi-data/:id', () => {
    describe('given a valid id', () => {
        test('should respond with a 200 status code', async () => {
            const response = await request(app).get('/save-planet-awapi-data/1').send();
            expect(response.statusCode).toBe(200);
        });  
    })

    describe('given an invalid id', () => {
        test('should respond with a 400 status code', async () => {
            const response = await request(app).get(`/save-planet-awapi-data/stringID`);
            expect(response.statusCode).toBe(400);
        });
    })
})

describe('save a planet data - POST/save-planet-to-database', () => {
    describe('given all the fields', () => {
        const newPlanet = {
            nombre: "Tierra",
            diametro: "12742",
            periodo_rotacion: "34",
            periodo_orbita: "365",
            clima: "temperate",
            gravedad: "1",
            terreno: "grasslands, mountains",
            superficie_agua: "70",
            poblacion: "7753000",
            url: "https://es.wikipedia.org/wiki/Tierra"
        }
        test('should respond with a 200 status code', async () => {
            const response = await request(app).post('/save-planet-to-database').send(newPlanet);
            expect(response.statusCode).toBe(200);
        });
    
        test('should have a content-type: application/json in header', async () => {
            const response = await request(app).post('/save-planet-to-database').send(newPlanet);
            expect(response.header['content-type']).toEqual(
                expect.stringContaining("json")
            )
        });
    
        test('should respond with an planet ID', async () => {
            const response = await request(app).post('/save-planet-to-database').send(newPlanet);
            expect(response.body.id).toBeDefined();
        });
    })

    describe('when a name is missing', () => {
        test('should respond with a 400 status code', async () => {
            const fields = [
                {},
                {nombre: ''},
                {url: 'https://es.wikipedia.org/wiki/Tierra'},
                {
                    nombre: '',
                    periodo_rotacion: "34",
                    periodo_orbita: "365",
                    diametro: "12742",
                    clima: "temperate",
                    gravedad: "1",
                    terreno: "grasslands, mountains",
                    superficie_agua: "70",
                    poblacion: "7753000",
                    url: "https://es.wikipedia.org/wiki/Tierra"
                },
            ]
            for (const field of fields) {
                const response = await request(app).post('/save-planet-to-database').send(field);
                expect(response.statusCode).toBe(400);
            }
        });
    })
})

