const {Builder, Browser, By} = require('selenium-webdriver');
const fs = require('fs');


const urls = {
    "Arsenal": "https://www.premierleague.com/clubs/1/Arsenal/squad?se=578" ,
    "Aston Villa": "https://www.premierleague.com/clubs/2/Aston-Villa/squad?se=578",
    "Bournemouth": "https://www.premierleague.com/clubs/127/Bournemouth/squad?se=578",
    "BrentFord": "https://www.premierleague.com/clubs/130/Brentford/squad?se=578",
    "Brighton and Hove Albion": "https://www.premierleague.com/clubs/131/Brighton-and-Hove-Albion/squad?se=578",
    "Burnley": "https://www.premierleague.com/clubs/43/Burnley/squad?se=578",
    "Chelsea": "https://www.premierleague.com/clubs/4/Chelsea/squad?se=578",
    "Crystal Palace": "https://www.premierleague.com/clubs/6/Crystal-Palace/overview",
    "Everton": "https://www.premierleague.com/clubs/7/Everton/squad?se=578",
    "Fulham": "https://www.premierleague.com/clubs/34/Fulham/squad?se=578",
    "Liverpool": "https://www.premierleague.com/clubs/10/Liverpool/squad?se=578",
    "Luton Town": "https://www.premierleague.com/clubs/163/Luton-Town/squad?se=578",
    "Manchester City": "https://www.premierleague.com/clubs/11/Manchester-City/squad?se=578",
    "Manchester United": "https://www.premierleague.com/clubs/12/Manchester-United/squad?se=578",
    "Newcastle United": "https://www.premierleague.com/clubs/23/Newcastle-United/squad?se=578",
    "Nottingham Forest": "https://www.premierleague.com/clubs/15/Nottingham-Forest/overview",
    "Sheffield United": "https://www.premierleague.com/clubs/18/Sheffield-United/squad?se=578",
    "Tottenham Hotspur": "https://www.premierleague.com/clubs/21/Tottenham-Hotspur/squad?se=578",
    "West Ham United": "https://www.premierleague.com/clubs/25/West-Ham-United/squad?se=578",
    "Wolverhampton Wanderers": "https://www.premierleague.com/clubs/38/Wolverhampton-Wanderers/squad?se=578"

}

async function crawl(url, club) {
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    const players = [];
    try {
        await driver.get(url);
        const elements = await driver.findElements(By.className('stats-card__container'));
        for(let e of elements) {
            const firstName = await e.findElement(By.className('stats-card__player-first')).getText();
            const lastName = await e.findElement(By.className('stats-card__player-last')).getText();
            const number = await e.findElement(By.className('stats-card__squad-number u-hide-mob-l')).getText();
            const position = await e.findElement(By.className('stats-card__player-position')).getText();
            const country = await e.findElement(By.className('stats-card__player-country')).getText();
            players.push({firstName, lastName, number, position, country, club});
        }
    } catch(e) {
        console.error(e)
    }finally
    {
        await driver.quit();
    }
    return players;
}

(async function main(){
    let players = [];
    for(const url in urls) {
        players = players.concat(await crawl(urls[url], url));
    }
    fs.writeFile('players.csv', JSON.stringify(players), 'utf8', function (err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
            console.log('It\'s saved!');
        }
    });
})()



