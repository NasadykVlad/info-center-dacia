const express = require('express') // Initialization Express.js
const app = express() // Initialization app const
const exphbs = require('express-handlebars') // Initializarion handle-bars
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session)
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const csrf = require('csurf');
const flash = require('connect-flash');
const keys = require('./keys')

// Initialization Routes
const infoRoutes = require("./routes/info")
const shopRoutes = require("./routes/shop")
const aboutRoutes = require("./routes/contacts")
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders")
const authRoutes = require("./routes/auth")
const { isError } = require('util');

const hbs = exphbs.create({ // Use hbs
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
});
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI

})

app.engine('hbs', hbs.engine) // Initialization engine hbs
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'public'))) // Initialization public directory (style ...)
app.use(express.urlencoded({ extended: true })) // Listen forms
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(flash());
app.use(varMiddleware)
app.use(userMiddleware)


// Add Routes
app.use('/', infoRoutes)
app.use('/shop', shopRoutes)
app.use('/contacts', aboutRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3030 // Initialization port

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, { useNewUrlParser: true })

        app.listen(PORT, () => { // Start server
            console.log(`Server is running on port: ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()