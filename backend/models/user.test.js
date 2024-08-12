'use strict';

const bcrypt = require('bcrypt');
const db = require('../db');
const User = require('./user');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('authenticate', function () {
  test('successfully logs in user', async function () {
    const user = await User.authenticate('u1', 'password1');
    expect(user).toEqual({
      username: 'u1',
      firstName: 'Mickey',
      lastName: 'Mouse',
      email: 'mickey_mouse@yahoo.com',
      isAdmin: true,
      phoneNumber: '123-456-7890',
      profilePicture: null
    });
  });

  test('unauth if no such user', async function () {
    try {
      await User.authenticate('nope', 'password');
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test('unauth if wrong password', async function () {
    try {
      await User.authenticate('u1', 'wrong');
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

describe('register', function () {
  const newUser = {
    username: 'new',
    firstName: 'Test',
    lastName: 'Tester',
    email: 'test@test.com',
    isAdmin: false,
    phoneNumber: '000-000-0000',
    profilePicture: null
  };

  test('successfully registers user', async function () {
    let user = await User.register({
      ...newUser,
      password: 'password',
    });
    expect(user).toEqual({...newUser});

    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith('$2b$')).toEqual(true); // Check if password is hashed
  });

  test('bad request with duplicate data', async function () {
    try {
      await User.register({
        ...newUser,
        password: 'password',
      });
      await User.register({
        ...newUser,
        password: 'password',
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe('findAll', function () {
  test('works: no filter', async function () {
    const users = await User.findAll();
    expect(users).toEqual([
        {
            username: 'u3',
            firstName: 'Peach',
            lastName: 'Toadstool',
            email: 'peach@gmail.com',
            isAdmin: false,
            phoneNumber: '123-456-7890',
            profilePicture: null,
            rating: '5.00',
            numRatings: 1,
          },
      {
        username: 'u1',
        firstName: 'Mickey',
        lastName: 'Mouse',
        email: 'mickey_mouse@yahoo.com',
        isAdmin: true,
        phoneNumber: '123-456-7890',
        profilePicture: null,
        rating: '4.50',
        numRatings: 2,
      },
      {
        username: 'u2',
        firstName: 'Bowser',
        lastName: 'Koopa',
        email: 'bowser@gmail.com',
        isAdmin: false,
        phoneNumber: '987-654-3210',
        profilePicture: null,
        rating: '3.50',
        numRatings: 2,
      },
    ]);
  });

  test('works: filter by username', async function () {
    const users = await User.findAll({ username: 'u1' });
    expect(users).toEqual([
      {
        username: 'u1',
        firstName: 'Mickey',
        lastName: 'Mouse',
        email: 'mickey_mouse@yahoo.com',
        isAdmin: true,
        phoneNumber: '123-456-7890',
        profilePicture: null,
        rating: '4.50',
        numRatings: 2,
      },
    ]);
  });

  test('works: filter by rating', async function () {
    const users = await User.findAll({ rating: 4 });
    expect(users).toEqual([
        {
            username: 'u3',
            firstName: 'Peach',
            lastName: 'Toadstool',
            email: 'peach@gmail.com',
            isAdmin: false,
            phoneNumber: '123-456-7890',
            profilePicture: null,
            rating: '5.00',
            numRatings: 1,
          },
      {
        username: 'u1',
        firstName: 'Mickey',
        lastName: 'Mouse',
        email: 'mickey_mouse@yahoo.com',
        isAdmin: true,
        phoneNumber: '123-456-7890',
        profilePicture: null,
        rating: '4.50',
        numRatings: 2,
      },
    ]);
  });
});

describe('get', function () {
  test('works', async function () {
    const user = await User.get('u1');
    expect(user).toEqual({
      username: 'u1',
      firstName: 'Mickey',
      lastName: 'Mouse',
      email: 'mickey_mouse@yahoo.com',
      isAdmin: true,
      phoneNumber: '123-456-7890',
      profilePicture: null,
      posts: [],
      transactions: [],
    });
  });

  test('not found if no such user', async function () {
    try {
      await User.get('nope');
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe('update', function () {
  const updateData = {
    firstName: 'NewF',
    lastName: 'NewL',
    email: 'new@mail.com',
    phoneNumber: '000-000-0000',
    profilePicture: '/images/new-pic.png',
  };

  test('successfully updates user', async function () {
    const user = await User.update('u1', updateData);
    expect(user).toEqual({
      username: 'u1',
      ...updateData,
    });
  });

  test('not found if no such user', async function () {
    try {
      await User.update('nope', {
        firstName: 'test',
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe('remove', function () {
  test('successfully removes user', async function () {
    await User.remove('u1');
    const res = await db.query("SELECT * FROM users WHERE username='u1'");
    expect(res.rows.length).toEqual(0);
  });

  test('not found if no such user', async function () {
    try {
      await User.remove('nope');
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe('addRating', function () {
  test('successfully calculates new rating', async function () {
    const updatedUser = await User.addRating('u2', 4);
    expect(updatedUser).toEqual({
      username: 'u2',
      rating: '3.67',
      numRatings: 3,
    });
  });

  test('not found if no such user', async function () {
    try {
      await User.addRating('nope', 4);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
