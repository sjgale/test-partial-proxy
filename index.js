const http = require('http')
const https = require('https')
const httpProxy = require('http-proxy')
const fs = require('fs')

const REAL_IP = 'http://123.12.12.123'
const urlsToNotProxy = [
	/.*\/real-route1\/.*/,
	/.*\/real-route2\/.*/
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
	const shouldRedirect = !urlsToNotProxy.some(url => url.test(req.url))
	
	if (shouldRedirect) {
		return proxy.web(req, res, {
			target: 'http://127.0.0.1:4200'
		})
	} else {
		return proxy.web(req, res, {
			target:  REAL_IP
		})
	}
}