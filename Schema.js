const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listings: Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        bedtype : Joi.string().required(),
        hosteltype : Joi.string().required(),
        bathroom : Joi.string().required(),
        roomtype : Joi.string().required(),
        contact: Joi.string().required().length(10).pattern(/^[0-9]{10}$/),
        alternatecontact: Joi.string().required().length(10).pattern(/^[0-9]{10}$/),
        singleprice: Joi.number().required().min(0),
        doubleprice: Joi.number().required().min(0),
        tripleprice: Joi.number().required().min(0),
        image : Joi.string().allow("", null)
    }).required(),
})


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).empty("").default(5),
        comment: Joi.string().required()
    }).required()
});