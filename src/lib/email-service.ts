/**
 * Email Service for GMGP Butcher Shop
 * 
 * TODO: Replace mock console.log with a real provider like Resend or SendGrid.
 */

export async function sendOrderConfirmationEmail(orderId: string, email: string, total: number) {
  console.log(`[EMAIL SERVICE] Sending Order Confirmation to ${email}`);
  console.log(`[EMAIL SERVICE] Order ID: ${orderId}`);
  console.log(`[EMAIL SERVICE] Total Amount: A$${total.toFixed(2)}`);
  
  // In a real implementation:
  // await resend.emails.send({
  //   from: 'GMGP <orders@gmgp.com>',
  //   to: email,
  //   subject: `Order Confirmed: #${orderId.slice(0, 8).toUpperCase()}`,
  //   html: `<h1>Thank you for your order!</h1><p>Total: A$${total.toFixed(2)}</p>`
  // });

  return true;
}

export async function sendOrderCancellationEmail(orderId: string, email: string) {
  console.log(`[EMAIL SERVICE] Sending Order Cancellation to ${email}`);
  console.log(`[EMAIL SERVICE] Order ID: ${orderId}`);

  // In a real implementation:
  // await resend.emails.send({
  //   from: 'GMGP <orders@gmgp.com>',
  //   to: email,
  //   subject: `Order Cancelled: #${orderId.slice(0, 8).toUpperCase()}`,
  //   html: `<h1>Your order has been cancelled.</h1>`
  // });

  return true;
}
