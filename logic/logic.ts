import { PersonType, VehicleType, ShuttleType, StepType, Location } from "./Types";

const distributePeopleToVehicles = (people: PersonType[], vehicles: VehicleType[], allPeople: PersonType[]) => {
  //This variable allows the distribution of people across all vehicles so that no one is lonely
  let indexVehicle = 0;
  //Loop through each person without a car and assign them to a car with space
  for (var idxPerson = 0; idxPerson < people.length; idxPerson++) {
    var person = people[idxPerson];

    //Find first vehicle with space
    for (
      var i = indexVehicle;
      i < vehicles.length;
      i++
    ) {
      const vehicle = vehicles[i];
      const peopleInVehicle = allPeople.filter(
        (person: PersonType) => person.vehicleId === vehicle.personId
      );
      const currentSpace = vehicle.maxSpace - peopleInVehicle.length;

      if (currentSpace > 0) {
        person.vehicleId = vehicle.personId;
        indexVehicle = indexVehicle >= vehicles.length - 1 ? 0 : indexVehicle + 1; 
        break;
      };

      //if we're at the end of vehicles
      //and there is an earlier vehicle with space
      //restart at the beginning
      if (i === vehicles.length - 1) {
        const vehicleWithSpace = vehicles.find((v: VehicleType)=>{
          const peopleInVehicle = allPeople.filter(
            (p: PersonType) => p.vehicleId === v.personId
          );
          const currentSpace = v.maxSpace - peopleInVehicle.length;
          return currentSpace > 0;
        });
        if (vehicleWithSpace !== undefined) {
          i = -1;
        }
      };

      continue;
    }
  }
};

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

    distributePeopleToVehicles(peopleWithoutCars, takeOutVehicles, takeOutPeople);
    
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

const getMinVehiclesToPutIn = (previousStep: StepType): StepType => {
  //There are currently no people/vehicles at the put in, so we only look at the take out
  let peopleInput: PersonType[] = JSON.parse(
    JSON.stringify(previousStep[1].People)
  );
  let vehiclesInput: VehicleType[] = JSON.parse(
    JSON.stringify(previousStep[1].Vehicles)
  );
  let putInPeople: PersonType[] = [];
  let putInVehicles: VehicleType[] = [];
  let takeOutPeople: PersonType[] = [];
  let takeOutVehicles: VehicleType[] = [];

  //Find Take out vehicles
  let takeOutVehicleIds:string[] = [];
  const vehicleCount = vehiclesInput.length;
  let space = 0;
  for (let i = vehiclesInput.length - 1; i >= 0; i--) {
    if (space >= vehicleCount) {
      break;
    }
    space += vehiclesInput[i].maxSpace;
    takeOutVehicleIds.push(vehiclesInput[i].personId);
  };
  
  takeOutVehicles = vehiclesInput.filter((v)=>takeOutVehicleIds.includes(v.personId));
  putInVehicles = vehiclesInput.filter((v)=>!takeOutVehicleIds.includes(v.personId));
  
  //Find vehicles going to put in with space available
  let putInVehiclesWithSpace: VehicleType[] = [];
  for (let i = 0; i < putInVehicles.length;  i++) {
    const vehicle = putInVehicles[i];
    const vehicleMaxSpace = vehicle.maxSpace;
    const peopleInVehicle = peopleInput.filter(person=>person.vehicleId === vehicle.personId).length;
    if (peopleInVehicle < vehicleMaxSpace) {
      putInVehiclesWithSpace.push(putInVehicles[i]);
    }
  }

  //Find people not in a vehicle going to put in
  takeOutVehicleIds = takeOutVehicles.map(vehicle=>vehicle.personId);
  let peopleNeedingToMove: PersonType[] = peopleInput.filter((person)=>{
    return person.vehicleId && takeOutVehicleIds.includes(person.vehicleId);
  });

  //Move people to vehicles going to put in with space available
  //Put drivers at the end of the array so that we move drivers last
  let indexesNeedingToMoveToEndOfArray = [];
  for (let i = 0; i < peopleNeedingToMove.length; i++) {
    if (takeOutVehicleIds.includes(peopleNeedingToMove[i].id)) {
      indexesNeedingToMoveToEndOfArray.push(i)
    }
  }
  indexesNeedingToMoveToEndOfArray.forEach(index => {
    peopleNeedingToMove.push(peopleNeedingToMove.splice(index, 1)[0]);
  });

  distributePeopleToVehicles(peopleNeedingToMove, putInVehiclesWithSpace, peopleInput);

  putInPeople = peopleInput.filter((person)=>{
    const putInVehicleIds = putInVehicles.map(vehicle=>vehicle.personId);
    return person.vehicleId && putInVehicleIds.includes(person.vehicleId);
  });

  takeOutPeople = peopleInput.filter((person)=>{
    const takeOutVehicleIds = takeOutVehicles.map(vehicle=>vehicle.personId);
    return person.vehicleId && takeOutVehicleIds.includes(person.vehicleId);
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

const getSmallestVehicleFromPutInToTakeOut = (previousStep: StepType): StepType => {
  let putInPeopleInput: PersonType[] = JSON.parse(
    JSON.stringify(previousStep[0].People)
  );
  let putInVehiclesInput: VehicleType[] = JSON.parse(
    JSON.stringify(previousStep[0].Vehicles)
  );
  let takeOutPeopleInput: PersonType[] = JSON.parse(
    JSON.stringify(previousStep[1].People)
  );
  let takeOutVehiclesInput: VehicleType[] = JSON.parse(
    JSON.stringify(previousStep[1].Vehicles)
  );
  let putInPeople: PersonType[] = [];
  let putInVehicles: VehicleType[] = [];
  let takeOutPeople: PersonType[] = [];
  let takeOutVehicles: VehicleType[] = [];

  let peopleNeedingToMove = takeOutPeopleInput;
  
  //find smallest vehicle that fits all people
  // TODO this may need to be multiple cars, instead of just the smallest one
  let vehicleToUse: VehicleType = putInVehiclesInput[0];
  putInVehiclesInput.sort((a, b) => a.maxSpace - b.maxSpace);
  for (let i = 0; i < putInVehiclesInput.length; i++) {
    if (putInVehiclesInput[i].maxSpace >= peopleNeedingToMove.length) {
      vehicleToUse = putInVehiclesInput[i];
      break;
    }
  }
  let personToUse: PersonType = putInPeopleInput.find(person => person.id === vehicleToUse.personId) || putInPeopleInput[0];

  //Move everyone except the driver out of the vehicle
  putInPeopleInput.forEach(person => {
    if (person.vehicleId === vehicleToUse?.personId && person.id !== vehicleToUse?.personId) { 
      delete person.vehicleId;
    }
  });

  //Move vehicle from put in to take out
  putInVehicles = putInVehiclesInput.filter(vehicle => vehicle !== vehicleToUse);
  takeOutVehicles = takeOutVehiclesInput;
  takeOutVehicles.push(vehicleToUse);
  
  //Move person from put in to take out
  putInPeople = putInPeopleInput.filter(person => person.id !== personToUse.id);
  takeOutPeople = takeOutPeopleInput;
  takeOutPeople.push(personToUse);

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

const getAllPeopleToPutInLeaveVehiclesAtTakeOut = (previousStep: StepType, vehiclesToStayAtTakeOut: VehicleType[]): StepType => {
  let putInPeopleInput: PersonType[] = JSON.parse(
    JSON.stringify(previousStep[0].People)
  );
  let putInVehiclesInput: VehicleType[] = JSON.parse(
    JSON.stringify(previousStep[0].Vehicles)
  );
  let takeOutPeopleInput: PersonType[] = JSON.parse(
    JSON.stringify(previousStep[1].People)
  );
  let takeOutVehiclesInput: VehicleType[] = JSON.parse(
    JSON.stringify(previousStep[1].Vehicles)
  );
  let putInPeople: PersonType[] = putInPeopleInput;
  let putInVehicles: VehicleType[] = putInVehiclesInput;
  let takeOutPeople: PersonType[] = [];
  let takeOutVehicles: VehicleType[] = [];

  //Find vehicles to move to put in
  const takeOutVehiclesInputIds = takeOutVehiclesInput.map(v=>v.personId);
  const vehiclesToStayAtTakeOutIds = vehiclesToStayAtTakeOut.map(v=>v.personId);
  const vehiclesGoingToPutInIds = takeOutVehiclesInputIds.filter((vehicleId: string)=>!vehiclesToStayAtTakeOutIds.includes(vehicleId));
  const vehiclesGoingToPutIn = takeOutVehiclesInput.filter(v=>vehiclesGoingToPutInIds.includes(v.personId));

  //Put as many people as possible to vehicles going to put in
  //People to move either are not in a vehicle, or are in a vehicle that will stay at take out
  let peopleNeedingToChangeVehicles = takeOutPeopleInput.filter((person:PersonType) => !person.vehicleId || vehiclesToStayAtTakeOutIds.includes(person.vehicleId));

  //Distribute people to move across vehicles to move
  //Move people to vehicles going to put in with space available
  //Put drivers at the end of the array so that we move drivers last
  let indexesNeedingToMoveToEndOfArray = [];
  for (let i = 0; i < peopleNeedingToChangeVehicles.length; i++) {
    if (vehiclesToStayAtTakeOutIds.includes(peopleNeedingToChangeVehicles[i].id)) {
      indexesNeedingToMoveToEndOfArray.push(i)
    }
  }
  indexesNeedingToMoveToEndOfArray.forEach(index => {
    peopleNeedingToChangeVehicles.push(peopleNeedingToChangeVehicles.splice(index, 1)[0]);
  });

  distributePeopleToVehicles(peopleNeedingToChangeVehicles, vehiclesGoingToPutIn, takeOutPeopleInput);

  //People going to put in are in a vehicle going to put in
  takeOutPeopleInput.forEach((person:PersonType) => {
    if (person.vehicleId && vehiclesGoingToPutInIds.includes(person.vehicleId)) {
      putInPeople.push(person);
    } else {
      takeOutPeople.push(person);
    }
  });
  takeOutVehiclesInput.forEach((vehicle:VehicleType) => {
    if (vehiclesGoingToPutInIds.includes(vehicle.personId)) {
      putInVehicles.push(vehicle);
    } else {
      takeOutVehicles.push(vehicle);
    }
  });

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

export const calculateMeetAtTakeOut = (
  people: PersonType[],
  vehicles: VehicleType[]): StepType[] => {
    let Steps: StepType[] = [];

    Steps.push(getAllPeopleAllVehiclesToTakeOut(people, vehicles));

    Steps.push(getMinVehiclesToPutIn(Steps[Steps.length - 1]));

    //While there are still people at the take out, get them to the put in
    while (Steps[Steps.length - 1][1].People.length > 0) {
      const takeOutVehicles: VehicleType[] = Steps[Steps.length - 1][1].Vehicles;
      Steps.push(getSmallestVehicleFromPutInToTakeOut(Steps[Steps.length - 1]));
      Steps.push(getAllPeopleToPutInLeaveVehiclesAtTakeOut(Steps[Steps.length - 1], takeOutVehicles));
    };

    //Ensure there is enough space at take out to bring people back to their cars at put in
    let takeOutSpace = 0;
    const spaceNeeded = Steps[Steps.length - 1][0].Vehicles.length;
    let finalTakeOutVehicles = Steps[Steps.length - 1][1].Vehicles;
    for(let i = 0; i < finalTakeOutVehicles.length; i++) {
      const passengerSpace = finalTakeOutVehicles[i].maxSpace - 1;
      takeOutSpace += passengerSpace;
    }
    if (spaceNeeded > takeOutSpace) {
      throw new Error("Not enough space at take out");
    }

    //Ensure all people at the start have made it to the put in
    let firstTakeOutPeople = Steps[0][1].People.map((p) => p.name);
    let finalPutInPeople = Steps[Steps.length - 1][0].People.map((p) => p.name);
    if (!compareStringArrays(firstTakeOutPeople, finalPutInPeople)) {
      throw new Error("we lost some people");
    }

    return Steps;
  };