SQLAlchemy supports many relational databases, including SQLite, MySQL, PostgreSQL, Oracle and Microsoft SQL Server.

It uses a concept called Dialect, which allows SQLAlchemy to communicate with different database engines using a largely consistent Python API.

SQLAlchemy 2.1 Documentation

+1

## 1. Databases supported by SQLAlchemy

### Officially included dialects

| Database | Supported | Python driver |
| --- | --- | --- |
| SQLite | Yes | Built-in `sqlite3` |
| PostgreSQL | Yes | `psycopg` |
| MySQL | Yes | `PyMySQL` |
| MariaDB | Yes | `mariadb` |
| Microsoft SQL Server | Yes | `pyodbc` |
| Oracle | Yes | `oracledb` |

### Other databases through external dialects

- Snowflake
- Google BigQuery
- Amazon Redshift
- CockroachDB
- ClickHouse
- IBM DB2
- SAP HANA
- TiDB
- YugabyteDB

These require separate dialect packages.

SQLAlchemy 2.1 Documentation

## 2. How to connect to different databases

The interesting thing is that your SQLAlchemy models and most CRUD operations remain the same.

Only the connection URL and sometimes the driver change.

| Database | Connection URL |
| --- | --- |
| SQLite | `sqlite:///./test.db` |
| PostgreSQL | `postgresql+psycopg://user:pass@localhost/db` |
| MySQL | `mysql+pymysql://user:pass@localhost/db` |
| MariaDB | `mariadb+mariadbconnector://user:pass@localhost/db` |
| SQL Server | `mssql+pyodbc://user:pass@server/db` |
| Oracle | `oracle+oracledb://user:pass@localhost/db` |

## 3. Example with FastAPI and SQLAlchemy

Install:

bash

```bash
pip install sqlalchemy
```

For PostgreSQL:

bash

```bash
pip install "psycopg[binary]"
```

Create your database connection:

python

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "postgresql+psycopg://postgres:password@localhost/mydb"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

Base = declarative_base()
```

Now suppose you have a User model:

python

```python
from sqlalchemy import Column, Integer, String

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    email = Column(String(100))
```

If tomorrow you want to switch from PostgreSQL to MySQL, you generally just change:

python

```python
DATABASE_URL = "mysql+pymysql://root:password@localhost/mydb"
```

Install the MySQL driver:

bash

```bash
pip install pymysql
```

Your model and most CRUD code can remain unchanged.

## 4. Which database should you learn with FastAPI?

My recommendation:

Postgresql Logo PNG Transparent With Clear Background ID 473068 | TOPpng

PostgreSQL

My recommendationGreat for production applications, complex queries, transactions and JSON support.

Kanbel Technologies

MySQL

Popular for web applications and widely used in production.

Logo SQLite – Logos PNG

SQLite

Excellent for learning and small applications. No separate database server required.

My suggestion: Learn SQLAlchemy with PostgreSQL. Once you understand SQLAlchemy ORM, switching between supported relational databases becomes much easier.

Official documentation: [SQLAlchemy – Supported Database Dialects](<https://docs.sqlalchemy.org/en/21/dialects/?utm_source=chatgpt.com>).