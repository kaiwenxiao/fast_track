const fomatTerminals = list => {
    const terminals = [],
      terminalsList = [];

    list.forEach(el => {
      terminals.push(el.name);
      terminalsList[el.name] = el.code;
    });
    sessionStorage.setItem('terminalsNameColumns', terminals);

    return terminals;
  },
  findTerminalsCode = name => {
    const { terminalList } = JSON.parse(sessionStorage.getItem('selectAirport')),
      { code } = terminalList.find(item => {
        return item.name === name;
      });
    return code;
  },
  // 对接口返回的visitDateTimes字段进行处理
  visitDateFomat = data => {
    const visitDate = {
      minDate: new Date(),
      maxDate: new Date(),
    };
    visitDate.minDate = new Date(Date.parse(data[0].date));
    visitDate.maxDate = new Date(Date.parse(data[data.length - 1].date));

    return visitDate;
  },
  visitTimeFomat = (data, visitDate) => {
    const { times } = data.find(item => {
      return item.date === visitDate;
    });

    return times;
  },
  // 对日期按需求进行格式化成  => 25 July 2020
  formatDateEN = date => {
    const monthsInEng = {
      'en-US': [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      'ru-RU': ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
      'pt-PT': [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Maio',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ],
      'es-ES': ['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      'bs-BA': ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'],
      'sr-SP': ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
      'sr-ME': ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'],
      'hr-HR': ['sij', 'vlj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'],
      'fr-FR': [
        'Jan',
        'Fév',
        'Mar',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Aoû',
        'Sep',
        'Oct',
        'Nov',
        'Déc',
      ],
      'nl-NL': ['Jan', 'Feb', 'Maa', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
      'el-GR': [
        'Ιαν',
        'Φεβ',
        'Μάρ',
        'Απρ',
        'Μάι',
        'Ιούν',
        'Ιούλ',
        'Αύγ',
        'Σεπ',
        'Οκτ',
        'Νοέ',
        'Δεκ',
      ],
      'si-SI': [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    };
    if (localStorage.getItem('lang') === 'bs-BA' || localStorage.getItem('lang') === 'sr-SP') {
      return `${date.getDate()}. ${
        monthsInEng[localStorage.getItem('lang')][date.getMonth()]
      } ${date.getFullYear()}`;
    }
    return `${date.getDate()} ${
      monthsInEng[localStorage.getItem('lang') || 'en-US'][date.getMonth()]
    } ${date.getFullYear()}`;
  },
  jsDateFormatter = dateInput => {
    // dateInput 是一个 js 的 Date 对象
    const year = dateInput.getFullYear();

    let month = dateInput.getMonth() + 1,
      theDate = dateInput.getDate(),
      hour = dateInput.getHours(),
      minute = dateInput.getMinutes(),
      second = dateInput.getSeconds();

    if (month < 10) {
      month = `0${month}`;
    }

    if (theDate < 10) {
      theDate = `0${theDate}`;
    }

    if (hour < 10) {
      hour = `0${hour}`;
    }

    if (minute < 10) {
      minute = `0${minute}`;
    }

    if (second < 10) {
      second = `0${second}`;
    }

    return `${year}-${month}-${theDate}`;
  },
  getQueryString = name => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`),
      r = window.location.search.substr(1).match(reg);
    if (r !== null) return decodeURI(r[2]);
    return null;
  },
  // 对json数据进行筛选分类（适用于索引表）
  transformData = data => {
    /* eslint-disable */
    let oldData = [];
    let newData = [];
    let newObj = {};
    data.forEach(el => {
      let oldObj = {
        firstWord: el.firstWord,
        list: [],
      };
      oldObj.list.push(el);
      oldData.push(oldObj);
    });
    oldData.forEach((el, i) => {
      if (!newObj[el.firstWord]) {
        newData.push(el);
        newObj[el.firstWord] = true;
      } else {
        newData.forEach(el => {
          if (el.firstWord === oldData[i].firstWord) {
            el.list = [...el.list, ...oldData[i].list];
          }
        });
      }
    });
    newData = newData.sort((a, b) => a.firstWord && a.firstWord.localeCompare(b.firstWord));
    return newData;
    /* eslint-disable */
  },
  formatCardNo = card => {
    return card
      .replace(/\s/g, '')
      .replace(/[^\d]/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ');
  },
  openAppHandler = (schemeURL, downloadLink) => {
    const loadDateTime = new Date();
    setTimeout(() => {
      const timeOutDateTime = new Date();
      if (timeOutDateTime - loadDateTime < 5000) {
        window.location = downloadLink;
      } else {
        window.close();
      }
    }, 50);
    window.location = schemeURL;
  },
  openApp = data => {
    const { iOS, android } = data;
    let payload = null;
    const url = window.location.href;
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      payload = iOS;
    } else if (navigator.userAgent.match(/android/i)) {
      payload = android;
    }
    const { schemeURL, downloadLink } = payload;
    openAppHandler(schemeURL, downloadLink);
  },
  encodeUnicode = str => {
    var res = [];
    for (var i = 0; i < str.length; i++) {
      res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return '\\u' + res.join('\\u');
  },
  languageOpts = [
    {
      label: 'Bosnian',
      value: 'bs-BA',
      showText: 'BS',
    },
    {
      label: 'Croatian',
      value: 'hr-HR',
      showText: 'HR',
    },
    {
      label: 'Dutch',
      value: 'nl-NL',
      showText: 'NL',
    },
    {
      label: 'English',
      value: 'en-US',
      showText: 'EN',
    },
    {
      label: 'French',
      value: 'fr-FR',
      showText: 'FR',
    },
    {
      label: 'Greek',
      value: 'el-GR',
      showText: 'EL',
    },
    {
      label: 'Montenegrin',
      value: 'sr-ME',
      showText: 'ME',
    },
    {
      label: 'Portuguese',
      value: 'pt-PT',
      showText: 'PT',
    },
    {
      label: 'Russian',
      value: 'ru-RU',
      showText: 'RU',
    },
    {
      label: 'Serbian',
      value: 'sr-SP',
      showText: 'SR',
    },
    {
      label: 'Spanish',
      value: 'es-ES',
      showText: 'ES',
    },
  ];

export {
  fomatTerminals,
  visitDateFomat,
  formatDateEN,
  jsDateFormatter,
  visitTimeFomat,
  findTerminalsCode,
  getQueryString,
  transformData,
  formatCardNo,
  openApp,
  encodeUnicode,
  languageOpts,
};
