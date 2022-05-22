const express = require('express')
const request = require('request');
const https=require("https")
require('.env').config()

API_KEY=process.env.API_KEY
const app = express();
// For serving static files to site
app.use(express.static("public"))

app.use(express.urlencoded({extended:true}));
//app.use(express.json())

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
});

app.post("/",(req,res)=>{
    const fname=req.body.firstname;
    const lname=req.body.lastname;
    const email=req.body.email;

    //Creating data and formatting to JSON
    const data={
        members:[{
            email_address:email,
            status: "subscribed",
            merge_fields:{
                 FNAME:fname,
                 LNAME:lname
            }
        }]
    }

    const jsonData=JSON.stringify(data);
    const authdata="ShekarYenagandula:"+API_KEY
    // connecting API to post data
    const url="https://us14.api.mailchimp.com/3.0/lists/9a10838088"
    const options={
        method:"POST",
        auth:authdata
    }
    const request= https.request(url,options,(response)=>{
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data",(data)=>{
            
        })
    })

    request.write(jsonData)
    request.end()

})


app.post("/failure",(req,res)=>{
    res.redirect("/")
})
app.listen(process.env.PORT || 3000,()=>{
    console.log("Running on port 3000")
})

// API key fo mailchimp : 54db9da8a64c11a97c360513d97db0d5-us14
// Audience ID : 9a10838088