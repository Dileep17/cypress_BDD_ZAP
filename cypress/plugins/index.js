const cucumber = require('cypress-cucumber-preprocessor').default
const zapClient = require('../customscripts/zapclient')
const htmlReportGenerator = require('../customscripts/reportGenerator') 
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

  on('task', {
    generateCustomReports () {
      return htmlReportGenerator.parseJsonAndGenerateReport();
    }
  })

}