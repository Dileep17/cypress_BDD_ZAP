This is a spike on cypress and zap proxy 

#### Application under test 
Application under test is zap juice shop application. Steps to run the application in local or in heruko are in juice shop repo. Please dont forget below
1. Update the URL of juice shop in cypress.json
2. In zapconfig > AutomatedContext.context, incRegex is defined to keep only juice shop app in scan scope. Update the incRegex.

I have hosted the app in heroku and removed. Please deploy your instance and use it. Dont use the urls mentioned in the repo. 

#### Zap proxy
Download zap proxy from OWASP and install it. Make yourself familiar with zap by using it manually (setting proxy, installing certificate, recording and running active scan etc)
In  cypress > customscripts > zapclient.js, update 
1. zap api key (currently its dummy value 12345)
2. update the zap local proxy url



##### Install node dependencies
```
npm install
```

##### Running tests
BDD test steps are present in cypress > integration 
stepdefinitions are present in cypress > support > step_definitions

steps:-
1. Run zap proxy
2. update the zap proxy url and api key
3. update the incRegex in zapconfig > AutomatedContext.context
4. udpate baseurl in cypress.json
5. Run cypress,
    ```
    ./node_modules/.bin/cypress open 
    ```
    or
    ```
    ./node_modules/.bin/cypress run
    ```
6. Scan reports are written to zapreport folder


