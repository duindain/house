module.exports = {
    devServer: {
        proxy: 'http://192.168.2.48/',
    },
    publicPath: '/house/'
        /*
            publicPath: process.env.NODE_ENV === 'development' ?
                'http://192.168.2.48/house/' :
                'https://rmu.no-ip.com/house/'*/
}