const fs = require('fs');
const path = require('path');

const getImage = (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'images', imageName);

    fs.access(imagePath, fs.constants.F_OK, (error) => {
        if (error) return res.status(404).send('image not found');
        return res.sendFile(imagePath);
    }) 
}

module.exports = {getImage};