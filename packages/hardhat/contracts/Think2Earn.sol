// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface Think2EarnBountyRegistry {
    function getFactoryCount() external view returns (uint256);
    function getFactory(uint256 factoryId) external view returns (address);
}

interface Think2EarnBountyFactoryV1 {
    // seller methods
    function submitEEGData(uint256 _bountyId, bytes calldata _eegDataHash) external returns (uint256 submissionId);

    // buyer methods
    function createBounty(
        string memory _name,
        string memory _description,
        string memory mediaURI,   // Hash of the media URI
        uint256 _duration,
        uint256 _judgeTime,
        uint256 _maxProgress
    ) external payable;
    function completeBounty(uint256 _bountyId, uint256[] calldata acceptedSubmissions) external;

    // view
    function getBountyCount() external view returns (uint256);
    function getBountyDetails(uint256 _bountyId) external view returns (
        string memory name,
        string memory description,
        string memory mediaURI,
        uint256 reward,
        uint256 duration,
        uint256 judgeTime,
        uint256 maxProgress,
        address creator,
        uint256 creationBlock,
        bool isActive,
        uint256 submissionsLength,
        uint256 currentProgress
    );
    function getBountySubmissions(uint256 _bountyId, uint256 _submission) external view returns (Submission memory);
    function getActiveBounties() external view returns (uint[] memory);
    function getVersion() external view returns (uint256);
    struct Submission {
        address submitter;
        bytes eegDataHash;    // Hash of the EEG data
    }
}

contract Think2Earn is Think2EarnBountyFactoryV1, ReentrancyGuard {

    struct Bounty {
        string name;
        string description;     // IPFS hash or YouTube link
        string mediaURI;   // media URI
        uint256 reward;
        uint256 duration;       // in blocks
        uint256 judgeTime;      // in blocks
        uint256 maxProgress;    // max number of participants
        uint256 creationBlock;
        address creator;
        bool isActive;
        Submission[] submissions; // Array of submissions for this bounty
    }

    uint256[] public activeBountyIds;
    mapping(uint256 => Bounty) public bounties;
    uint256 public bountyCount = 0;     // Start counting bounties from 0

    event EEGDataSubmitted(uint256 bountyId, uint256 submissionId, address submitter, bytes eegDataHash);
    event EtherDeposited(address sender, uint256 amount);
    event PaymentMade(uint256 bountyId, uint256 submissionId, uint256 amount);
    event BountyCreated(uint256 bountyId, string name, string description, string mediaURI, uint256 reward, uint256 duration, uint256 judgeTime, uint256 maxProgress, address creator);
    event BountyCompleted(uint256 bountyId, uint256 numAcceptedSubmissions);

    receive() external payable {
        emit EtherDeposited(msg.sender, msg.value);
    }

    constructor() {
        createBounty("Cat", "is nice?", "https://cat.info/", 150, 10, 5);
    }

    function submitEEGData(uint256 _bountyId, bytes calldata _eegDataHash) external returns (uint256 submissionId) {
        require(_eegDataHash.length > 0, "Invalid EEG data hash");

        bounties[_bountyId].submissions.push(Submission({
            submitter: msg.sender,
            eegDataHash: _eegDataHash
        }));
        submissionId = bounties[_bountyId].submissions.length;

        emit EEGDataSubmitted(_bountyId, submissionId, msg.sender, _eegDataHash);

        return submissionId;
    }

    function createBounty(
        string memory _name,
        string memory _description,
        string memory _mediaURI,   // media URI
        uint256 _duration,
        uint256 _judgeTime,
        uint256 _maxProgress
    ) public payable {
        require(bytes(_name).length > 0, "Bounty name cannot be empty");
        require(bytes(_description).length > 0, "Bounty description cannot be empty");
        require(_duration > 0, "Bounty duration must be greater than zero");

        Bounty storage newBounty = bounties[bountyCount];
        newBounty.name = _name;
        newBounty.description = _description;
        newBounty.mediaURI = _mediaURI;
        newBounty.reward = msg.value;
        newBounty.duration = _duration;
        newBounty.judgeTime = _judgeTime;
        newBounty.maxProgress = _maxProgress;
        newBounty.creationBlock = block.number;
        newBounty.creator = msg.sender;
        newBounty.isActive = true;

        emit BountyCreated(bountyCount, _name, _description, _mediaURI, msg.value, _duration, _judgeTime, _maxProgress, msg.sender);

        activeBountyIds.push(bountyCount);
        bountyCount++;
    }

    function completeBounty(uint256 _bountyId, uint256[] calldata acceptedSubmissions) external nonReentrant {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.isActive, "Bounty is not active");
        require(msg.sender == bounty.creator);
        require(block.number >= bounty.creationBlock + bounty.duration, "Bounty duration not yet passed");

        bounty.isActive = false;

        uint256 rewardPerSubmission = bounty.reward / bounty.maxProgress;
        uint256 startingBalance = address(this).balance;
        uint256 numAcceptedSubmissions = acceptedSubmissions.length;
        for (uint i = 0; i < numAcceptedSubmissions; i++) {
            // Transfer reward to each submitter
            address payable submitter = payable(bounty.submissions[acceptedSubmissions[i]].submitter);
            (bool success, ) = submitter.call{value: rewardPerSubmission}("");
            emit PaymentMade(_bountyId, acceptedSubmissions[i], rewardPerSubmission);
        }

        // return remaining eth (or all e.g. if nothing accepted or closing early)
        uint256 leftoverReward = startingBalance - address(this).balance - bounty.reward;
        (bool success, ) = bounty.creator.call{value: leftoverReward}("");
        bounty.reward = 0;

        removeBountyFromActiveList(_bountyId);
        emit BountyCompleted(_bountyId, numAcceptedSubmissions);
    }

    function removeBountyFromActiveList(uint bountyId) private {
        for (uint i = 0; i < activeBountyIds.length; i++) {
            if (activeBountyIds[i] == bountyId) {
                activeBountyIds[i] = activeBountyIds[activeBountyIds.length - 1];
                activeBountyIds.pop();
                break;
            }
        }
    }

    function getBountyCount() external view returns (uint256) {
        return bountyCount;
    }

    function getBountySubmissions(uint256 _bountyId, uint256 _submissionId) external view returns (Submission memory) {
        return bounties[_bountyId].submissions[_submissionId];
    }

    function getActiveBounties() public view returns (uint[] memory) {
        return activeBountyIds;
    }

    function getBountyDetails(uint256 _bountyId) external view returns (
        string memory name,
        string memory description,
        string memory mediaURI,
        uint256 reward,
        uint256 duration,
        uint256 judgeTime,
        uint256 maxProgress,
        address creator,
        uint256 creationBlock,
        bool isActive,
        uint256 submissionsLength,
        uint256 currentProgress
    ) {
        Bounty storage bounty = bounties[_bountyId];
        return (
            bounty.name,
            bounty.description,
            bounty.mediaURI,
            bounty.reward,
            bounty.duration,
            bounty.judgeTime,
            bounty.maxProgress,
            bounty.creator,
            bounty.creationBlock,
            bounty.isActive,
            bounty.submissions.length,
            bounty.submissions.length
        );
    }

    function getBounties() external view returns (Bounty[] memory) {
        Bounty[] memory allBounties = new Bounty[](activeBountyIds.length);
        for (uint256 i = 0; i < bountyCount; i++) {
            allBounties[i] = bounties[activeBountyIds[i]];
        }
        return allBounties;
    }

    function getVersion() external view returns (uint256) {
        return 1;
    }
}

