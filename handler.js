'use strict';
var Alexa = require('alexa-sdk');
const databaseManager = require('./databaseManager');

var APP_ID = 'amzn1.ask.skill.30b8e1d7-4cf3-4f84-897c-839a9727de67';

var SKILL_NAME = "My THC guide";
var GET_FACT_MESSAGE = "Here's your cannabis fact: ";
var HELP_MESSAGE = "You can say tell me a cannabis fact, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

module.exports.intents = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId  = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function findUserFactBase(userId) {
  return databaseManager.findUserFactsId(userId).then(item => {
     console.log(userId);
     console.log(item);
     return item;
  });
}

// function findFactsDBCount() {
//   return databaseManager.findFactsCount().then(item => {
//     console.log(item);
//     return item;
//   });
// }


var handlers = {
    'LaunchRequest': function () {
        this.emit('GetTHCFactIntent');
    },
    'GetTHCFactIntent': function () {
      // tuka ke treba da se stavi logikata so baraj koi id se za toj userid veke iskoristeni i vo nov random da se trgaat tie
      //  console.log(this.event.session.user.userId);

   //  vikaj so .then ova =>  findUserFactBase(this.event.session.user.userId);

//        var factArr = data;
        var factCount = 0;
        console.log('PRED DA VIKNAM');
        databaseManager.findFactsCount()
        .then(item => {
           factCount = item;
           console.log('factCount : ' + factCount );
           var factIndex = Math.floor(Math.random() * factCount-1);
            databaseManager.findFactsId(factIndex)
              .then(item => {
                var randomFact = item.cannabis_fact;
                var speechOutput = GET_FACT_MESSAGE + randomFact;
                this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
              });
        })
        .catch(error => {
            console.log(error);
        });
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};