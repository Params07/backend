const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.listen(5000,()=>{
    console.log("hello");
})
app.use(express.json({limit:'1mb'}));
const request= require("request-promise")
const cheerio= require("cheerio");
const fs = require('fs');
const Pool = require("pg").Pool;
var nodemailer = require('nodemailer');
const pool = new Pool({
    user:"postgres",
    password:"parama",
    host : "localhost",
    port:5433,
    database:"project1"
});
var transporter = nodemailer.createTransport({
    service: 'gmail',
    
    auth: { 
      user: 'datasciencefeeds07@gmail.com',
      pass: 'params1507@'
    }
  });
  const sendemails = async(title,src,descrip,link) =>{
    const newemail = await pool.query("SELECT * FROM email");
    v = newemail.rows.map(data=>{
        return data["email_id"];
      }).join(',');
      console.log(v);
    
            var mailOptions = {
                from: 'datasciencefeeds07@gmail.com',
                to: v,
                subject: '',
                html:`<h3>${title}</h3> <img src=${src}> <p>${descrip}</p><br>
                <p> <a href=${link}> click here</a> to visit a page</p>
                `
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent'+info.response);
                }

  });
}    


app.post('/email_id',async(req,res)=>{
    try {
        const {title} = req.body;
        const check = await pool.query("SELECT * FROM email WHERE email_id = $1",[title])
       
      if(!check.rows.length){
        
        const newemail = await pool.query("INSERT INTO email (email_id) VALUES($1)",[title]);
        console.log("added succesfully"+title);
        res.json("not exist");
       
    }else{
        console.log("this email already logined");
        res.json("exist");
    }
  
    
         
           } catch (error) {
         console.log(error.message);
      }
});

    app.get('/feeds/:category',async(req,res)=>{
            try {
                 var category = req.params.category;
                    if(category=="data")
                    {
                        const newemail = await pool.query("SELECT * FROM feeds");
                        res.json(newemail.rows);
                 
                    }else {
                        const newemail = await pool.query("SELECT * FROM feeds  WHERE Category = $1",[category]);
                        res.json(newemail.rows);
                    }
                 
                   } catch (error) {
                 console.log(error.message);
              }
        });
   function call () {     
                        request('https://www.infoworld.com/category/machine-learning/',(error, response, html) => {
                            if(!error && response.statusCode==200) {
                        const $= cheerio.load(html);
                            
                        $('div[class="river-well article"]').each(async(i,data)=>
                        {   
                            let tit = $ (data).find('div[class="post-cont"] > h3').text().trim()
                            let link = 'https://www.infoworld.com'+$ (data).find('div[class="post-cont"] > h3 > a').attr('href');
                            let src = $(data).find(' figure[class = "well-img"] > a > img ').attr('data-original');
                            let descrip =  $ (data).find('div[class="post-cont"] > h4').text().trim();
                            try{
                            const check = await pool.query("SELECT * FROM feeds WHERE TITLE = $1",[tit])
                            
                            if(!check.rows.length){
                                
                                const newfeed = await pool.query("INSERT INTO feeds (Category,TITLE,DESCRIPTION,link,src) VALUES($1,$2,$3,$4,$5)",['ml',tit,descrip,link,src]);
                                console.log('data added');
                                sendemails(tit,src,descrip,link);
                            }else{
                                console.log("same data");
                            }
                            }catch(err)
                            {
                                console.log(err);
                            }
                            
                            
                        
                            
                                })
                                
                        }});

                                
                            

                            
                        request('https://www.infoworld.com/category/cloud-computing/', (error, response, html) => {
                            if(!error && response.statusCode==200) {
                        const $= cheerio.load(html);
                            
                        $('div[class="river-well article"]').each(async(i,data)=>
                        {   
                            let tit = $ (data).find('div[class="post-cont"] > h3').text().trim()
                            let link = 'https://www.infoworld.com'+$ (data).find('div[class="post-cont"] > h3 > a').attr('href');
                            let src = $(data).find(' figure[class = "well-img"] > a > img ').attr('data-original');
                            let descrip =  $ (data).find('div[class="post-cont"] > h4').text().trim();
                            
                            try{  const check = await pool.query("SELECT * FROM feeds WHERE TITLE = $1",[tit])
                            
                            if(!check.rows.length){
                                
                                const newfeed = await pool.query("INSERT INTO feeds (Category,TITLE,DESCRIPTION,link,src) VALUES($1,$2,$3,$4,$5)",['cc',tit,descrip,link,src]);
                                console.log('data added');
                                sendemails(tit,src,descrip,link);
                            }else{
                                console.log("same data");
                            } }catch(err)
                            {
                                    console.log(err);
                            }
                                
                            
                            
                            
                                })
                                
                        }});



                        request("https://artificialintelligence-news.com/", (error, response, html) => {
                            if(!error && response.statusCode==200) {
                                const $= cheerio.load(html);
                            
                                $('section[class="entry-content"]').each(async(i,data)=>
                                {   
                                    let tit = $ (data).find('header[class="article-header"] > h3').text().trim()
                                    let link = $ (data).find('header[class="article-header"] > h3 > a').attr('href');
                                    let src = $(data).find(' div[class="grid-x grid-margin-x"]> div[class="cell small-3 medium-6 large-6"]>div[class="image"] > a > img ').attr('srcset');
                                    let des =  $ (data).find('div[class="cell small-12  medium-8 large-6"] ');
                                    let descrip = $(des).find('p').text().trim();
                                    let desp = descrip.split('.')[0]
                                    try {
                                    const check = await pool.query("SELECT * FROM feeds WHERE TITLE = $1",[tit])
                            
                                    if(!check.rows.length){
                                    
                                    const newfeed = await pool.query("INSERT INTO feeds (Category,TITLE,DESCRIPTION,link,src) VALUES($1,$2,$3,$4,$5)",['ai',tit,desp,link,src]);
                                    console.log(newfeed.rows);
                                    sendemails(tit,src,desp,link);
                                    }else{
                                        console.log("same data");
                                    }
                                }catch(err)
                                {
                                    console.log(err);
                                }
                                
                                
                                
                                    
                                
                                })
                            
                            
                                }
                                


                        });

                        request('https://www.the-scientist.com/tag/deep-learning', (error, response, html) => {
                            if(!error && response.statusCode==200) {
                        const $= cheerio.load(html);
                        $('div[class="ArticleSummary"]').each(async(i,data)=>{
                        
                            
                            let tit = $ (data).find('header').text().trim()
                            let link ="https://www.the-scientist.com"+ $ (data).find('header > a').attr('href');
                            let src = $(data).find(' figure > a > picture > img ').attr('src');
                            let descrip =  $ (data).find('main > div').text().trim();
                            try {
                            const check = await pool.query("SELECT * FROM feeds WHERE TITLE = $1",[tit])
                            
                            if(!check.rows.length){
                            
                            const newfeed = await pool.query("INSERT INTO feeds (Category,TITLE,DESCRIPTION,link,src) VALUES($1,$2,$3,$4,$5)",['dl',tit,descrip,link,src]);
                            console.log(newfeed.rows);
                            sendemails(tit,src,descrip,link);
                            }else{
                                console.log("same data");
                            }
                        }catch(err)
                        {
                            console.log(err);
                        }
                        

                        
                            })
                            
                            
                                }
                                
                            });
                            
                            


                        request("https://www.iotevolutionworld.com/iot/", (error, response, html) => {
                            if(!error && response.statusCode==200) {
                                const $= cheerio.load(html);
                            
                                $('div[class="item image-left"]').each(async(i,data)=>
                                {   
                                    
                                    let tit = $ (data).find('div[class="item-content"] > h3').text().trim()
                                    let link = $ (data).find('div[class="item-content"] > h3 > a').attr('href');
                                    let src = $(data).find(' div[class="item-header"]> a > figure > img ').attr('src');
                                    
                                    let descrip = $(data).find('div[class="item-content"] > p').text().trim();
                                    try{
                                
                                    const check = await pool.query("SELECT * FROM feeds WHERE TITLE = $1",[tit])
                            
                                    if(!check.rows.length){
                                    
                                    const newfeed = await pool.query("INSERT INTO feeds (Category,TITLE,DESCRIPTION,link,src) VALUES($1,$2,$3,$4,$5)",['iot',tit,descrip,link,src]);
                                    console.log("data added");
                                    sendemails(tit,src,descrip,link);
                                    }else{
                                        console.log("same data");
                                    }
                                }catch(err)
                                {
                                    console.log(err);
                                }
                                
                                
                                
                                    
                                
                                })
                            
                                
                                
                            

                            
                                
                            
                                }
                                


                        });
                    }
function logEvery2Seconds(i) {
    setTimeout(() => {
        console.log('Infinite Loop Test n:');
        call();
       
    }, 20000)
}

logEvery2Seconds(0);

let i = 0;
setInterval(() => {
    console.log('Infinite Loop Test interval n:');
}, 20000)
  


    
    

        
