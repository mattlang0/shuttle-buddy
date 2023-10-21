export type ScenarioType = {
    People: PersonType[];
    Vehicles: VehicleType[];
  };
  
  export type EntityType = {
    person: PersonType;
    vehicle?: VehicleType;
  };
  
  export type PersonType = {
    id: string;
    name: string;
    vehicleId?: string;
  };
  
  export type VehicleType = {
    personId: string; // id of the person who owns this vehicle
    maxSpace: number;
  };

  export type GroupType = {
    Location: Location;
    People: PersonType[] | [];
    Vehicles: VehicleType[] | [];
  }
  
  export type StepType = [
    {
      Location: Location.PUT_IN;
      People: PersonType[] | [];
      Vehicles: VehicleType[] | [];
    },
    {
      Location: Location.TAKE_OUT;
      People: PersonType[] | [];
      Vehicles: VehicleType[] | [];
    }
  ];
  
  export enum Location {
    PUT_IN = "PUT_IN",
    TAKE_OUT = "TAKE_OUT",
  }
  
  export enum ShuttleType {
    MEET_AT_PUT_IN = "MEET_AT_PUT_IN",
    MEET_AT_TAKE_OUT = "MEET_AT_TAKE_OUT",
  }