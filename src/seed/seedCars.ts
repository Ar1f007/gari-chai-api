import { faker } from '@faker-js/faker';
import Car from '../modules/car/new-car/model';
import connect from '../utils/connect';

const brandAndModel = [
  {
    brand: {
      id: '6570440a08ec1be714bc4a78',
      name: 'Maruti',
    },
    model: {
      id: '6570447808ec1be714bc4a81',
      name: 'Alto',
    },
  },

  {
    brand: {
      id: '6570442008ec1be714bc4a7c',
      name: 'Hyundai',
    },
    model: {
      id: '657ec30246ee599afd2fb38e',
      name: 'Aura',
    },
  },
  {
    brand: {
      id: '657051eb08ec1be714bc4bce',
      name: 'Lamborghini',
    },
    model: {
      id: '6570525f08ec1be714bc4bd3',
      name: 'Revuelto',
    },
  },
];

const bodyStyles = [
  {
    id: '6570426808ec1be714bc4a6c',
    name: 'Sedan',
  },
  {
    id: '6570427208ec1be714bc4a6f',
    name: 'Suv',
  },
  {
    id: '657042bd08ec1be714bc4a74',
    name: 'Hatchback',
  },
];

const tags = [
  {
    value: 'latest-cars',
    label: 'Latest cars',
  },
  {
    value: 'popular-cars',
    label: 'Popular cars',
  },
  {
    value: 'upcoming-cars',
    label: 'Upcoming cars',
  },
  {
    value: 'electric-cars',
    label: 'Electric cars',
  },
];

const fuel = [
  {
    typeInfo: {
      type: 'CNG',
      fullForm: 'Compressed Natural Gas',
    },
  },
  {
    typeInfo: {
      type: 'Petrol',
      fullForm: 'Gasoline (Petrol)',
    },
  },
  {
    typeInfo: {
      type: 'Diesel',
      fullForm: 'Diesel',
    },
  },
];

const posterImages = [
  {
    originalUrl:
      'https://files.edgestore.dev/w8o4pj4chujyxw16/publicImages/_public/dd865273-528a-4edf-a6c2-28a0089c58de.webp',
    thumbnailUrl:
      'https://files.edgestore.dev/w8o4pj4chujyxw16/publicImages/_public/dd865273-528a-4edf-a6c2-28a0089c58de-thumb.webp',
  },
  {
    originalUrl:
      'https://files.edgestore.dev/w8o4pj4chujyxw16/publicImages/_public/4fc447a0-7fe6-47fa-8890-5efff6549b1f.webp',
    thumbnailUrl:
      'https://files.edgestore.dev/w8o4pj4chujyxw16/publicImages/_public/4fc447a0-7fe6-47fa-8890-5efff6549b1f-thumb.webp',
  },
  {
    originalUrl:
      'https://files.edgestore.dev/w8o4pj4chujyxw16/publicImages/_public/e9354c93-b44d-4c90-b942-1bd93a565952.webp',
    thumbnailUrl:
      'https://files.edgestore.dev/w8o4pj4chujyxw16/publicImages/_public/e9354c93-b44d-4c90-b942-1bd93a565952-thumb.webp',
  },
];

function generateSingleSpecification() {
  return {
    name: faker.word.noun(),
    value: faker.word.adjective(),
    valueType: 'text',
  };
}

function generateSpecificationsByGroup() {
  const groupName = faker.lorem.words(3);
  const values = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => generateSingleSpecification());

  return {
    groupName,
    values,
  };
}

function generateData() {
  const randomIndex = Math.floor(Math.random() * brandAndModel.length);
  const randomBrand = brandAndModel[randomIndex].brand;
  const randomModel = brandAndModel[randomIndex].model;

  const minPrice = faker.number.int({ min: 100000, max: 50000000 });
  const maxPrice = faker.number.int({ min: minPrice + 1, max: 50000000 });
  const isNegotiable = faker.datatype.boolean();

  const data = {
    name: faker.vehicle.manufacturer() + ' ' + faker.vehicle.model(),
    brand: randomBrand,
    brandModel: randomModel,
    tags: faker.helpers.arrayElements(tags, 3),
    bodyStyle: faker.helpers.arrayElement(bodyStyles),
    seatingCapacity: faker.number.int({ min: 4, max: 8 }),
    numOfDoors: faker.number.int({ min: 4, max: 6 }),
    transmission: faker.helpers.arrayElement(['Manual', 'Automatic', 'Manual/Automatic']),
    fuel: faker.helpers.arrayElement(fuel),
    price: {
      min: minPrice,
      max: maxPrice,
      isNegotiable,
    },
    specificationsByGroup: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }).map(() =>
      generateSpecificationsByGroup(),
    ),

    launchedAt: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2025-01-01T00:00:00.000Z' }),

    posterImage: faker.helpers.arrayElement(posterImages),
  };

  return data;
}
async function seedCars() {
  console.log('⏳ Running seed...');

  const start = Date.now();
  const data = faker.helpers.multiple(generateData);

  for (let i = 0; i < data.length; i++) {
    await Car.create(data);
  }

  const end = Date.now();
  console.log(`✅ Seed completed in ${end - start}ms`);
}

(async function runSeed() {
  const connected = await connect();

  if (connected) {
    await seedCars();
  }

  process.exit(0);
})();
