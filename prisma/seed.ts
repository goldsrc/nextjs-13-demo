import {PrismaClient} from '@prisma/client';
import {faker} from '@faker-js/faker';
const prisma = new PrismaClient();
function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

type Result = {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: number;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
  login: {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
  };
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  id: {
    name: string;
    value: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
};

type Response = {
  results: Result[];
};

async function getRandomUser() {
  const {
    results: [user],
  }: Response = await fetch('https://randomuser.me/api/').then((res) =>
    res.json(),
  );
  return {
    name: user.name.first + ' ' + user.name.last,
    email: user.email,
    image: user.picture.large,
    age: user.dob.age,
    bio: faker.lorem.paragraphs(3),
  };
}

async function seed() {
  try {
    const userIds: string[] = [];
    // Create 100 users
    for (let i = 0; i < 100; i++) {
      try {
        const user = await prisma.user.create({
          data: await getRandomUser(),
        });
        userIds.push(user.id);
      } catch (error) {
        i--;
      }
    }
    // pick 16 random user ids
    const randomUserIds = Array.from({length: 16}, () => pickRandom(userIds));

    // Create 100 posts
    for (let i = 0; i < 100; i++) {
      await prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          slug: faker.lorem.slug(),
          content: faker.lorem.paragraphs(10),
          authorId: pickRandom(randomUserIds),
          published: true,
        },
      });
    }

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error creating seed data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
