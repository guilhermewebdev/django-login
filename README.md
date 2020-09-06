# Django Login
This project objective is to show a login example using Django and React.

## How to setup in development mode:
Requirements:  
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

After install the requirements, you need clone this repository. You Can download the code using clicking [here](https://github.com/guilhermewebdev/django-login/archive/master.zip), or installing git following [this](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) instructions and running this command:   

```
    git clone https://github.com/guilhermewebdev/django-login.git
```

Whit the project in your machine, you need create a .env file whit database credentials, this file need be created into directory \<Project Path\>/server/api/, it's have the sensitive infos about project, how database credentials and secret key in this format:

/\<Project Path\>/server/api/.env
```
    DB=<Database name>
    DB_USER=<Database username>
    DB_PASS=<Database password>
    DB_HOST=<Database host>
    SECRET_KEY=<Django secret key>
```

Read more about Django Secret Key [here](https://docs.djangoproject.com/en/2.2/ref/settings/#std:setting-SECRET_KEY). The database credentials is configured into docker-compose.yml file, the default is:

```
    DB=database
    DB_USER=user
    DB_PASS=password
    DB_HOST=172.25.20.15
```
Now, whit the project configured, you can build the containers, run the following command into project directory to do it:

```
    docker-compose build
```

After build successful migrate the database running this command:

```
    docker-compose exec backend pypy3 manage.py migrate
```
Now, the project ir already to run, you can make it running:

```
    docker-compose up
```
If the database connection failed, try stop pressing CTRL + C and run again. Or if running successful open http://localhost/ in your browser and see the project running.