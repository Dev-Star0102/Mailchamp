const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const https = require("https");

const app = express();

app.use(express.static("public"))


app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", (req,res)=>{
    res.redirect("/signup.html")
})




app.post("/signup", (req, res) => {
    const nama = req.body.nama;
    const paporite = req.body.paporite;
    const email = req.body.email;

    //DI bawah ini saya mengambil data dari mencari object yang akan saya pake di dalam server dan semuanya udah di jelaskan di mailchimp


    //untuk member disini saya mengambil dari Mailchimp/developer tepatnya reference/lists/#post_/lists/-list_id-
    //Request body parameter
    //untuk isi object member bisa di liat di mailchimp tepatnya mailchimp.com/lists/settings/merge-tags?id=652454 
    //dan di audience disitu ada form

    //json data ini akan mengembalikan data ke mailchimpt dengan format json string
    //untuk mengisi apikey mailchimp harap baca dulu documentation di mailchimp untuk pengisiannya

    //untuk melihat https request ini bisa chek doumentation di node https request 
    //atau yang lebih lengkapnya di starckOverFlow ( how do I make a https post in Node Js without any third party module )
    //untuk melihat documentation https rquest api bisa langsung liat ke node nya

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: nama,
                    LNAME: paporite
                }
            }
        ]
    }
    const JsonData = JSON.stringify(data);

    const url = "https://us19.api.mailchimp.com/3.0/lists/8097573be9";

    const Option = {
        method: "POST",
        auth: "AnggaLesmana1:713a5afef4f915e436ad7ab0e90877af-us19"
    }

    const request = https.request(url, Option, (respone) => {
        respone.on("data", (data) => {
            // console.log(JSON.parse(data))
            if(respone.statusCode === 300){
                res.sendFile(__dirname + "/succes.html")
            }
            else{
                res.sendFile(__dirname + "/failur.html")
            }
        })

        })
        request.write(JsonData);
        request.end();
        request.on("error", (err) => {
            console.error(err.stack)
    })
})



app.listen(process.env.PORT || 4000,() => {
    console.log('succes buka langsing di localhost:4000')
})

//ApiKey
// 713a5afef4f915e436ad7ab0e90877af-us19

//list Id
//8097573be9