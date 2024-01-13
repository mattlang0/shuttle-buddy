import { getTestScenario, zeroPad } from "./testScenarios";
import { calculateMeetAtTakeOut, isScenarioValid } from "../logic";
import { ShuttleType } from "../Types";

test("all scenarios up to x", async () => {
  //Rick & Morty scenario
  //[4, 0, 1, 0, 2, 0];
  //4 people with 0 space
  //0 people with 1 space
  //1 people with 2 space
  //0 people with 3 space
  //2 people with 4 space
  //0 pepole with 5 space

  const min = 0
  const max = 999999;
  const shuttleType = ShuttleType.MEET_AT_TAKE_OUT;

  for (let number = min; number < max; number++) {
    let numArray = zeroPad(number).split("").map(Number);
    numArray.reverse();
    const scenario = getTestScenario(shuttleType, numArray);
    const { people, vehicles } = scenario;
    if (isScenarioValid(people, vehicles, shuttleType)) {
      expect(calculateMeetAtTakeOut(people, vehicles)).not.toThrow;
    }
  }
});
