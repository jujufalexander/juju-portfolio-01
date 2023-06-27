require('dotenv').config();
const Web3 = require('web3');
const AlchemyWeb3 = require('@alch/alchemy-web3');
const contractABI = require('./contractABI.json');
const nodemailer = require('nodemailer');

// Set up Alchemy provider
const alchemyApiKey = 'ALCHEMY-KEY-GOES-HERE';
const alchemyProvider = AlchemyWeb3.createAlchemyWeb3(alchemyApiKey);

// Create Web3 instance using the Alchemy provider
const web3 = new Web3(alchemyProvider);

const contractAddress = 'YOUR-CONTRACT-ADDRESS-GOES-HERE'; 

const connectWallet = async () => {
    try {
        const accounts = await web3.eth.requestAccounts();
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        await contract.methods.connectWallet(accounts[0]).send({ from: accounts[0] });
        document.getElementById('wallet-address').value = accounts[0];
    } catch (err) {
        console.error(err);
    }
};

const submitForm = async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const walletAddress = document.getElementById('wallet-address').value;

    try {
        const accounts = await web3.eth.requestAccounts();
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        await contract.methods.connectWallet(walletAddress).send({ from: accounts[0] });

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });        

        const mailOptions = {
            from: 'SOURCE-EMAIL-GOES-HERE',
            to: 'RECEIVING-EMAIL-GOES-HERE',
            subject: 'New Form Submission',
            text: `New submission with email: ${email}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email notification sent: ' + info.response);
            }
        });

        // Make the API request to Formspree using the environment variable
    axios.post(process.env.FORMSPREE_ENDPOINT, { email, walletAddress })
    .then(response => {
      // Handle the Formspree response
      console.log(response.data);
      // Reset the form
      document.getElementById('email').value = '';
      document.getElementById('wallet-address').value = '';
    })
    .catch(error => {
      // Handle any errors
      console.error(error);
    });
        // Reset the form
        document.getElementById('email').value = '';
        document.getElementById('wallet-address').value = '';
    } catch (err) {
        console.error(err);
    }
};

const connectWalletButton = document.getElementById('connect-wallet-button');
connectWalletButton.addEventListener('click', connectWallet);

const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', submitForm);
