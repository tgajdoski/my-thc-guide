'use strict';
var Alexa = require('alexa-sdk');
const databaseManager = require('./databaseManager');

var APP_ID = 'amzn1.ask.skill.30b8e1d7-4cf3-4f84-897c-839a9727de67';

var SKILL_NAME = "My THC guide";
var GET_FACT_MESSAGE = "Here's your cannabis fact: ";
var HELP_MESSAGE = "You can say tell me a cannabis fact, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

var data = [
  "Approximately 9% of people who try marijuana become addicted to it, compared to 15% of people who try cocaine, and 24 % of those who try heroin.",
  "Teenagers don’t smoke more pot in states where marijuana is legal than in states where it is illegal.",
  "The word “canvas” is related to the word “cannabis.” Historically, canvases were made of hemp.",
  "In the United States, about 750,000 people are arrested each year for marijuana offenses. However, not all arrests lead to prison time, and less than 1% of inmates in state and federal prisons are in for possession alone.",
  "Scientists have found that a marijuana compound can freeze and stop the spread of some types of aggressive cancer.",
  "Both Thomas Jefferson and George Washington grew hemp on their plantations. The British crown even ordered the colonists to grow the plant.",
  "Since 2015, marijuana has become the fastest growing industry in the U.S. If marijuana becomes legal in all 50 states, the industry will become larger than the organic food market",
  "The first item sold over the Internet was a bag of marijuana over 40 years ago. Stanford students used Arapnet (an early form of the Internet) to buy weed from their counterparts at MIT.",
  "Marijuana is the most common illegal drug used in the United States. Approximately 100 million Americans have tried marijuana at least once, and more than 25 million have smoked it in the last year.",
  "According to the U.N., 158.8 million people around the world use marijuana, which is over 3.8% of the world’s population.",
  "According to one national survey on drug use, each day approximately 6,000 Americans try marijuana for the first time.",
  "In the United States, marijuana use is three times higher than the global average. However, the rate of use is about the same as other Western democracies",
  "The primary active ingredient in marijuana is THC (delta 9 tetrhydrocannabinol). It is this chemical that produces marijuana’s mind-altering effects.",
  "Cannabis seeds were used as a food source in China as early as 6000 B.C.",
  "The first recorded use of marijuana as a medicinal drug occurred in 2737 B.C. by Chinese emperor Shen Nung. The emperor documented the drug’s effectiveness in treating the pains of rheumatism and gout.",
  "In October of 1937, Samuel Caldwell was the first U.S. citizen arrested under the Marihuana Tax Act for selling marijuana without paying the newly mandated tax. He was fined $1,000 and sentenced to four years of hard labor in Leavenworth.",
  "From 1850 to 1942, marijuana was listed in the United States Pharmacopoeia as a useful medicine for nausea, rheumatism, and labor pains and was easily obtained at the local general store or pharmacy.",
  "In 2003, Canada became the first country in the world to offer medical marijuana to pain-suffering patients.",
  "In 1996, California became the first U.S. state to legally allow medical marijuana for patients with a valid doctor’s recommendation.",
  "The energy needed to produce 2.2 pounds of marijuana indoors is equivalent to the amount of energy required to drive across the U.S. five times in a car that gets 44 miles to the gallon.",
  "The first two drafts of the United States Declaration of Independence were written on paper made from hemp.",
  "In a 2013 survey, appropriately titled “Ignorance Is Not Bliss,” researchers found that only “13 percent of U.S. medical schools teach the endocannabinoid system to future doctors.” Cannabis research is limited primarily due to its federally illegal status, which prevents government institutions like the FDA from conducting clinical studies. ",
  "The endocannabinoid system works in overdrive when diseases are present. Scientists have found that with a variety of illnesses, the ECS system shows increased activity and greater expression to restore the body’s natural balance.",
  "You don’t need psychoactive THC to stimulate the endocannabinoid system. CBD found in industrial hemp is among many cannabinoids which activate the ECS to provide a range of physical and psychological health benefits. However, THC and CBD combined pack a powerful punch by bringing out the other’s best traits.",
  "Cannabis contains more than 113 cannabinoids",
  "THC acts on specific brain cell receptors called cannabinoids.",
  "The compound is also known to stimulate appetite (informally known as 'the munchies') and induce a relaxed state, as well as other effects on sense of smell, hearing, and eyesight. THC can also cause fatigue. In some people, THC may reduce aggression."
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