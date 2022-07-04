import bcrypt from 'bcrypt';
import User from '../model/userModel';

const createUser = async(req, res) => {
  const { username, email, password } = req.body
  try {
    const usernameCheck = await User.findOne({ username });
    if(usernameCheck)
      return res.json({message: 'Username has been taken', status: false })
    const emailCheck = await User.findOne({ email });
    if(emailCheck)
      return res.json({message: 'Emails already exist', status: false })
    const hashedPassword = await bcrypt.hash(password, 10);
    const userInput = new User({
      username,
      email,
      password: hashedPassword,
    });
    const user = await userInput.save();
    delete user.password;
    res.status(200).json({
      data: user,
      message: 'Account created successfully',
      status: true
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }  
}

const login = async(req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne( { username });
    if(!user) {
      return res.json({
        message: 'Incorrect username or password',
        status: false,
      })
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if(!validatePassword){
      return res.json({
        message: 'Incorrect username or password',
        status: false
      })
    }
    delete user.password;
    res.status(200).json({
      message: 'Login successful',
      data: user,
      status: true
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const setAvatar = async(req, res) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const data = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    res.status(200).json({
      message: 'Image set successfully',
      isSet: data.isAvatarImageSet,
      image: data.avatarImage,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const allUsers = async(req, res) => {
  try {
    const userId = req.params.id;
    const users = await User.find({ _id: { $ne: `${userId}` }}).select([
      'username',
      'email',
      'avatarImage',
      '_id',
    ]);
    res.status(200).json({
      users,
      message: 'Users fetched successfully',
    })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {
  createUser,
  login,
  setAvatar,
  allUsers,
}
