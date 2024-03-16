import express, { Request, Response } from 'express';
import Hotel from '../models/hotel.model';
import { HotelSearchResponse } from '../shared/types';

const router = express.Router();

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    // i = ignore case
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, 'i') },
      { country: new RegExp(queryParams.destination, 'i') },
    ];
  }

  // gte = greater than or equal (>=)
  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  // find Hotel that has all the facilities
  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  // find any Hotel that includes any of the types
  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  // find any Hotel that includes any of the stars
  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  // lte = less than or equal (<=)
  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

router.get('/search', async (req: Request, res: Response) => {
  const query = constructSearchQuery(req.query);

  let sortOptions = {};
  switch (req.query.sortOption) {
    case 'starRating':
      sortOptions = { starRating: -1 }; // -1 = descending (high to low)
      break;
    case 'pricePerNightAsc':
      sortOptions = { pricePerNight: 1 }; // 1 = ascending (low to high)
      break;
    case 'pricePerNightDesc':
      sortOptions = { pricePerNight: -1 };
      break;
  }

  try {
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : '1'
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
