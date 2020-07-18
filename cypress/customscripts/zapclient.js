
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

    // create a new session.
    await zaproxy.core.newSession(sessionName, true)
    .then(
        resp => console.log("created new session: " + JSON.stringify(resp)),
        err => console.log('Failed to create new session. Error: ' + err.message)
      );

    // When a session is created it auto imported. This step is optional!
    // await zaproxy.core.loadSession(sessionName)
    // .then(
    //     resp => console.log("Session Loaded: " + JSON.stringify(resp)),
    //     err => console.log('Failed to load session'  + err.message)
    // );

    // import the context
    let contextFilePath = path.resolve("zapconfig/"+contextName+".context");
    console.log("context file path:- " + contextFilePath);
    await zaproxy.context.importContext(contextFilePath)
    .then(
        resp => console.log("imported context: " + JSON.stringify(resp)),
        err => console.log('Failed to import context. Error: ' + err.message)
    );

    // remove if scane policy with same name exists and import scan policy
    await zaproxy.ascan.removeScanPolicy(policyName)
    .then(
        resp =>  console.log("removed existing scan policy: " + JSON.stringify(resp)),
        err => console.log("Failed to removed scan policy. Error: " + err.message)
    );
    let policyFilePath = path.resolve("zapconfig/"+policyName+".policy");

    await zaproxy.ascan.importScanPolicy(policyFilePath)
    .then(
        resp => console.log("imported scan policy: " + JSON.stringify(resp)),
        err => console.log('Failed to import scan policy. Error ' + err.message)
    );

    // set passive scan to scan only urls in scope
    await zaproxy.pscan.setScanOnlyInScope(true)
    .then(
        resp => console.log("set pscan to scan URLS InScope alone: " + JSON.stringify(resp)),
        err => console.log('Failed to set pscan to scan URLS InScope alone. Error: ' + err.message)
    );

    return null;
}

async function runActiveScan(){
    // await sleep(2000);
    // get context ID by name
    let contextId = await zaproxy.context.context(contextName)
    .then(
        resp => { return resp.context.id },
        err => console.log("Failed to get contextID by context name. Error: "+err.message)
    );

    // start active scan
    scanId = await zaproxy.ascan.scan("", "", "", policyName, "", "", contextId)
    .then(
        resp => { return resp.scan; },
        err => console.log("Failed to start ascan. Error: " + err.message)
    );

    // wait for active scan to complete
    await pollProgressOfAscan(scanId);

    return null;
}

async function pollProgressOfAscan(scanId){
    console.log("ascan with scanID = " + scanId + " is in-progress");
    await zaproxy.ascan.status(scanId)
    .then(
        async(resp) => {
            if(resp.status != "100") {
                await sleep(10000);
                await pollProgressOfAscan(scanId);
            }
        },
        err => console.log("Error in polling active scan progress. Erorr: " + err.message)
    )
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateReports(){
    await sleep(2000);
    // generate html report
    await zaproxy.core.htmlreport()
    .then(
        resp => {
            fs.writeFile('zapreport/zapReport.html',resp, function (err) {
                if (err) return console.log("Failed to write zap html report to file. Error: " + err.message);
                console.log("zap report is writen to zapreport/zapReport.html")
            });
        },
        err => console.log("Failed to generate html report. Error: " + err.message)
    );

    // generate json report
    await zaproxy.core.jsonreport()
    .then(
        resp => {
            fs.writeFile('zapreport/zapReport.json',JSON.stringify(resp), function (err) {
                if (err) return console.log("Failed to write zap json report to file. Error: " + err.message);
                console.log("zap report is writen to zapreport/zapReport.json")
            });
        },
        err => console.log("Failed to generate json report. Error: " + err.message)
    );
    return null;
}

module.exports.initForScan = initForScan;
module.exports.runActiveScan = runActiveScan;
module.exports.generateReports = generateReports;