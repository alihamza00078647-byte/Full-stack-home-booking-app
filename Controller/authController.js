const User = require('../model/user');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');




exports.getLoginPage = (req, res, next) => {
    res.render('auth/login', {pageTitle : 'Login page', 
        isLoggedIn : false,
        errors : [],
    });
} 


exports.postLoginPage = async (req, res, next) => {

    const {email, password} = req.body;
    const user = await User.findOne({email : email})

        if (!user) {
            console.log('User not found with email:', email);
            return res.status(422).render('auth/login', {
                pageTitle : 'Login Page',
                isLoggedIn : false,
                errors : ['Invalid email or password'],
                oldInput : {email : email}
            }
        )
    }
    
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch){
            console.log('User not found with password:', password);
            return res.status(422).render('auth/login', {
                pageTitle : 'Login Page',
                isLoggedIn : false,
                errors : ['Invalid email or password'],
                oldInput : {email : email}
            })
        }

    req.session.myUser = {
        id : user._id.toString(),
        firstName : user.firstName,
        lastName : user.lastName,
        email : user.email,
        userType : user.userType
    }
    req.session.isLoggedIn = true;
    await req.session.save();
    console.log('Login Successfully');
    res.redirect('/');
}

exports.getLogoutPage = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error While Logging Out', err);
            return next(err);
        }
        res.clearCookie('connect.sid');
        return res.redirect('/login');
    });
}








exports.getSignupPage = (req, res, next) => {
    res.render('auth/signup', {pageTitle : 'Signup page',
        isLoggedIn : req.isLoggedIn,
        errors : [],
        oldInput : {firstName : "", lastName : "", email : "", password : "", userType : ""}
    });
}


exports.postSignupPage =  [

    
    check('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({min : 2})
    .withMessage('First name must be at least 2 characters long')
    .matches(/^[A-Za-z]+$/)
    .withMessage('First name can only contain letters'),
    
    
    check('lastName')
    .trim()
    .matches(/^[A-Za-z]*$/)
    .withMessage('Last name can only contain letters'),
    
    
    check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
    
    
    check('password')
    .trim()
    .isLength({min: 8})
    .withMessage('Password must be at least 6 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*()_+{};|'"<>?,./\:"]/)
    .withMessage('Password must contain at least one special character'),
    
    
    check('confirmPassword')
    .trim()
    .custom((value, {req}) => {
        if (value !== req.body.password){
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    
    
    check('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['host', 'guest'])
    .withMessage('Invalid user type'),
    
    async (req, res, next) => {
        const {firstName, lastName, email, password, confirmPassword, userType} = req.body;
        const errors = validationResult(req);
        
        if (!errors.isEmpty()){
            return res.status(422).render('auth/signup', {
                pageTitle : 'Signup page',
                isLoggedIn : false,
                errors : errors.array().map(err => err.msg),
                oldInput : {firstName, lastName, email, userType}
            })
        }

        try {
            const existingUser = await User.findOne({email : email});
            if (existingUser) {
                return res.render({
                    pageTitle : 'Signup page',
                    isLoggedIn : false,
                    errors : ['Email already exists. Please use a different email.'],
                    oldInput : {firstName, lastName, email, userType}
                })
            }

        const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({firstName, lastName, email, password : hashedPassword, userType});
            await user.save();
            res.redirect('/login');
        } catch(err) {
            console.log('Error While Saving User', err);
            return res.status(422).render('auth/signup', {
                pageTitle : 'Signup page',
                isLoggedIn : false,
                errors : [err.message],
                oldInput : {firstName, lastName, email, userType}
            });
        }
    }
]