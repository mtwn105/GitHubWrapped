import { OpenPanel } from '@openpanel/nextjs';

export const op = new OpenPanel({
  clientId: process.env.OPENPANEL_CLIENTID!,
  clientSecret: process.env.OPENPANEL_CLIENTSECRET!,
});
