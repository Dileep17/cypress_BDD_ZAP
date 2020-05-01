const fs = require('fs')
const path = require('path')


function parseJsonAndGenerateReport(){
    let jsonData = require(path.resolve(process.cwd(), "zapreport/zapReport.json"));
    let alertHTMLGenerated = "";
    jsonData.site.forEach(function(site) {
         let siteHTMLAlertContext = "";
         site.alerts.forEach(function(alert){    
            let alertHTML = "<div class='alert'><div class='collapsible'>";
            alertHTML = alertHTML + "<div>" + alert.name + "</div>";
            alertHTML = alertHTML + "</div>";
            alertHTML = alertHTML + "<div class='content'><table>";
            alertHTML = alertHTML + "<tr><td>Risk Level</td><td>" + alert.riskcode + "</td></tr>";
            alertHTML = alertHTML + "<tr><td>Confidence Level</td><td>" + alert.confidence + "</td></tr>"; 
            alertHTML = alertHTML + "<tr><td>Description</td><td>" + alert.desc + "</td></tr>";
            alertHTML = alertHTML + "<tr><td colspan='2'>Instances :- </td></tr>";
            let instanceHTMLContext = "";
            alert.instances.forEach(function(instance){
                let instanceHTML = "<tr><td colspan='2'>";
                instanceHTML = instanceHTML + "<button type='button' class='collapsible'>" + instance.uri +"</button>";
                instanceHTML = instanceHTML + "<div class='content'><table>";
                instanceHTML = instanceHTML + "<tr><td> method </td><td>" + instance.method  + "</td></tr>";
                instanceHTML = instanceHTML + "<tr><td> evidence </td><td>" + instance.evidence  + "</td></tr>";
                instanceHTML = instanceHTML + "</table></div>";
                instanceHTMLContext = instanceHTMLContext + instanceHTML;
            });
            alertHTML = alertHTML + instanceHTMLContext;
            alertHTML = alertHTML + "<tr><td>solution</td><td>" + alert.solution + "</td></tr>";
            alertHTML = alertHTML + "<tr><td>reference</td><td>" + alert.reference + "</td></tr>";
            alertHTML = alertHTML + "<tr><td>cweid</td><td>" + alert.cweid + "</td></tr>";
            alertHTML = alertHTML + "<tr><td>wascid</td><td>" + alert.wascid + "</td></tr>";
            alertHTML = alertHTML + "<tr><td>sourceid</td><td>" + alert.sourceid + "</td></tr>";
            alertHTML = alertHTML + "</table></div>"; // close content div and table
            alertHTML = alertHTML + "</div>"; // close alertHTML
            siteHTMLAlertContext = siteHTMLAlertContext + alertHTML;
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


