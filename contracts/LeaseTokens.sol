//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title A Lease your token platform contract
/// @author Yash Sharma 
/// @notice This contract is to be used for curating, accepting 
/// and enforcing lease offers for tokens
/// @dev there are no events

contract LeaseTokens {
    
    struct Offer {
        address token;
        uint256 rentedBal;
        uint256 rent;
        uint256 tenure;
    }
    struct Lease {
        address token;
        address rentee;
        uint256 rentedBal;
        uint256 tenure;
        uint256 rent;
        uint256 start;
    }
    //mapping for the offers
    mapping(address => Offer) public offers;
    //mapping for the leases
    mapping(address => Lease) public leases;

    /// @notice This function creates an offer and curates it
    /// @dev Explain to a developer any extra details
    function offer(
        address _token,
        uint256 _rentedBal,
        uint256 _rent,
        uint256 _tenure
    ) external {
        IERC20 token = IERC20(_token);
        require(
            token.allowance(msg.sender, address(this)) >= _rentedBal,
            "you have to approve control of tokens"
        );
        offers[msg.sender] = Offer(_token, _rentedBal, _rent, _tenure);
    }

    /// @notice This function allows the renter to take up an offer
    /// @dev No events here
    function take(address _rentee) external payable {
        require(offers[_rentee].token != address(0), "no token here");
        Offer memory o = offers[_rentee];
        require(msg.value >= o.rent, "you are not paying enough to lease");
        leases[msg.sender] = Lease(
            o.token,
            _rentee,
            o.rentedBal,
            o.tenure,
            o.rent,
            block.timestamp
        );
        delete offers[_rentee];
    }

    /// @notice This function allows the renter to vacate a lease
    /// @dev No events here
    /// @param _recipient - is the recipient of the leased tokens
    function vacate(address _recipient) external {
        require(
            leases[msg.sender].token != address(0),
            "no lease for this renter"
        );
        IERC20 token = IERC20(leases[msg.sender].token);
        Lease memory l = leases[msg.sender];
        if (l.tenure > (block.timestamp - l.start)) {
            uint frac = ((block.timestamp - l.start)*100)/l.tenure;
            token.transferFrom(l.rentee, _recipient, l.rentedBal);           
            if (_recipient == l.rentee) {               
                payable(l.rentee).transfer(
                   l.rent *frac/100
                );                
                payable(msg.sender).transfer(
                     l.rent - (l.rent *frac)/100                    
                );
            } else {
                payable(l.rentee).transfer(l.rent);
            }
        } else {
            token.transferFrom(l.rentee, l.rentee, l.rentedBal);
            payable(l.rentee).transfer(l.rent);
        }
        delete leases[msg.sender];
    }

    /// @notice This function allows the renter to vacate a lease
    /// @dev No events here
   
    function claim(address _renter) external {
        require(
            leases[_renter].token != address(0),
            "no lease for this renter"
        );  
        Lease memory l = leases[_renter]; 
        require(msg.sender == l.rentee, "you are not the rentee");     
        IERC20 token = IERC20(l.token);
        
        if (l.tenure > (block.timestamp - l.start)) {
            uint frac = ((block.timestamp - l.start)*100)/l.tenure;
            payable(l.rentee).transfer(
                  l.rent *frac/100
            );
            l.start = block.timestamp;
            payable(_renter).transfer(l.rent - (l.rent *frac)/100);
        } else {
            token.transferFrom(l.rentee, l.rentee, l.rentedBal);
            payable(l.rentee).transfer(l.rent);
            delete leases[_renter];
        }
    }
    /// @notice This function allows the rentee to delete a lease
    /// @dev No events here    
    function deleteOffer() external {
         require(
            leases[msg.sender].token != address(0),
            "no lease for this renter"
        );
        IERC20 token = IERC20(leases[msg.sender].token);
        Lease memory l = leases[msg.sender];
        token.transferFrom(l.rentee, l.rentee, l.rentedBal);
        delete offers[msg.sender];
    }

    receive() external payable {}

    //THIS IS FOR TEST

   /* function setSTART(address _renter, uint _prepose) external {
        leases[_renter].start = block.timestamp - _prepose;
    }*/
}
