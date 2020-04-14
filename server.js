/*/ search? play = KEYWORD - Return all insults from the searched piece. 
Will also return if there are no insults with that play. 
http: // localhost: 8000 / api / search? play = Macbeth*/ 

const http  = require('http');
const fs = require('fs');
const server = http.createServer();

server.on('request', (req, res) => {
    console.log('Requested url: ', req.url);

    if(req.url === '/') {
        console.log('Hello');
        const src = fs.createReadStream('index.html');
        src.pipe(res);
    }else if (req.url === '/client.js') {
        const src = fs.createReadStream('client.js');
        src.pipe(res);
    }

    if (req.url.indexOf('/api/insult') !== -1) {
        let search = req.url.split('=');
        let allInsult;
        let result = [];

        http.get('http://shakespeare-insults-generator.herokuapp.com/getAll', (response) => {            let data = '';
        
            response.on('data', (chunk) => {
                data += chunk;
            });
        
            response.on('end', () => {
            //    console.log(JSON.parse(data));
                let allInsult = JSON.parse(data);

                for(insult of allInsult){
                    if(insult.play == search[1]) {
                        result.push(insult);
                    }
                }

                console.log("Inside reult: " , result);
                res.end(JSON.stringify(result));
            });
        });
    }else if(req.url.indexOf('/api/all') !== -1){
        http.get('http://shakespeare-insults-generator.herokuapp.com/getAll', (response) => {            
            let data = '';
        
            response.on('data', (chunk) => {
                data += chunk;
            });
        
            response.on('end', () => {
            //    console.log(JSON.parse(data));
                allInsult = JSON.parse(data);

                console.log("Inside reult: " , allInsult);
                res.end(JSON.stringify(allInsult));
            });
        });
    }else if(req.url.indexOf('/api/getTheInsult') !== -1) {
        const insult = {
            insult: 'Out, you green-sickness carrion! Out, you baggage! You tallow-face!',
            play: 'Romeo and Juliet'
        }
        res.end(JSON.stringify(insult));
    }
});

server.listen(5000);