[![Build Status](https://travis-ci.org/ehab180hb/crudApp.svg?branch=master)](https://travis-ci.org/ehab180hb/crudApp)
[![codecov](https://codecov.io/gh/ehab180hb/crudApp/branch/master/graph/badge.svg)](https://codecov.io/gh/ehab180hb/crudApp)

#  Basic CRUD API

To run in development:
``` 
yarn
yarn dev
```

To deploy in production:
```
export MONGO_URI="<Your MongoDB URI here>"
yarn
yarn start
```

The API is Google App Engine-ready:
```
echo "MONGO_URI=\"<Your MongoDB URI here>\"" >> .env
gcloud app deploy
```

## To do:
- Validate before hitting controller
- Passport JWT local
- Stackdriver/datadog winston transporter
- ts-check

## Available APIs

- [User](#user)
	- [Create a new user](#create-a-new-user)
	- [Delete user](#delete-user)
	- [Get all users](#get-all-users)
	- [Get a user](#get-a-user)
	- [Update user](#update-user)
	


# User

## Create a new user



	POST /api/v1/user/


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String			|  User's email							|

### Success Response

Success response:

```
HTTPS 201 CREATED
{ "created": true }
```
### Error Response

Error response:

```
HTTPS 409 CONFLICT
{ "error": "User already exists" }
```
Error response:

```
HTTPS 400 BAD REQUEST
{
  "error": "ValidationError: child \"email\" fails because [\"email\" must be a valid email]"
}
```
## Delete user



	DELETE /api/v1/user/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| id			| String			|  User ID							|

### Success Response

Success respone:

```
HTTPS 200 OK
{ "deleted": true }
```
### Error Response

Error respone:

```
HTTPS 404 NOT FOUND
  { "error": "User not found" }
```
Error respone:

```
HTTPS 400 BAD REQUEST
{
  error: "ValidationError: child \"id\" fails because [\"id\" with value \"hij\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/]"
}
```
## Get all users



	GET /api/v1/user/


### Success Response

Success response:

```
HTTPS 200 OK
[{
  "id": "5affe783a49ebd0355359913",
  "email": "user1@email.com"
},
{
  "id": "5affe783a49ebd0355359923",
  "email": "user1@email.com"
}]
```
### Error Response

Error response:

```
HTTPS 404 NOT FOUND
{ "error": "There are no existing users" }
```
## Get a user



	GET /api/v1/user/:id


### Success Response

Success response:

```
HTTPS 200 OK
{
  "id": "5affe783a49ebd0355359923",
  "email": "user1@email.com"
}
```
### Error Response

Error respone:

```
HTTPS 400 BAD REQUEST
{
  "error": "ValidationError: child "email" fails because ["email" must be a valid email]"
}
```
Error respone:

```
HTTPS 404 NOT FOUND
{ "error": "User not found"  }
```
## Update user



	PATCH /api/v1/user/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| id			| String			|  User ID							|
| email			| String			|  User's email							|

### Success Response

Success response:

```
HTTPS 200 OK
{ "updated": true }
```
### Error Response

Error respone:

```
HTTPS 404 NOT FOUND
  { "error": "User not found" }
```
Error respone:

```
HTTPS 400 BAD REQUEST
  { "error": "ValidationError: child \"email\" fails because [\"email\" must be a valid email]" }
```

