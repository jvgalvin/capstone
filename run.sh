docker build -t capstone .
docker run -it -p 8888:8888 -v $(pwd):/capstone/project capstone