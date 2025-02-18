import request from 'supertest';
import app from '../src/index.js';
import User from '../src/models/user.model.js';
import { connectDB, closeDB } from '../src/config/db.js';

describe('Auth API', () => {
  beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await closeDB();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
          department: 'IT',
          role: 'employee'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
    });

    it('should return 400 for invalid registration data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid',
          password: '123'
        });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
    });
  });
});
