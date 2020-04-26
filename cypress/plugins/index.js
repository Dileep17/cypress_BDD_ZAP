const cucumber = require('cypress-cucumber-preprocessor').default
const zapClient = require('../customscripts/zapclient')
 
module.exports = (on, config) => {

  on('file:preprocessor', cucumber()),

  on('task', {
    initZapClient () {
      return zapClient.initForScan();
    }
  }),

  on('task', {
    runActiveScan () {
      return zapClient.runActiveScan();
    }
  }),

  on('task', {
    generateReports () {
      return zapClient.generateReports();
    }
  })

}