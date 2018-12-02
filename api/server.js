const express = require("express");
const app = express();
const models = require('./models');
const bodyParser = require('body-parser');
const cors = require('cors')
var stripe = require("stripe")("sk_test_bIkFI8h8wKbxKfX2paoXeDqe");
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());

app.post('/cab/payment', (req, res) => {
    const token = req.body.stripeToken;
    console.log(req.body);
    const charge = stripe.charges.create({
        amount: 10,
        currency: 'rupee',
        description: 'Example charge',
        source: token,
    }, (error, charge) => {
        console.log(charge);
        if (error) {
            res.send({
                success: false,
                message: 'Error'
            })
        }
        else {
            res.send({
                success: true,
                message: 'Success'
            })
        }
    });
})

app.post('/cab/drive', (req, res) => {
    models.Driver.create(req.body).then((result) => {
        res.send(result).status(200);
    })
})

app.post('/cab/user', (req, res) => {
    models.User.create(req.body).then((result) => {
        res.send(result);
    })
})

app.post('/cab/availability', (req, res) => {
    console.log(req.body);
    models.Driver.findOne({
        where: {
            status: 'free',
            carType: req.body.carType
        }
    }).then((result) => {
        res.send(result);
    })
})

app.post('/cab/book', (req, res) => {
    models.Driver.findOne({
        where: {
            carType: req.body.carType,
            status: 'free'
        }
    }).then((resutl) => {
        req.body.driverId = resutl.id;
        models.Trip.create(req.body)
            .then((resp) => {
                models.Driver.update({
                    status: 'booked'
                }, {
                        where: {
                            id: resutl.id
                        }
                    }).then((response) => {
                        res.send([resutl, resp]);
                    })
            }).catch(() => {

            })
    }).catch(() => {

    })
})

app.post('/cab/cancel', (req, res) => {
    models.Trip.findOne({
        where: {
            id: req.body.id
        }
    }).then((findResult) => {
        models.Trip.update({
            bookingStatus: 'cancel'
        }, {
                where: {
                    id: findResult.id
                }
            }).then((updateResult) => {
                models.Driver.update({
                    status: 'free'
                }, {
                        where: {
                            id: findResult.driverId
                        }
                    }
                ).then(result => {
                    res.send(result);
                })
            })
    })
})

app.get('/cab/trips', (req, res) => {
    let id = req.query.id;
    models.Trip.findAll({
        where: {
            userId: id
        }
    }).then(result => {
        res.send(result);
    })
})

app.post('/cab/report', (req, res) => {
    models.Report.create(req.body).then((result) => {
        res.send(result);
    })
})

app.listen(3000, () => {
    console.log("Server listen on port 3000");
});