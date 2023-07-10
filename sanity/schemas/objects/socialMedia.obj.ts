import { defineType } from 'sanity'

export default defineType({
  name: 'socialMedia',
  title: 'Redes Sociais',
  type: 'array',
  description: 'Redes sociais da loja',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'channel',
          title: 'Canal',
          type: 'string',
          options: {
            list: [
              { title: 'WhatsApp', value: 'whatsapp' },
              { title: 'Telegram', value: 'telegram' },
              { title: 'Instagram', value: 'instagram' },
              { title: 'Facebook', value: 'facebook' },
              { title: 'Twitter', value: 'twitter' },
              { title: 'LinkedIn', value: 'linkedin' },
              { title: 'YouTube', value: 'youtube' },
              { title: 'TikTok', value: 'tiktok' }
            ]
          },
          description: 'Canal da rede social'
        },
        {
          name: 'username',
          title: 'usuario',
          type: 'string',
          description:
            'Usuário da rede social, se for whatsapp, informar o número com DDD'
        },
        {
          name: 'profileUrl',
          title: 'Link do Perfil',
          type: 'url',
          description: 'Link da rede social'
        },
        {
          name: 'moreInfo',
          title: 'Mais Informações',
          type: 'string'
        }
      ],
      preview: {
        select: {
          channel: 'channel',
          username: 'username',
          profileUrl: 'profileUrl'
        },
        prepare({ channel, username, profileUrl }) {
          return {
            title: `${channel} - ${username}`,
            subtitle: profileUrl
          }
        }
      }
    }
  ]
})
