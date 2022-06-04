$(document).ready(function () {

    $("#connect").click(async function async() {
      
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];        
        $("#connect").text(account);

    });
    $("#get_offer").click(async function async() {
      
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
      

    });
    
});