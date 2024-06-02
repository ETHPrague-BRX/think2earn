import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  BountyCompleted,
  BountyCreated,
  EEGDataSubmitted,
  EtherDeposited,
  PaymentMade
} from "../generated/Think2Earn/Think2Earn"

export function createBountyCompletedEvent(
  bountyId: BigInt,
  numAcceptedSubmissions: BigInt
): BountyCompleted {
  let bountyCompletedEvent = changetype<BountyCompleted>(newMockEvent())

  bountyCompletedEvent.parameters = new Array()

  bountyCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "bountyId",
      ethereum.Value.fromUnsignedBigInt(bountyId)
    )
  )
  bountyCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "numAcceptedSubmissions",
      ethereum.Value.fromUnsignedBigInt(numAcceptedSubmissions)
    )
  )

  return bountyCompletedEvent
}

export function createBountyCreatedEvent(
  bountyId: BigInt,
  name: string,
  description: string,
  mediaURI: string,
  reward: BigInt,
  duration: BigInt,
  judgeTime: BigInt,
  maxProgress: BigInt,
  creator: Address
): BountyCreated {
  let bountyCreatedEvent = changetype<BountyCreated>(newMockEvent())

  bountyCreatedEvent.parameters = new Array()

  bountyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "bountyId",
      ethereum.Value.fromUnsignedBigInt(bountyId)
    )
  )
  bountyCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  bountyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  bountyCreatedEvent.parameters.push(
    new ethereum.EventParam("mediaURI", ethereum.Value.fromString(mediaURI))
  )
  bountyCreatedEvent.parameters.push(
    new ethereum.EventParam("reward", ethereum.Value.fromUnsignedBigInt(reward))
  )
  bountyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "duration",
      ethereum.Value.fromUnsignedBigInt(duration)
    )
  )
  bountyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "judgeTime",
      ethereum.Value.fromUnsignedBigInt(judgeTime)
    )
  )
  bountyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxProgress",
      ethereum.Value.fromUnsignedBigInt(maxProgress)
    )
  )
  bountyCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return bountyCreatedEvent
}

export function createEEGDataSubmittedEvent(
  bountyId: BigInt,
  submissionId: BigInt,
  submitter: Address,
  eegDataHash: Bytes
): EEGDataSubmitted {
  let eegDataSubmittedEvent = changetype<EEGDataSubmitted>(newMockEvent())

  eegDataSubmittedEvent.parameters = new Array()

  eegDataSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "bountyId",
      ethereum.Value.fromUnsignedBigInt(bountyId)
    )
  )
  eegDataSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "submissionId",
      ethereum.Value.fromUnsignedBigInt(submissionId)
    )
  )
  eegDataSubmittedEvent.parameters.push(
    new ethereum.EventParam("submitter", ethereum.Value.fromAddress(submitter))
  )
  eegDataSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "eegDataHash",
      ethereum.Value.fromBytes(eegDataHash)
    )
  )

  return eegDataSubmittedEvent
}

export function createEtherDepositedEvent(
  sender: Address,
  amount: BigInt
): EtherDeposited {
  let etherDepositedEvent = changetype<EtherDeposited>(newMockEvent())

  etherDepositedEvent.parameters = new Array()

  etherDepositedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  etherDepositedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return etherDepositedEvent
}

export function createPaymentMadeEvent(
  bountyId: BigInt,
  submissionId: BigInt,
  amount: BigInt
): PaymentMade {
  let paymentMadeEvent = changetype<PaymentMade>(newMockEvent())

  paymentMadeEvent.parameters = new Array()

  paymentMadeEvent.parameters.push(
    new ethereum.EventParam(
      "bountyId",
      ethereum.Value.fromUnsignedBigInt(bountyId)
    )
  )
  paymentMadeEvent.parameters.push(
    new ethereum.EventParam(
      "submissionId",
      ethereum.Value.fromUnsignedBigInt(submissionId)
    )
  )
  paymentMadeEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return paymentMadeEvent
}
