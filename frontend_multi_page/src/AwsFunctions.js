import * as AWS from 'aws-sdk'
import aws_config from './aws_config.json';

//Following: https://betterprogramming.pub/how-to-use-aws-dynamodb-in-react-70b55ffff93e

var config = new AWS.Config(aws_config)

AWS.config.update(config)
const docClient = new AWS.DynamoDB.DocumentClient()

// export const fetchData = async (tableName) => {
//     var params = {
//         TableName: tableName
//     }

//     try {
//         const results = await docClient.scan(params, function (err, data) {
//             if (!err) {
//                 console.log(data)
//                 return data
//             }
//         })
//         console.log(results.TableNames.join('\n'));
//     } catch (err) {
//         console.error(err)
//     }
// }

export async function fetchDataByDeviceID(deviceID){
    try {
        var params = {
            KeyConditionExpression: 'deviceID = :deviceID',
            ExpressionAttributeValues: {
                ':deviceID': deviceID
            },
            TableName: 'Cup_Table'
        };
        var result = await docClient.query(params).promise()
        console.log(JSON.stringify(result.Items))
        return result.Items
    } catch (error) {
        console.error(error);
    }
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