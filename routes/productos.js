var express = require('express');
var router = express.Router();
var productos = [
    {
        nombre:'Coca Cola',
        description: 'Refresco de cola con azucar',
        precio: 15.00,
        cantidadEnInventario: 20,
        fechaDeModificacion: new Date()
    },
    {
        nombre:'Coca Cola Sin Azucar',
        description: 'Refresco de cola sin azucar',
        precio: 12.50,
        cantidadEnInventario: 20,
        fechaDeModificacion: new Date()
    }
];

/* GET productos listing. */

router.get('/getProductos', function(req, res) {
  res.send(productos);
});


router.post('/addProducto', function(req, res) {
    productos.push(req.body);
    res.send(productos);
});

module.exports = router;
