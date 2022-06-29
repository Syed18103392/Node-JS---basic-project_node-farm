const fs = require('fs');
const http = require('http');
const url = require('url');

// // ANCHOR Blocking Syncronize way 
// const inputText = fs.readFileSync(`./txt/input.txt`,'utf-8');
// console.log(inputText); 

// const intputOUt = `This is what we know about avocado = ${inputText} \n created on date ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',intputOUt);

// console.log('💥');
// const inputTextTwo = fs.readFileSync(`./txt/output.txt`, 'utf-8');
// console.log(inputTextTwo);


// // ANCHOR Non-blocking Asyncronize way  && Call back hall 
// fs.readFile('./txt/start.txt','utf-8',(err , data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);
//             const finalTask = `${data2} 💥💥💥 ${data3}`;
//             fs.writeFile(`./txt/final.txt`,finalTask,'utf-8',err=>{
//                 console.log('Written complete');

//                 fs.readFile(`./txt/final.txt`,'utf-8',(err,data)=>{
//                     console.log(data);
//                 })
//             })
//         })
//     })    
// })

//NOTE Get the Data 
//NOTE : Read the server data from JSON file
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);
//NOTE : Read the template data 
const overviewTemplate = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const productTemplate = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const overviewCardTemplate = fs.readFileSync(`${__dirname}/templates/template-overview-card.html`,'utf-8');


//NOTE Global : functions
const replateTemplate = (temp,product)=>{
    let output = temp.replaceAll('{%PRODUCT_NAME%}', product.productName);
    output = output.replaceAll('{%IMAGE%}', product.image);
    output = output.replaceAll('{%QUANTITY%}', product.quantity);
    output = output.replaceAll('{%PRICE%}', product.price);
    output = output.replaceAll('{%ID%}', product.id);
    output = output.replaceAll('{%DESCRIPTION%}', product.description);
    output = output.replaceAll('{%NUTRIENTS%}', product.nutrients);
    output = output.replaceAll('{%FROM%}', product.from);

    product.organic?output=output.replaceAll('{%NOT_ORGANIC%}', ' ') : output=output.replaceAll('{%NOT_ORGANIC%}', 'not-organic');

    return output;
} 

//NOTE Server : Create a Server && Routing && Header 

const server = http.createServer((req,res)=>{
    const {query,pathname} = url.parse(req.url, true);
    // console.log(url.parse(req.url,true).query.id);

    //LINK : HOME && OVERVIEW
    if(pathname==='/' || pathname==='/overview'){
        const cardTemplateHTML = dataObj.map(el=>replateTemplate(overviewCardTemplate,el)).join('');
        res.writeHead(200,{
            'Content-type'  :   'text/html',
        })
        res.end(overviewTemplate.replace('{%PRODUCTS_CARDS%}',cardTemplateHTML));
    }

    //LINK product page
    else if(pathname==='/product'){
        const singleProductHTML = replateTemplate(productTemplate, dataObj[query.id]);


        res.writeHead(200,{
            'Content-type'  :   'text/html'
        })
        res.end(singleProductHTML);
    }

    //LINK API Link
    else if(pathname==='/api'){
        res.writeHead(200,{
         'Content-type'  :   'application/json'
        })
        res.end(data);
    }

    //LINK Page not found 
    else{
        res.writeHead(404,{
            'Content-type'  :   'text/html',
            'Developed-by'  :   'Syed Sajib',
        });
        res.end(`<h1 style='color:red'>Page not found</h1>`);
    }
});

server.listen('8080','127.0.0.1',()=>{
    console.log('Start Listening on port 8080');
})
