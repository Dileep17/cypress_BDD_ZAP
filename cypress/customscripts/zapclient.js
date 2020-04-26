
const ZapClient = require('zaproxy');
const path = require("path");
const sessionName = "AutomationSession";
const contextName = "AutomatedContext";
const policyName = "AutomatedPolicy";
const fs = require('fs');
let scanId = "100";
const zapOptions = {
    apiKey: "12345",
    proxy: "https://127.0.0.1:8091"
};

const zaproxy = new ZapClient(zapOptions);

async function initForScan(){
    await zaproxy.core.newSession(sessionName, true)
    .then(
        resp => console.log("created session: " + JSON.stringify(resp)),
        err => console.log('Failed to create session: ' + err.message)
      );

    await zaproxy.core.loadSession(sessionName)
    .then(
        resp => console.log("Session Loaded: " + JSON.stringify(resp)),
        err => console.log('Failed to load session'  + err.message)
    );

    let contextFilePath = path.resolve("zapconfig/"+contextName+".context");
    console.log("context File path:- " + contextFilePath);
    await zaproxy.context.importContext(contextFilePath)
    .then(
        resp => console.log("created context: " + JSON.stringify(resp)),
        err => console.log('Failed to create context: ' + err.message)
    );
    await zaproxy.ascan.removeScanPolicy(policyName)
    .then(
        resp =>  console.log("removed scan policy: " + JSON.stringify(resp)),
        err => console.log("Failed to removed scan policy: " + err.message)
    );
    let policyFilePath = path.resolve("zapconfig/"+policyName+".policy");
    await zaproxy.ascan.importScanPolicy(policyFilePath)
    .then(
        resp => console.log("created ascan policy: " + JSON.stringify(resp)),
        err => console.log('Failed to create ascan policy: ' + err.message)
    );

    await zaproxy.pscan.setScanOnlyInScope(true)
    .then(
        resp => console.log("PScan URLS Only InScope: " + JSON.stringify(resp)),
        err => console.log('Failed to set PScan URLS Only InScope: ' + err.message)
    );

    return null;
}

async function runActiveScan(){
    await sleep(2000);
    let contextId = await zaproxy.context.context(contextName)
    .then(
        resp => { return resp.context.id },
        err => console.log(" error in getting contextID = "+err.message)
    );
    scanId = await zaproxy.ascan.scan("", "", "", policyName, "", "", contextId)
    .then(
        resp => { return resp.scan; },
        err => console.log("failed to start ascan " + err.message)
    );

    await pollProgressOfAscan(scanId);
    return null;
}

async function pollProgressOfAscan(scanId){
    console.log("**** in pollProgressOfAscan *** with scanID ** " + scanId);
    await zaproxy.ascan.status(scanId)
    .then(
        async(resp) => {
            console.log("status result = " + JSON.stringify(resp))
            if(resp.status != "100") {
                await sleep(10000);
                await pollProgressOfAscan(scanId);
            }
        },
        err => console.log("poll error " + err.message)
    )
}

function sleep(ms) {
    console.log("*********** sleeping for 2 sec!")
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateReports(){
    await sleep(2000);
    await zaproxy.core.htmlreport()
    .then(
        resp => {
            fs.writeFile('zapreport/zapReport.html',resp, function (err) {
                if (err) return console.log("Failed to write zap html report: " + err.message);
                console.log("zap report is writen to zapreport/zapReport.html")
            });
        },
        err => console.log("error generating html file = " + err.message)
    );

    // json report
    await zaproxy.core.jsonreport()
    .then(
        resp => {
            fs.writeFile('zapreport/zapReport.json',JSON.stringify(resp), function (err) {
                if (err) return console.log("Failed to write zap json report: " + err.message);
                console.log("zap report is writen to zapreport/zapReport.json")
            });
        },
        err => console.log("error generating json file = " + err.message)
    );
    return null;
}

module.exports.initForScan = initForScan;
module.exports.runActiveScan = runActiveScan;
module.exports.generateReports = generateReports;