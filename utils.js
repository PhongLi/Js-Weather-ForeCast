export const dateToWords = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    date = new Date(date);
    const month = months[date.getMonth()];
    const dateNum = date.getDate();

    return `${month} ${dateNum}`;
};
export const findIcon = (condition) => {
    let icon;
    switch (condition) {
        case 'Clear':
            icon = 'fa-cloud';
            break;
        case 'Sunny':
            icon = 'fa-sun';
            break;
        case 'Mist':
            icon = 'fa-cloud-meatball';
            break;
        case 'Cloudy':
            icon = 'fa-cloud';
            break;
        case 'Partly cloudy':
            icon = 'fa-cloud-sun';
            break;
        case 'Overcast':
            icon = 'fa-smog';
            break;
        case 'Blizzard':
            icon = 'fa-meteor';
            break;
        case 'Fog':
            icon = 'fa-smog';
            break;
        case 'Light rain':
            icon = 'fa-cloud-rain';
            break;
        case 'Medium rain':
            icon = 'fa-cloud-rain';
            break;
        case 'Heavy rain':
            icon = 'fa-cloud-showers-heavy';
            break;
        case 'Light snow':
            icon = 'fa-snowflake';
            break;
        case 'Medium snow':
            icon = 'fa-snowflake';
            break;
        case 'Heavy snow':
            icon = 'fa-icicles';
            break;
        default:
            icon = 'fa-cloud';
    }
    return icon;
};

export const setInnerText = (element, text) => {
    element.innerText = '';
    element.innerText = text;
};
