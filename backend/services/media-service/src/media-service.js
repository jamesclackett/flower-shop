import { access, constants } from 'fs';
import { join } from 'path';

export const getImage = (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = join(__dirname, 'res/images', imageName);

    access(imagePath, constants.F_OK, (error) => {
        if (error) return res.status(404).send('image not found');
        return res.sendFile(imagePath);
    }) 
}