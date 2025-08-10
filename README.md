# Regret Vault Api

## Api for posting our biggest regrets

Api for users to post their biggest regrets. This has the following features:

* Authentication using jwt. Register new user and login existing user.

* Post new regret, need to be logged in.

* See all the public regrets.

* See all of your regrets.

* See a specific regret by id. No authentication required to see pubic regrets. But for private ones, you can only view your own, so you need to be logged in.

* Edit a regret by id, needs to be your own regret, login required.

* Delete a regret by id, needs to be your own regret, login required.

* Search public regrets by their title or message.

* Search your own regrets by their title or message. Login required.

## Docs

The proper docs for this api are available at 
https://regret-vault-api.onrender.com/docs/

## How to run locally

1. Clone the repository

    ```
    git clone https://github.com/Turbash/regre-vault-api.git
    cd regre-vault-api
    ```

2. Install the dependencies

    ```
    npm install
    ```

3. Set up the environment variables:

    * Create a .env file in the root folder 

        ```
        touch .env
        ```

    * Add these environment variables in .env

        ```
        MONGO_URI = your_mongodb_database_uri_string 
        JWT_SECRET = jwt_secret_string
        ```
4. Run the index.js file

    ```
    node index.js
    ```

## Requirements

* You need to just have a decent version of node and npm installed on your system. You can download from here https://nodejs.org/en/download

* Make sure to make a env in the root directory (same folder as index.js, README). And set up your environment variables to run locally.

## License

This project is licensed under the MIT License.
You are free to use, modify, and distribute this software for any purpose.