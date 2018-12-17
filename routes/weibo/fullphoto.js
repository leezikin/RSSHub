const axios = require('../../utils/axios');
const cheerio = require('cheerio');
const date = require('../../utils/date');


module.exports = async (ctx) => {
    const uid = ctx.params.uid;

    // const containerResponse = await axios({
    //     method: 'get',
    //     url: `http://www.weiboread.com/user/${uid}`,
    //     headers: {
    //         Referer: 'http://www.weiboread.com/',
    //     },
    // });
    // const name = containerResponse.data.data.userInfo.screen_name;
    // const containerid = containerResponse.data.data.tabsInfo.tabs[1].containerid;

    const response = await axios({
        method: 'get',
        url: `http://www.weiboread.com/user/${uid}`,
        headers: {
            Referer: 'http://www.weiboread.com/',
        },
    });
    const  data = response.data
    const $ = cheerio.load(data, {
        decodeEntities: false,
    });

    const wbs = [];
    let imgs = [];
    const items = $('.media.row.toutiao');
    let wb, item, titleEle,img;

    items.map(function (index, ele) {
        wb = {};
        item = $(this);
        titleEle = item.find('.media-body div p a:first-of-type');
        //将特殊符号清除
        wb.description = titleEle.text().replace(/^\s+|\s+$/g, '');
        wb.description = wb.description.replace(/\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007|\u0008|\u0009|\u000a|\u000b|\u000c|\u000d|\u000e|\u000f|\u0010|\u0011|\u0012|\u0013|\u0014|\u0015|\u0016|\u0017|\u0018|\u0019|\u001a|\u001b|\u001c|\u001d|\u001e|\u001f/g, '');
        wb.title = wb.description;
        if (wb.title.length > 16) {
            wb.title = wb.title.slice(0, 16) + '...';
        }

        wb.pubDate = item.find('.media-body div p:first-of-type').html();
        wb.link = item.find('.media-body div p a:first-of-type').attr('href');
        imgs = item.find('.img-single');
        imgs.map(function (index,ele) {
            img = $(this);
            img = img.attr('src');//获取图片
            img = img.replace(/orj360/g,'large')
            // wb.imgs.push(img);
            //logger.info(img);
            wb.description += '<br><img src="' + img + '"></img>';

        });
        //logger.info(wb.imgs.length);
        // for(var i = 0;i < wb.imgs.length;i++){
        //     wb.description += '<br><img src="' + wb.imgs[i] + '"></img>';
        // }
        wbs.push(wb);

    });

    // console.log(wbs)
    const name = $('.username').text().slice(0,-3);
    ctx.state.data = {
        title: `${name}的微博`,
        link: `http://www.weiboread.com/user/${uid}`,
        item: wbs,
    };
    // console.log("通过")

    // ctx.state.data = {
        // title: `${name}的微博`,
        // link: `http://weibo.com/${uid}/`,
        // description: `${name}的微博`,
        // item: response.data.data.cards
            // .filter((item) => item.mblog && !item.mblog.isTop)
            // .map((item) => {
            //     const description = weiboUtils.format(item.mblog);
            //     const title = description.replace(/<img.*?>/g, '[图片]').replace(/<.*?>/g, '');
            //     return {
            //         title,
            //         description: description,
            //         pubDate: date(item.mblog.created_at, 8),
            //         link: `https://weibo.com/${uid}/${item.mblog.bid}`,
            //     };
            // }),
    // };
};
