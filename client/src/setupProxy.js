const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
	app.use(
		createProxyMiddleware('/apiV2/**', {
			target: 'http://localhost:4444',
			changeOrigin: true,
			secure: false
		})
	);
	app.use(
		createProxyMiddleware('/api/**', {
			target: 'http://localhost:8080',
			changeOrigin: true,
			secure: false
		})
	);
};
