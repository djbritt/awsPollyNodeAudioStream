// Load the SDK
const AWS = require('aws-sdk')
const Fs = require('fs')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

// Create an Polly client
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
})

app.get('/', function(req, res) {
    res.sendFile('index.html', {
        root: __dirname
    });
});

app.get('/read', function(req, res) {
    var voiceList = ["Geraint", "Gwyneth", "Mads", "Naja", "Hans", "Marlene", "Nicole", "Russell", "Amy",
        "Brian", "Emma", "Raveena", "Ivy", "Joanna", "Joey", "Justin", "Kendra", "Kimberly",
        "Salli", "Conchita", "Enrique", "Miguel", "Penelope", "Chantal", "Celine", "Mathieu",
        "Dora", "Karl", "Carla", "Giorgio", "Mizuki", "Liv", "Lotte", "Ruben", "Ewa", "Jacek",
        "Jan", "Maja", "Ricardo", "Vitoria", "Cristiano", "Ines", "Carmen", "Maxim", "Tatyana",
        "Astrid", "Filiz"
    ]
    var chosenVoice = voiceList[Math.floor(Math.random() * voiceList.length)];

    let params = {
        'Text': req.query.text,
        'OutputFormat': 'mp3',
        'VoiceId': chosenVoice
    }


    Polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.log(err.code)
        }
        else if (data) {
            if (data.AudioStream instanceof Buffer) {
                Fs.writeFile("./speech.mp3", data.AudioStream, function(err) {
                    if (err) {
                        return console.log(err)
                    }
                    console.log("The file was saved!")
                    var file = __dirname + '/speech.mp3';
                    fs.exists(file, function(exists) {
                        if (exists) {
                            var rstream = fs.createReadStream(file);
                            rstream.pipe(res);
                        }
                        else {
                            res.send("Its a 404");
                            res.end();
                        }
                    });
                })
            }
        }
    })

});

io.on('connection', function(socket) {

    socket.on('message', (data) => {
        console.log('Message: ' + data['msg'])
        io.emit('message', {
            'msg': data['msg'],
        })
    })


})


http.listen(process.env.PORT, function() {
    console.log("https://5059ad0a70d24b0e8e5a17934ed14d73.vfs.cloud9.us-west-2.amazonaws.com/");
});
