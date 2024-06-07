import { MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const dir = join(__dirname, '..', 'templates');
console.log(join(dir, 'templates'));

export const mailerConfig: MailerOptions = {
  transport: {
    host: 'smtp-relay.brevo.com', // e.g., smtp.gmail.com
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '7637f5001@smtp-brevo.com',
      pass: 'aY8jBNLSvr5HqMCd',
    },
  },
  defaults: {
    from: '"No Reply" <kangn2101@gmail.com>',
  },
  template: {
    dir: join(__dirname, '..', 'templates'),
    adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
    options: {
      strict: true,
    },
  },
};
