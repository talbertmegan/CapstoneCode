import numpy as np
import json
import ast
import sklearn 
#create test data, --- in real code this will instead be importing test data
time = np.arange(0,1000,0.5)

epsilon = np.random.uniform(-10,10, size=int(1000/0.5),)

weight = 4*time + 2*epsilon
#converts array to json object to simulate what will come out of database
time_weight_array = np.array([time, weight])
time_weight_list = time_weight_array.tolist()
json_time_weight = json.dumps(time_weight_list)

#print(json_time_weight)

##now convert from json back to numpy 
time_weight_data = ast.literal_eval(json_time_weight)
time_weight_data = np.array(time_weight_data)
time_data = time_weight_data[0]
weight_data = time_weight_data[1]
##then, create magic line
model =

##then, predict future with magic line