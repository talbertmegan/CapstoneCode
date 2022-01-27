import numpy as np
import json
import ast
import os.path
import os
from sklearn.linear_model import LinearRegression
from matplotlib import pyplot as plt
# use relative pathing
 #os.path.join(os.getcwd(), 'testdata0.txt')
filename = 'testdata0.txt'
dict1 = {}
# fields in the file
fields =['time', 'reading']
with open(filename) as fh:
    # count variable for time reading
    l = 1
    userid = fh.readline()
    print(userid)
    for line in fh:
        # reading line by line from the text file
        description = list( line.strip().split(None, 2))
        # for output see below
        # print(description)
        # for automatic creation of id for each data point
        sno ='time'+str(l)
        # loop variable
        i = 0
        # intermediate dictionary
        dict2 = {}
        while i<len(fields):
                # creating dictionary for each time
                dict2[fields[i]]= description[i]
                i = i + 1
        # appending the record of each time reading to
        # the main dictionary
        dict1[sno]= dict2
        l = l + 1
# creating json file
with open("test.json", "w") as out_file:
        json.dump(dict1, out_file, indent = 4)
##creates test data with noise, not being used now that I have real test data
#time = np.arange(0, 1000, .5)
#epsilon = np.random.uniform(-10,10, size=(int(1000/.5),))
#weight = 4 * time + 100 + epsilon
#time_weight_array = np.array([time, weight])
#time_weight_list = time_weight_array.tolist()
#json_time_weight = json.dumps(time_weight_list)
##converts json to np array and does analysis on it
with open('test.json', 'r') as f:
# returns JSON object as
# a dictionary
        json_time_weight = json.load(f)
#json_time_weight = output
#print(json_time_weight)
time_data = [np.float64(sample['time']) for sample in json_time_weight.values()]
weight_data = [np.float64(sample['reading']) for sample in json_time_weight.values()]
time_data = np.reshape(time_data, (-1, 1))
weight_data = np.reshape(weight_data, (-1, 1))
#print(time_data)
#print(weight_data)
maxTime = np.amax(time_data)
print(maxTime)
time = np.arange(0,maxTime,0.5)
model = LinearRegression(fit_intercept = True)
model.fit(time_data, weight_data)
print(model.coef_)
slope = model.coef_[0]
intercept = model.intercept_
print("Slope = ", slope)
print("Intercept = ", intercept)
plt.figure()
plt.scatter(time_data,weight_data, color='dodgerblue')
plt.plot(time, slope*time+intercept, color="red") ##substitute time_data for time here
plt.xlabel("Time")
plt.ylabel("Weight")
plt.title("Cup Weight Over Time")
plt.show(block=True)
# COMMENTS FROM IAN
# DIFFERENT WAYS TO FORMAT/READ YOUR DATA
# USING COMPREHENSIONS
# replacing for loop with dict comprehension
# makes edits easier
#     outpu = [
#             {
#                 'time': list( line.strip().split(None, 2))[0],
#                 'reading': list( line.strip().split(None, 2))[1],
#                 'userID': userid,
#             }
#             for line in fh
#     ]
# changing to more pandas-like format
#     {
#         'time': [times],
#         'reading': [readings],
#         'userID': [userIDs]
#     }
#      all_lines = fh.readlines()
#      outpu = {
#              'time': [list( line.strip().split(None, 2))[0] for line in all_lines],
#              'reading': [list( line.strip().split(None, 2))[1] for line in all_lines],
#              'userID': userID
#      }
"""
ISOLATING TIME/WEIGHT
Just time elements
[sample['time'] for sample in json_reading]
just readings
[sample['reading'] for sample in json_reading]
SQL CODE:
import sqlalchemy
import pandas as pd
import numpy as np
user = file_load(config)
password = input("Password: ")
engine = sqlalchemy.create_engine(f'postgresql://{user}:{password}@localhost/postgres', echo=False)
# create tables
try:
with open('./schema.sql', 'r') as schema_file:
        schema = '\n'.join(schema_file.readlines())
command = sqlalchemy.text(schema)
with engine.connect() as con:
        con.execute(command)
except Exception:
print("Tables already created")

"""