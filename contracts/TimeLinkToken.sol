// contracts/TimeLinkToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract TimeLinkToken is ERC20, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    address public distributionContract;
    
    // 분배 비율 (베이스 포인트: 10000 = 100%)
    uint256 public constant CREATOR_SHARE = 6000;    // 60%
    uint256 public constant UPLOADER_SHARE = 1000;   // 10%
    uint256 public constant PLATFORM_SHARE = 2000;   // 20%
    uint256 public constant ECOSYSTEM_SHARE = 1000;  // 10%
    
    mapping(address => bool) public minters;
    
    constructor() ERC20("TimeLink Token", "TLT") {
        // 초기 발행량
        _mint(msg.sender, 100_000_000 * 10**18); // 초기 유동성
    }
    
    modifier onlyMinter() {
        require(minters[msg.sender], "Not authorized minter");
        _;
    }
    
    function mintToUser(
        address user,
        uint256 amount,
        DistributionParams calldata params
    ) external onlyMinter whenNotPaused returns (bool) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        // 포인트 배분
        uint256 creatorAmount = amount * CREATOR_SHARE / 10000;
        uint256 uploaderAmount = amount * UPLOADER_SHARE / 10000;
        uint256 platformAmount = amount * PLATFORM_SHARE / 10000;
        uint256 ecosystemAmount = amount * ECOSYSTEM_SHARE / 10000;
        
        _mint(params.creator, creatorAmount);
        _mint(params.uploader, uploaderAmount);
        _mint(owner(), platformAmount);
        _mint(address(this), ecosystemAmount); // 생태계 펀드
        
        return true;
    }
    
    struct DistributionParams {
        address creator;
        address uploader;
        uint256 playSeconds;
        uint256 adRevenue;
    }
}

// contracts/StakingContract.sol
contract TLStaking is Ownable, ReentrancyGuard {
    IERC20 public tltToken;
    
    struct StakeInfo {
        uint256 amount;
        uint256 stakeTime;
        uint256 lastRewardTime;
        uint256 pendingRewards;
    }
    
    mapping(address => StakeInfo) public stakes;
    uint256 public rewardRate = 100; // 연 10% (100/1000)
    uint256 public totalStaked;
    
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(tltToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        StakeInfo storage stakeInfo = stakes[msg.sender];
        
        // 보상 계산
        if (stakeInfo.amount > 0) {
            uint256 reward = calculateReward(msg.sender);
            stakeInfo.pendingRewards += reward;
        }
        
        stakeInfo.amount += amount;
        stakeInfo.stakeTime = block.timestamp;
        stakeInfo.lastRewardTime = block.timestamp;
        
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
}
