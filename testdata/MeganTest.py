import numpy as np
import json
import ast
#from sklearn.linear_model import LinearRegression
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
        print(description) 
          
        # for automatic creation of id for each data point
        sno ='time'+str(l)
      
        # loop variable
        i = 0
        # intermediate dictionary
        dict2 = {}
        while i<len(fields):
              
                # creating dictionary for each employee
                dict2[fields[i]]= description[i]
                i = i + 1
                  
        # appending the record of each employee to
        # the main dictionary
        dict1[sno]= dict2
        l = l + 1

# creating json file        
out_file = open("test.json", "w")
json.dump(dict1, out_file, indent = 4)
out_file.close()

##creates test data with noise
#time = np.arange(0, 1000, .5)

#epsilon = np.random.uniform(-10,10, size=(int(1000/.5),))

#weight = 4 * time + 100 + epsilon

#time_weight_array = np.array([time, weight])

#time_weight_list = time_weight_array.tolist()
#json_time_weight = json.dumps(time_weight_list)

##converts json to np array and does analysis on it
f = open('test.json')
# returns JSON object as
# a dictionary
json_time_weight = json.load(f)
f.close()
#print(json_time_weight)
time_weight_data = ast.literal_eval(json_time_weight)
time_weight_data = np.array(time_weight_data)
time_data = time_weight_data[0]
weight_data = time_weight_data[1]
time_data = np.reshape(time_data, (-1, 1))
weight_data = np.reshape(weight_data, (-1, 1))

#model = LinearRegression(fit_intercept = True)

#model.fit(time_data, weight_data)
#print(model.coef_)
