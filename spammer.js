const fetch = require('node-fetch');

const [maxVote] = process.argv.slice(2);

let counter = 0;
let voteCounter = 0;
// TODO: Update this one
for(let i = 109101; i < 111001; i++) {
    setTimeout(() => {
        fetch(`https://city.bg/chart/vote?trackId=21236&userId=${i}`)
            .then(res => res.text())
            .then(body => {
                if(body.indexOf('id="registration" class="alert alert-success">Вие гласувахте успешно!') > 0) {
                    console.log('Added vote, total: ', voteCounter);
                    voteCounter++;
                }
                if(+maxVote < voteCounter) {
                    console.log('Reached the vote limit. Exiting...');
                    process.exit();
                }
            });
    }, counter)
    counter += 1000;
}