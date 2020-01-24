exports.userSignupValidator = (req, response, next) => {
  req.check("name", "name is required").notEmpty();
  req
    .check("email", "email is required")
    .matches(/.+\@.+\..+/)
    .withMessage("email must contain @");
  req.check("password", "password is required").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("password must contains more than 6 charactors")
    .matches(/\d/)
    .withMessage("password must contains a number ");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(err => err.msg)[0];
    return response.status(400).json({ error: firstError });
  }
  next();
};
