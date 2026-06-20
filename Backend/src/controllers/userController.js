const User = require('../models/User');
const asynchandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const APIFeatures = require('../utils/APIFeatures');



/**
 * @desc    add a new user
 * @route   POST /api/users
 * @method  POST
 * @access  Public
 */
exports.CreateUser = asynchandler(async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, 10);
     if (req.file) {
    req.body.image = req.file.filename;
    }
    // way 1
    // const user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     role: req.body.role
    // })
    // const savedUser = await user.save();
    
    // way 2
    // const user = new User(req.body);
    // const savedUser = await user.save();
    
    // way 3
    const savedUser = await User.create(req.body);
    savedUser.password = undefined;
    logger.info("User created successfully");
    res.status(201).json(savedUser);
});


/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @method  POST
 * @access  Public
 */
exports.LoginUser = asynchandler(async (req, res) => {
      const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({
            status: "fail",
            message: "Email and password are required"
        });
    }
    const user = await User.findOne({ email }).select('+password');;
    if (!user) {
        res.status(404).json({ message: "User not found" });
        logger.warn(`Login attempt with non-existent email: ${email}`);
        return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        logger.warn(`Failed login attempt for email: ${email}`);
        return;
    }
    if(!user.isActive){
        logger.warn(`Login attempt for inactive user: ${email}`)
        res.status(403).json({ message: "User is not active, you cannot log in" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    logger.info(`User logged in successfully: ${email}`);
    res.status(200).json({ token });
});


/**
 * @desc    Logout user
 * @route   POST /api/users/logout
 * @method  POST
 * @access  Public
 */
exports.LogoutUser = asynchandler(async (req, res) => {
    // Since JWT is stateless, we can't truly "log out" a user on the server side.
    // However, we can instruct the client to delete the token.
    logger.info("User logged out successfully");
    res.status(200).json({ message: "Logged out successfully" });
});


/**
 * @desc    get all users
 * @route   GET /api/users
 * @method  GET
 * @access  private (admin)
 */
exports.GetUsers = asynchandler(async (req, res) => {
    logger.info(`Retrieving all users by admin: ${req.user.id}`);
    // const users = await User.find().select("-password");
    // res.status(200).json(users);

    // with pagination i want use paginate middleware and make select -password in it
    const result = await new APIFeatures(User, req.query)
      .filter() 
      .sort()
      .select()
      .paginate({
        defaultLimit: 10,
        maxLimit: 50
      })
      .execute();
   res.status(200).json(result);
});

/**
 * @desc    get me
 * @route   GET /api/users/me
 * @method  GET
 * @access  private (me)
 */
exports.GetMe = asynchandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    logger.info(`User details retrieved successfully: ${req.user.id}`);
    res.status(200).json(user);
});

/**
 * @desc    update me
 * @route   PUT /api/users/me
 * @method  PUT
 * @access  private (me)
 */
exports.UpdateMe = asynchandler(async (req, res) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
     if (req.file) {
    req.body.image = req.file.filename;
    }
    // way 1
    // const updatedUser = await User.findByIdAndUpdate(req.user.id,$.set({
    //     username: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    // }), { new: true });
    // way 2
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { returnDocument: "after"  }).select("-password");
    logger.info(`User details updated successfully: ${req.user.id}`);
    res.status(200).json(updatedUser);

});

/**
 * @desc    reset my password
 * @route   PUT /api/users/me/reset-password
 * @method  PUT
 * @access  private (me)
 */
exports.ResetMyPassword = asynchandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body || {};

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        logger.warn(`Password reset requested for non-existent user: ${req.user.id}`);
        return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        logger.warn(`Password reset failed due to wrong current password: ${req.user.id}`);
        return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    logger.info(`Password reset successfully: ${req.user.id}`);
    return res.status(200).json({ message: "Password reset successfully" });
});

/**
 * @desc    delete user
 * @route   DELETE /api/users/
 * @method  DELETE
 * @access  private (admin)
 */
exports.DeleteUser = asynchandler(async (req, res) => {
    await User.findByIdAndDelete(req.params.userId);
    logger.info(`User deleted successfully: ${req.params.userId}`);
    res.status(200).json({ message: "User deleted successfully" });
});

/**
 * @desc    change user role
 * @route   PUT /api/users/:userId/role
 * @method  patch
 * @access  private (admin)
 * */
exports.ChangeUserRole = asynchandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        logger.warn(`Attempt to update role with invalid role: ${role}`);
        res.status(400).json({ message: "Invalid role" });
        return;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { returnDocument: "after"  });
    if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        logger.warn(`Attempt to update role for non-existent user: ${userId}`);
        return;
    }
    logger.info(`User role updated successfully: ${userId}`);
    res.status(200).json(updatedUser);
});

/**
 * @desc   activate user
 * @route   PATCH /api/users/activate/:userId
 * @method  PATCH
 *  @access  private (admin)
 *  
 * */
exports.ActivateUser = asynchandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        logger.warn(`Attempt to activate non-existent user: ${userId}`);
        return;
    }
    if(user.isActive){
        user.isActive = false;
        await user.save();
        logger.info(`User deactivated successfully: ${userId}`);
        return res.status(200).json({ message: `User deactivated successfully: ${userId}` });
    }
    user.isActive = true;
    await user.save();
    logger.info(`User activated successfully: ${userId}`);
    res.status(200).json({ message: `User activated successfully: ${userId}` });
});

  


