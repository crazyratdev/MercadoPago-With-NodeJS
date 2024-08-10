
# MercadoPago With NodeJS

A simple "step-by-step" guide showing how to use the MercadoPago's Checkout Transparente to make payments.

I strongly recommed checking the official MercadoPago's documentation, which you can find here:
***https://www.mercadopago.com.br/developers/en/docs/checkout-api/landing***




## 1. Appendix

Before starting, I want to make it clear that I'm actually a newbie on using this API, so there's probably a lot of better ways to do it, and here, I'll be focusing on the simplest way (in my opinion) to use it with Node.


## 2. Requirements

Not a lot of things, so I'll be showing the packages that you'll need, and the npm comand to install'em.

Packages:

  - Mercadopago: ```npm i mercadopago```
  - express: ```npm i express```
  - ejs: ```npm i ejs```
  - nodemon: ```npm i -D nodemon```
  - sucrase: ```npm i -D sucrase```
## 3. Configure the environment

I'll be using ES Modules (import export), to do that so, create a nodemon.json file in your root folder, and type the code below:

```
{
  "execMap": {
    "js: "node -r sucrase/register index.js",
  },
}
```

And then create a new script (I'll be using "start") in your package.json that executes the script below:

`"start": "nodemon index.js"`

If you wanna test this configuration, open a new terminal and run: `npm run [your_script_name]`. You should see in the last line something like the we inserted into our nodemon.json file.

---

Now let's start coding. First of all, let's set up our server. To do so, create a new index.js file in your project root folder, and type this:
```
import express from 'express'
import routes from './routes'

const app = express()

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('./static'))
app.use(express.json())
app.use(routes)

app.listen(8000, console.log("Server running on: http://localhost:8000"))
```

- `import express from 'express'`: Import the express package.
- `import routes from './routes'`: Import the routes file, wich we'll create later.
- `const app = express()`: Create a new express server.
- `app.set('view engine', 'ejs')`: Set the "HTML" "interpreter" to ejs.
- `app.set('views', './views')`: Set the folder wich contains the ejs files.
- `app.use(express.static('./static'))`: Set the static files folder, like .css and .js (frontend).
- `app.use(express.json())`: Use JSON parse on POSTs.
- `app.use(routes)`: Use the routes set on the routes file.
- `app.listen(8000, log("Server runnning...")`: Make the server listen on localhost port 8000, and then log that the server is listening.

---
Create, in your project root folder, 2 more folders, one called `static`, and the other one `views`.

Inside `static`, create a css.css file, and a `frontend.js` file. Don't need to type anything inside'em for now.

Inside `views`, create a `index.ejs` file, and create the basic structure of a HTML using `!`. In the body section, type `Hello World!`, so we can test it later (and to not get cursed).

In your project's root folder, create a `routes.js`,and type the code below in it:

```
import express from express
const router = express.Router()

router.get('/', (req, res) => res.render('index'))

export default router
```

- Here we imported the express, and created a new Router wich will take care of the routes of our application. Then we set the home route to render the index.ejs file. Note that we don't need to type it's entire path, because the express server is already serving us our views files.

Now, just run the start script created before, and open a new tab in your browser going to the http://localhost:8000.
## 4. Initialize the cardForm

Now let's start using the mercadopago's API. Open your view file, and import the mercadopago's SDK. This file will take care of getting all the card infos, and generating a secure token wich we'll use to make the payments.

Put this on the <head> section:

`<script src="https://sdk.mercadopago.com/js/v2"></script>`

Now we must set our credentials, wich you can get here: https://www.mercadopago.com.br/developers/panel/app

Login in your account, and go to "Your Integrations", and select your integration. From there, go to Test Credentials, and copy your Public Key.

Open your frontend.js file, and type this:

`const mp = new MercadoPago("YOUR_PUBLIC_KEY")`

Chanhe your Public Key with the one you copied before.

---

Then, on the index.ejs, copy paste the following:

```
<form id="form-checkout">
    <div id="form-checkout__cardNumber" class="container"></div>
    <div id="form-checkout__expirationDate" class="container"></div>
    <div id="form-checkout__securityCode" class="container"></div>
    <input type="text" id="form-checkout__cardholderName" />
    <select id="form-checkout__issuer"></select>
    <select id="form-checkout__installments"></select>
    <select id="form-checkout__identificationType"></select>
    <input type="text" id="form-checkout__identificationNumber" />
    <input type="email" id="form-checkout__cardholderEmail" />

    <button type="submit" id="form-checkout__submit">Pay</button>
    <progress value="0" class="progress-bar">Loading...</progress>
</form>
```

This is the form that will get the card data.

Add the css.css import on the index.ejs too. And paste this to add some customization:

```
<style>
    #form-checkout {
      display: flex;
      flex-direction: column;
      max-width: 600px;
    }

    .container {
      height: 18px;
      display: inline-block;
      border: 1px solid rgb(118, 118, 118);
      border-radius: 2px;
      padding: 1px 2px;
    }
</style>
```

---

Now, on the frontend file, copy paste (just remeber to look for incorrect brackets):

```
const cardForm = mp.cardForm({
amount: "100.5",
iframe: true,
form: {
id: "form-checkout",
cardNumber: {
id: "form-checkout__cardNumber",
placeholder: "Card Number",
},
expirationDate: {
id: "form-checkout__expirationDate",
placeholder: "MM/YY",
},
securityCode: {
id: "form-checkout__securityCode",
placeholder: "Security Code",
},
cardholderName: {
id: "form-checkout__cardholderName",
placeholder: "Cardholder",
},
issuer: {
id: "form-checkout__issuer",
placeholder: "Issuing bank",
},
installments: {
id: "form-checkout__installments",
placeholder: "Installments",
},
identificationType: {
id: "form-checkout__identificationType",
placeholder: "Document type",
},
identificationNumber: {
id: "form-checkout__identificationNumber",
placeholder: "Document number",
},
cardholderEmail: {
id: "form-checkout__cardholderEmail",
placeholder: "Email",
},
},
callbacks: {
onFormMounted: error => {
if (error) return console.warn("Form Mounted handling error: ", error);
console.log("Form mounted");
},
onSubmit: event => {
event.preventDefault();

const {
paymentMethodId: payment_method_id,
issuerId: issuer_id,
cardholderEmail: email,
amount,
token,
installments,
identificationNumber,
identificationType,
} = cardForm.getCardFormData();

fetch("/process_payment", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
token,
issuer_id,
payment_method_id,
transaction_amount: Number(amount),
installments: Number(installments),
description: "Product Description",
payer: {
email,
identification: {
type: identificationType,
number: identificationNumber,
},
},
}),
});
},
onFetching: (resource) => {
console.log("Fetching resource: ", resource);

// Animate progress bar
const progressBar = document.querySelector(".progress-bar");
progressBar.removeAttribute("value");

return() => {
progressBar.setAttribute("value", "0");
};
}
},
});
```

This 100 lines code, basically sets the amount (first line), and says wich input corresponds to it's respectively card data.

In it, is a onSubmit function, that will POST fetch on a backend port that we must create.
