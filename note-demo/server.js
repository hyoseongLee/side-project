const { response } = require('express');
let http = require ('http')
let url = require ('url')

function start(route, handle) {
    function onRequest(req,res) {
        let pathname = url.parse(req.url).pathname;
        let queryData = url.parse(req.url.true).query;

        route(pathname,handle,response,queryData.noteId);
    }
    http.createServer(onRequest).listen(1234);
}

exports.start = start;