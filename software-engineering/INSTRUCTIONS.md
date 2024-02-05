<!-- TOC -->

* [Install the pre-commit hooks](#install-the-pre-commit-hooks)
* [Pre-requisites](#pre-requisites)
    * [Backend](#backend)
    * [Frontend](#frontend)
* [Development](#development)
    * [Stack](#stack)
    * [Install](#install)
        * [Backend](#backend-1)
        * [Frontend](#frontend-1)
    * [Run](#run)
        * [Backend](#backend-2)
        * [Frontend](#frontend-2)
        * [Endpoints](#endpoints)
    * [Generating the frontend client](#generating-the-frontend-client)

<!-- TOC -->

## Install the pre-commit hooks

Before starting to work on the repo please install [pre-commit](https://pre-commit.com/):

```bash
python3.10 -m pip install pre-commit
```

And install the hooks:

```bash
pre-commit install
```

## Pre-requisites

### Backend

* Python ^3.10
* [Poetry](https://python-poetry.org/) ^1.4.0
* [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/) (for running
  the backend dependencies in development mode)

### Frontend

* Node v18.16.1 (install [nvm](https://github.com/nvm-sh/nvm) then `nvm install v18.16.1`)
* [Yarn](https://classic.yarnpkg.com/lang/en/docs/install)
* [openapi-generator-cli](https://openapi-generator.tech/docs/installation/) (for generating the frontend client from the
  OpenAPI schema)

## Development

### Stack

The application is a web application with a React frontend and a Django backend. The frontend and the backend are
completely decoupled and communicate through a REST API but the application is served as a monolithic application:
the frontend assets are served by the backend webserver.

The backend uses a Postgres database (for relational data) and Azure Blob Storage (for image file storage).

The backend is a [Django](https://www.djangoproject.com/) application with the following main components:

* [Django Rest Framework](https://www.django-rest-framework.org/) - A django app for building REST APIs
* [django-storages[azure]](https://django-storages.readthedocs.io/en/latest/backends/azure.html) - A custom storage
  backend for Azure Blob Storage. This allows to
  store [`django.db.models.ImageField`](https://docs.djangoproject.com/en/5.0/ref/models/fields/#django.db.models.ImageField)
  files in Azure Blob Storage instead of the local filesystem.
* [drf-spectacular](https://drf-spectacular.readthedocs.io/en/latest/) - A Django Rest Framework extension to
  automatically
  generate OpenAPI schema from the Django models. This openapi schema is used to generate the client code for the
  frontend.

The frontend is a [React](https://reactjs.org/) application with the following main components:

* [Elastic UI](https://elastic.github.io/eui/#/) - The UI library used for the frontend
* [Axios](https://axios-http.com/docs/intro) - A promise based HTTP client. The client is automatically generated from
  the
  OpenAPI schema using [openapi-generator](https://openapi-generator.tech/docs/installation/)

When running in development mode, the backend webserver will serve the frontend assets and proxy the API requests to the
frontend webserver. This allows for hot code reloading in both the frontend and the backend.

### Install

#### Backend

```bash
poetry --directory backend install
```

#### Frontend

```bash
yarn --cwd frontend install
yarn --cwd frontend generate-client
yarn --cwd frontend build
```

### Run

#### Backend

1. Start the dockerized dependencies (postgres, azure blob storage emulation "azurite"):

    ```bash
    docker compose -f docker/docker-compose.yml up postgres blob-storage
    ```

   The blob storage api will be available at http://localhost:10000/devstoreaccount1.
   The account name is `devstoreaccount1`. The account key
   is `Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==`
   See [Microsoft's documentation](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio#well-known-storage-account-and-key)
   for more information.

   The postgres database will be available at `localhost:5432` with username `inspektor` and password `inspektor`.

   All data persisted through the application will be stored in docker volumes called `postgres-data`
   and `blob-storage-data` (`docker volumes ls`).
   You can restart from scratch at anytime by deleting those volumes (you will have to follow the steps below again to
   recreate the database schema and the superuser).

2. Create the db migrations and apply them (you will need to run these steps again if you change the models):

    ```bash
    poetry --directory backend run backend/inspektor/manage.py makemigrations
    poetry --directory backend run backend/inspektor/manage.py migrate
    ```

3. Create a test superuser (for the django admin interface, only need to run this once):

    ```bash
    poetry --directory backend run backend/inspektor/manage.py createsuperuser
    ```

   This will prompt you for a username, email and password. As we are running in local mode, you can use any
   username and password you like. The email is not used for anything, so you can leave it blank.

4. Start the development backend webserver on port 8000 (django) with hot code reloading:

    ```bash
    poetry --directory backend run backend/inspektor/manage.py collectstatic --noinput
    poetry --directory backend run backend/inspektor/manage.py runserver
    ```

The backend server will be automatically reloaded when you save changes to the backend source files.

#### Frontend

Start the development frontend webserver on port 3000 (node) with hot code reloading

```bash
yarn --cwd frontend start
```

The node webserver serving the frontend with hot code reloading will be automatically proxied from http://localhost:3000
to
http://localhost:8000/ by the backend webserver. Any changes to the frontend source files will be immediately visible at
in
your browser at http://localhost:8000/.

#### Endpoints

The following routes will be exposed:

| Name                 | URL                                       | Comment                                                |
|----------------------|-------------------------------------------|--------------------------------------------------------|
| Admin                | http://localhost:8000/admin/              | Django admin UI (login with the superuser credentials) |
| API                  | http://localhost:8000/api/                | API root                                               |
| API - OpenAPI schema | http://localhost:8000/api/schema/         | OpenAPI schema file (yaml)                             |
| API - Swagger UI     | http://localhost:8000/api/schema/swagger/ | Swagger UI                                             |
| Inspektor UI         | http://localhost:8000/                    | React UI of the application                            |

### Generating the frontend client

OpenAPI is used to standardize the specification of the
API. [drf-spectacular](https://drf-spectacular.readthedocs.io/en/latest/)
is used to automatically generate the OpenAPI schema specification from the django models:

```bash
poetry --directory backend run backend/inspektor/manage.py spectacular --color --file schema.yml
```

This will create a file called `schema.yml` containing the entire OpenAPI specification.
Using this file and the [openapi-generator](https://github.com/OpenAPITools/openapi-generator), clients for the API
can be automatically generate in a number of languages (see below).

Provided you have generated the OpenAPI `schema.yml` file as described above (and openapi-generator-cli is available on
your system),
you can automatically generate a typescript [Axios](https://github.com/axios/axios) http client for use in the frontend
code with the following command:

```bash
openapi-generator-cli version-manager set 6.6.0
openapi-generator-cli generate -i schema.yml -g typescript-axios -o ./frontend/src/api/generated --additional-properties=withInterfaces=true
```

The generated sources will be in `frontend/src/api/generated`. By default, they will be ignored by git.
Please do not push the auto-generated client code to the repository. Instead, use the command above to generate the
latest version of the client.

You can then import the client in the React code the following way:

```typescript
import {CaseApi} from "./api/client/generated";


const caseClient = new CaseApi();
caseClient.caseRetrieve(1234).then(function (response) {
    console.log(response);
})
    .catch(function (error) {
        console.log(error);
    })
```

This step is done automatically for you when you run `yarn --cwd frontend generate-client` as described in the
"Install" section above (see the `frontend/package.json` file).
