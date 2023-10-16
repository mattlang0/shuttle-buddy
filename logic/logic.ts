import { PersonType, VehicleType, ShuttleType } from "./Types";

export const isScenarioValid = (
    people: PersonType[],
    vehicles: VehicleType[],
    shuttleType: ShuttleType
  ) => {
    const minCars: number = 2;
  
    if (vehicles.length < minCars) {
      return false;
    }
  
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
  
    return true;
  };