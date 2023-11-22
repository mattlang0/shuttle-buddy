import { getTestScenario, zeroPad } from "./testScenarios";
import { calculateMeetAtPutIn, isScenarioValid } from "../logic";
import { ShuttleType } from "../Types";

test("all scenarios up to x", async () => {
  //Rick & Morty scenario
  //[4, 0, 1, 0, 2, 0];

  const max = 999999;
  const shuttleType = ShuttleType.MEET_AT_PUT_IN;

  for (let number = 0; number < max; number++) {
    const numArray = zeroPad(number).split("").map(Number);
    const scenario = getTestScenario(shuttleType, numArray);
    const { people, vehicles } = scenario;
    if (isScenarioValid(people, vehicles, shuttleType)) {
      expect(calculateMeetAtPutIn(people, vehicles)).not.toThrow;
    }
  }
});
