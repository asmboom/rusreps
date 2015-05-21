/* Copyright IBM Corp. 2014 All Rights Reserved                      */

// Require and create the Express framework
var express = require('express');
var app = express();
var http = require('http');
//var hostName = 'www.rbcdaily.ru';
var hostName = 'www.rusrep.ru';
//var hostName = 'www.1tv.ru';
var fs = require('fs'),
    index, video;
 
fs.readFile('./qwe.html', function (err, data) {
    if (err) {
        throw err;
    }
    index = data;
});

fs.readFile('./653532565467658.mp4', function (err, data) {
    if (err) {
        throw err;
    }
    video = data;
});



// Determine port to listen on
var port = (process.env.PORT || process.env.VCAP_APP_PORT);
// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See 
// http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy');

// Add a handler to inspect the req.secure flag (see 
// http://expressjs.com/api#req.secure). This allows us 
// to know whether the request was via http or https.
app.use (function (req, res, next) {
	if (!req.secure) {
		// request was via https, so do no special handling
		next();
	} else {
		// request was via http, so redirect to https
		res.redirect('http://' + req.headers.host + req.url);
	}
});


app.get('*', function(request, response) {
    console.log('serve: ' + request.url);
/*
    //console.log(request.headers.host);
     if (request.url === '/favicon.ico') {
    response.writeHead(200, {'Content-Type': 'image/x-icon'} );
    response.end();
    console.log('favicon requested');
    return;
  }
  */
    if (request.url == '/society/562949992508296'){
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(index);
        response.close();
        }
     /*   
     if (request.url == '/653532565467658.mp4'){
        var range = request.headers.range;
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var end = partialend ? parseInt(partialend, 10) : total - 1;
        var chunksize = (end-start)+1;
        var total = video.length;
        
         response.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                        "Accept-Ranges": "bytes",
                        "Content-Length": chunksize,
                        "Content-Type":"video/mp4"});
        response.end(video.slice(start, end+1), "binary");
        }    
        */
    //static/styles/blocks/b-header/images/icons.png    
    var options = {
        hostname: hostName,
        port: 80,
        path: request.url,
        //charset=utf-8"
        charset: 'utf-8',
       // 'Location':'http://'+request.headers.host+response.url,
        method: 'GET'
    };

    var proxy = http.request(options, function (res) {
        //res.header("Content-Type", "text/html; charset=utf-8");
        res.pipe(response, {
            end: true
        });
    });

    request.pipe(proxy, {
        end: true
    });
});

// Start listening on the port
var server = app.listen(port, function() {
	console.log('Listening on port %d', server.address().port);
});