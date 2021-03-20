
const httpError = require('../models/error');

const admin = require('../models/admin');

const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken')




const signup = async (req, res, next) =>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next
            (new httpError('invalid input passed ', 422));

    }

    const { name, matricule, password } = req.body;
    let existinguser;
    try {

        existinguser = await admin.findOne({ matricule: matricule })

    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }

    if (existinguser) {
        const error = new httpError(
            'admin exist',
            422
        );
        return next(error);
    }


    const createduser = new admin({

        name,
        matricule,
        password,
    });

    try {
        await createduser.save();
    } catch (err) {
        const error = new httpError('failed signup', 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { adminId: createduser.id, matricule: createduser.matricule },
            'secret-thinks',
            { expiresIn: '1h' }
        );

    } catch (err) {
        const error = new httpError('failed signup try again later', 500);
        return next(error);

    }




    res.status(201).json({ adminId: createduser.id, matricule:createduser.matricule, token:token });


}



const login = async (req,res,next)=>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next
            (new httpError('invalid input passed ', 422));

    }

    const {matricule,password}=req.body

    let existingUser 

    try {
        existingUser = await admin.findOne({matricule: matricule})
    }catch{
        return next
            (new httpError('failed !!', 500));
    }

    if((!existingUser) || (existingUser.password !== password)){
        return next
            (new httpError('invalid input passed ', 422));
    }

    let token;
    try {
        token = jwt.sign(
            { adminId: existingUser.id, matricule: existingUser.matricule },
            'secret-thinks',
            { expiresIn: '1h' }
        );

    } catch (err) {
        const error = new httpError('failed signup try again later', 500);
        return next(error);

    }


    res.status(200).json({admin:existingUser, token:token})
     
}


exports.signup=signup
exports.login=login
