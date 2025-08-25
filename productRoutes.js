const express = require('express');
const app = express();
const cors = require('cors');
// import products
let products = require('./data/products');

// global middlewares
app.use(cors());
app.use(express.json());

// logging middleware 
app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);  next();
});

// get all products
app.get('/products', (req, res, next) => {
  res.json(products);
});

// searching for specific products this should be above of /porducts/:id until not to treated as search as id
app.get('/products/search', (req, res, next) => {
  try {
    const { q, minPrice, maxPrice } = req.query;
    const filterProducts = products
      .filter(
        (product) =>
          product.price >= parseFloat(minPrice) && product.price <= parseFloat(maxPrice)
      )
      .slice(0, parseInt(q));
    res.json({
      message: 'This is Search endpoint',
      filterProducts: filterProducts,
    });
  } catch (error) {
    next(error);
  }
});

// get product by id
app.get('/products/:id', (req, res, next) => {
  const { id } = req.params;
  let product = products.find((product) => product.id == id);
  if (!product) {
    const error = new Error(`Product with id ${id} not found`);
    error.status = 404;  // setting status for error handler
    return next(error);
  }
  res.json(product);
});

// add product
app.post('/products', (req, res, next) => {
  products.push({
    id: products.length + 1,
    ...req.body,
  });
  res.json({
    id: products.length,
    message: 'User has been successfully created',
    user: req.body,
  });
});

// edit product
app.put('/products/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    let productIndex = products.findIndex((product) => product.id == id);
    if (productIndex == -1) {
      const error = new Error(`Product with id ${id} not found`);
      error.status = 404;
      return next(error);
    }

    const updatedProduct = {
      ...products[productIndex],
      ...data,
    };
    products[productIndex] = updatedProduct;

    res.json({
      message: `The product with id ${id} has been successfully edited.`,
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// delete product
app.delete('/products/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const index = products.findIndex((product) => product.id == id);
    if (index == -1) {
      const error = new Error(`Product with id ${id} not found`);
      error.status = 404;
      return next(error);
    }
    products.splice(index, 1);
    res.status(200).json({
      message: `Product with id ${id} has been successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
});

// handle non endpoint exists
app.use((req,res,next)=>{
    const error = new Error('This page is not found');
    error.status = 404;
    next(error);
})

// error handling middleware
app.use((err, req, res, next) => {
//   console.log('this is error stack:', err.stack);
  res.status(err.status || 500).json({
    error: err.message,
  });
});

// start server on port 5000
app.listen(5000, () => {
  console.log('server has been connected successfully');
});
