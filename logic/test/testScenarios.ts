import { PersonType, VehicleType, EntityType, ScenarioType, ShuttleType } from "../Types";

const getPeople = (entities: EntityType[]): PersonType[] => {
  return entities.map((entity) => {
    return entity.person;
  });
};

const getVehicles = (entities: EntityType[]): VehicleType[] => {
  let returnArray: VehicleType[] = [];
  entities.forEach((entity) => {
    if (entity.vehicle) {
      returnArray.push(entity.vehicle);
    }
  });

  return returnArray;
};

const getScenario = (entities: EntityType[], shuttleType: ShuttleType): ScenarioType => {
  return {
    people: getPeople(entities),
    vehicles: getVehicles(entities),
    shuttleType
  };
};

const getEntity = (name: string, maxSpace: number | null): EntityType => {
  let personId = name;
  let vehicle: VehicleType | undefined = undefined;

  const person: PersonType = {
    id: personId,
    name: name,
  };
  if (maxSpace && maxSpace > 1) {
    vehicle = {
      personId,
      maxSpace,
    };
    person.vehicleId = personId;
  }

  const entity: EntityType = { person, vehicle };
  return entity;
};

export const getTestScenario = (shuttleType: ShuttleType, scenario?: number[]): ScenarioType => {
  if (!scenario) {
    scenario = [
      getNumber(),
      getNumber(),
      getNumber(),
      getNumber(),
      getNumber(),
      getNumber(),
    ];
  }
  console.log(scenario);
  let entities: EntityType[] = [];

  for (let i = 0; i < scenario.length; i++) {
    let numPeopleToCreate = scenario[i];
    for (let x = 0; x < numPeopleToCreate; x++) {
      entities.push(getEntity(getRandomName(), i === 0 ? null : i));
    }
  }

  return getScenario(entities, shuttleType);
};

export const getNumber = () => {
  const min = 0;
  const max = 5; // Maximum people allowed with the same maxSpace
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const zeroPad = (num: number) => {
  const places = 6;
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
};

export const getRandomName = () => {
  return (Math.random() + 1).toString(36).substring(7);
};