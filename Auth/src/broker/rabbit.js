import amqp from "amqplib";
import config from "../configs/config.js";

let channel, connection;

export const connectMQ = async () => {
  connection = await amqp.connect(config.RABBITMQ_URI);
  channel = await connection.createChannel();

  console.log("RabbitMQ is Connected");
};

export const publishToQueue = async (queueName, data) => {
  await channel.assertQueue(queueName, { durable: true });
  await channel.sentToQueue(queueName, Buffer.from(JSON.stringify(data)));

  console.log("Message sent to queue ", queueName);
};
