module.exports= {
    devServer: {
        host: "localhost",
        port: 8080,
        https: false,
        proxy: {
            '/api': {
                target: 'http://localhost:8002',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''  //通过pathRewrite重写地址，将前缀/api转为/
                }
            }
        }
    }
};
