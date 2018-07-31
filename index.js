const http = require('http')
const https = require('https')
const httpProxy = require('http-proxy')
const fs = require('fs')

require('dotenv').config()

const REAL_IP = process.env.REAL_IP
const urlsNotToProxy = [
	/.*\/ws\/.*/,
	/.*\/bb\/.*/
]

const proxy = httpProxy.createProxyServer()
const options = {
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
}

https.createServer(options, redirect)
    .listen(443, '0.0.0.0', () => {
        console.log("Server listening on port 443")
    })

http.createServer(redirect)
	.listen(80, '0.0.0.0', () => {
        console.log("Server listening on port 80")
    })


function redirect(req, res) {
	const shouldRedirect = !urlsNotToProxy.some(url => url.test(req.url))
	
	if (shouldRedirect) {
		return proxy.web(req, res, {
			target: process.env.URL_TO_REDIRECT_TO
		})
	} else {
		return proxy.web(req, res, {
			target:  REAL_IP
		})
	}
}