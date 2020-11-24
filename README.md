# Restful services for the AI Project
https://ai-store-api.herokuapp.com/

## Installation

### Clone the repo

```bash
git clone REPO_URL
```

### cd to it in console

```bash
cd ai-store-api
```

### Install the dependencies of the api

```bash
cd api
npm install
```

### Run the API service in dev mode

```bash
npm run dev
```

## Usage

Consume the API using Postman or Arc

### Auth routes
<pre>
/auth/?pin=""               [GET]                       Gets the info of a store  
</pre>

<pre>
/auth/signup                [POST]                      Creates a new store in db. 
</pre>
```json
{
    "storeName": "Alsuper Robinson",
    "pin": "5431",
    "storeCapacity": 50,
    "peopleInside": 10,
    "hash": "06d80eb0c50b49a509b49f2424e8c805"
}
```
<pre>
/auth/signin                [POST]                      Returns a JWT if valid pin is sent 
</pre>
```json
{
    "pin": "5431"
}
```

<pre>
/auth/new-pin               [POST]                      Changes the pin of a store. It needs the x-access-token header. 
</pre>
```json
{
    "pin": "5431",
    "newPin": "5556"
}
```

<pre>
/auth/logout                [POST]                      Logs us off 
</pre>

### Info routes

<pre>
/info/                      [POST]                      Creates a new info log in the server. It needs the x-access-token header.
</pre>
```json
{
    "peopleEntering": 1,
    "storePin": "5431"
}
```

<pre>
/info/?pin=""               [GET]                       Returns all the logs of a store 
</pre>

<pre>
/info/7days-logs/?pin=""    [GET]                       Returns all the logs of a store in a week
</pre>

<pre>
/info/7days-maxes/?pin=""   [GET]                       Returns all the maxes of a store in a week
</pre>
## Contributing
Just ask for permission.
