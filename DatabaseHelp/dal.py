import pandas as pd
import sqlalchemy
import numpy as np
import os
import glob
import datetime

#DB_URL="postgresql://localhost" DB_NAME="thisdb" RAW_DATA_PATH="../testdata" python data_loader.py
#**ADD IN URL user and password
thisuser = 'test2'
desired_time_start = datetime.datetime(year=1970, month=1, day=1, tzinfo=datetime.timezone.utc).timestamp()
desired_time_end = datetime.datetime(year=1970, month=1, day=1, second=4, tzinfo=datetime.timezone.utc).timestamp()


db_url = os.environ['DB_URL']
db_name = os.environ['DB_NAME']
data_path = os.environ['RAW_DATA_PATH']

engine = sqlalchemy.create_engine(f'{db_url}/{db_name}', echo=False)
query = f'''
SELECT * FROM measurements WHERE userid='{thisuser}' AND time BETWEEN {desired_time_start} AND {desired_time_end} ORDER BY time DESC


'''
results = pd.read_sql(sql=query, con=engine)
print(results)