import { PersonType, VehicleType, ShuttleType, StepType, Location } from "./Types";

const getAllPeopleMinVehiclesToPutIn = (
  people: PersonType[],
  vehicles: VehicleType[]
): StepType => {
  let putInPeople: PersonType[] = JSON.parse(JSON.stringify(people));
  let putInVehicles: VehicleType[] = [];
  let takeOutPeople: PersonType[] = [];
  let takeOutVehicles: VehicleType[] = [];

  const minCars: number = 2;

  //** Sort vehicles by max space **
  vehicles.sort((a, b) => b.maxSpace - a.maxSpace);

  //STEP ONE PUT IN VEHICLES
  //Only use enough cars that fit people count
  //loop through vehicles, summing space until we get to the vehicle where we have enough space
  const peopleCount = people.length;
  let spaceCount = 0;
  for (let v = 0; v < vehicles.length; v++) {
    const vehicle = vehicles[v];
    if (spaceCount < peopleCount || putInVehicles.length < minCars) {
      putInVehicles.push(vehicle);
      spaceCount += vehicle.maxSpace;
      continue;
    }
    let driverId = vehicle.personId;
    let driver = putInPeople.find((p) => p.id === driverId);
    if (driver) {
      delete driver.vehicleId;
    }
  }

  //STEP ONE PUT IN PEOPLE
  //** Move people without a vehicle to the first available vehicle **
  //List people without cars
  const peopleWithoutCars = putInPeople.filter(
    (person: PersonType) => person.vehicleId === undefined
  );
  //Loop through each person without a car and assign them to a car with space
  for (var idxPerson = 0; idxPerson < peopleWithoutCars.length; idxPerson++) {
    var person = peopleWithoutCars[idxPerson];

    //Find first vehicle with space
    for (
      var idxLastVehicle = 0;
      idxLastVehicle < putInVehicles.length;
      idxLastVehicle++
    ) {
      const vehicle = putInVehicles[idxLastVehicle];
      const peopleInVehicle = putInPeople.filter(
        (person: PersonType) => person.vehicleId === vehicle.personId
      );
      const currentSpace = vehicle.maxSpace - peopleInVehicle.length;

      if (currentSpace > 0) {
        person.vehicleId = vehicle.personId;
        break;
      }
    }
  }

  //** TODO Evenly distribute people across vehicles **

  //Sometimes putInPeople were added twice during rapid testing of the same scenario
  //This function makes the array unique
  putInPeople = [
    ...new Map(
      putInPeople.map((item: PersonType) => [item["name"], item])
    ).values(),
  ];

  return [
    {
      Location: Location.PUT_IN,
      People: putInPeople,
      Vehicles: putInVehicles,
    },
    {
      Location: Location.TAKE_OUT,
      People: takeOutPeople,
      Vehicles: takeOutVehicles,
    },
  ];
};

const getMaxVehiclesToTakeOut = (previousStep: StepType): StepType => {
  let putInPeople: PersonType[] = JSON.parse(
    JSON.stringify(previousStep[0].People)
  );
  let putInVehicles: VehicleType[] = JSON.parse(
    JSON.stringify(previousStep[0].Vehicles)
  );
  let takeOutPeople: PersonType[] = JSON.parse(
    JSON.stringify(previousStep[1].People)
  );
  let takeOutVehicles: VehicleType[] = JSON.parse(
    JSON.stringify(previousStep[1].Vehicles)
  );

  //PUT IN VEHICLES
  const driversVehicles = putInVehicles.filter((v) => v.personId !== undefined);
  const driversVehiclesIds = driversVehicles.map((v) => v.personId);
  putInVehicles = putInVehicles.filter((v) => {
    driversVehiclesIds.includes(v.personId);
  });

  //TAKE OUT VEHICLES
  let drivers = putInPeople.filter((p) => driversVehiclesIds.includes(p.id));
  takeOutVehicles.push(...driversVehicles);

  //PUT IN PEOPLE
  let putInPeopleIds = putInPeople.map((p) => p.id);
  putInPeopleIds = putInPeopleIds.filter(
    (p) => !driversVehiclesIds.includes(p)
  );
  putInPeople.forEach((p) => {
    if (putInPeopleIds.includes(p.id)) {
      p.vehicleId = undefined;
    }
  });
  putInPeople = putInPeople.filter((p) => putInPeopleIds.includes(p.id));

  //Sometimes drivers were added twice during rapid testing of the same scenario
  //This function makes the array unique
  drivers = [
    ...new Map(
      drivers.map((item: PersonType) => [item["name"], item])
    ).values(),
  ];

  //TAKE OUT PEOPLE
  takeOutPeople.push(...drivers);

  return [
    {
      Location: Location.PUT_IN,
      People: putInPeople,
      Vehicles: putInVehicles,
    },
    {
      Location: Location.TAKE_OUT,
      People: takeOutPeople,
      Vehicles: takeOutVehicles,
    },
  ];
};

const getAllPeopleToPutIn = (previousStep: StepType): StepType => {
  let putInPeople: PersonType[] = JSON.parse(
    JSON.stringify(previousStep[0].People)
  );
  let putInVehicles: VehicleType[] = JSON.parse(
    JSON.stringify(previousStep[0].Vehicles)
  );
  let takeOutPeople: PersonType[] = JSON.parse(
    JSON.stringify(previousStep[1].People)
  );
  let takeOutVehicles: VehicleType[] = JSON.parse(
    JSON.stringify(previousStep[1].Vehicles)
  );

  // PEOPLE TO MOVE
  let peopleToMove: PersonType[] = takeOutPeople;
  let peopleToMoveCount = peopleToMove.length;

  // VEHICLES TO MOVE
  takeOutVehicles.sort((a, b) => a.maxSpace - b.maxSpace);
  // move vehicles with only one space to the end of the array
  while (takeOutVehicles[0].maxSpace === 1) {
    const first = takeOutVehicles.shift();
    first && takeOutVehicles.push(first);
  }
  let vehiclesToMove: VehicleType[] = [];
  let vehiclesToMoveSpace: number = 0;
  for (let i = 0; i < takeOutVehicles.length; i++) {
    vehiclesToMove.push(takeOutVehicles[i]);
    vehiclesToMoveSpace += takeOutVehicles[i].maxSpace;
    if (vehiclesToMoveSpace >= peopleToMoveCount) {
      break;
    }
  }

  // REARRANGE PEOPLE TO VEHICLES
  let vehiclesToMoveDrivers = vehiclesToMove.map((v) => v.personId);
  for (let i = 0; i < peopleToMove.length; i++) {
    const person = peopleToMove[i];
    //Skip rearranging drivers of vehicles to move since they are already where needed
    if (person.vehicleId && vehiclesToMoveDrivers.includes(person.vehicleId)) {
      continue;
    }
    //Find vehicle with space for this person
    const vehicleWithSpaceForPerson: VehicleType | undefined =
      vehiclesToMove.find((vehicle: VehicleType) => {
        let vehicleEmptySpace = vehicle.maxSpace;
        let peopleToMoveVehicles = peopleToMove.map((p) => p.vehicleId);
        for (const v of peopleToMoveVehicles) {
          if (v === vehicle.personId) {
            vehicleEmptySpace--;
          }
        }
        return vehicleEmptySpace > 0;
      });
    person.vehicleId = vehicleWithSpaceForPerson?.personId;
  }

  // MOVE VEHICLES TO PUT IN
  putInVehicles.push(...vehiclesToMove);
  takeOutVehicles = takeOutVehicles.filter((v: VehicleType) => {
    return !vehiclesToMove.includes(v);
  });

  // MOVE PEOPLE TO PUT IN
  putInPeople.push(...peopleToMove);
  takeOutPeople = takeOutPeople.filter((p: PersonType) => {
    return !peopleToMove.includes(p);
  });

  return [
    {
      Location: Location.PUT_IN,
      People: putInPeople,
      Vehicles: putInVehicles,
    },
    {
      Location: Location.TAKE_OUT,
      People: takeOutPeople,
      Vehicles: takeOutVehicles,
    },
  ];
};

export const calculateMeetAtPutIn = (
  people: PersonType[],
  vehicles: VehicleType[]
): StepType[] => {
  let Steps: StepType[] = [];

  Steps.push(getAllPeopleMinVehiclesToPutIn(people, vehicles));

  Steps.push(getMaxVehiclesToTakeOut(Steps[Steps.length - 1]));

  Steps.push(getAllPeopleToPutIn(Steps[Steps.length - 1]));

  let finalTakeOutVehicles = Steps[Steps.length - 1][1].Vehicles;
  if (finalTakeOutVehicles.length <= 0) {
    throw new Error("no vehicles at take out");
  }

  let firstPutInPeople = Steps[0][0].People.map((p) => p.name);
  let finalPutInPeople = Steps[Steps.length - 1][0].People.map((p) => p.name);
  if (!compareStringArrays(firstPutInPeople, finalPutInPeople)) {
    throw new Error("we lost some people");
  }
  return Steps;
};

export const isScenarioValid = (
    people: PersonType[],
    vehicles: VehicleType[],
    shuttleType: ShuttleType
  ) => {
    if (shuttleType === ShuttleType.MEET_AT_PUT_IN) {
      const minCars: number = 2;
  
      if (vehicles.length < minCars) {
        return false;
      }
    
      //Make sure there is a vehicle with enough space to take two people back to put in
      let vehiclesWithMoreThanOneSpace = false;
      for (let i = 0; i < vehicles.length; i++) {
        if (vehicles[i].maxSpace > 1) {
          vehiclesWithMoreThanOneSpace = true;
          break;
        }
      }
      if (!vehiclesWithMoreThanOneSpace) {
        return false;
      }

      //Make sure there is enough vehicle space for the people
      const spaceAvailable = vehicles.reduce((value: number, currentValue: VehicleType) => value + currentValue.maxSpace, 0)
      const spaceRequired = people.length;
      if ( spaceRequired > spaceAvailable) {
        return false;
      }
    
      return true;
    } else {
      // TODO: FILL IN THIS LOGIC
      return true;
    }
  };

const compareStringArrays = (array1: string[], array2: string[]) => {
  if (array1.length !== array2.length) {
    return false;
  }
  array1.sort();
  array2.sort();
  for (var i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false;
  }
  return true;
};

const getAllPeopleAllVehiclesToTakeOut = (
  people: PersonType[],
  vehicles: VehicleType[]): StepType => {
    let putInPeople: PersonType[] = [];
    let putInVehicles: VehicleType[] = [];
    let takeOutPeople: PersonType[] = JSON.parse(JSON.stringify(people));
    let takeOutVehicles: VehicleType[] = JSON.parse(JSON.stringify(vehicles));
  
    //TAKE OUT VEHICLES
    //TODO do we need all vehicles?
    //** Sort vehicles by max space **
    takeOutVehicles.sort((a, b) => b.maxSpace - a.maxSpace);

    //TAKE OUT PEOPLE
    //Distribute people across vehicles
    //List people without cars
    const peopleWithoutCars = takeOutPeople.filter(
      (person: PersonType) => person.vehicleId === undefined
    );
    //Loop through each person without a car and assign them to a car with space
    for (var idxPerson = 0; idxPerson < peopleWithoutCars.length; idxPerson++) {
      var person = peopleWithoutCars[idxPerson];

      //Find first vehicle with space
      for (
        var idxLastVehicle = 0;
        idxLastVehicle < takeOutVehicles.length;
        idxLastVehicle++
      ) {
        const vehicle = takeOutVehicles[idxLastVehicle];
        const peopleInVehicle = takeOutPeople.filter(
          (person: PersonType) => person.vehicleId === vehicle.personId
        );
        const currentSpace = vehicle.maxSpace - peopleInVehicle.length;

        if (currentSpace > 0) {
          person.vehicleId = vehicle.personId;
          break;
        }
      }
    }

    return [
      {
        Location: Location.PUT_IN,
        People: putInPeople,
        Vehicles: putInVehicles,
      },
      {
        Location: Location.TAKE_OUT,
        People: takeOutPeople,
        Vehicles: takeOutVehicles,
      },
    ]; 
};

export const calculateMeetAtTakeOut = (
  people: PersonType[],
  vehicles: VehicleType[]): StepType[] => {
    let Steps: StepType[] = [];

    Steps.push(getAllPeopleAllVehiclesToTakeOut(people, vehicles));

    return Steps;
  };