const { access, constants, path } = require('fs');

const getImage = (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'res/images', imageName);

    access(imagePath, constants.F_OK, (error) => {
        if (error) return res.status(404).send('image not found');
        return res.sendFile(imagePath);
    }) 
}

module.exports = { getImage };