// src/__tests__/eventController.test.js
const request = require('supertest');
const { Event } = require('../models');
const app = require('../app');

jest.setTimeout(10000); // Increase timeout to 10 seconds

describe('GET /events', () => {
  beforeAll(async () => {
    // Ensure database connection is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Setup test data
    await Event.bulkCreate([
      { title: 'Event 1', description: 'Test event 1' },
      { title: 'Event 2', description: 'Test event 2' },
    ]);
  }, 10000); // 10 second timeout

  afterAll(async () => {
    // Clean up test data
    await Event.destroy({ where: {} });
    
    // Close database connection
    const sequelize = require('../config/database');
    await sequelize.close();
    
    // Close any open database connections
    await app.close();
  });

  it('should return all events', async () => {
    const response = await request(app).get('/events');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('events');
    expect(response.body.events.length).toBe(2);
  });
});

describe('POST /events', () => {
  it('should create a new event', async () => {
    const token = 'your_token_here'; // Replace with a valid token
    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Event',
        description: 'Test event description',
        location: 'Test Location',
        address: '123 Test St',
        date: '2025-12-31T23:59:59Z',
        category: 'Test Category',
        price: 10,
        capacity: 100,
        imageUrl: 'https://example.com/image.jpg',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.event).toHaveProperty('id');
    expect(res.body.data.event.title).toEqual('New Event');
  });
});

describe('GET /events/:id', () => {
  it('should get an event by ID', async () => {
    const event = await Event.create({
      title: 'Test Event',
      description: 'Test event description',
      organizerId: 1,
    });
    const res = await request(app).get(`/events/${event.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.event.id).toEqual(event.id);
  });

  it('should return 404 if event not found', async () => {
    const res = await request(app).get('/events/9999');
    expect(res.statusCode).toEqual(404);
  });
});

describe('PUT /events/:id', () => {
  it('should update an event', async () => {
    const token = 'your_token_here'; // Replace with a valid token
    const event = await Event.create({
      title: 'Test Event',
      description: 'Test event description',
      organizerId: 1,
    });
    const res = await request(app)
      .put(`/events/${event.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Event' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.event.title).toEqual('Updated Event');
  });

  it('should return 403 if user is not the organizer', async () => {
    const token = 'your_token_here'; // Replace with a valid token
    const event = await Event.create({
      title: 'Test Event',
      description: 'Test event description',
      organizerId: 2,
    });
    const res = await request(app)
      .put(`/events/${event.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Event' });
    expect(res.statusCode).toEqual(403);
  });
});

describe('DELETE /events/:id', () => {
  it('should delete an event', async () => {
    const token = 'your_token_here'; // Replace with a valid token
    const event = await Event.create({
      title: 'Test Event',
      description: 'Test event description',
      organizerId: 1,
    });
    const res = await request(app)
      .delete(`/events/${event.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    const deletedEvent = await Event.findByPk(event.id);
    expect(deletedEvent).toBeNull();
  });

  it('should return 403 if user is not the organizer', async () => {
    const token = 'your_token_here'; // Replace with a valid token
    const event = await Event.create({
      title: 'Test Event',
      description: 'Test event description',
      organizerId: 2,
    });
    const res = await request(app)
      .delete(`/events/${event.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(403);
  });
});

describe('GET /events/nearby', () => {
  it('should search for nearby events', async () => {
    const res = await request(app).get('/events/nearby?lat=37.7749&lon=-122.4194');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('events');
  });
});
