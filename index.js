import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

let mainCoinInfo = '';  //The Coin's info object that have been searched
let mainCoinCurrency = ''; //The Coin's currency object that have been searched
let coinsList = ''; 

let mainCoinId = 'bitcoin'; // Default main coin's id
let currency = 'usd'; // Default currency




app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        //Get the whole coin list
        const coinsData = await axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=true');
        coinsList = coinsData.data; 

        for (let i = 0; i < coinsList.length; i++) {
            if (coinsList[i]['id'] == mainCoinId) {
                mainCoinInfo = coinsList[i];
                
            }
        }

        //Get the main coin data that will be displayed in the center
        const result = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${mainCoinId}&vs_currencies=${currency}&include_24hr_change=true`);
        mainCoinCurrency = result.data;
        res.render("index.ejs", {
            mainCoinInfo : mainCoinInfo,
            mainCoinCurrency : mainCoinCurrency[mainCoinId],
            coinsList : coinsList,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500);
    }

})

app.post("/", async (req, res) => {
    const searchSymbol = req.body.symbol;
    console.log(searchSymbol)
    try {
        for (let i = 0; i < coinsList.length; i++) {
            if (coinsList[i]['symbol'] == searchSymbol) {
                mainCoinInfo = coinsList[i];
                mainCoinId = mainCoinInfo.id;
            }
        }
        const result = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${mainCoinInfo.id}&vs_currencies=usd&include_24hr_change=true`);
        mainCoinCurrency = result.data;

        res.render("index.ejs", {
            mainCoinInfo : mainCoinInfo,
            mainCoinCurrency : mainCoinCurrency[mainCoinId],
            coinsList : coinsList,
        })
        
    } catch (error) {
        console.log('404'+error.message);
        res.status(500);
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})