const { myLog, Parsecurl, Makecurl } = require('curl-extract-build')

const myCurl = {
    requestType: 'POST',
    url: '/v2/auth/user?name=aniket&role=admin',  // url + Query param 
    headers: [
        { key: 'Content-Type', value: 'application/json', isChecked: true },
        {
            key: 'api-key',
            value: 'my-api-key',
            isChecked: true,
        },
    ],
    body: {
        email: 'mymail@gmail.com',
        password: "mail@123",
        role: 'admin',
        config: {
            notification: true,
            superuser: true
        },
    },
}

console.log(Makecurl(myCurl));