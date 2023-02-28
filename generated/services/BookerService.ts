/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Booking } from '../models/Booking';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BookerService {

    /**
     * @param year 
     * @param month 
     * @returns Booking Success
     * @throws ApiError
     */
    public static getBookings(
year: number,
month: number,
): CancelablePromise<Array<Booking>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bookings',
            query: {
                'year': year,
                'month': month,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns Booking Success
     * @throws ApiError
     */
    public static postBookings(
requestBody: Booking,
): CancelablePromise<Booking> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param year 
     * @param month 
     * @param id 
     * @returns boolean Success
     * @throws ApiError
     */
    public static deleteBookings(
year: number,
month: number,
id: string,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/bookings',
            query: {
                'year': year,
                'month': month,
                'id': id,
            },
        });
    }

}
