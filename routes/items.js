const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { sql, poolPromise } = require('../db');

// storage config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ADD ITEM
router.post('/add', upload.single('image'), async (req, res) => {
    const { user_id, item_name, price } = req.body;
    const image_path = req.file.filename;

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('item_name', sql.VarChar, item_name)
            .input('price', sql.Int, price)
            .input('image_path', sql.VarChar, image_path)
            .query(`
                INSERT INTO Items (user_id, item_name, price, image_path)
                VALUES (@user_id, @item_name, @price, @image_path)
            `);

        res.json({ success: true });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});
router.delete('/buy/:id', async (req, res) => {
    const itemId = req.params.id;

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('item_id', sql.Int, itemId)
            .query('DELETE FROM Items WHERE item_id = @item_id');

        res.json({ success: true });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

// GET ITEMS
router.get('/all', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
    SELECT i.*, u.name, u.phone 
    FROM Items i
    JOIN Users u ON i.user_id = u.user_id
`);

        res.json(result.recordset);

    } catch (err) {
        res.json({ error: err.message });
    }
});

module.exports = router;