const { Router } = require('express');
const router = Router();
const Card = require('../models/card');
const Contact = require('../models/contact');

router.post('/add', async(req, resp) => {
    const contact = await Contact.getById(req.body.id)
    await Card.add(contact)
    resp.redirect('/contacts')
})

router.delete('/remove/:id', async(req, resp) => {
    const card = await Card.remove(req.params.id)
    resp.status(200).json(card)
})

router.get('/', async(req, resp) => {
    const card = await Card.fetch()
    resp.render('card', {
        title: 'Card',
        isCard: true,
        contacts: card.contacts
    })

})

module.exports = router