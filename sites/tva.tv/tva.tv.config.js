const axios = require('axios')
const dayjs = require('dayjs')

module.exports = {
  site: 'tva.tv',
  url: function ({ date, channel }) {
    return `https://api.ott.tva.tv/v2/epg/program_events.json?channel_id=${
      channel.site_id
    }&pivot_date=${date.format('YYYY-MM-DD')}`
  },
  logo: function ({ channel }) {
    return channel.logo
  },
  parser: function ({ content, date, channel }) {
    const programs = []
    const items = parseItems(content)
    items.forEach(item => {
      programs.push({
        title: item.name,
        description: item.description,
        start: dayjs(item.start_at),
        stop: dayjs(item.end_at)
      })
    })

    return programs
  },
  async channels({ country, lang }) {
    const data = await axios
      .get(
        `https://api.ott.tva.tv/v1/channels?client_id=66797942-ff54-46cb-a109-3bae7c855370&client_version=0.0.1&expand%5Bchannel%5D=images&locale=en-GB&page%5Blimit%5D=100&page%5Boffset%5D=0&timezone=10800`,
        {
          headers: {
            Origin: 'https://tva.tv'
          }
        }
      )
      .then(r => r.data)
      .catch(console.log)

    const channels = []
    for (let item of data.data) {
      const logo = item.images
        ? item.images[0].url_template
            .replace('{width}', '512')
            .replace('{height}', '512')
            .replace('{crop}', 'c')
        : null
      channels.push({
        lang: 'fa',
        site_id: item.id,
        name: item.name,
        xmltv_id: item.slug,
        logo
      })
    }

    return channels
  }
}

function parseItems(content) {
  const data = JSON.parse(content)
  if (!data || !Array.isArray(data.data)) return []

  return data.data
}