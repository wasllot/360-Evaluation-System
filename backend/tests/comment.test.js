import request from 'supertest';
import app from '../src/index.js';
import User from '../src/models/user.model.js';
import Comment from '../src/models/comment.model.js';
import Evaluation from '../src/models/evaluation.model.js';
import { connectDB, closeDB } from '../src/config/db.js';

describe('Comment API', () => {
  let authToken;
  let evaluationId;

  beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
    await Comment.deleteMany({});
    await Evaluation.deleteMany({});

    // Create test user
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      department: 'IT',
      role: 'employee'
    });

    // Create test evaluation
    const evaluation = await Evaluation.create({
      employee: user._id,
      evaluator: user._id,
      status: 'completed'
    });
    evaluationId = evaluation._id;

    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    authToken = res.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Comment.deleteMany({});
    await Evaluation.deleteMany({});
    await closeDB();
  });

  describe('POST /api/evaluations/:evaluationId/comments', () => {
    it('should create a new comment', async () => {
      const res = await request(app)
        .post(`/api/evaluations/${evaluationId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test comment'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('content', 'Test comment');
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post(`/api/evaluations/${evaluationId}/comments`)
        .send({
          content: 'Test comment'
        });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/evaluations/:evaluationId/comments', () => {
    it('should get comments for an evaluation', async () => {
      const res = await request(app)
        .get(`/api/evaluations/${evaluationId}/comments`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
});
