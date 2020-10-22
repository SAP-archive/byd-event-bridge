// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

exports.handler = async(event, context) => {
    // Set the region 
    //AWS.config.update({ region: 'us-east-1' });
    AWS.config.update({ region: '<PLEASE REPLACE WITH YOUR AWS REGION>' });

    // Test Code to figure out http request and context
    console.log("event:\n", JSON.stringify(event));
    console.log("context:\n", JSON.stringify(context));

    // Create an SQS service object
    var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

    var params = {
        // Remove DelaySeconds parameter and value for FIFO queues
        DelaySeconds: 10,
        MessageAttributes: {
            "Title": {
                DataType: "String",
                StringValue: "ByDEvents"
            },
            "Author": {
                DataType: "String",
                StringValue: "<PLEASE REPLACE WITH YOUR NAME>"
            },
            "WeeksOn": {
                DataType: "Number",
                StringValue: "6"
            }
        },
        MessageBody: JSON.stringify(event.body),
        // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
        // MessageGroupId: "Group1",  // Required for FIFO queues
        QueueUrl: "<PLEASE REPLACE WITH YOUR OWN AWS SQS URL>"
    };

    try {
        var data = await sqs.sendMessage(params).promise();
        console.log("success, messageId:", data.MessageId);
        const response = {
            statusCode: 200,
            body: JSON.stringify(data),
            isBase64Encoded: false,
        };

        return response;
    }
    catch (err) {
        console.log("Error", err);
        const response = {
            statusCode: 500,
            body: JSON.stringify(err),
            isBase64Encoded: false,
        };
        return response;
    }
};
