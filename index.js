const express = require('express');
const { resolve } = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

// Constants
const TAX_RATE = 0.05;
const DISCOUNT_PERCENTAGE = 0.10;
const LOYALTY_POINTS_MULTIPLIER = 2;

// Helper function to validate numeric input
const validateNumericInput = (value, fieldName) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new Error(`Invalid ${fieldName}: must be a number`);
  }
  return num;
};

app.get('/cart-total', (req, res) => {
  try {
    const newItemPrice = validateNumericInput(req.query.newItemPrice, 'newItemPrice');
    const cartTotal = validateNumericInput(req.query.cartTotal, 'cartTotal');
    const total = cartTotal + newItemPrice;
    res.json({ total });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/membership-discount', (req, res) => {
  try {
    const cartTotal = validateNumericInput(req.query.cartTotal, 'cartTotal');
    const isMember = req.query.isMember === 'true';
    const finalPrice = isMember ? cartTotal * (1 - DISCOUNT_PERCENTAGE) : cartTotal;
    res.json({ finalPrice });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/calculate-tax', (req, res) => {
  try {
    const cartTotal = validateNumericInput(req.query.cartTotal, 'cartTotal');
    const tax = cartTotal * TAX_RATE;
    res.json({ tax });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/estimate-delivery', (req, res) => {
  try {
    const shippingMethod = req.query.shippingMethod;
    const distance = validateNumericInput(req.query.distance, 'distance');

    if (!['standard', 'express'].includes(shippingMethod)) {
      throw new Error('Invalid shipping method: must be "standard" or "express"');
    }

    const days = Math.ceil(distance / (shippingMethod === 'standard' ? 50 : 100));
    res.json({ days });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/loyalty-points', (req, res) => {
  try {
    const purchaseAmount = validateNumericInput(req.query.purchaseAmount, 'purchaseAmount');
    const loyaltyPoints = purchaseAmount * LOYALTY_POINTS_MULTIPLIER;
    res.json({ loyaltyPoints });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});