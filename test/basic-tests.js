const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lease A token", function () {
  it("Should be able to create an offer", async function () {
    const RENT_BALANCE = 324324324;
    const RENT = 12134333553;
    const TENURE = 237688332;
    const [owner, renter] = await ethers.getSigners();
    const AToken = await ethers.getContractFactory("AToken");
    const token = await AToken.deploy();          
    const LeaseTokens = await ethers.getContractFactory("LeaseTokens");
    const leaseTokens = await LeaseTokens.deploy();    
    await token.connect(owner).approve(leaseTokens.address, RENT_BALANCE);    
    await leaseTokens.connect(owner).offer(token.address, RENT_BALANCE, RENT, TENURE);      
    expect(await token.allowance(owner.address, leaseTokens.address)).to.equal(RENT_BALANCE);

    
  });
  it("Should be able to take an offer", async function () {
    
    const RENT_BALANCE = 324324324;
    const RENT = 3;
    const TENURE = 237688332;
    const [owner, renter] = await ethers.getSigners();
    const AToken = await ethers.getContractFactory("AToken");
    const token = await AToken.deploy();             
    const LeaseTokens = await ethers.getContractFactory("LeaseTokens");
    const leaseTokens = await LeaseTokens.deploy();    
    await token.connect(owner).approve(leaseTokens.address, RENT_BALANCE);    
    await leaseTokens.connect(owner).offer(token.address, RENT_BALANCE, RENT, TENURE);      
    expect(await token.allowance(owner.address, leaseTokens.address)).to.equal(RENT_BALANCE);
    
    let prevBalance = await ethers.provider.getBalance(leaseTokens.address);
    await leaseTokens.connect(renter).take(owner.address, {value: RENT});  
    let currBalance = await ethers.provider.getBalance(leaseTokens.address);

    let num = ethers.BigNumber.from(currBalance);
    let num2 = ethers.BigNumber.from(prevBalance);
    
    expect(num.sub(num2)).to.equal(RENT); //rent recived

    let lease = await leaseTokens.connect(renter).leases(renter.address);  
    expect(lease.rentee).to.equal(owner.address);
    expect(lease.rentedBal).to.equal(RENT_BALANCE);
    expect(lease.tenure).to.equal(TENURE);

  });
  it("Should be able to vacate an active lease to another recipient", async function () {
    const RENT_BALANCE = 324324324;
    const RENT = 3;
    const TENURE = 237688332;
    const [owner, renter, recipient] = await ethers.getSigners();
    const AToken = await ethers.getContractFactory("AToken");
    const token = await AToken.deploy();             
    const LeaseTokens = await ethers.getContractFactory("LeaseTokens");
    const leaseTokens = await LeaseTokens.deploy();    
    await token.connect(owner).approve(leaseTokens.address, RENT_BALANCE);    
    await leaseTokens.connect(owner).offer(token.address, RENT_BALANCE, RENT, TENURE);      
    expect(await token.allowance(owner.address, leaseTokens.address)).to.equal(RENT_BALANCE);
    
    let prevBalance = await ethers.provider.getBalance(leaseTokens.address);
    await leaseTokens.connect(renter).take(owner.address, {value: RENT});  
    let currBalance = await ethers.provider.getBalance(leaseTokens.address);

    let num = ethers.BigNumber.from(currBalance);
    let num2 = ethers.BigNumber.from(prevBalance);
    
    expect(num.sub(num2)).to.equal(RENT); //rent recived

    let lease = await leaseTokens.connect(renter).leases(renter.address);  
    expect(lease.rentee).to.equal(owner.address);
    expect(lease.rentedBal).to.equal(RENT_BALANCE);
    expect(lease.tenure).to.equal(TENURE);
    
    let prevBalanceOwner = await ethers.provider.getBalance(owner.address);
    //executing a vacation on an active lease - passing to any recipient
    await leaseTokens.connect(renter).vacate(recipient.address); 

    let currBalanceOwner = await ethers.provider.getBalance(owner.address);
    let recipientBalance = await token.balanceOf(recipient.address);

    expect(ethers.BigNumber.from(recipientBalance)).to.equal(RENT_BALANCE);
    let num3 = ethers.BigNumber.from(currBalanceOwner);
    let num4 = ethers.BigNumber.from(prevBalanceOwner);
    expect(num3.sub(num4)).to.equal(RENT); //rent returned
    
  });

  it("Should be able to vacate an active lease back to the rentee", async function () {
    const RENT_BALANCE = 324324324;
    const RENT = 34873827478659;
    const TENURE = 237688332;
    const [owner, renter, recipient] = await ethers.getSigners();
    const AToken = await ethers.getContractFactory("AToken");
    const token = await AToken.deploy();             
    const LeaseTokens = await ethers.getContractFactory("LeaseTokens");
    const leaseTokens = await LeaseTokens.deploy();    
    await token.connect(owner).approve(leaseTokens.address, RENT_BALANCE);    
    await leaseTokens.connect(owner).offer(token.address, RENT_BALANCE, RENT, TENURE);      
    expect(await token.allowance(owner.address, leaseTokens.address)).to.equal(RENT_BALANCE);
    
    let prevBalance = await ethers.provider.getBalance(leaseTokens.address);
    await leaseTokens.connect(renter).take(owner.address, {value: RENT});  
    let currBalance = await ethers.provider.getBalance(leaseTokens.address);

    let num = ethers.BigNumber.from(currBalance);
    let num2 = ethers.BigNumber.from(prevBalance);
    
    expect(num.sub(num2)).to.equal(RENT); //rent recived

    let lease = await leaseTokens.connect(renter).leases(renter.address);  
    expect(lease.rentee).to.equal(owner.address);
    expect(lease.rentedBal).to.equal(RENT_BALANCE);
    expect(lease.tenure).to.equal(TENURE);
    
    let prevBalanceOwner = await ethers.provider.getBalance(owner.address);
    //executing a vacation on an active lease - returning to the rentee 
    //await leaseTokens.connect(renter).setSTART(renter.address, 90*Math.ceil(TENURE/100));
    await leaseTokens.connect(renter).vacate(owner.address); 
    let currBalanceOwner = await ethers.provider.getBalance(owner.address);
    let num3 = ethers.BigNumber.from(currBalanceOwner);
    let num4 = ethers.BigNumber.from(prevBalanceOwner);
    
    //expect(); 
    //expect(); 
    
  });
  it("Should be able to vacate an expired lease", async function () {
    const RENT_BALANCE = 324324324;
    const RENT = 3;
    const TENURE = 0; //expired lease
    const [owner, renter, recipient] = await ethers.getSigners();
    const AToken = await ethers.getContractFactory("AToken");
    const token = await AToken.deploy();             
    const LeaseTokens = await ethers.getContractFactory("LeaseTokens");
    const leaseTokens = await LeaseTokens.deploy();    
    await token.connect(owner).approve(leaseTokens.address, RENT_BALANCE);    
    await leaseTokens.connect(owner).offer(token.address, RENT_BALANCE, RENT, TENURE);      
    expect(await token.allowance(owner.address, leaseTokens.address)).to.equal(RENT_BALANCE);
    
    let prevBalance = await ethers.provider.getBalance(leaseTokens.address);
    await leaseTokens.connect(renter).take(owner.address, {value: RENT});  
    let currBalance = await ethers.provider.getBalance(leaseTokens.address);

    let num = ethers.BigNumber.from(currBalance);
    let num2 = ethers.BigNumber.from(prevBalance);
    
    expect(num.sub(num2)).to.equal(RENT); //rent recived

    let lease = await leaseTokens.connect(renter).leases(renter.address);  
    expect(lease.rentee).to.equal(owner.address);
    expect(lease.rentedBal).to.equal(RENT_BALANCE);
    expect(lease.tenure).to.equal(TENURE);
    
    let prevBalanceOwner = await ethers.provider.getBalance(owner.address);
    await leaseTokens.connect(renter).vacate(recipient.address); 
    let currBalanceOwner = await ethers.provider.getBalance(owner.address);
   
    let num3 = ethers.BigNumber.from(currBalanceOwner);
    let num4 = ethers.BigNumber.from(prevBalanceOwner);
    expect(num3.sub(num4)).to.equal(RENT); //rent returned    

    let recipientBalance = await token.balanceOf(recipient.address);
    expect(ethers.BigNumber.from(recipientBalance)).to.equal(0);

    let renteeBalance = await token.balanceOf(owner.address);
    expect(ethers.BigNumber.from(renteeBalance)).to.equal(await token.totalSupply());
    
  });

  it("Should be able to claim an expired lease", async function () {
    const RENT_BALANCE = 324324324;
    const RENT = 3;
    const TENURE = 0; //expired lease
    const [owner, renter, recipient] = await ethers.getSigners();
    const AToken = await ethers.getContractFactory("AToken");
    const token = await AToken.deploy();             
    const LeaseTokens = await ethers.getContractFactory("LeaseTokens");
    const leaseTokens = await LeaseTokens.deploy();    
    await token.connect(owner).approve(leaseTokens.address, RENT_BALANCE);    
    await leaseTokens.connect(owner).offer(token.address, RENT_BALANCE, RENT, TENURE);      
    expect(await token.allowance(owner.address, leaseTokens.address)).to.equal(RENT_BALANCE);
    
    let prevBalance = await ethers.provider.getBalance(leaseTokens.address);
    await leaseTokens.connect(renter).take(owner.address, {value: RENT});  
    let currBalance = await ethers.provider.getBalance(leaseTokens.address);

    let num = ethers.BigNumber.from(currBalance);
    let num2 = ethers.BigNumber.from(prevBalance);
    
    expect(num.sub(num2)).to.equal(RENT); //rent recived

    let lease = await leaseTokens.connect(renter).leases(renter.address);  
    expect(lease.rentee).to.equal(owner.address);
    expect(lease.rentedBal).to.equal(RENT_BALANCE);
    expect(lease.tenure).to.equal(TENURE);
    
    let prevBalanceOwner = await ethers.provider.getBalance(owner.address);
    await leaseTokens.connect(owner).claim(renter.address); 
    let currBalanceOwner = await ethers.provider.getBalance(owner.address);
   
    let num3 = ethers.BigNumber.from(currBalanceOwner);
    let num4 = ethers.BigNumber.from(prevBalanceOwner);
    /*expect(num3.sub(num4)).to.equal(RENT); //rent returned    

    let recipientBalance = await token.balanceOf(recipient.address);
    expect(ethers.BigNumber.from(recipientBalance)).to.equal(0);

    let renteeBalance = await token.balanceOf(owner.address);
    expect(ethers.BigNumber.from(renteeBalance)).to.equal(await token.totalSupply());*/
    
  });
});
