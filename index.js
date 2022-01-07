// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const axios = require('axios');
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  function statusElevatorHandler(agent){
    const elevator_id = agent.parameters.elevator_id;
    agent.add('Hello there');
    let response = {};
    return axios.get(`https://rocketaiweek.azurewebsites.net/api/elevators/${elevator_id}/status`).then(function(result){
      response.status_elevator = result.data;
    }).then(() => {
      agent.add(`The elevator ${elevator_id} is ${response.status_elevator}`);
    });
    
    
  }
  function statusBatteryHandler(agent){
    const battery_id = agent.parameters.battery_id;
    agent.add('Hello there');
    let response = {};
    return axios.get(`https://rocketaiweek.azurewebsites.net/api/elevators/${battery_id}/status`).then(function(result){
      response.status_battery = result.data;
    }).then(() => {
      agent.add(`The battery ${battery_id} is ${response.status_battery}`);
    });
  }
  function statusColumnHandler(agent){
    const column_id = agent.parameters.column_id;
    agent.add('Hello there');
    let response = {};
    return axios.get(`https://rocketaiweek.azurewebsites.net/api/columns/${column_id}/status`).then(function(result){
      response.status_column = result.data;
    }).then(() => {
      agent.add(`The column ${column_id} is ${response.status_column}`);
    });
  }
  function statusInterventionHandler(agent){
    const intervention_id = agent.parameters.intervention_id;
    agent.add('Hello there');
    let response = {};
    return axios.get(`https://rocketaiweek.azurewebsites.net/api/interventions/${intervention_id}/status`).then(function(result){
      response.status_intervention = result.data;
    }).then(() => {
      agent.add(`The Intervention ${intervention_id} is ${response.status_intervention}`);
    });
  }
  function greetingHandler(agent) {
    const word = agent.parameters.word;
    agent.add('Greeting');
    let response = {};
    
    return axios.get(`https://rocketaiweek.azurewebsites.net/api/alexa/`).then(function(result){
      	response.nb_elevators = result.data.elevators;
      	response.nb_buildings = result.data.buildings;
      	response.nb_customers = result.data.customers;
      	response.nb_stopped = result.data.stopped;
      	response.nb_batteries = result.data.batteries;
      	response.nb_quotes = result.data.quotes;
      	response.nb_leads = result.data.leads;
    	console.log(response);
    }).then(() => {
      return axios.get(`https://rocketaiweek.azurewebsites.net/api/addresses/city`).then(function(result){
        response.nb_cities = result.data.length;
      }).then(() => {
      	agent.add(`There are currently ${response.nb_elevators} elevators deployed in the ${response.nb_buildings} buildings of your ${response.nb_customers} customers`);
      	agent.add(`Currently, ${response.nb_stopped} elevators are not in Running Status and are being serviced`);
      	agent.add(`${response.nb_batteries} Batteries are deployed across ${response.nb_cities} cities`);
      	agent.add(`On another note you currently have ${response.nb_quotes} quotes awaiting processing`);
      	agent.add(`You also have ${response.nb_leads} leads in your contact requests`);
    });
      
      
    });
    
    
    
  }

  

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Greeting', greetingHandler);
  intentMap.set('StatusElevator', statusElevatorHandler);
  intentMap.set('StatusBattery', statusBatteryHandler);
  intentMap.set('StatusColumn', statusColumnHandler);
  intentMap.set('StatusIntervention', statusInterventionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
