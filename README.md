source env/bin/activate

pip install -r requirements.txt

docker-compose up --build

docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser

# front/react-upload-form/ 
npm run dev