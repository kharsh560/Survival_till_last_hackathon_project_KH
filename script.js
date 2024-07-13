let provider
let signer;
let gameContract;

const contractAddress = "0x8b9FEdBca1fbD498E1aF058821D65F49bbe2f44f";
const contractABI = [{
        "inputs": [{
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "approve_org",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "distribute_pending_tokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "_org_address",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "donate_to_organisation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "approver",
            "type": "address"
        }],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "receiver",
            "type": "address"
        }],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "sender",
            "type": "address"
        }],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "spender",
            "type": "address"
        }],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }],
        "name": "mintTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "owner",
            "type": "address"
        }],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }],
        "name": "getTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "_org",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_funds",
                "type": "uint256"
            }
        ],
        "name": "register_org",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
        }],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "check_my_balance",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contract_balance",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "get_registered_org",
        "outputs": [{
            "components": [{
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "funds_remaining",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "org_address",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "internalType": "struct Game.Registered_org[]",
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "is_org_applied",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "is_org_registered",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "org_queue",
        "outputs": [{
                "internalType": "address",
                "name": "org_address",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "funds_remaining",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "registered_org_arr",
        "outputs": [{
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "funds_remaining",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "org_address",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "registered_orgs",
        "outputs": [{
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "funds_remaining",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "org_address",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }
]

document.getElementById('connectWallet').onclick = async() => {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log(`connected account: ${await signer.getAddress()}`);
    document.getElementById('connectWallet').innerText = `${await signer.getAddress()}`;
    await fetchAndRenderOrganizations()

};

document.getElementById('checkBalance').onclick = async() => {
    try {
        let balance = await contract.check_my_balance(); // Await the asynchronous call
        console.log(balance.toString());
        document.getElementById('balance').innerText = balance.toString();
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
};

async function fetchAndRenderOrganizations() {
    try {
        const organizations = await contract.get_registered_org();
        const orgData = organizations.map(org => ({
            name: org.name,
            description: org.description,
            funds_remaining: org.funds_remaining.toString(),
            org_address: org.org_address
        }));
        renderCards(orgData);
    } catch (error) {
        console.error(error);
        alert('Failed to fetch organizations. Please try again.');
    }
}

function createCard(cardData) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('cardForTokens');

    const leftPartDiv = document.createElement('div');
    leftPartDiv.classList.add('leftPartOfCardForTokens');

    const nameHeader = document.createElement('h4');
    nameHeader.textContent = cardData.name;

    const descriptionHeader = document.createElement('h3');
    descriptionHeader.textContent = cardData.description;

    const fundsHeader = document.createElement('h5');
    fundsHeader.textContent = cardData.funds_remaining;

    const addressHeader = document.createElement('h5');
    addressHeader.textContent = cardData.org_address;

    const rightPartDiv = document.createElement('div');
    rightPartDiv.classList.add('rightPartOfCardForTokens');

    const checkboxInput = document.createElement('input');
    checkboxInput.setAttribute('type', 'checkbox');
    checkboxInput.setAttribute('id', `checkbox${cardData.org_address}`);
    checkboxInput.setAttribute('name', `option${cardData.org_address}`);

    leftPartDiv.appendChild(nameHeader);
    leftPartDiv.appendChild(descriptionHeader);
    leftPartDiv.appendChild(fundsHeader);
    leftPartDiv.appendChild(addressHeader);

    rightPartDiv.appendChild(checkboxInput);

    cardDiv.appendChild(leftPartDiv);
    cardDiv.appendChild(rightPartDiv);

    return cardDiv;
}

function renderCards(cardDataArray) {
    const cardContainer = document.getElementById("mainContainerForTokenCards");
    cardContainer.innerHTML = ''; // Clear existing cards

    cardDataArray.forEach(cardData => {
        const card = createCard(cardData);
        cardContainer.appendChild(card);
    });
}


document.getElementById('getTokens').addEventListener('click', async() => {
    kills = c2_callFunction("getKills");
    try {
        await contract.getTokens(kills);
        alert('Tokens received successfully!');
    } catch (error) {
        console.error(error);
        alert('Failed to get tokens. Please try again.');
    }
});


document.getElementById('donate').addEventListener('click', async() => {
    const orgAddress = document.getElementById("orgAddress").value;
    const amount = document.getElementById("donationAmount").value;
    if (!orgAddress || !amount) {
        alert('Please enter organization address and amount to donate.');
        return;
    }
    try {
        const tx = await contract.donate_to_organisation(orgAddress, amount);
        tx.wait();
    } catch (error) {
        console.log(error);
        alert(`failed to donate. please try again`);
    }
});
/*## Inspiration
There are so many disasters happening and victims needs aid ASAP. So I created a website and hosted my game in which we have to survive and kill monsters, for each monsters we will get 1 token then we can donate these tokens to organization listed in the same website where organization will be host crowd funding. In this manner orgazisation will get capital and use it for good of victims affected by disasters like flood, earthquake.
    
    ## What it does
User play the game, survive till he can, kill the monster Qand for every kill gets tokens and can donate it. For donation they will get reward. the donation will help the organisation to save and provide aid to the victims 
    
    ## How we built it
I used solidity for smart contract and deployed on etherlink. use HTML+css +js for the front end interaction and Construct 2 for building of game.
    
    ## Challenges we ran into
we faced a lot of challenges such as integration of game with front end, Construct 2 is very old software so we faced a lot of incompatibility issue. we faced a lot of issue in perfectly fetching and data form the smart contract.
    
    ## Accomplishments that we're proud of
We are feeling proud the we build a complete full stack project with the integration of game on the web and running fine in this short span of time which aims to help the organisation and victims in the huge disasters, we are fully motivated to complete whole project with full optimization in upcoming time
    
    ## What we learned
Connection of game with web and hosting with along side the integration of blockchain in it was one the coolest thing we learnt. we learnt how to embed a game in to web and send data from game to web
    
    ## What's next for Survival for Humanity
    We are planning to elevate its level further more and encourage people to play out game, earn token and help the needy people, someone's fun will help a lot of victims
*/