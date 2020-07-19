### Boilerplate for cypress and zaproxy for running scans and generating report

Apart from the zap integration, this project uses https://github.com/TheBrainFamily/cypress-cucumber-preprocessor for UI automation

#### Prerequisite
* Download Zaproxy  https://www.zaproxy.org/download/
* Host OWASP juiceshop  https://github.com/bkimminich/juice-shop


#### config
* Update the url of juiceshop, in cypress.json
* Update the zap context in zapconfig/AutomatedContext.context
* Update the zap scan policy in zapconfig/AutomatedPolicy.policy
* Update the incidents to be supressed in zapconfig/AlertSupressionList.json
* Set the proxy port in ZAP and update zapOptions.port in cypress/customscripts/zapclient.js
* Set apikey in ZAP and and update zapOptions.apiKey in cypress/customscripts/zapclient.js


##### Install node dependencies
```
npm install
```

##### Running tests
* Start ZAProxy
* set proxy env variable so that cypress can pick up the proxy url
   ex:- 
    ```
    export HTTP_PROXY=http://127.0.0.1:8091
    ```
    make sure port number given for HTTP_PROXY is the port set in zap proxy
* Run cypress,
    ```
    ./node_modules/.bin/cypress open 
    ```
    or
    ```
    ./node_modules/.bin/cypress run
    ```
* Scan reports are written to zapreport folder

#### Updating supression list
Copy the incident to be supressed to zapconfig/alertSupressionList.json under respective alert id. alert id and incident can be copied from zapconfig/zapReport.json

* alert id is pluginid in zapconfig/zapReport.json
* incident to be supressed can be copied from zapReport.json to supressionList

ex:-
```
    {
        "uri": "https://owsapjuiceshopapp.herokuapp.com/font-mfizz.woff",
        "method": "GET",
        "evidence": "X-Powered-By: Express"
    }
```

ZAPReport.json and alertSupressionList.json are parsed to generate customReport.html
zapReport.html is also generated without supression. 

Note: Currently supression is at URL level (not regex)
