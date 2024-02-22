# Postme API [1.0.0]

- A RESTful API for an imaginary social media app Postme

## Technologies

- Node.js(express)
- MongoDB(mongoose)
- Cloudinary
- Nodemailer
- Mailtrap
- JSON Web Tokens
- Multer
- Jimp
- Joi

## Features

- User authentication
- User authorization
- Forgot and reset password functionality
- Profile management (email , password , profile picture , bio)
- Following users
- Creating / updating / deleting posts with photos upload
- Creating / updating / deleting comments
- Liking posts and comments

## API Documentation

- soon...

## Setting Your Local Environment

- Make sure to have accounts on (mongodb atlas , mailtrap , cloudinary)
- Fork and clone the repo
- Install all required dependencies in package.json file
- After installing the dependencies the JS files will be built
- Create a .env file and fill it with your information in this format :

  ```txt
  NODE_ENV=development
  PORT=3000
  DB_URI=
  JWT_SECRET=
  EMAIL=
  EMAIL_HOST=
  EMAIL_PORT=
  EMAIL_USERNAME=
  EMAIL_PASSWORD=
  CLOUD_NAME=
  CLOUD_API_KEY=
  CLOUD_API_SECRET=
  ```

- run dist/index.js

## Contribution

- Contribution is welcomed by sending a pull request

## Licence

- This project is open-sourced under the MIT licence
