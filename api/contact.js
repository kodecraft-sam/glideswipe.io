import formData from 'form-data';
import Mailgun from 'mailgun.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log("Pumasok: req.method: ", req.method);
    const { name, email, subject, message } = req.body;

    // Mailgun config
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY, // API Key stored in environment variables
    });

    const data = {
      from: `Contact Form <no-reply@${process.env.MAILGUN_DOMAIN}>`,
      to: 'info@glideswipe.com',  // Your email where you want to receive form submissions
      subject: `${subject} from ${name}`,
      text: `${message}\n\nContact Email: ${email}`,
    };

    try {
      // Send the email using Mailgun
      await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Error sending email' });
    }
    // try {
    //     // Send the email using Mailgun
    //     const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
    //     res.status(200).json({ message: 'Email sent successfully!', response });
    //   } catch (error) {
    //     // Capture the specific error and return it in the response
    //     res.status(500).json({ error: error.message || 'Error sending email', details: error });
    //   }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
