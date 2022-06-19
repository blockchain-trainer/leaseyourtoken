$(document).ready(function () {
    let contract;
    let web3;
    async function initContract() {
        web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
        var contractAddress = '0xD194C2c0F253a3303b9f3b35Cf2C0bDEF40a6F86';
        var abi = [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_renter",
                        "type": "address"
                    }
                ],
                "name": "claim",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "deleteOffer",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "leases",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "token",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "rentee",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rentedBal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tenure",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rent",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "start",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_token",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_rentedBal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_rent",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_tenure",
                        "type": "uint256"
                    }
                ],
                "name": "offer",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "offers",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "token",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rentedBal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rent",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tenure",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_rentee",
                        "type": "address"
                    }
                ],
                "name": "take",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_recipient",
                        "type": "address"
                    }
                ],
                "name": "vacate",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "stateMutability": "payable",
                "type": "receive"
            }
        ];
        abiToken = [
            {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "balance",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ]
        contract = new web3.eth.Contract(abi, contractAddress);

    }


    $("#connect").click(async function async() {

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        $("#connect").text(account);
        await initContract();

    });
    $("#add_offer").click(async function async() {

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        let token_address = $('#token_address').val();
        tokenContract = new web3.eth.Contract(abiToken, token_address);
        let rentedAmount = $('#rented_amount').val();
        console.log(contract);
        await tokenContract.methods.
        approve(contract._address, rentedAmount).
        send({ from: account }, function (err, res) {
            if (err) {
                console.log("An error occured", err)
                return
            }
            console.log("Hash of the transaction: " + res)
        });
        let rentAmount = $('#rent_amount').val();
        let tenure = $('#tenure').val();
        await contract.methods
            .offer(token_address, rentedAmount, rentAmount, tenure)
            .send({ from: account }, function (err, res) {
                if (err) {
                    console.log("An error occured", err)
                    return
                }
                console.log("Hash of the transaction: " + res)
            });


    });

    $("#get_offer").click(async function async() {

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        let rentee = $('#offer_address').val();
        let offer = await contract.methods
            .offers(rentee)
            .call({ from: account });
        $("#offer").text(JSON.stringify(offer));
    });

    $("#take_offer").click(async function async() {

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        let rentee = $('#offer_address').val();
        let rent = JSON.parse($("#offer").val()).rent;;
        await contract.methods
        .take(rentee)
        .send({ from: account,  value: rent}, function (err, res) {
            if (err) {
                console.log("An error occured", err)
                return
            }
            console.log("Hash of the transaction: " + res)
        });
    });
    $("#get_lease").click(async function async() {

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        let renter = $('#lease_address').val();
        let lease = await contract.methods
            .leases(renter)
            .call({ from: account });
        $("#lease").text(JSON.stringify(lease));
    });

    $("#vacate_lease").click(async function async() {

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        let to_vacate = $('#vacate_address').val();
        await contract.methods
        .vacate(to_vacate)
        .send({ from: account}, function (err, res) {
            if (err) {
                console.log("An error occured", err)
                return
            }
            console.log("Hash of the transaction: " + res)
        });
    });

    $("#claim_lease").click(async function async() {

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        let to_claim = $('#claim_address').val();
        await contract.methods
        .claim(to_claim)
        .send({ from: account}, function (err, res) {
            if (err) {
                console.log("An error occured", err)
                return
            }
            console.log("Hash of the transaction: " + res)
        });
    });

});