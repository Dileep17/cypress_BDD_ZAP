const fs = require('fs')
const path = require('path')


function getUrlsSupressedForAlert(alertId){
    let supressionList = require(path.resolve(process.cwd(), "zapconfig/AlertSupressionList.json"));
    return supressionList[alertId];
}

function isURLSupressedForAlert(urlSupressedForListAlert, url, suppressAlerts){
    console.log("isURLSupressedForAlert")
    if(!urlSupressedForListAlert)
        return false;

    if(!suppressAlerts)
        return false;

    let supressed = false;

    for(var i = 0; i < urlSupressedForListAlert.length; i++){
        if(urlSupressedForListAlert[i] === url){
            supressed = true;
            break;
        }
    }
    return supressed;
}

function getLevelBaseOnId(levelId){
    switch(levelId) {
        case "-1":
            return "False Positive";
        case "0":
            return "Informational"
        case "1":
            return "LOW";
        case "2":
            return "MEDIUM";            
        case "3":
            return "HIGH";                                   
      }
}
 
function getColorBasedOnLevel(levelId){
    switch(levelId) {
        case "0":
            return "cadetblue";
        case "1":
            return "burlywood";
        case "2":
            return "chocolate";
        case "3":
            return "crimson";
      }
}

function parseJsonAndGenerateReport(checkSupression){
    let jsonData = require(path.resolve(process.cwd(), "zapreport/zapReport.json"));
    let alertHTMLGenerated = "<table><tbody>";
    alertHTMLGenerated = alertHTMLGenerated + "<tr style='border: none;'>"; 
    alertHTMLGenerated = alertHTMLGenerated + "<td style='border: none;'> <h2> Alerts </h2> </td>";
    alertHTMLGenerated = alertHTMLGenerated + "<td style='float:right; border:none;'> RISK Color Coding"; 
    alertHTMLGenerated = alertHTMLGenerated + "<div style='background:" + getColorBasedOnLevel("3") +";'>  High </div>";
    alertHTMLGenerated = alertHTMLGenerated + "<div style='background:" + getColorBasedOnLevel("2") +";'>  Medium </div>";
    alertHTMLGenerated = alertHTMLGenerated + "<div style='background:" + getColorBasedOnLevel("1") +";'>  Low </div>";
    alertHTMLGenerated = alertHTMLGenerated + "<div style='background:" + getColorBasedOnLevel("0") +";'> Infomational </div>";
    alertHTMLGenerated = alertHTMLGenerated + "</td></tr>";
    alertHTMLGenerated = alertHTMLGenerated + "</tbody></table>";
    jsonData.site.forEach(function(site) {
         let siteHTMLAlertContext = "";
         site.alerts.forEach(function(alert){    
            let urlsSupressedForAlert = getUrlsSupressedForAlert(alert.pluginid);
            console.log("urlsSupressedForAlert **:" + urlsSupressedForAlert);
            let instanceHTMLContext = "";
            alert.instances.forEach(function(instance){
                if(!isURLSupressedForAlert(urlsSupressedForAlert, instance.uri, checkSupression)){
                    let instanceHTML = "<tr><td colspan='2'>";
                    instanceHTML = instanceHTML + "<button type='button' class='collapsible' style='background-color: "+ getColorBasedOnLevel(alert.riskcode) +"'>" + instance.uri +"</button>";
                    instanceHTML = instanceHTML + "<div class='content'><table>";
                    instanceHTML = instanceHTML + "<tr><td> method </td><td>" + instance.method  + "</td></tr>";
                    instanceHTML = instanceHTML + "<tr><td> evidence </td><td>" + instance.evidence  + "</td></tr>";
                    instanceHTML = instanceHTML + "</table></div>";
                    instanceHTMLContext = instanceHTMLContext + instanceHTML;
                } else {
                    console.log("url is supressed " + instance.uri);
                    
                }
            });
            if(instanceHTMLContext !== ""){
                let alertHTML = "<div class='alert' style='color:"+ getColorBasedOnLevel(alert.riskcode) +";'><div class='collapsible' style='background-color: "+ getColorBasedOnLevel(alert.riskcode) +"; border-style: solid;'>";
                alertHTML = alertHTML + "<div>" + alert.name + "</div>";
                alertHTML = alertHTML + "</div>";
                alertHTML = alertHTML + "<div class='content'><table>"; 
                alertHTML = alertHTML + "<tr><td>Alert ID</td><td>" + alert.pluginid + "</td></tr>";
                alertHTML = alertHTML + "<tr><td>Risk Level</td><td>" + getLevelBaseOnId(alert.riskcode) + "</td></tr>";
                alertHTML = alertHTML + "<tr><td>Confidence Level</td><td>" + getLevelBaseOnId(alert.confidence) + "</td></tr>"; 
                alertHTML = alertHTML + "<tr><td>Description</td><td>" + alert.desc + "</td></tr>";
                alertHTML = alertHTML + "<tr><td colspan='2'>Instances :- </td></tr>";
                alertHTML = alertHTML + instanceHTMLContext;
                alertHTML = alertHTML + "<tr><td>solution</td><td>" + alert.solution + "</td></tr>";
                if(alert.reference)
                    alertHTML = alertHTML + "<tr><td>reference</td><td>" + alert.reference + "</td></tr>";
                alertHTML = alertHTML + "<tr><td>cweid</td><td>" + alert.cweid + "</td></tr>";
                alertHTML = alertHTML + "<tr><td>wascid</td><td>" + alert.wascid + "</td></tr>";
                alertHTML = alertHTML + "<tr><td>sourceid</td><td>" + alert.sourceid + "</td></tr>";
                alertHTML = alertHTML + "</table></div>"; // close content div and table
                alertHTML = alertHTML + "</div>"; // close alertHTML
                siteHTMLAlertContext = siteHTMLAlertContext + alertHTML;
            }
         });
         alertHTMLGenerated = alertHTMLGenerated + siteHTMLAlertContext;
    });
    try {
        const data = fs.readFileSync(path.resolve(process.cwd(), "cypress/customscripts/htmlsnippets/base.html"), 'utf8')
        const htmlContext = data.replace("<!--context-->",alertHTMLGenerated + "<!--context-->");
        fs.writeFile(path.resolve(process.cwd(), "zapreport/customReport.html"), htmlContext, (err) => {
            if (err) throw err;
            console.log('ZAP report created!');
        });
      } catch (err) {
        console.error(err)
      }
    return null;
}

module.exports.parseJsonAndGenerateReport = parseJsonAndGenerateReport;