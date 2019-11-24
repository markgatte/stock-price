const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', (req, res)=>{
    res.render('index', {title: 'ISQA_5 - Nasdaq Stock Price Checker'});
});

router.post('/api/stock-prices', (req, res)=>{
    const stock = req.body.stock;
    request(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`, (err, response, data)=>{
        console.log('err: ', err);
        console.log('statusCode: ', response && response.statusCode);
        console.log('body: ', data);
        res.render('index', {title: 'Stock', getPrice: data });
    });
    
});

router.post('/api/stock-prices/stocks', async (req, res)=>{

    const array = [];

    // Easiest way to run an array of async/await functions in series is to use for...of. This will execute them in order, one at a time, and wait for each to resolve.
    const asyncA = async ()=>{
        const stock = req.body.stock1;
        request(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`, (err, data)=>{
                // You need to use JSON.parse() to convert the stirng inside as an object
                const result = JSON.parse(data.body);
                array.push({
                    "symbol": result.symbol,
                    "price": result.latestPrice,                
                });
                console.log(array);
        });
    }
    const asyncB = async ()=>{
        const stock = req.body.stock2;
        request(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`, (err, data)=>{
                const result = JSON.parse(data.body);
                array.push({
                    symbol: result.symbol,
                    price: result.latestPrice,                
                });
                console.log(array);
                res.render('index', {title: 'Done...', combine: array});
        });
    }

    // const asyncC = async ()=> {
    //     console.log(array);
    //     res.render('index', {title: 'Done...', combine: array});
    // }

    const list = [asyncA, asyncB];

    await Promise.all(list.map(fn=> {fn()}));

});


module.exports = router;

//{"stockData":[{"stock":"name","price":1334.87,"rel_likes":0},{"stock":"MSFT","price":149.97,"rel_likes":0}]}