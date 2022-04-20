# API endpoints

The api endpoitns for the restify project. 

## GET
###### Accounts
`🔐` [/accounts/profile/](/accounts/profile/)

###### Restaurants
`🔐` [/restaurants/all/](/restaurants/all/)
`🔐` [/restaurants/search?](/restaurants/search?query=&type=)
`🔐` [/restaurants/<int:id>/](/restaurants/<int:id>/)
`🔐` [/restaurants/<int:id>/blogs/](/restaurants/<int:id>/blogs/)


###### Notifications
`🔐` [/notifications/owner/](/notifications/owner/)
`🔐` [/notifications/user/](/notifications/user/)

## POST
###### Accounts
`🔓` [/accounts/signup/](/accounts/signup/) 
`🔓` [/accounts/signin/](/accounts/signin/)

###### Restaurants
`🔐` [/restaurants/create/](/restaurants/create/)
`🔐` [/restaurants/<int:id>/add-img/](/restaurants/<int:id>/add-img/)
`🔐` [/restaurants/<int:id>/comment/](/restaurants/<int:id>/comment/)
`🔐` [/restaurants/<int:id>/blog/](/restaurants/<int:id>/blog/)
`🔐` [/restaurants/<int:id>/menu/add/](/restaurants/<int:id>/menu/add/)

## PUT
###### Accounts
`🔐` [/accounts/update/](/accounts/update/)


###### Restaurants
`🔐` [/restaurants/<int:id>/update/](/restaurants/update/)
`🔐` [/restaurants/<int:id>/like/](/restaurants/<int:id>/like/)
`🔐` [/restaurants/<int:id>/follow/](/restaurants/<int:id>/follow/)
`🔐` [/restaurants/<int:id>/comment/<int:commentid>/like/](/restaurants/<int:id>/comment/<int:commentid>/like/)
`🔐` [/restaurants/<int:id>/blog/<int:blogid>/like/](/restaurants/<int:id>/blog/<int:blogid>/like/)

## DELETE
###### Accounts
`🔐` [/accounts/delete/](/accounts/delete/)

###### Restaurants
`🔐` [/restaurants/<int:id>/delete/](/restaurants/<int:id>/delete/)
`🔐` [/restaurants/comment/<int:commentid>/delete/](/restaurants/comment/<int:commentid>/delete/)
`🔐` [/restaurants/<int:id>/blog/<int:blogid>/delete/](/restaurants/<int:id>/blog/<int:blogid>/delete/)
`🔐` [/restaurants/<int:id>/menu/<int:itemid>/delete/](/restaurants/<int:id>/menu/<int:itemid>/delete/)
___

### GET `🔐` localhost:8000/accounts/profile/
Get the user profile information

**Parameters** N/A

**Response**

```
// 200
{
    "user": {
        "username": "string",
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "avatar": "string",
        "restaurants_owned": [],
        "restaurants_followed": [],
        "comments": []
    }
}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
___
### GET `🔐` localhost:8000/restaurants/all/
Get the restaurants

**Parameters** N/A

**Response**

```
// 200
{
    "count": "integer"",
    "next": "string",
    "previous": "string",
    "results": [
        {
            "id": integer,
            "name": "string",
            "location": "string",
            "general_info": "string",
            "type": "string",
            "followers": integer,
            "phone": "string",
            "postal_code": "string",
            "icon": "string",
            "timestamp": date,
            "updated": date,
            "owner": {
                "id": integer,
                "username": "string",
                "email": "string"
            },
            "menu": {
                "id": integer,
                "name": "string",
                "items": []
            },
            "fans": [],
            "likes": [],
            "gallery": [],
            "comments": [],
            "blogs": []
        }
    ]
}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
___
### GET `🔐` localhost:8000/restaurants/search?query=&type=
Get the restaurants

**Query Parameters**
| Name | Required | Type | Description |
| ------:|:-----:|:-------:| --------- |
| `query` | optional | string  | The query string the user is trying to search |
| `type` | optional | string  | The search method the user wants to search with |

**Response**

```
// 200
{
    "count": "integer"",
    "next": "string",
    "previous": "string",
    "results": [
        int
    ]
}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
___
### GET `🔐` localhost:8000/restaurants/<int:id>/
Get a restaurant given id

**Parameters** N/A

**Response**

```
// 200
{
    "id": integer,
    "name": "string",
    "location": "string",
    "general_info": "string",
    "type": "string",
    "followers": integer,
    "phone": "string",
    "postal_code": "string",
    "icon": "string",
    "timestamp": date,
    "updated": date,
    "owner": {
        "id": integer,
        "username": "string",
        "email": "string"
    },
    "menu": {
        "id": integer,
        "name": "string",
        "items": []
    },
    "fans": [],
    "likes": [],
    "gallery": [],
    "comments": [],
    "blogs": []
}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
___
### GET `🔐` localhost:8000/restaurants/feed/
Get the blogs that the logged in user follows

**Parameters** N/A

**Response**

```
// 200
{
    "count": integer,
    "next": "string",
    "previous": "string",
    "results": [
        {
            "id": "string",
            "title": "string",
            "description": "string",
            "image": "string",
            "created_at": date,
            "likes": integer,
        }
    ],
    "length": integer
}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
___
### GET `🔐` localhost:8000/restaurants/<int:id>/blogs/
Get the blogs that belong to a specified restaurant

**Parameters** N/A

**Response**

```
// 200
{
    "count": integer,
    "next": "string",
    "previous": "string",
    "results": [
        {
            "id": integer,
            "title": "string",
            "description": "string",
            "image": "string"
        }
    ]
}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
___
### GET `🔐` localhost:8000/notifications/owner/
Get the notifications for the owner 

**Parameters** N/A

**Response**

```
// 200
{

}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
___
### GET `🔐` localhost:8000/notifications/user/
Get the notifications for the user 

**Parameters** N/A

**Response**

```
// 200
{

}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
---
---
### POST 🔓 localhost:8000/accounts/signup/
Create a user account for Restify

**Parameters**
| Name | Required | Type | Description |
| ------:|:-----:|:-------:| --------- |
| `username` | **required** | string  | The username of the user trying to sign up|
| `password` | **required** | string  | The password of the user trying to sign up|
| `password2` | **required** | string | A repeat of the password for security purposes |
| `first_name` | optional | string  | The first name of the user trying to sign up |
| `last_name` | optional | string  | The last name of the user trying to sign up |
| `email` | optional | string  | The email of the user trying to sign up  |
| `avatar` | optional | file  | An avatar for the user trying to sign up  |

**Response**

```
// 200
{
    "id": integer,
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "avatar": "string",
    "email": "string"
}

// 400
{
    "username": [
        "A user with that username already exists."
    ]
}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
___

### POST 🔓 localhost:8000/accounts/signin/
Log a user into their account for Restify

**Parameters**
| Name | Required | Type | Description |
| ------:|:-----:|:-------:| --------- |
| `username` | **required** | string  | The username of the user trying to sign in |
| `password` | **required** | string  | The password of the user trying to sign in |

**Response**

```
// 200
{
    "refresh": "string",
    "access": "string"
}

// 401
{
    "detail": "No active account found with the given credentials"
}
```
___

### POST `🔐` localhost:8000/restaurants/create/
Creates a restaurant 

**Parameters**
| Name | Required | Type | Description |
| ------:|:-----:|:-------:| --------- |
| `name` | **required** | string  | The name of the restaurant a user is trying to register |
| `general_info` | **required** | string  | The description of the restaurant a user is trying to register |
| `location` | **required** | string  | The location of the restaurant a user is trying to register |
| `type` | **required** | string  | The type of the restaurant a user is trying to register |
| `postal_code` | optional | string  | The description of the restaurant a user is trying to register |
| `phone` | optional | string  | The name of the restaurant a user is trying to register |
| `icon` | optional | file  | The description of the restaurant a user is trying to register |

**Response**

```
// 200
{
    "id": integer,
    "name": "string",
    "location": "string",
    "general_info": "string",
    "type": "string",
    "followers": integer,
    "phone": "string",
    "postal_code": "string",
    "icon": "string",
    "timestamp": date,
    "updated": date,
    "owner": {
        "id": integer,
        "username": "string",
        "email": "string"
    },
    "menu": {
        "id": integer,
        "name": "string",
        "items": [
            {
                "id": integer,
                "name": "string",
                "price": "string",
                "description": "string",
                "item_image": "string"
            }
        ]
    },
    "fans": [],
    "likes": [],
    "gallery": [
        {
            "id": integer,
            "name": "string",
            "image": "string"
        }
    ],
    "comments": [
        {
            "id": integer,
            "text": "string",
            "created_at": date,
            "author": {
                "id": integer,
                "username": "string",
                "email": "string"
            },
            "likes": []
        }
    ],
    "blogs": [
        {
            "id": integer,
            "title": "string",
            "description": "string",
            "image": "string",
            "created_at": date,
            "likes": []
        }
    ]
}

// 409
{
    "detail": "User already owns a restaurant"
}
// 401
{
    "detail": "No active account found with the given credentials"
}
```
___
### POST 🔐 localhost:8000/restaurants/<int:id>/add-img/
Add an image for a specified restaurant

**Parameters**
| Name | Required | Type | Description |
| ------:|:-----:|:-------:| --------- |
| `name` | **required** | string  | A name for the image the user is trying to upload |
| `image` | **required** | file  | The image the user is trying to upload |

**Response**

```
// 200
{
    "id": integer,
    "name": "string",
    "image": "string"
}

// 401
{
    "detail": "No active account found with the given credentials"
}
```
___
### POST 🔐 localhost:8000/restaurants/<int:id>/comment/
Add a comment for a specified restaurant

**Parameters**
| Name | Required | Type | Description |
| ------:|:-----:|:-------:| --------- |
| `text` | **required** | string  | A body of text the user is trying to comment |

**Response**

```
// 200
{
    "id": integer,
    "text": "string"
}

// 401
{
    "detail": "No active account found with the given credentials"
}
```
___
### POST 🔐 localhost:8000/restaurants/<int:id>/blog/
Add a blog for a specified restaurant

**Parameters**
| Name | Required | Type | Description |
| ------:|:-----:|:-------:| --------- |
| `title` | **required** | string  | A title for the blog of text the user is trying to post |
| `description` | **required** | string  | A body of text for the blog the user is trying to post |
| `image` | optional | file  | An image for the blog the user is trying to post |

**Response**

```
// 200
{
    "id": integer,
    "title": "string",
    "description": "string",
    "image": "string"
}

// 401
{
    "detail": "No active account found with the given credentials"
}
```
___
### POST 🔐 localhost:8000/restaurants/<int:id>/menu/add/
Add a menu item for the specified restaurant

**Parameters**
| Name | Required | Type | Description |
| ------:|:-----:|:-------:| --------- |
| `name` | **required** | string  | A name for the item to add to the menu of a specified restaurant |
| `price` | **required** | float  | A price for the item to add to the menu of a specified restaurant |
| `description` | **required** | string  | A description for the item to add to the menu of a specified restaurant |

**Response**

```
// 200
{
    "id": integer,
    "name": "string",
    "price": "string",
    "description": "string",
    "item_image": "string"
}

// 401
{
    "detail": "No active account found with the given credentials"
}
```
___
### PUT 🔐  localhost:8000/accounts/update/
Update a users account for Restify

**Parameters**
| Name | Required | Type | Description |
| ------:|:-----:|:-------:| --------- |
| `username` | **required** | string  | The username of the user trying to sign up|
| `password` | **required** | string  | The password of the user trying to sign up|
| `password2` | **required** | string | A repeat of the password for security purposes |
| `first_name` | optional | string  | The first name of the user trying to sign up |
| `last_name` | optional | string  | The last name of the user trying to sign up |
| `email` | optional | string  | The email of the user trying to sign up  |
| `avatar` | optional | file  | An avatar for the user trying to sign up  |

**Response**

```
// 200
{
    "id": integer,
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "avatar": "string",
    "email": "string"
}

// 400
{
    "username": [
        "A user with that username already exists."
    ]
}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
___
### PUT 🔐  localhost:8000/restaurants/<int:id>/update/
Update a specified restaurant for Restify

**Parameters**
| Name | Required | Type | Description |
| ------:|:-----:|:-------:| --------- |
| `name` | **required** | string  | The name of the restaurant a user is trying to register |
| `general_info` | **required** | string  | The description of the restaurant a user is trying to register |
| `location` | **required** | string  | The location of the restaurant a user is trying to register |
| `type` | **required** | string  | The type of the restaurant a user is trying to register |
| `postal_code` | optional | string  | The description of the restaurant a user is trying to register |
| `phone` | optional | string  | The name of the restaurant a user is trying to register |
| `icon` | optional | file  | The description of the restaurant a user is trying to register |

**Response**

```
// 200
{
    "id": integer,
    "name": "string",
    "location": "string",
    "general_info": "string",
    "type": "string",
    "followers": integer,
    "phone": "string",
    "postal_code": "string",
    "icon": "string",
    "timestamp": date,
    "updated": date,
    "owner": {
        "id": integer,
        "username": "string",
        "email": "string"
    },
    "menu": {
        "id": integer,
        "name": "string",
        "items": [
            {
                "id": integer,
                "name": "string",
                "price": "string",
                "description": "string",
                "item_image": "string"
            }
        ]
    },
    "fans": [],
    "likes": [],
    "gallery": [
        {
            "id": integer,
            "name": "string",
            "image": "string"
        }
    ],
    "comments": [
        {
            "id": integer,
            "text": "string",
            "created_at": date,
            "author": {
                "id": integer,
                "username": "string",
                "email": "string"
            },
            "likes": []
        }
    ],
    "blogs": [
        {
            "id": integer,
            "title": "string",
            "description": "string",
            "image": "string",
            "created_at": date,
            "likes": []
        }
    ]
}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
___
### PUT 🔐  localhost:8000/restaurants/<int:id>/like/
Like a specified restaurant

**Parameters** N/A

**Response**

```
// 200
{}

// 401
{
    "detail": "Authentication credentials were not provided."
},

// 404 
{
    "detail": "Not found."
}
```
___
### PUT 🔐  localhost:8000/restaurants/<int:id>/follow/
Follow a specified restaurant

**Parameters** N/A

**Response**

```
// 200
{}

// 401
{
    "detail": "Authentication credentials were not provided."
}
```
___
### PUT 🔐  localhost:8000/restaurants/<int:id>/comment/<int:commentid>/like/
Like a specified comment

**Parameters** N/A

**Response**

```
// 200
{}

// 401
{
    "detail": "Authentication credentials were not provided."
}

// 404
{
    "detail": "Not found."
}
```
___
### PUT 🔐  localhost:8000/restaurants/<int:id>/blog/<int:blogid>/like/
Like a specified blog

**Parameters** N/A

**Response**

```
// 200
{}

// 401
{
    "detail": "Authentication credentials were not provided."
}

// 404
{
    "detail": "Not found."
}
```
___
___
### DELETE 🔐 localhost:8000/accounts/delete/
Delete the account of a logged in user

**Parameters** N/A

**Response**

```
// 200
{}

// 401
{
    "detail": "No active account found with the given credentials"
}
```
___
### DELETE 🔐 localhost:8000/restaurants/comment/<int:commentid>/delete/
Delete a specified comment
**Parameters** N/A

**Response**

```
// 200
{}

// 404
{
    "detail": "Not found."
}
```
___
### DELETE 🔐 localhost:8000/restaurants/<int:id>/blog/<int:blogid>/delete/
Delete a specified blog

**Parameters** N/A

**Response**

```
// 200
{}

// 404
{
    "detail": "Not found."
}
```
___
### DELETE 🔐 localhost:8000/restaurants/<int:id>/menu/<int:itemid>/delete/
Delete a specified menu item

**Parameters** N/A

**Response**

```
// 200
{}

// 404
{
    "detail": "Not found."
}
```