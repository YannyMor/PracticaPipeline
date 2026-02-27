const request = require('supertest')
const app = require('../src/app')
const { calculateValue } = require('../src/logic')

describe('Suite de Pruebas de Calidad de Software', () => {
  describe('Pruebas Unitarias logica de Inventario', () => {
    test(' Calcula correctamente el valor total (10 * 5 = 50)', () => {
      const result = calculateValue(10, 5)
      expect(result).toBe(50)
    })

    test(' 0 si se ingresan valores negativos', () => {
      const result = calculateValue(-10, 5)
      expect(result).toBe(0)
    })

    //  1: stock en 0 debe retorna 0
    test('Retorna 0 si el stock es 0', () => {
      const result = calculateValue(10, 0)
      expect(result).toBe(0)
    })

    // 2: ambos valores negativos retorna 0
    test('Retorna 0 si tanto precio como stock son negativos', () => {
      const result = calculateValue(-5, -3)
      expect(result).toBe(0)
    })
  })

  describe('Pruebas de Integración - API Endpoints', () => {
    test('GET /health - status 200 y JSON correcto', async () => {
      const response = await request(app).get('/health')
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('status', 'OK')
    })

    test('GET /items - valida la estructura del inventario', async () => {
      const response = await request(app).get('/items')
      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body[0]).toHaveProperty('id')
      expect(response.body[0]).toHaveProperty('stock')
    })

    //  3: validar que /items retorna al menos un elemento
    test('GET /items -  retorna al menos un item en el inventario', async () => {
      const response = await request(app).get('/items')
      expect(response.statusCode).toBe(200)
      expect(response.body.length).toBeGreaterThan(0)
    })

    //  4: /items tiene la propiedad name
    test('GET /items - Cada item tiene la propiedad name', async () => {
      const response = await request(app).get('/items')
      expect(response.statusCode).toBe(200)
      response.body.forEach((item) => {
        expect(item).toHaveProperty('name')
      })
    })
  })
})
