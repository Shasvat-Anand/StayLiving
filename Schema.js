const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listings: Joi.object({
        title: Joi.string().required(),
        Brand:Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        bedtype : Joi.string().required(),
        hosteltype : Joi.string().required(),
        bathroom : Joi.string().required(),
        roomtype : Joi.string().required(),
        contact: Joi.string().required().length(10).pattern(/^[0-9]{10}$/),
        alternatecontact: Joi.string().required().length(10).pattern(/^[0-9]{10}$/),
        price: Joi.number().required().min(0),
       
        image: Joi.array().items(
            Joi.object({
            url: Joi.string().required(),
            filename: Joi.string().required(),
            })
        ),
    }).required(),
})


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).empty("").default(5),
        comment: Joi.string().required()
    }).required()
});