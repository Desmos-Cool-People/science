require('express')()
    .get ('/', async (req, res) => {
        res.status(200).sendFile(require('path').join(__dirname, 'public/html/index.html'))
    }) 
    .get ('/styles.css', async (req, res) => {
        res.status(200).sendFile(require('path').join(__dirname, 'public/css/styles.css'))
    })
    .get ('/index.js', async (req, res) => {
        res.status(200).sendFile(require('path').join(__dirname, 'public/js/index.js'))
    })
    .get ('/data', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(JSON.parse(require('fs').readFileSync(require('path').join(__dirname, 'data.json'), 'utf-8')))
    })
    .get ('/admin/', async (req, res) => {
        res.status(200).sendFile(require('path').join(__dirname, 'public/admin/html/index.html'))
    })
    .get ('/admin/styles.css', async (req, res) => {
        res.status(200).sendFile(require('path').join(__dirname, 'public/admin/css/styles.css'))
    })
    .get ('/admin/index.js', async (req, res) => {
        res.status(200).sendFile(require('path').join(__dirname, 'public/admin/js/index.js'))
    })
    .post ('/data', require('express').json(), (req, res) => {
        const jsonData = req.body;
        jsonData.cost = async () => {
            let cost = 0;
            for (let index = 0; index < jsonData.days.length; index++) {
                const element = jsonData.days[index];
                //console.log(element)
                switch (element) {
                    case 'a1':
                        cost+=1;
                        break;
                    case 'a2':
                        cost+=0.75;
                        break;
                    case 'b1':
                        cost+=0.4;
                        break;
                    case 'b2': 
                        cost+=0.3;
                        break;
                    case 'c1':
                        cost+=0.1;
                        break;
                    case 'c2':
                        cost+=0.05;
                        break;
                    default: 
                        cost+=0;
                        break;
                }
            }
            return Math.floor(cost*1000);
        }
        jsonData.cost().then((cost) => {
            jsonData.cost = cost;
            jsonData.timestamp = Date.now();
            const storedJSON = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, 'data.json'), 'utf-8'))
            storedJSON.push(jsonData);
            require('fs').writeFileSync(require('path').join(__dirname, 'data.json'), JSON.stringify( storedJSON, null, 2 ))});
            res.status(201).send('')
        })
    .listen(3000, () => console.log('Server running on port 3000'))