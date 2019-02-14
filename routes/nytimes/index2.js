const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async (ctx) => {
    const feed = await parser.parseURL('https://rsshub.app/nytimes');
    console.log(feed)
    console.log(feed.items.length)
    // const items = feed.items



    const items = await Promise.all(
        feed.items.splice(0, 10).map(async (item) => {
            // console.log(item.content.match(/([a-zA-z]+:\/\/[^\s]*.(jpg|png|jpeg|gif))/g))
            // item.content = item.content.replace(/^([a-zA-z]+:\/\/[^\s]*.(jpg|png|jpeg|gif))$/,"https://images.weserv.nl/?url=$1")
            item.content = item.content.replace(/([a-zA-z]+:\/\/[^\s]*.(jpg|png|jpeg|gif))/g,"https://images.weserv.nl/?url=$1")
            const description = item.content
            // console.log(description)
            const single = {
                title: item.title,
                description,
                pubDate: item.pubDate,
                link: item.link,
                author: item.author,
            };
            return single;
        })
    );

    ctx.state.data = {
        title: '纽约时报中文网 - proxy From DIYGOD.ME',
        link: 'https://rsshub.app/nytimes',
        description: '纽约时报中文网',
        item: items,
    };
};
