UserApi.post("/register", upload.single("profileImage"), async (req, res) => {
    const { fullName, email, mobile, password } = req.body;

    // check if user exists with email or mobile
    const existingUser = await UserModel.findOne({
        where: {
            [Op.or]: [
                { email },
                { mobile }
            ]
        }
    });

    // if exists don't allow registration
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    let profileImageUrl = null;

    // upload profile image to cloudinary if provided
    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer
        );

        profileImageUrl = result.secure_url;
    }

    // create user object
    const userObj = {
        fullName,
        email,
        mobile,
        password,
        profileImageUrl
    };

    // call register service
    const user = await register(userObj);

    // send response
    res.status(201).json({
        message: "Registration successful",
        payload: { user }
    });
});