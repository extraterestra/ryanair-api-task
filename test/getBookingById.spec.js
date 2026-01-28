const request = require('supertest');
const expect = require('chai').expect;
const bookingSpec = require('../specs/bookingSpec');
const { bookingKeys } = require('../models/bookingModel');
const { errorKeys, errorDetailKeys, locationKeys } = require('../models/errorModel');

describe('Get Booking by ID', () => {
    const bookingId = 1;
    const bookingIdAsUndefined = undefined;
    const bookingIdNotExisting = 99999;

    it('GET /booking/:id should return a specific booking', async () => {
        const response = await request(bookingSpec.baseUrl)
            .get(bookingSpec.getBookingPath(bookingId))
            .set('Accept', 'application/json');

        expect(response.status).to.equal(200);
        
        // Assert on the structure using the booking model
        expect(response.body).to.have.all.keys(bookingKeys);

        // Specific field types
        expect(response.body.id).to.be.a('number');
        expect(response.body.date).to.be.a('string');
        expect(response.body.destination).to.be.a('string');
        expect(response.body.origin).to.be.a('string');
        expect(response.body.userId).to.be.a('number');
    });

        it('GET /booking/{undefined_id} should return 400 response code', async () => {
        const response = await request(bookingSpec.baseUrl)
            .get(bookingSpec.getBookingPath(bookingIdAsUndefined))
            .set('Accept', 'application/json');
        
        expect(response.status).to.equal(400);
        
    });

    it('GET /booking/{undefined_id} should have required structure of response', async () => {
        const response = await request(bookingSpec.baseUrl)
            .get(bookingSpec.getBookingPath(bookingIdAsUndefined))
            .set('Accept', 'application/json');
        
        // Verify response structure using the error model
        expect(response.body).to.have.all.keys(errorKeys);
        expect(response.body.errors).to.be.an('array');
        
        if (response.body.errors.length > 0) {
            const error = response.body.errors[0];
            expect(error).to.have.all.keys(errorDetailKeys);
            expect(error.location).to.have.all.keys(locationKeys);
            
            expect(error.message).to.be.a('string');
            expect(error.location.in).to.be.a('string');
            expect(error.location.name).to.be.a('string');
            expect(error.location.docPath).to.be.a('string');
            expect(error.location.path).to.be.a('string');
        }
    });

    it('GET /booking/{not_existing_id} should return 404 response code', async () => {
        const response = await request(bookingSpec.baseUrl)
            .get(bookingSpec.getBookingPath(bookingIdNotExisting))
            .set('Accept', 'application/json');
        
        expect(response.status).to.equal(404);
        
    });

        it('GET /booking/{not_existing_id} should message in response body of required value', async () => {
        const response = await request(bookingSpec.baseUrl)
            .get(bookingSpec.getBookingPath(bookingIdNotExisting))
            .set('Accept', 'application/json');
        
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Booking not found');

        
    });

        it('GET /booking/{not_existing_id} should return required response structure', async () => {
        const response = await request(bookingSpec.baseUrl)
            .get(bookingSpec.getBookingPath(bookingIdNotExisting))
            .set('Accept', 'application/json');
    
        
        // Verify response structure using the error model
        expect(response.body).to.have.all.keys(errorKeys);
        expect(response.body.errors).to.be.an('array');
        
        if (response.body.errors.length > 0) {
            const error = response.body.errors[0];
            expect(error).to.have.all.keys(errorDetailKeys);
            expect(error.location).to.have.all.keys(locationKeys);
            
            expect(error.message).to.be.a('string');
            expect(error.location.in).to.be.a('string');
            expect(error.location.name).to.be.a('string');
            expect(error.location.docPath).to.be.a('string');
            expect(error.location.path).to.be.a('string');
        }
    });

});
