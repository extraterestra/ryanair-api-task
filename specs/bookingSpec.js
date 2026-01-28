class BookingSpec {
    constructor() {
        this.baseUrl = 'http://127.0.0.1:8900';
    }

    getBookingPath(id) {
        return `/booking/${id}`;
    }

    getInvalidBookingPath() {
        return '/booking/';
    }
}

module.exports = new BookingSpec();
