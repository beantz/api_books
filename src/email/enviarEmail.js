import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

// Exportação nomeada (recomendado para ESM)
export const enviarEmail = async ({ to, subject, html, text }) => {
  await transporter.sendMail({ 
    from: '"App Name" <seuemail@gmail.com>', 
    to, 
    subject, 
    html,
    text,
  });
};