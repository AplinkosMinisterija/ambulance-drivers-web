const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/proxy/palantir', {
      target: 'https://vdv.stat.gov.lt',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy/palantir': '',
      },
      headers: {
        Connection: 'keep-alive',
      },
    }),
  );
  app.use(
    createProxyMiddleware('/proxy/distance', {
      target: 'https://router.project-osrm.org',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy/distance': '',
      },
      headers: {
        Connection: 'keep-alive',
      },
    }),
  );
};
