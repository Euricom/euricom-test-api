# euri-test-api

Fake Online REST API for Testing and Prototyping
Copyright (c) 2018 Euricom nv. Licensed under the [MIT license](https://opensource.org/licenses/MIT).

## System

```json
# reset all data
DELETE /api/system
```

<hr>

## Tasks

GET [/api/tasks](/api/tasks)
GET [/api/tasks/1](/api/tasks/1)

```
POST /api/tasks
{
  "desc": "By some beer"
}

PATCH /api/tasks
{
  "completed": true
}

DELETE /api/tasks/122
```

<hr>

## Users

GET [/api/users](/api/users)
GET [/api/users/12](/api/users/12)
GET [/api/users?page=0&pageSize=10](/api/users?page=0&pageSize=10)

```
POST /api/users
{
  "firstName": "peter",
  "lastName": "cosemans",
  "age": 52,
  "email": "peter.cosemans@gmail.com",
  "role": "admin"
}

PUT /api/users/12
{
  "firstName": "peter",
  "lastName": "cosemans",
  "age": 52,
  "email": "peter.cosemans@gmail.com",
  "role": "admin"
}

DELETE /api/users/12
```

<hr>

## Products

GET [/api/products](/api/products)
GET [/api/products/1](/api/products/1)
GET [/api/products?page=0&pageSize=10](/api/products?page=0&pageSize=10)
GET [/api/products?sort=price](/api/products?sort=price)
GET [/api/products?sort=-price](/api/products?sort=-price)

```
# create a new product
POST /api/products
{
  "title": "my new product",
  "price": 9.99,
  "stocked": true,
  "desc": "just some text",
  "image": "https://dummyimage.com/300x300.jpg"
}

# Update an existing product
PUT /api/products/12
{
  "title": "my new product",
  "price": 9.99,
  "stocked": true,
  "desc": "just some text",
  "image": "https://dummyimage.com/300x300.jpg"
}

# Remove the product
DELETE /api/products/12
```

## Basket

GET [/api/basket/xyz](/api/basket/xyz)

```
# Get the basket with key
GET /api/basket/{yourKey}
```

```
# Add product to basket
# If the product already exist in the basket the quantity is added
# Product not found: 404 error
# Product not in stock: 409 error

POST /api/basket/{yourKey}/product/1
{
  "quantity": 2
}

# Update quantity for product
# When quantity is '0' the product is removed
# When the product is not available in the basket the product is added
# Product not found: 404 error
# Product not in stock: 409 error

PATCH /api/basket/{yourKey}/product/1
{
  "quantity": 10
}

# Empty the basket
DELETE /api/basket/{yourKey}

# Remove the product from the basket
DELETE /api/basket/{yourKey}/product/46
```
