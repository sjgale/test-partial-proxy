const http = require('http')
const https = require('https')
const httpProxy = require('http-proxy')
const fs = require('fs')

const REAL_IP = 'http://52.53.141.92'
const urlsToNotProxy = [
	/.*\/bb\/.*/,
	/.*\/ws\/.*/
]

const proxy = httpProxy.createProxyServer()
const options = {
    key: fs.readFileSync('ssl/proxy.key'),
    cert: fs.readFileSync('ssl/proxy.crt')
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
	const shouldProxy = !urlsToNotProxy.some(url => url.test(req.url))
	
	if (shouldProxy) {
		return proxy.web(req, res, {
			target: 'http://127.0.0.1:4200'
		})
	} else {
		return proxy.web(req, res, {
			target:  REAL_IP
		})
	}
}