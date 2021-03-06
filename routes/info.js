const { Router } = require('express');
const Contact = require('../models/contact')
const auth = require('../middleware/auth')


const router = Router();

router.get('/', (req, resp) => {
    resp.render('index', {
        title: 'Info page',
        isInfo: true
    })
})

router.post('/', auth, async(req, resp) => { // Listen forms
    const contact = new Contact({
        name: req.body.name,
        photo: req.body.photo,
        email: req.body.email,
        userId: req.user
    })

    try {
        await contact.save()
        resp.redirect('/contacts') // Method for redirect
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;