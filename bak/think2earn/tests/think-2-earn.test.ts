import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { BountyCompleted } from "../generated/schema"
import { BountyCompleted as BountyCompletedEvent } from "../generated/Think2Earn/Think2Earn"
import { handleBountyCompleted } from "../src/think-2-earn"
import { createBountyCompletedEvent } from "./think-2-earn-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let bountyId = BigInt.fromI32(234)
    let numAcceptedSubmissions = BigInt.fromI32(234)
    let newBountyCompletedEvent = createBountyCompletedEvent(
      bountyId,
      numAcceptedSubmissions
    )
    handleBountyCompleted(newBountyCompletedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BountyCompleted created and stored", () => {
    assert.entityCount("BountyCompleted", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BountyCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "bountyId",
      "234"
    )
    assert.fieldEquals(
      "BountyCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "numAcceptedSubmissions",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
