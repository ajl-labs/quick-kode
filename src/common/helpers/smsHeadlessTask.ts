// File: smsHeadlessTask.js

// This function will be called in the background when an SMS is received
const smsHeadlessTask = async (taskData: any) => {
  console.log('Background: SMS Headless Task triggered with data:', taskData);

  // --- EXAMPLE TASK: Send the SMS data to your server ---
  try {
    // const response = await fetch(
    //   'https://api.your-service.com/momo-transactions',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       sender: taskData.senderName,
    //       amount: taskData.amount,
    //       transactionId: taskData.transactionId,
    //       receivedAt: new Date().toISOString(),
    //     }),
    //   },
    // );
    // const responseJson = await response.json();
    // console.log('Background: API call successful!', responseJson);
  } catch (error) {
    console.error('Background: API call failed.', error);
  }
};

export default smsHeadlessTask;
