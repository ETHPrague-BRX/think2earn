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
    // struct Submission {}
    function submitEEGData(uint256 _bountyId, bytes32 _eegDataHash) external returns (uint256 submissionId);
    // function deleteEEGData(uint256 bountyId, uint256 _submissionId, bytes32 _eegDataHash) external;

    // buyer methods
    // struct Bounty{}
    function createBounty(
        string memory _name,
        string memory _description,
        string memory mediaURIHash,   // Hash of the media URI
        uint256 _duration,
        uint256 _judgeTime,
        uint256 _maxProgress
    ) external payable;
    // function approveSubmissionAndPay(uint256 bountyId, uint256 submissionId) external; // require(msgSender == creator)
    // function rejectSubmission(uint256 bountyId, uint256 submissionId) external; // require(msgSender == creator)
    function completeBounty(uint256 _bountyId, uint256[] calldata acceptedSubmissions) external;    // require(msgSender == creator)
    // function sendMedia(uint256 _submissionId, bytes32 _mediaURIHash) external; // this was for the buyer to upload cat pics??

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
        uint256 submissionsLength
    );
    function getBountySubmissions(uint256 _bountyId, uint256 _submission) external view returns (Submission memory);
    function getActiveBounties() external view returns (uint[] memory);
    function getVersion() external view returns (uint256);
    struct Submission {
        address submitter;
        bytes32 eegDataHash;    // Hash of the EEG data
        // bool isPaid;
        // bool eegDataSubmitted;  // Indicates if EEG data has been submitted
    }
}

contract Think2Earn is Think2EarnBountyFactoryV1, ReentrancyGuard {

    struct Bounty {
        string name;
        string description;     // IPFS hash or YouTube link
        string mediaURIHash;   // Hash of the media URI
        uint256 reward;
        uint256 duration;       // in blocks
        uint256 judgeTime;      // in blocks
        uint256 maxProgress;    // max number of participants
        uint256 creationBlock;
        address creator;    // msg sender?
        bool isActive;

        Submission[] submissions; // Array of submissions for this bounty
    }

    uint256[] public activeBountyIds;
    mapping(uint256 => Bounty) public bounties;
    uint256 public bountyCount = 1;     // Start counting bounties from 1

//     event MediaSent(uint256 indexed submissionId, bytes32 mediaURIHash, address indexed recipient);
    event EEGDataSubmitted(uint256 indexed bountyId, uint256 indexed submissionId, bytes32 eegDataHash);
    event EtherDeposited(address indexed sender, uint256 amount);
    event PaymentMade(uint256 indexed bountyId, uint256 indexed submissionId, uint256 amount);
    event BountyCreated(uint256 indexed bountyId, string name, string description, uint256 reward, uint256 duration, uint256 judgeTime, uint256 maxProgress, address indexed creator);
    event BountyCompleted(uint256 indexed bountyId, uint256 numAcceptedSubmissions);

    // constructor(address initialOwner) {
    //     transferOwnership(initialOwner);
    // }

    receive() external payable {
        emit EtherDeposited(msg.sender, msg.value);
    }

    function submitEEGData(uint256 _bountyId, bytes32 _eegDataHash) external returns (uint256 submissionId) {
        require(_eegDataHash != 0, "Invalid EEG data hash");

        bounties[_bountyId].submissions.push (Submission({
            submitter: msg.sender,
            eegDataHash: _eegDataHash
        }));
        uint256 submissionId = bounties[_bountyId].submissions.length;

        emit EEGDataSubmitted(_bountyId, submissionId, _eegDataHash);

        return submissionId;
    }

//     function approveAndPay(uint256 _submissionId, address _submitterAddress) external onlyOwner nonReentrant {
//         Submission storage submission = submissions[_submissionId];
//         require(submission.submitter == _submitterAddress, "Submission ID and address do not match");
//         require(submission.submitter != address(0), "Submission not found");
//         require(!submission.isPaid, "Already paid");
//         require(submission.eegDataSubmitted, "EEG data not submitted");

//         submission.isPaid = true;
//         (bool sent, ) = submission.submitter.call{value: submission.tokenReward}("");
//         require(sent, "Failed to send Ether");

//         emit PaymentMade(_submissionId, submission.tokenReward);
//     }

//     function setReward(uint256 _submissionId, uint256 _reward) external onlyOwner {
//         Submission storage submission = submissions[_submissionId];
//         require(!submission.isPaid, "Already paid");
//         submission.tokenReward = _reward;
//     }

//     function withdrawEther(address payable _to, uint256 _amount) external onlyOwner nonReentrant {
//         require(_amount <= address(this).balance, "Insufficient balance");
//         (bool sent, ) = _to.call{value: _amount}("");        Submission[] memory submissions;
//         require(sent, "Failed to send Ether");
//     }

//     function getBalance() public view returns (uint256) {
//         return address(this).balance;
//     }

    function createBounty(
        string calldata _name,
        string calldata _description,
        string calldata _mediaURIHash,   // Hash of the media URI
        uint256 _duration,
        uint256 _judgeTime,
        uint256 _maxProgress
    ) external payable {
        require(bytes(_name).length > 0, "Bounty name cannot be empty");
        require(bytes(_description).length > 0, "Bounty description cannot be empty");
        // require(_reward > 0, "Bounty reward must be greater than zero");    // TODO - maybe not? some fun/charity bounties?
        require(_duration > 0, "Bounty duration must be greater than zero");

        Bounty storage newBounty = bounties[bountyCount];
        newBounty.name = _name;
        newBounty.description = _description;
        newBounty.mediaURIHash = _mediaURIHash;
        newBounty.reward = msg.value;
        newBounty.duration = _duration;
        newBounty.judgeTime = _judgeTime;
        newBounty.maxProgress = _maxProgress;
        newBounty.creationBlock = block.number;
        newBounty.creator = msg.sender;
        newBounty.isActive = true;

        // bounties[bountyCount] = Bounty({
        //     name: _name,
        //     description: _description,
        //     mediaURIHash: _mediaURIHash,   // Hash of the media URI
        //     reward: msg.value,
        //     duration: _duration,
        //     judgeTime: _judgeTime,
        //     maxProgress: _maxProgress,
        //     creationBlock: block.number,
        //     creator: msg.sender,
        //     isActive: true
        //     // submissions: submissions
        // });

        emit BountyCreated(bountyCount, _name, _description, msg.value, _duration, _judgeTime, _maxProgress, msg.sender);

        activeBountyIds.push(bountyCount);
        bountyCount++;
    }

    // function rejectSubmission(uint256 bountyId, uint256 dasubmissionId) external; // require(msgSender == creator)
    // TODO - security consideration, this could run out of gas for some very large submission numbers
    function completeBounty(uint256 _bountyId, uint256[] calldata acceptedSubmissions) external nonReentrant {    // require(msgSender == creator)
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.isActive, "Bounty is not active");
        require(msg.sender == bounty.creator);
        require(block.number >= bounty.creationBlock + bounty.duration, "Bounty duration not yet passed");
        // require(bounty.reward <= address(this).balance, "Insufficient contract balance to reward"); // TODO we can get stuck if not enough eth in the contract (e.g. due to some rounding error)

        bounty.isActive = false;

        uint256 rewardPerSubmission = bounty.reward / bounty.maxProgress;
        uint256 startingBalance = address(this).balance;
        uint256 numAcceptedSubmissions = acceptedSubmissions.length;
        for (uint i = 0; i < numAcceptedSubmissions; i++) {
            // Transfer reward to each submitter
            address payable submitter = payable(bounty.submissions[acceptedSubmissions[i]].submitter);
            (bool success, ) = submitter.call{value: rewardPerSubmission}("");
            emit PaymentMade(_bountyId, acceptedSubmissions[i], rewardPerSubmission);
            // require(success, "Failed to send Ether"); TODO security issue - if we can't send bounty to someone, we coulnd't close the bounty
        }

        // return remainging eth (or all e.g. if nothing accepted or closing early)
        uint256 leftoverReward = startingBalance - address(this).balance - bounty.reward;
        (bool success, ) = bounty.creator.call{value: leftoverReward}("");
        bounty.reward = 0;

        removeBountyFromActiveList(_bountyId);
        emit BountyCompleted(_bountyId, numAcceptedSubmissions);
    }

    // Helper function to remove a bounty from the active list
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

    function getBountySubmissions(uint256 _bountyId, uint256 _submissionId) external view returns (Submission memory)
    {
        return bounties[_bountyId].submissions[_submissionId];
    }

    function getActiveBounties() public view returns (uint[] memory) {
        return activeBountyIds;
    }

    // TODO @tom returns lenght of the submission array, submissions 
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
        uint256 submissionsLength
    ) {
        Bounty storage bounty = bounties[_bountyId];
        return (
            bounty.name,
            bounty.description,
            bounty.mediaURIHash,
            bounty.reward,
            bounty.duration,
            bounty.judgeTime,
            bounty.maxProgress,
            bounty.creator,
            bounty.creationBlock,
            bounty.isActive,
            bounty.submissions.length
        );
    }
    function getVersion() external view returns (uint256) 
    {
        return 1;
    }
}
