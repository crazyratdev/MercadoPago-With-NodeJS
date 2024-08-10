import express from "express";
const router = express.Router();
import { Payment, MercadoPagoConfig } from "mercadopago";

router.get("/", (req, res) => res.render("principal"));

router.post("/process_payment", (req, res) => {
  console.log(
    req.body.payer.identification.type,
    req.body.payer.identification.number,
    req.body.installments
  );
  const client = new MercadoPagoConfig({
    accessToken:
      "TEST-1756481476852605-080620-81ffd9e9968c58f8eca773b0686395c1-1738939354",
  });
  const payment = new Payment(client);
  payment
    .create({
      body: {
        transaction_amount: req.body.transaction_amount,
        token: req.body.token,
        description: req.body.description,
        installments: req.body.installments,
        payment_method_id: req.body.payment_method_id,
        issuer_id: req.body.issuer_id,
        payer: {
          email: req.body.payer.email,
          identification: {
            type: req.body.payer.identification.type,
            number: req.body.payer.identification.number,
          },
        },
      },
      requestOptions: {
        idempotencyKey: "e730d8d5-8666-4b0e-9fb0-ad82787ff4b9",
      },
    })
    .then((result) => {
      res.json(result);
      return;
    })
    .catch((error) => {
      console.log(error);
      return;
    });
});

export default router;
