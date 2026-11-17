# Create and activate virtual environment
```
python3 -m venv .fastapienv
source .fastapienv/bin/activate 
```

# Install fastAPI
```
pip3 install "fastapi[all]"
```

# start server
```
uvicorn main:app --reload
```

# URL
```
http://localhost:8000/
http://localhost:8000/docs
http://localhost:8000/openapi.json
```