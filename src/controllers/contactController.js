const resend = require("resend");

const resendClient = new resend.Resend(process.env.RESEND_API_KEY);

const contactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }
    await resendClient.emails.send({
      from: "no-reply@yourdomain.com",
      to: "asiva@ukr.net",
      subject: "Contact Us Form",
      html: `<b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Message:</b> ${message}`,
      reply_to: email,
    });
    res.json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { contactUs };
