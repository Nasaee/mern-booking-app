import express, { Request, Response } from 'express';
import multer from 'multer';
import cloundinary from 'cloudinary';
import Hotel, { HotelType } from '../models/hotel.model';
import verifyToken from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// api/my-hotels
router.post(
  '/',
  verifyToken,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type').notEmpty().withMessage('Hotel type is required'),
    body('pricePerNight')
      .notEmpty()
      .isNumeric()
      .withMessage('Price per night is required'),
    body('facilities')
      .notEmpty()
      .isArray()
      .withMessage('Facilities are required'),
  ],
  upload.array('imageFiles', 6), // max 6 images
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      // 1. upload the images to cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString('base64'); // convert encoded image to base64
        let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
        const res = await cloundinary.v2.uploader.upload(dataURI);
        return res.url;
      });
      const imageURLs = await Promise.all(uploadPromises); // wait for all images uploads to finish
      newHotel.imageUrls = imageURLs;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId; // get userId from auth token

      // 2. save the new hotel in our database
      const hotel = new Hotel(newHotel);
      await hotel.save();

      // 3. return a 201 status
      return res.status(201).send(hotel);
    } catch (error) {
      console.log('Error crateing hotel: ', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
);

export default router;
