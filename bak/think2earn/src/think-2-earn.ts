import {
  BountyCompleted as BountyCompletedEvent,
  BountyCreated as BountyCreatedEvent,
  EEGDataSubmitted as EEGDataSubmittedEvent,
  EtherDeposited as EtherDepositedEvent,
  PaymentMade as PaymentMadeEvent
} from "../generated/Think2Earn/Think2Earn"
import {
  BountyCompleted,
  BountyCreated,
  EEGDataSubmitted,
  EtherDeposited,
  PaymentMade
} from "../generated/schema"

export function handleBountyCompleted(event: BountyCompletedEvent): void {
  let entity = new BountyCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bountyId = event.params.bountyId
  entity.numAcceptedSubmissions = event.params.numAcceptedSubmissions

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBountyCreated(event: BountyCreatedEvent): void {
  let entity = new BountyCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bountyId = event.params.bountyId
  entity.name = event.params.name
  entity.description = event.params.description
  entity.mediaURI = event.params.mediaURI
  entity.reward = event.params.reward
  entity.duration = event.params.duration
  entity.judgeTime = event.params.judgeTime
  entity.maxProgress = event.params.maxProgress
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEEGDataSubmitted(event: EEGDataSubmittedEvent): void {
  let entity = new EEGDataSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bountyId = event.params.bountyId
  entity.submissionId = event.params.submissionId
  entity.submitter = event.params.submitter
  entity.eegDataHash = event.params.eegDataHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEtherDeposited(event: EtherDepositedEvent): void {
  let entity = new EtherDeposited(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaymentMade(event: PaymentMadeEvent): void {
  let entity = new PaymentMade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bountyId = event.params.bountyId
  entity.submissionId = event.params.submissionId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
