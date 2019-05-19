# +plusOne

built with `Express` and `Mongoose`

## Usage
Make sure you have Node.js and npm installed in your computer and then run these commands:
```console
$ npm install
$ npm start
```
For development purpose, you can run:
```console
$ npm install
$ npm run dev
```
For testing purpose, you can run:
```console
$ npm run test
```
Make sure you have set all required your .env parameters
<br>(key reference: .env.example)

Access the REST API via SERVER_URL = `http://api.plusone.ramdhon.net`

## REST API Routes:

### AUTHENTICATION

- **Register**
  - URL:
    - **`POST`** *`<SERVER_URL>/register`*
  - Body:
    - `name`: `String`, required
    - `email`: `String`, required
    - `password`: `String`, required
    - `role`: `String`, required
  - Expected response (status: `201`):
    ```json
      {
        "message": "account registered",
        "newUser":
        {
          "_id": "<generatedId>",
          "name": "<registeredName>",
          "email": "<registeredEmail>",
          "password": "<hashedPassword>",
          "role": "<registeredRole>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<detailedErrors>"
      }
      ```
      Notes:
      - ERROR `400` is caused by entering *empty name* or *empty email* or *duplicated email* or *email not valid format* or *empty password* or *empty role*

- **Login**
  - URL:
    - **`POST`** *`<SERVER_URL>/login`*
  - Body:
    - `email`: `String`, required
    - `password`: `String`, required
  - Expected response (status: `200`):
    ```json
      {
        "message": "login success",
        "token": "<accessToken>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "invalid username / password"
      }
      ```

- **Google Login**
  - URL:
    - **`POST`** *`<SERVER_URL>/oauth/google/login`*
  - Header(s):
    - `id_token`: `String`
  - Expected response (status: `200`):
    ```json
      {
        "message": "login success",
        "token": "<accessToken>"
      }
    ```
  - Error responses:
    - status: `404`:
      ```json
      {
        "message": "new account, then set password",
        "register_token": "<registeredToken>"
      }
      ```
      Notes:
      - ERROR `404` is caused by not registered yet on database, new password needed to be entered from client side
  - Notes:
    - `id_token` is provided from client-side and generated by google sign-in script

- **Google Register**
  - URL:
    - **`POST`** *`<SERVER_URL>/oauth/google/register`*
  - Header(s):
    - `register_token`: `String`
  - Expected response (status: `200`):
    ```json
      {
        "message": "login success",
        "token": "<accessToken>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<errorMessage>"
      }
      ```
      Notes:
      - ERROR `400` is caused by *invalid register_token* or *no token assigned*
  - Notes:
    - `register_token` is genereted after google login server is done

### PRODUCTS

- **GET LIST OF PRODUCTS**
  - URL:
    - **`GET`** *`<SERVER_URL>/products`*
  - URL (filtered):
    - **`GET`** *`<SERVER_URL>/products?search=<KEYWORD>`*
  - Expected response (status: `200`):
    ```json
      {
        "message": "data found",
        "products": [
          {
            "_id": "<id>",
            "name": "<name>",
            "description": "<description>",
            "price": "<price>",
            "stock": "<stock>",
            "imageURL": "<imageURL>",
            "created": "<createdAt>",
            "updated": "<updatedAt>"
          }, 
          {
            "..."
          }, 
          "..."
        ]
      }
    ```
  - Error responses:
    - status: `404`:
      ```json
        {
          "message": "data empty"
        }
      ```

- **CREATE NEW PRODUCT**
  - Notes:
    - Authorization: only admin can access
  - URL:
    - **`POST`** *`<SERVER_URL>/products`*
  - Header(s):
    - `token`: `String`
  - Body:
    - `name`: `String`, required
    - `description`: `String`
    - `price`: `Number`, required, minimum 0
    - `stock`: `String`, required, minimum 0
    - `image`: `File`
  - Expected response (status: `201`):
    ```json
      {
        "message": "data created",
        "newProduct":
        {
          "_id": "<id>",
          "name": "<name>",
          "description": "<description>",
          "price": "<price>",
          "stock": "<stock>",
          "imageURL": "<imageURL>",
          "created": "<createdAt>",
          "updated": "<updatedAt>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
      - ERROR `400` is also Validation Error caused by entering *empty name* or *empty price* or *empty stock* or *negative value price* or or *negative value stock*
    - status: `401`:
      ```json
      {
        "message": "unauthorized to access"
      }
      ```
    
- **GET PRODUCT BY ID**
  - URL:
    - **`GET`** *`<SERVER_URL>/products/:id`*
  - Expected response (status: `200`):
    ```json
      {
        "message": "data found",
        "product": 
        {
          "_id": "<id>",
          "name": "<name>",
          "description": "<description>",
          "price": "<price>",
          "stock": "<stock>",
          "imageURL": "<imageURL>",
          "created": "<createdAt>",
          "updated": "<updatedAt>"
        }
      }
    ```
  - Error responses:
    - status: `404`:
      ```json
        {
          "message": "data not found"
        }
      ```

- **UPDATE PRODUCT BY ID**
  - Notes:
    - Authorization: only admin can access
  - URL(s):
    - **`PUT`** *`<SERVER_URL>/products/:id`*
    - **`PATCH`** *`<SERVER_URL>/products/:id`*
    <br>Notes:
        - `PUT` method is used for updating all details of data
        - `PATCH` method is used for updating some details of data
  - Header(s):
    - `token`: `String`
  - Body:
    - `name`: `String`, required
    - `description`: `String`
    - `price`: `Number`, required, minimum 0
    - `stock`: `String`, required, minimum 0
    - `image`: `File`
  - Expected response (status: `201`):
    ```json
      {
        "message": "data updated",
        "updatedProduct":
        {
          "_id": "<id>",
          "name": "<name>",
          "description": "<description>",
          "price": "<price>",
          "stock": "<stock>",
          "imageURL": "<imageURL>",
          "created": "<createdAt>",
          "updated": "<updatedAt>"
        },
        "info": "<info-optional>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<authemtication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
      - ERROR `400` is also Validation Error caused by entering *empty name* or *empty price* or *empty stock* or *negative value price* or or *negative value stock*
    - status: `401`:
      ```json
      {
        "message": "unauthorized to access"
      }
      ```
    - status: `404`:
      ```json
        {
          "message": "data not found"
        }
      ```

- **DELETE PRODUCT BY ID**
  - Notes:
    - Authorization: only admin can access
  - URL(s):
    - **`DELETE`** *`<SERVER_URL>/products/:id`*
  - Header(s):
    - `token`: `String`
  - Expected response (status: `200`):
    ```json
      {
        "message": "data deleted",
        "deletedProduct":
        {
          "_id": "<id>",
          "name": "<name>",
          "description": "<description>",
          "price": "<price>",
          "stock": "<stock>",
          "imageURL": "<imageURL>",
          "created": "<createdAt>",
          "updated": "<updatedAt>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
    - status: `401`:
      ```json
      {
        "message": "unauthorized to access"
      }
      ```
    - status: `404`:
      ```json
        {
          "message": "data not found"
        }
      ```