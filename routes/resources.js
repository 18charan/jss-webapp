const express = require('express');
const path = require('path')

const router = express.Router();

router.get('/:file', (req, res) => {
    const file_name = req.params.file
    return res.sendFile(path.join(__dirname, '/../resources/'+file_name))
});

module.exports = router;