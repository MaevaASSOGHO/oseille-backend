const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

describe('Auth API', () => {
  beforeAll(async () => {
    // Créer un utilisateur de test
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('testpassword', 10),
      is_verified: true
    });
  });

  afterAll(async () => {
    // Nettoyer la base de données
    await User.destroy({ where: {} });
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
  });
});