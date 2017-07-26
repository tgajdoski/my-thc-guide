'use strict';
var Alexa = require('alexa-sdk');
const databaseManager = require('./databaseManager');

var APP_ID = 'amzn1.ask.skill.30b8e1d7-4cf3-4f84-897c-839a9727de67';

var SKILL_NAME = "My THC guide";
var GET_FACT_MESSAGE = "Here's your fact: ";
var HELP_MESSAGE = "You can say tell me a cannabis fact, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

var data = [
    "A year on Mercury is just 88 days long.",
    "Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.",
    "Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.",
    "On Mars, the Sun appears about half the size as it does on Earth.",
    "Earth is the only planet not named after a god.",
    "Jupiter has the shortest day of all the planets.",
    "The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.",
    "The Sun contains 99.86% of the mass in the Solar System.",
    "The Sun is an almost perfect sphere.",
    "A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.",
    "Saturn radiates two and a half times more energy into space than it receives from the sun.",
    "The temperature inside the Sun can reach 15 million degrees Celsius.",
    "The Moon is moving approximately 3.8 cm away from our planet every year."
];

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
  });
}

function findFactsDBCount() {
  return databaseManager.findFactsCount().then(item => {
    console.log(item);
  });
}


var handlers = {
    'LaunchRequest': function () {
        this.emit('GetTHCFactIntent');
    },
    'GetTHCFactIntent': function () {
      // tuka ke treba da se stavi logikata so baraj koi id se za toj userid veke iskoristeni i vo nov random da se trgaat tie
        console.log(this.event.session.user.userId);
   //     findUserFactBase(this.event.session.user.userId);

        var factArr = data;
        var factIndex = Math.floor(Math.random() * factArr.length);

        var factCount = findFactsDBCount();
        console.log('factCount : ' + factCount );


        var randomFact = factArr[factIndex];
        var speechOutput = GET_FACT_MESSAGE + randomFact;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
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