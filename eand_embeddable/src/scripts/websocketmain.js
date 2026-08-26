import controller from './notifications-controller.js';
import config from './config.js';

// Obtain a reference to the platformClient object
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// API instances
const usersApi = new platformClient.UsersApi();
//const conversationsApi = new platformClient.ConversationsApi();

let userId='';
let agentName='';
let agentAlias='';



function onUserConversationEvent(data) {
    console.log(`CXClient:onUserConversationEvent`);
    if(window.CallbackParent) {
        console.log(`Triggering window.CallbackParent`);
        window.CallbackParent(data);
    } else {
        console.log(`Callback Func Empty`);
    }
    if(window.parent.CallbackParent) {
        console.log(`Triggering window.parent.CallbackParent`);
        window.parent.CallbackParent(data);
    }
    window.parent.postMessage(data);
}

function setupUserChannel(){
    const _prefix=`CXClient:${userId}`;
    return controller.createChannel()
    .then(data => {
        // Subscribe to all incoming messages
        console.info(`${_prefix}setting up subscription for v2.users.${userId}.conversations`);
        return controller.addSubscription(
            `v2.users.${userId}.conversations`,
            onUserConversationEvent)
    });
}



/////////////////////
///// Initial Setup
////////////////////

const urlParams = new URLSearchParams(window.location.search);

client.setPersistSettings(true, 'cx-notification-client');
client.setEnvironment(config.genesysCloud.region);
client.loginImplicitGrant(
    config.clientID,
    config.redirectUri)
.then(data => {
    console.log(`CXClient:Authenticated:${JSON.stringify(data)}`);
    // Get Details of current User
    return usersApi.getUsersMe();
}).then(userMe => {
    userId = userMe.id;
    agentName = userMe.name;
    agentAlias = agentName ? agentName : agentAlias;
    console.log(`CXClient:setting up channels`)
    return setupUserChannel();
}).then((data)=>{
    console.log(`CXClient:Finished Setup:${JSON.stringify(data)}`);
}).catch(e => console.log(`CXClient:Error Initial setup had following error ${JSON.stringify(e)}`));
