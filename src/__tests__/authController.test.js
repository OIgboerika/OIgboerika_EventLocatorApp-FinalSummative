const request = require('supertest');
const { User } = require('../models');
const app = require('../app');

jest.setTimeout(10000); // Increase timeout to 10 seconds

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Ensure database connection is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    // Clean up test data
    await User.destroy({ where: {} });
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Test User');
    });
  });

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      // First, register a user
      await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      // Then, login
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });
  });
});
