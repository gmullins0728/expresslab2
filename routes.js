const router = require("express").Router();
const pool = require("./connection");

router.get('/tables', (req, res) => {
    pool.query('SELECT * FROM shopping_cart').then((data) => {
    res.json(data.rows);
    res.status(200);
    })
});

router.get('/tables/:id', (req, res) => {
    pool.query('SELECT * FROM shopping_cart WHERE id = $1::int', [req.params.id]).then((data) => {
        if (data.rows.length !== 0) {
            res.json(data.rows[0]);
        } else {
            res.status(404)
            res.json({ message: `ID: ${req.params.id} not found` });
        }
    });
});

router.post('/tables', (req, res) => {
    pool.query('INSERT INTO shopping_cart (id, product, price, quantity) VALUES ($1::int, $2::text, $3::real, $4::int)', [req.body.id, req.body.product, req.body.price, req.body.quantity]).then((data) => {
        data.rows.push({
            id: req.body.id,
            product: req.body.product,
            price: req.body.price,
            quantity: req.body.quantity, 
        }); 
    res.json(data.rows);
    res.status(201);
    });
});

router.put('/tables/:id', (req, res) => {
    pool.query('UPDATE shopping_cart SET product=$1::text, price=$2::real, quantity=$3::int WHERE id=$4::int', [req.body.product, req.body.price, req.body.quantity, req.params.id]).then((data) => {
        const index = data.rows[req.params];
            data.rows.splice(index, 1, req.body);
            res.status(200);
            res.json(data.rows);
    });
});

router.delete('/tables/:id', (req,res) => {
    pool.query('DELETE FROM shopping_cart WHERE id=$1::int', [req.params.id]).then((data) => {
        const index = data.rows.indexOf(req.params.id);
            data.rows.splice(index, 1);
            res.status(204);
            res.json(data.rows);
    });
});

module.exports = router;