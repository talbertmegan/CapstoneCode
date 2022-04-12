import * as AWS from 'aws-sdk'
import aws_config from './aws_config.json';

//Following: https://betterprogramming.pub/how-to-use-aws-dynamodb-in-react-70b55ffff93e

var config = new AWS.Config(aws_config)

AWS.config.update(config)
const docClient = new AWS.DynamoDB.DocumentClient()

export const fetchData = (tableName) => {
    var params = {
        TableName: tableName
    }

    docClient.scan(params, function (err, data) {
        if (!err) {
            console.log(data)
        }
    })
}

export const putData = (tableName , data) => {
  var params = {
      TableName: tableName,
      Item: data
  }
  
  docClient.put(params, function (err, data) {
      if (err) {
          console.log('Error', err)
      } else {
          console.log('Success', data)
      }
  })
}