const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    const token = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decodedData = jwt.verify(token.toString(), process.env.JWT_SECRET);

    req.user = await User.findById(decodedData._id);

    next();
    console.log(token);
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource `,
                    403
                )
            );
        }

        next();
    };
};