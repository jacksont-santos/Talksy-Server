import request from 'supertest';
import { chatModel } from '../../src/Chat/Entity/Chat';
import { RoomModel } from '../../src/Room/Entity/Room';
import { roomMembersModel } from '../../src/Room/Entity/RoomMembers';
import { signupAndSignin } from '../helpers/auth';
import { clearTestDatabase, connectTestDatabase, disconnectTestDatabase } from '../helpers/mongo-memory';

describe('Room integration', () => {
  let app;

  beforeAll(async () => {
    process.env.SECRET_KEY = 'integration-secret-key';
    await connectTestDatabase();
    const { createApp } = require('../../src/app');
    app = createApp();
  });

  afterEach(async () => {
    await clearTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('should not create private room without password', async () => {
    const { token } = await signupAndSignin(app, {
      username: 'owneruser',
      password: 'secure123',
      nickname: 'ownernick'
    });

    const response = await request(app).post('/room/create').set('Authorization', token).send({
      name: 'Room A',
      maxUsers: 5,
      isPublic: 'false'
    });

    expect(response.status).toBe(400);
    expect(response.body?.message).toBe('Password is required for private rooms');
  });

  it('should return 404 when requesting public room by invalid id', async () => {
    const { token } = await signupAndSignin(app, {
      username: 'owneruser404',
      password: 'secure123',
      nickname: 'ownernick404'
    });

    const response = await request(app).get('/room/id/non-existent-room').set('Authorization', token);
    expect(response.status).toBe(404);
    expect(response.body?.message).toBe('Room not found');
  });

  it('should create and update room as owner', async () => {
    const { token } = await signupAndSignin(app, {
      username: 'owneruser2',
      password: 'secure123',
      nickname: 'ownernick2'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', token).send({
      name: 'Room B',
      maxUsers: 5,
      isPublic: 'true'
    });

    expect(createResponse.status).toBe(201);
    const roomId = createResponse.body?.data?._id;
    expect(roomId).toBeTruthy();

    const updateResponse = await request(app)
      .put(`/room/update/${roomId}`)
      .set('Authorization', token)
      .send({
        name: 'Room B Updated',
        maxUsers: 6,
        isPublic: 'true'
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body?.data?.name).toBe('Room B Updated');
    expect(updateResponse.body?.data?.maxUsers).toBe(6);
  });

  it('should reject room update from non-owner', async () => {
    const owner = await signupAndSignin(app, {
      username: 'owneruser3',
      password: 'secure123',
      nickname: 'ownernick3'
    });

    const anotherUser = await signupAndSignin(app, {
      username: 'guestuser3',
      password: 'secure123',
      nickname: 'guestnick3'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', owner.token).send({
      name: 'Room C',
      maxUsers: 4,
      isPublic: 'true'
    });
    const roomId = createResponse.body?.data?._id;

    const updateResponse = await request(app)
      .put(`/room/update/${roomId}`)
      .set('Authorization', anotherUser.token)
      .send({
        name: 'Hacked Name'
      });

    expect(updateResponse.status).toBe(403);
    expect(updateResponse.body?.message).toBe('Only the room owner can edit the room');
  });

  it('should return 400 when updating room without any editable fields', async () => {
    const owner = await signupAndSignin(app, {
      username: 'owneruser4',
      password: 'secure123',
      nickname: 'ownernick4'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', owner.token).send({
      name: 'Room D',
      maxUsers: 4,
      isPublic: 'true'
    });
    const roomId = createResponse.body?.data?._id;

    const updateResponse = await request(app).put(`/room/update/${roomId}`).set('Authorization', owner.token).send({});
    expect(updateResponse.status).toBe(400);
    expect(updateResponse.body?.message).toBe('Missing required fields');
  });

  it('should require password when changing public room to private', async () => {
    const owner = await signupAndSignin(app, {
      username: 'owneruser5',
      password: 'secure123',
      nickname: 'ownernick5'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', owner.token).send({
      name: 'Room E',
      maxUsers: 4,
      isPublic: 'true'
    });
    const roomId = createResponse.body?.data?._id;

    const updateResponse = await request(app).put(`/room/update/${roomId}`).set('Authorization', owner.token).send({
      isPublic: 'false'
    });
    expect(updateResponse.status).toBe(400);
    expect(updateResponse.body?.message).toBe('Password is required for private rooms');
  });

  it('should return member rooms for authenticated user', async () => {
    const owner = await signupAndSignin(app, {
      username: 'owneruser6',
      password: 'secure123',
      nickname: 'ownernick6'
    });
    const member = await signupAndSignin(app, {
      username: 'memberuser6',
      password: 'secure123',
      nickname: 'membernick6'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', owner.token).send({
      name: 'Room F',
      maxUsers: 4,
      isPublic: 'true'
    });
    const roomId = createResponse.body?.data?._id;

    await roomMembersModel.create({
      _id: `members-${roomId}`,
      ownerId: owner.signinResponse.body?.data?._id,
      roomId,
      users: [member.signinResponse.body?.data?._id]
    });

    const memberRoomsResponse = await request(app).get('/room/member').set('Authorization', member.token);
    expect(memberRoomsResponse.status).toBe(200);
    expect(Array.isArray(memberRoomsResponse.body?.data)).toBe(true);
    expect(memberRoomsResponse.body.data.some((room) => room._id === roomId)).toBe(true);
  });

  it('should return room messages with pagination', async () => {
    const owner = await signupAndSignin(app, {
      username: 'owneruser7',
      password: 'secure123',
      nickname: 'ownernick7'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', owner.token).send({
      name: 'Room G',
      maxUsers: 4,
      isPublic: 'true'
    });
    const roomId = createResponse.body?.data?._id;

    await chatModel.create({
      roomId,
      chat: [
        { id: 'm1', userId: 'u1', nickname: 'n1', content: 'hello-1', createdAt: new Date() },
        { id: 'm2', userId: 'u2', nickname: 'n2', content: 'hello-2', createdAt: new Date() }
      ]
    });

    const response = await request(app)
      .get(`/room/messages/${roomId}?page=1&limit=1`)
      .set('Authorization', owner.token);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body?.data)).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].content).toBe('hello-1');
  });

  it('should return 404 for messages of non-existing room', async () => {
    const owner = await signupAndSignin(app, {
      username: 'owneruser8',
      password: 'secure123',
      nickname: 'ownernick8'
    });

    const response = await request(app)
      .get('/room/messages/non-existing-room?page=1&limit=10')
      .set('Authorization', owner.token);

    expect(response.status).toBe(404);
    expect(response.body?.message).toBe('Room not found');
  });

  it('should enforce password for inconsistent private room update', async () => {
    const owner = await signupAndSignin(app, {
      username: 'owneruser9',
      password: 'secure123',
      nickname: 'ownernick9'
    });
    const ownerId = owner.signinResponse.body?.data?._id;

    const inconsistentRoom = await RoomModel.create({
      ownerId,
      name: 'Room Inconsistent',
      maxUsers: 4,
      public: false,
      active: true
    });

    const response = await request(app)
      .put(`/room/update/${inconsistentRoom._id}`)
      .set('Authorization', owner.token)
      .send({ name: 'Room Inconsistent Updated' });

    expect(response.status).toBe(400);
    expect(response.body?.message).toBe('Password is required for private rooms');
  });

  it('should return private room by id for owner', async () => {
    const owner = await signupAndSignin(app, {
      username: 'ownerprivate1',
      password: 'secure123',
      nickname: 'ownerprivate1'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', owner.token).send({
      name: 'Private Room 1',
      maxUsers: 4,
      isPublic: 'false',
      password: 'room1234'
    });
    const roomId = createResponse.body?.data?._id;

    const response = await request(app).get(`/room/private/id/${roomId}`).set('Authorization', owner.token);
    expect(response.status).toBe(200);
    expect(response.body?.data?._id).toBe(roomId);
  });

  it('should block private room by id for non-owner', async () => {
    const owner = await signupAndSignin(app, {
      username: 'ownerprivate2',
      password: 'secure123',
      nickname: 'ownerprivate2'
    });
    const guest = await signupAndSignin(app, {
      username: 'guestprivate2',
      password: 'secure123',
      nickname: 'guestprivate2'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', owner.token).send({
      name: 'Private Room 2',
      maxUsers: 4,
      isPublic: 'false',
      password: 'room1234'
    });
    const roomId = createResponse.body?.data?._id;

    const response = await request(app).get(`/room/private/id/${roomId}`).set('Authorization', guest.token);
    expect(response.status).toBe(404);
    expect(response.body?.message).toBe('Room not found');
  });

  it('should get invited room with valid invite token', async () => {
    const owner = await signupAndSignin(app, {
      username: 'ownerinvite1',
      password: 'secure123',
      nickname: 'ownerinvite1'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', owner.token).send({
      name: 'Private Invite Room',
      maxUsers: 4,
      isPublic: 'false',
      password: 'room1234'
    });
    const roomId = createResponse.body?.data?._id;
    const ownerId = owner.signinResponse.body?.data?._id;
    const { signJWT } = require('../../src/utils/jwt');
    const inviteToken = signJWT({ _id: ownerId, username: 'ownerinvite1', date: new Date() });

    const response = await request(app)
      .get(`/room/invited/${roomId}/token/${inviteToken}`)
      .set('Authorization', owner.token);

    expect(response.status).toBe(200);
    expect(response.body?.data?._id).toBe(roomId);
  });

  it('should delete room as owner and block second delete', async () => {
    const owner = await signupAndSignin(app, {
      username: 'ownerdelete1',
      password: 'secure123',
      nickname: 'ownerdelete1'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', owner.token).send({
      name: 'Delete Room 1',
      maxUsers: 4,
      isPublic: 'true'
    });
    const roomId = createResponse.body?.data?._id;

    const deleteResponse = await request(app).delete(`/room/delete/${roomId}`).set('Authorization', owner.token);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body?.data?._id).toBe(roomId);

    const secondDeleteResponse = await request(app).delete(`/room/delete/${roomId}`).set('Authorization', owner.token);
    expect(secondDeleteResponse.status).toBe(404);
    expect(secondDeleteResponse.body?.message).toBe('Room not found or you are not the owner');
  });

  it('should block delete room for non-owner', async () => {
    const owner = await signupAndSignin(app, {
      username: 'ownerdelete2',
      password: 'secure123',
      nickname: 'ownerdelete2'
    });
    const guest = await signupAndSignin(app, {
      username: 'guestdelete2',
      password: 'secure123',
      nickname: 'guestdelete2'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', owner.token).send({
      name: 'Delete Room 2',
      maxUsers: 4,
      isPublic: 'true'
    });
    const roomId = createResponse.body?.data?._id;

    const response = await request(app).delete(`/room/delete/${roomId}`).set('Authorization', guest.token);
    expect(response.status).toBe(404);
    expect(response.body?.message).toBe('Room not found or you are not the owner');
  });
});

