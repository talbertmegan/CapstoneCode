import pandas as pd
import sqlalchemy
import numpy as np
import os
import glob
"""
DB_URL="postgresql://localhost/postgres" DB_NAME="thisdb" RAW_DATA_PATH="../testdata" python data_loader.py
**ADD IN URL user and password
"""

db_url = os.environ['DB_URL']
db_name = os.environ['DB_NAME']
data_path = os.environ['RAW_DATA_PATH']

#testdata = pd.read_json(f'{data_path}/test.json').T.append(pd.read_json(f'{data_path}/test2.json').T)


testdata = pd.DataFrame()
for file in glob.glob(f'{data_path}/*.json'):
    file_data = pd.read_json(file).T
    file_data = file_data.reset_index(drop=True)
    file_data['Standing'] = [True if np.random.random() <0.3 else False for i in range(len(file_data))]
    file_data['userid'] = os.path.basename(os.path.splitext(file)[0])
    testdata = testdata.append(file_data)
print(testdata)
testdata.to_csv('./temp.csv')


engine = sqlalchemy.create_engine(db_url, echo=False)
testdata.to_sql(name='measurements', if_exists='append', con=engine, index=False)